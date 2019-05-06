function drawValueAnomaliesView(selectedUnit, drawOverviewParam) {

  // var height = parseInt(d3.select('.svg-container').style('height'));
  var height = window.innerHeight;
  // var runSimulation = drawOverviewParam.runSimulation;
  var stopSimulation = drawOverviewParam.stopSimulation;

  const circleStartRadius = 0.3;
  const circleEndRadius = 0.95;
  const identityMargin = 20;
  const maxApprovalBubble = 0.12; // as ratio of diameter
  const minApprovalBubble = 0.07;
  const centerRadius = 0.25;
  const ZOOM_DATA = 1;
  const SigmaSymbol = '\u03C3';

  var unitNode = selectedUnit.node();
  var mainObject = selectedUnit.datum();
  var requestIndex = mainUnits.findIndex(function (a) {
    return a === mainObject;
  });
  if (requestIndex < 0) {
    console.error("Bad requestIndex");
  }

  // if sigma not calculated yet then calculate it
  if (mainObject.above3sigma === undefined) state.dataFunc.sigma(mainObject);

  var sigmaRange = mainObject.maxSigmaDev <= 0 ? 1 : Math.min(Math.ceil(mainObject.maxSigmaDev),state.SIGMA_CAP_LIMIT);

  // var colorGenerator = state.common.colorForSigma(sigmaRange);

  d3.select(unitNode).raise();

  // compute center and radius
  var outerRadius = Math.max(mainObject.outerRadius, zoomInDiameterFactor / 2 * height);
  const circleMarkersGap = (circleEndRadius - circleStartRadius) / (Math.min(mainObject.categories.length, state.MAX_CATEGORIES) + 1);

  var detailedGroupBase = selectedUnit.selectAll(".detailed-group")
    .data([mainObject], function(d) {return d.request});

  var detailedGroup = detailedGroupBase
    .enter();

  detailedGroup = detailedGroup.append("svg:g")
    .attr("class", "detailed-group value-anomaly")
    .on("click", handleFlowerClick)
    .on("mouseleave", approvalMouseLeave);

  detailedGroup.merge(detailedGroupBase)
    .classed("zoom", state.criteria.clusterLevel > 0);

  function drawMainCircularShape() {
    // draws main grey circular shape
    detailedGroup.selectAll("circle")
      .data([{cx: 0, cy: 0, radius: outerRadius}])
      .enter()
      .append("circle")
      .attr("r", function (d, i) {
        return d.radius;
      })
      .attr("class", function (d, i) {
        return "main-circle-background";
      });
  }

  function handleFlowerClick(d, i) {
    d3.event.stopPropagation();

    if (d3.select(this).classed("locked")) {
      releaseLockedState();
    }
  }

  function drawCircularMarkers() {
    // drawing cyclical markers

    function estimateAngleGapForText(radius, text) {
      return text.length * 8 / (radius); // gap in radians
    }

    // outer identity marker (which department and employee count)
    var gap = estimateAngleGapForText(outerRadius - identityMargin, mainObject.unitLabel);

    detailedGroup.selectAll("identity.path")
      .data([{
        radius: outerRadius - identityMargin,
        from: 0, // state.common.toRadians(-30) + gap/2,
        to: 2*Math.PI // state.common.toRadians(330) - gap/2
      }])
      .enter()
      .append("svg:path")
      .attr("id", "objectIdentity")
      .attr("class", "identity circular-marker")
      .attr("fill", "transparent")
      .attr("stroke-width", function(d) {
        return 1;
      })
      .attr("stroke-linejoin", "round")
      .attr("d", function(d) {return state.common.arcSliceFull(d);});

    // background for the label
    detailedGroup
      .append("svg:path")
      .attr("id", "objectIdentityPath")
      .attr("class", "background-stroke")
      .attr("fill", "transparent")
      .attr("stroke-width", 1)
      .attr("d", state.common.arcSliceFull({
        radius: outerRadius - identityMargin,
        to: state.common.toRadians(-30) + gap/2,
        from: state.common.toRadians(-30) - gap/2
      }));

    var circularMarkerLabel = mainObject.request + ". " + mainObject.totalCount + " requests. " + mainObject.above3sigma + " above 3" + SigmaSymbol + ".";

    detailedGroup
      .append("text")
      .attr("class", "approval-type-label")
      .attr("dy", 3)
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", "#objectIdentityPath") //place the ID of the path here
      .style("text-anchor","middle") //place the text halfway on the arc
      .attr("startOffset", "24%")
      .text(circularMarkerLabel);

    // categories' circular markers (categories labels)

    var circularGroups = detailedGroup.selectAll("g.category-group")
      .data(subUnits.map(function(d, i) {
        var radius = outerRadius * (circleStartRadius + (i+1)*circleMarkersGap);
        return {
          category: d,
          radius: radius
        };
      }))
      .enter()
      .append("svg:g")
      .attr("class", "category-group")
      .attr("id", function(d,i) {
        return "c" + d.category.categoryIndex;
      })
      .on("mouseenter", categoryMouseEnter)
      .on("mouseleave", categoryMouseLeave);

    circularGroups
      .append("svg:path")
      .attr("class", "circular-marker")
      .attr("fill", "transparent")
      .attr("stroke-width", function(d) {
        return 1;
      })
      .attr("stroke-linejoin", "round")
      .attr("d", function(d) {return state.common.arcSliceFull({
        radius: d.radius,
        from: 0,
        to: 2*Math.PI
      })});

    // background for the label
    circularGroups
      .append("svg:path")
      .attr("id", function(d, i) {
        return "categoryID" + d.category.categoryIndex;
      })
      .attr("class", "category-name-label-background background-stroke")
      .attr("fill", "transparent")
      .attr("stroke-width", 1)
      .attr("d",  function(d) {
        var gap = estimateAngleGapForText(d.radius, d.category.categoryName);
        return state.common.arcSliceFull({
          radius: d.radius,
          to: state.common.toRadians(-30) + gap/2,
          from: state.common.toRadians(-30) - gap/2
        });
      });

    circularGroups
      .append("text")
      .attr("class", "category-name-label")
      .attr("dy", 3)
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", function(d,i) {
        return "#categoryID" + d.category.categoryIndex;
      }) //place the ID of the path here
      .style("text-anchor","middle") //place the text halfway on the arc
      // .attr("startOffset", "79%") // this will show the invert text
      .attr("startOffset", "24%")
      .text(function(d) {
        return d.category.categoryName;
      });

    function categoryMouseEnter(d,i) {
      var index = d.category.categoryIndex;
      d3.select(this).classed("highlight", true);
      d3.select(".detailed-group").classed("approver-highlight", true);
      d3.selectAll("g.sphere"+index).classed("highlight", true);
      d3.selectAll("g.zoom-sphere"+index).classed("highlight", true);
      d3.selectAll(".bubble-guide"+index).classed("highlight", true);
      d3.selectAll(".zoom-bubble-guide"+index).classed("highlight", true);
      d3.select("#average-guide" + index).classed("highlight", true);

      //     centerSphere
      d3.select(".detailed-group .request-value")
        .text(">3" + SigmaSymbol + " = " + state.common.sigmaToText(d.category.valueAbove3sigma, d.category));
      // d3.select(".detailed-group .detailed-request-percent").text(approverPercent);

      // circumference
      var circularMarkerLabel = mainObject.request + ". " + d.category.totalCount + " items. " + d.category.above3sigma + " above 3" + SigmaSymbol + ".";
      d3.select(".detailed-group .approval-type-label textPath").text(circularMarkerLabel);

      // TODO revisit
      d3.select(".table-rows").classed("category-highlight", true);
      d3.selectAll(".table-rows .data-row.r" + requestIndex + "c" + index).classed("highlight", true);
    }

    function categoryMouseLeave(d, i) {
      d3.select(this).classed("highlight", false);
      d3.select(".detailed-group").classed("approver-highlight", false);
      d3.selectAll(".bubble-guide").classed("highlight", false);
      d3.selectAll(".zoom-bubble-guide").classed("highlight", false);
      d3.selectAll("g.sphere").classed("highlight", false);
      d3.selectAll("g.zoom-sphere").classed("highlight", false);
      d3.selectAll(".average-guide").classed("highlight", false);
      d3.select(".detailed-group .request-value")
        .text(">3" + SigmaSymbol + " = " + state.common.sigmaToText(mainObject.valueAbove3sigma, mainObject));
      // d3.select(".detailed-group .detailed-request-percent").text("");

      // circumference
      var circularMarkerLabel = mainObject.request + ". " + mainObject.totalCount + " requests. " + mainObject.above3sigma + " above 3" + SigmaSymbol + ".";
      d3.select(".detailed-group .approval-type-label textPath").text(circularMarkerLabel);

      d3.select(".table-rows").classed("category-highlight", false);
      d3.selectAll(".table-rows .data-row").classed("highlight", false);
    }

  }

  const SliceBackgroundColor = [
    '#00634499',               // for transparency change last two hex '80' for 50%
    '#B6C61A99',
    '#D8A80099',
    '#BD3B1B99'
  ];

  var sliceCount = Math.max(sigmaRange,1); // mainObject.sigma <= 0 ? 1 : Math.ceil(mainObject.maxSigmaDev);
  var sliceDegrees = (state.approvalsRadialEnd - state.approvalsRadialStart)/sliceCount;

  var sliceArr = [];
  for (var i=0;i<sliceCount;i++) {
    sliceArr[i] = i;
  }

  function drawSigmaSlicesOuter() {
    detailedGroup
      .selectAll(".sigma-slice")
      .data(sliceArr)
      .enter()
      .append("svg:path")
      .attr("class", "sigma-slice")
      .attr("fill", function(d,i) {return SliceBackgroundColor[Math.min(i,SliceBackgroundColor.length-1)]})
      .attr("stroke-width", 0)
      .attr("d",  function(d) {
        var arc = d3.arc()
          .startAngle(state.common.toRadians(d * sliceDegrees))
          .endAngle(state.common.toRadians((d+1) * sliceDegrees))
          .innerRadius(centerRadius * outerRadius)
          .outerRadius(outerRadius - identityMargin);
        return arc();
      });

  }

  function drawSigmaSlicesInner() {
    var slicesInner = detailedGroup
      .append("svg:g")
      .attr("class", "slices-inner");

    slicesInner
      .selectAll(".sigma-slice-label-bg")
      .data(sliceArr)
      .enter()
      .append("svg:path")
      .attr("class", "sigma-slice-label-bg")
      .attr("fill", function(d) {return d%2 ? "#686868" : "#585858"})
      .attr("stroke-width", 0)
      .attr("d",  function(d) {
        var arc = d3.arc()
          .startAngle(state.common.toRadians(d * sliceDegrees))
          .endAngle(state.common.toRadians((d+1) * sliceDegrees))
          .innerRadius(centerRadius * outerRadius)
          .outerRadius(centerRadius * outerRadius + 36);
        return arc();
      });

    slicesInner
      .selectAll(".sigma-slice-label")
      .data(sliceArr)
      .enter()
      .append("text")
      .attr("class", "sigma-slice-label")
      .attr("fill", "black")
      .attr("stroke-width", 0)
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        var arc = d3.arc()
          .startAngle(state.common.toRadians(d * sliceDegrees))
          .endAngle(state.common.toRadians((d+1) * sliceDegrees))
          .innerRadius(centerRadius * outerRadius)
          .outerRadius(centerRadius * outerRadius + 36);
        return arc.centroid()[0];
      })
      .attr("y", function(d) {
        var arc = d3.arc()
          .startAngle(state.common.toRadians(d * sliceDegrees))
          .endAngle(state.common.toRadians((d+1) * sliceDegrees))
          .innerRadius(centerRadius * outerRadius)
          .outerRadius(centerRadius * outerRadius + 36);
        return arc.centroid()[1];
      })
      .text(function(d) {
        return (d > 0 ? (d+1) : "") + SigmaSymbol;
      });
  }

  // var subUnits = mainObject.categories;
  var subUnits = mainObject.categories.slice(mainObject.startCategoryIndex, mainObject.startCategoryIndex + state.MAX_CATEGORIES);

  var densityFactor = mainObject.categories.length > 5 ? 0.6 : 1;

  // values translated between 0 and diameter of
  var basicValueDiameterScale = d3.scaleLinear()
    .domain([0, mainObject.maxValue])
    .range([0, densityFactor * maxApprovalBubble * outerRadius * 2]);
  const minimalBubbleSize = minApprovalBubble * outerRadius * 2;

  // TODO some code repeat itself from drawDetailedView - need to optimize

  // TODO consider adding to table classes "c" for category and "i" for category index (alongside approver and approval)

  function drawAverageMarkers() {

    // draw average values guideline
    var avgGuideGroup = detailedGroup.selectAll("g.average-guide")
      .data(subUnits)
      .enter()
      .append("svg:g")
      .attr("class", "average-guide")
      .attr("id", function(d,i) {
        return "average-guide" + d.categoryIndex;
      })
      .style("transform", "rotate(180deg)");

    avgGuideGroup
      .append("svg:line")
      .attr("class", "average-guide-line")
      .style("stroke-dasharray", ("5, 2"))
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", function (d, index) {
        return outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
      });

    avgGuideGroup
      .append("text")
      .attr("class", "average-guide-label")
      .attr("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "-0.8em")
      .attr("x", function (d, index) {
        return 0;
      })
      .attr("y", function (d, index) {
        return outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap);
      })
      .text(function (d) {
        return state.common.typedValueToTextShort(d.meanValue, d.presentation);
      })
      .attr("transform", function (d, index) {
        var radius = outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap);
        return d3.svg.transform()
          .translate(d.flipText ? -radius : radius, radius)
          .rotate(d.flipText ? -90 : 90)();
      });
  }


  function drawSpheresGuidelines(dataToShow, classModifier) {
    if (state.criteria.clusterLevel) {
      dataToShow = ZOOM_DATA;
      classModifier = "zoom-";
    }
    else {
      dataToShow = false;
      classModifier = "";
    }

    subUnits.forEach(function (t, index) {
      // var approverIndex = (dataToShow == ZOOM_DATA) ? index : t.approverIndex;
      var categoryIndex = t.categoryIndex;

      var elements = dataToShow == ZOOM_DATA ? t.zoomItems : t.items;
      var className = classModifier + "bubble-guide";

      var localGroup = d3.select(".detailed-group").selectAll("line." + className + categoryIndex)
        .data(elements, function(d,i) {return i;});

      var enteredGroup = localGroup
        .enter()
        .append("svg:line")
        .style("opacity", 0)
        .attr("class", function(d) {return className + " " + className + categoryIndex})
        .attr("id", function(d,i) {
          var id;
          if (dataToShow == ZOOM_DATA) {
            var split = d.anomalyZoomBucket.split("b");
            id = split[0] + "g" + split[1];
          }
          else {
            id = "c" + categoryIndex + "g" + (d.parentApproval && d.parentApproval.id) + "i" + d.itemIndex;
          }
          return id;
        })
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", function (d) {
          return outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
        })
        .attr("transform", function (d) {
          var sampleDegrees = -180 + state.approvalsRadialStart +
            (state.approvalsRadialEnd - state.approvalsRadialStart) * Math.min(d.sigmaDev/sigmaRange, 1);
          return "rotate(" + sampleDegrees + ")";
        });

      enteredGroup
        .transition()
        .duration(150)
        .style("opacity", 1)
        .on("end", () => {
          enteredGroup.style("opacity", null);
        });

/*
      enteredGroup
        .merge(localGroup)
        .attr("stroke", function (d) {
          return colorGenerator(d.sigmaDev);
        })
*/
    });
  }

  function releaseLockedState() {
    d3.selectAll(".approval-halo").remove();
    d3.selectAll(".detailed-group .sphere, .detailed-group .zoom-sphere").classed("locked", false);
    d3.select(".detailed-group").classed("locked", false);
    d3.select(".table-container").style("height",null).classed("on", false);
  }

  function approvalMouseLeave() {
    d3.select(".submitterTooltip")
      .style("display","none");
    d3.selectAll(".sphere").classed("highlight", false);
    d3.selectAll(".bubble-guide").classed("highlight", false);
    d3.selectAll(".category-group").classed("highlight", false);
    d3.select(".detailed-group").classed("approval-highlight", false);

    d3.selectAll(".zoom-bubble-guide").classed("highlight", false);
    d3.selectAll("g.zoom-sphere").classed("highlight", false);
    d3.selectAll(".average-guide").classed("highlight", false);

    if (!d3.select(".detailed-group").classed("locked")) {
      d3.select(".table-rows").classed("approval-highlight", false);
      d3.selectAll(".table-rows .data-row").classed("highlight", false);
    }
  }


  function drawSpheres(dataToShow, classModifier) {
    var valueDiameterScale = basicValueDiameterScale;

    if (state.criteria.clusterLevel) {
      dataToShow = ZOOM_DATA;
      classModifier = "zoom-";
    }
    else {
      dataToShow = false;
      classModifier = "";
    }

    function approvalClicked(d, i) {
      d3.event.stopPropagation();
      d3.selectAll(".approval-halo").remove();
      if (d3.select(this).classed("locked")) {
        // release locked state
        releaseLockedState();
      }
      else {
        // var sphereID = d3.select(this).attr("id"); //e.g.  a3b8 will be matched with guide a3g8
        var approvalId = d3.select(this).attr("approval-id");
        var itemIndex = d3.select(this).attr("item-index");
        d3.select(this).classed("locked", true);
        d3.select(".detailed-group").classed("locked", true);
        var currentApprovalCircle = d3.select(this).select(".approval-circle-foreground");

        d3.select(this)
          .append("circle")
          .attr("class", "approval-halo")
          .attr("cx", currentApprovalCircle.attr("cx"))
          .attr("cy", currentApprovalCircle.attr("cy"))
          .attr("transform", currentApprovalCircle.attr("transform"))
          .attr("r", parseFloat(currentApprovalCircle.attr("r")) + 5)
          .on("mouseleave", approvalMouseLeave);

        state.common.showTooltip("click-to-release", this, {relate: "above", align: "center", margin: 10, duration: 2000});

        refreshTable(mainUnits);
        d3.select(".table-rows").classed("approval-highlight", true);
        d3.selectAll(".table-rows .data-row").classed("highlight", false); // in case mouseLeave was not fired

        // if in zoom state we highlight according to rows according to anomalyZoomBucket, otherwise use sphere ID
        if (dataToShow == ZOOM_DATA && d.anomalyZoomBucket)
          d3.select(".table-rows").selectAll(`.data-row[data-zoom=${d.anomalyZoomBucket}]`).classed("highlight", true);
        else
          d3.selectAll(`.data-row[approval-id="${approvalId}"][item-index="${itemIndex}"`).classed("highlight", true); //

        d3.select(".table-container").classed("on", true);

      }
    }

    function approvalMouseEnter(d, i) {  // Add interactivity

      var currentApprovalCircle = d3.select(this).select(".approval-circle-foreground");
      var approvalRadius = parseFloat(currentApprovalCircle.attr("r"));

      var sphereID = d3.select(this).attr("id"); //e.g.  a3b8 will be matched with guide a3g8
      var split = sphereID.split("b");

      d3.select(this).classed("highlight", true);
      d3.select("#" + split[0] + "g" + split[1]).classed("highlight", true);
      d3.select(".detailed-group").classed("approval-highlight", true);

      // var categoryIndex = parseInt(sphereID.substring(1));
      var categoryIndex = d.categoryIndex;
      d3.select("#c" + categoryIndex).classed("highlight", true); // .approver-group of specific approver
      d3.select("#average-guide" + categoryIndex).classed("highlight", true);

      d3.select(this).on("mouseleave", approvalMouseLeave);

      var rect = this.getBoundingClientRect();

      d3.select(".submitterTooltip")
        .style("display","block")
        .style("left", (rect.x + rect.width/2 + approvalRadius + 10) + "px")
        .style("top", (rect.y + rect.height/2) + "px");

      // TODO standardize on value and reportedValue for items as well... to remove ugly condition
      var sigmaX = d.sigmaDev.toFixed(1);
      d3.select(".submitter-content .submitter-name").text(d.submitter || d.parentApproval.submitter);
      d3.select(".submitter-content .wait-time").text("Sigma: " + sigmaX + SigmaSymbol);
      d3.select(".submitter-content .misc").text(state.common.smartValueToText(d,
        (d.itemValueUSD || d.parentApproval.value),
        (d.presentation || d.parentApproval && d.parentApproval.presentation)));
    }

    function drawBackgroundOrForeground(foreground) {
      // now drawing spheres
      subUnits.forEach(function (t, index) {

        // var approverIndex = (dataToShow == ZOOM_DATA) ? index : t.approverIndex;
        var categoryIndex = t.categoryIndex;

        var elements = dataToShow == ZOOM_DATA ? t.zoomItems : t.items;
        var className = classModifier + (foreground ? "sphere" : "sphere-background");
        // due to general update pattern detailedGroup might be empty so selecting explicitly
        var spheresSelection = d3.select(".detailed-group").selectAll("g." + className + categoryIndex)
          .data(elements, function(d,i) {return i;});

        var spheres = spheresSelection
          .enter()
          .append("svg:g")
          .attr("class", className + " " + className + categoryIndex)
          .attr("id", function(d,i) {
            if (foreground) {
              return (dataToShow == ZOOM_DATA) ? d.anomalyZoomBucket :
                ("c" + categoryIndex + "b" + (d.parentApproval && d.parentApproval.id) + "i" + d.itemIndex);
            }
            else
              return null;

/*
            var id = (dataToShow == ZOOM_DATA) ? d.anomalyZoomBucket : (d.parentApproval && d.parentApproval.id);
            return foreground ? ("c" + categoryIndex + "b" + id + "i" + d.itemIndex) : null; // a [approver index] b [approval index]
*/
          })
          .attr("approval-id", function(d,i) {
            return foreground ? (d.parentApproval && d.parentApproval.id) : null; // a [approver index] b [approval index]
          })
          .attr("item-index", function(d,i) {
            return foreground ? d.itemIndex : null; // a [approver index] b [approval index]
          });

        // the first iteration will create an opaque background to hide background
        // the second iteration has some transparency to show overlapping intersections

        // add sphere or sphere background
        spheres
          .style("opacity", 0)
          .append("circle")
          .attr("class", function(d) {
            if (!foreground) return "main-circle-background";
            return "approval-circle-foreground";
          })
/*
          .attr("stroke", "transparent")
          .attr("fill", function (d) {
            if (!foreground) return;
            return colorGenerator(d.sigmaDev);
          })
*/
          .style("mix-blend-mode", foreground ? "multiply" : null)
          .attr("cx", function (d) {
            return 0;
          })
          .attr("cy", function (d) {
            return outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
          })
          .attr("r", function (d, i) {
            // no need for different bubble sizes...
            // return Math.max(valueDiameterScale(d.value) / 2, minimalBubbleSize / 2);
            return minimalBubbleSize / 2;
          })
          .attr("transform", function (d) {
            var sampleDegrees = -180 + state.approvalsRadialStart +
              (state.approvalsRadialEnd - state.approvalsRadialStart) * Math.min(d.sigmaDev/sigmaRange, 1);
            return "rotate(" + sampleDegrees + ")";
          });

        spheres
          .transition()
          .duration(150)
          .style("opacity", 1)
          .on("end", () => {
            spheres.style("opacity", null);
          });

        if (!foreground) return;

        // add listener
        spheres
          .on("mouseenter", approvalMouseEnter)
          .on("click", approvalClicked);

        // add label
        spheres
          .append("text")
          .attr("class", "approval-value")
          .attr("text-anchor", "middle")
          .attr("dy", ".35em")
          .attr("x", function (d) {
            // calculate absolute position based on radius and angle
            var radius = outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
            var angle = -90 + state.approvalsRadialStart + (state.approvalsRadialEnd - state.approvalsRadialStart) * Math.min(d.sigmaDev/sigmaRange, 1);
            return Math.cos(state.common.toRadians(angle)) * radius;
          })
          .attr("y", function (d) {
            // calculate absolute position based on radius and angle
            var radius = outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
            var angle = -90 + state.approvalsRadialStart + (state.approvalsRadialEnd - state.approvalsRadialStart) * Math.min(d.sigmaDev/sigmaRange, 1);
            return Math.sin(state.common.toRadians(angle)) * radius;
          })
          .text(function (d) {
            return state.common.typedValueToTextShort(d.itemValueUSD, d.presentation || d.parentApproval.presentation);
          });

/*
        var a = spheres
          .merge(spheresSelection)
          .select(".approval-circle-foreground");
          .attr("fill", function (d) {
            return colorGenerator(d.sigmaDev);
          });
*/
      });
    }

    drawBackgroundOrForeground(false);
    drawBackgroundOrForeground(true);

  }

  function drawCenterSphere() {
    // draws center darker sphere

    var centerSphere = detailedGroup
      .append("svg:g")
      .attr("class", "center-sphere");

    centerSphere
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", centerRadius * outerRadius)
      .attr("class", "center center-circle-background");
    centerSphere
      .append("text")
      .attr("class", "request-name")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", -5)
      .text(mainObject.request);
    centerSphere
      .append("text")
      .attr("class", "request-value")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", 20)
      .text(function(d) {
        return ">3" + SigmaSymbol + " = " + state.common.sigmaToText(mainObject.valueAbove3sigma, mainObject);
      });
    centerSphere
      .append("text")
      .attr("class", "detailed-request-percent")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "2.3em")
      .text("");

    if (mainObject.categories.length <= state.MAX_CATEGORIES) {
      return;
    }

    // background for the label
    centerSphere
      .append("svg:path")
      .attr("id", "chunk-label")
      // .attr("class", "approver-name-label-background background-stroke")
      .attr("fill", "transparent")
      .attr("stroke-width", 0)
      .attr("d",  function(d) {
        return state.common.arcSliceFull({
          radius: centerRadius * outerRadius - 13,
          to: state.common.toRadians(30),
          from: state.common.toRadians(-90)
        });
      });

    centerSphere
      .append("text")
      .attr("class", "nav-chunk")
      .attr("dy", 3)
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", "#chunk-label") //place the ID of the path here
      .style("text-anchor","middle") //place the text halfway on the arc
      .attr("startOffset", "24%")
      .text(function(d) {
        var start = mainObject.startCategoryIndex + 1,
          end = Math.min(mainObject.startCategoryIndex + state.MAX_CATEGORIES, mainObject.categories.length);
        return `Showing ${start}-${end}`;
      });

    var nextChunkGroup = centerSphere
      .append("svg:g")
      .attr("transform", `rotate(190) translate(0,${centerRadius * outerRadius - 13})`);

    nextChunkGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .attr("class", "next-nav-chunk")
      .on("mousedown", function() {
        d3.event.stopPropagation();
        if (mainObject.startCategoryIndex + state.MAX_CATEGORIES < mainObject.categories.length) {
          mainObject.startCategoryIndex += state.MAX_CATEGORIES;
          window.dispatchEvent(new CustomEvent("drawCategoriesChunk", { detail : {} }));
        }
      });

    nextChunkGroup
      .append("svg:path")
      .attr("d", "M 3,5 L -5,0 L 3,-5 Z")
      .attr("class", "next-prev-marker");

    var prevChunkGroup = centerSphere
      .append("svg:g")
      .attr("transform", `rotate(105) translate(0,${centerRadius * outerRadius - 13})`);

    prevChunkGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .attr("class", "prev-nav-chunk")
      .on("mousedown", function() {
        d3.event.stopPropagation();
        if (mainObject.startCategoryIndex > 0) {
          mainObject.startCategoryIndex -= state.MAX_CATEGORIES;
          window.dispatchEvent(new CustomEvent("drawCategoriesChunk", { detail : {} }));
        }
      });

    prevChunkGroup
      .append("svg:path")
      .attr("d", "M -3,-5 L 5,0 L -3,5 Z")
      .attr("class", "next-prev-marker");

  }

  drawMainCircularShape();
  drawCircularMarkers();
  drawSigmaSlicesOuter();
  drawSpheresGuidelines();
  drawAverageMarkers();
  drawSigmaSlicesInner();
  drawSpheres();
  drawCenterSphere();

  if (state.criteria.clusterLevel > 0) {
    d3.select(".detailed-group .center-sphere").raise();
    d3.select(".detailed-group").insert(function() {
      return d3.select(".detailed-group .slices-inner").remove().node();
    }, ".zoom-sphere-background");
  }
  else {
    d3.select(".detailed-group .center-sphere").raise();
    d3.select(".detailed-group").insert(function() {
      return d3.select(".detailed-group .slices-inner").remove().node();
    }, ".sphere-background");
  }

}