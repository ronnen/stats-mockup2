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
  const approverRadius = 0.25;
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
  if (mainObject.sigma === undefined) state.dataFunc.sigma(mainObject);

  var sigmaRange = mainObject.sigma <= 0 ? 1 : Math.ceil(mainObject.maxAbsoluteDev / mainObject.sigma) * mainObject.sigma;
  // var sigmaRange = mainObject.sigma <= 0 ? 1 : Math.ceil(Math.min(mainObject.maxAbsoluteDev / mainObject.sigma,4)) * mainObject.sigma;

  var colorGenerator = state.common.colorForSigma(sigmaRange);

  d3.select(unitNode).raise();

  // compute center and radius
  var outerRadius = Math.max(mainObject.outerRadius, zoomInDiameterFactor / 2 * height);
  const circleMarkersGap = (circleEndRadius - circleStartRadius) / (state.common.countNonHidden(mainObject.approvers) + 1);

  var detailedGroupBase = selectedUnit.selectAll(".detailed-group")
    .data([mainObject], function(d) {return d.request});

  var detailedGroup = detailedGroupBase
    .enter();

  detailedGroup = detailedGroup.append("svg:g")
    .attr("class", "detailed-group value-anomaly")
    .on("click", handleFlowerClick)
    .on("mouseleave", approvalMouseLeave);

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

    // approvers' circular markers (approval labels)

    var circularGroups = detailedGroup.selectAll("g.approver-group")
      .data(subUnits.map(function(d, i) {
        var radius = outerRadius * (circleStartRadius + (i+1)*circleMarkersGap);
        return {
          approver: d,
          radius: radius
        };
      }))
      .enter()
      .append("svg:g")
      .attr("class", "approver-group")
      .attr("id", function(d,i) {
        return "a" + d.approver.approverIndex
      });

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
        return "approverID" + i;
      })
      .attr("class", "approver-name-label-background background-stroke")
      .attr("fill", "transparent")
      .attr("stroke-width", 1)
      .attr("d",  function(d) {
        var gap = estimateAngleGapForText(d.radius, d.approver.approverName);
        return state.common.arcSliceFull({
          radius: d.radius,
          to: state.common.toRadians(-30) + gap/2,
          from: state.common.toRadians(-30) - gap/2
        });
      });

    circularGroups
      .append("text")
      .attr("class", "approver-name-label")
      .attr("dy", 3)
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", function(d,i) {
        return "#approverID" + i
      }) //place the ID of the path here
      .style("text-anchor","middle") //place the text halfway on the arc
      // .attr("startOffset", "79%") // this will show the invert text
      .attr("startOffset", "24%")
      .text(function(d) {
        return d.approver.approverName;
      });

  }

  const SliceBackgroundColor = [
    '#00634480',
    '#B6C61A80',
    '#D8A80080',
    '#BD3B1B80'
  ];

  var sliceCount = mainObject.sigma <= 0 ? 1 : Math.ceil(mainObject.maxAbsoluteDev / mainObject.sigma);
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
          .innerRadius(approverRadius * outerRadius)
          .outerRadius(outerRadius - identityMargin);
        return arc();
      });

  }

  function drawSigmaSlicesInner() {
    detailedGroup
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
          .innerRadius(approverRadius * outerRadius)
          .outerRadius(approverRadius * outerRadius + 36);
        return arc();
      });

    detailedGroup
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
          .innerRadius(approverRadius * outerRadius)
          .outerRadius(approverRadius * outerRadius + 36);
        return arc.centroid()[0];
      })
      .attr("y", function(d) {
        var arc = d3.arc()
          .startAngle(state.common.toRadians(d * sliceDegrees))
          .endAngle(state.common.toRadians((d+1) * sliceDegrees))
          .innerRadius(approverRadius * outerRadius)
          .outerRadius(approverRadius * outerRadius + 36);
        return arc.centroid()[1];
      })
      .text(function(d) {
        return (d > 0 ? (d+1) : "") + SigmaSymbol;
      });
  }

  var subUnits = mainObject.approvers;
  var densityFactor = mainObject.approvers.length > 5 ? 0.6 : 1;

  // values translated between 0 and diameter of
  var basicValueDiameterScale = d3.scaleLinear()
    .domain([0, mainObject.maxValue])
    .range([0, densityFactor * maxApprovalBubble * outerRadius * 2]);
  const minimalBubbleSize = minApprovalBubble * outerRadius * 2;

  // TODO some code repeat itself from drawDetailedView - need to optimize

  function drawSpheresGuidelines(dataToShow, classModifier) {
    dataToShow = false;
    classModifier = "";

    subUnits.forEach(function (t, index) {
      var approverIndex = (dataToShow == ZOOM_DATA) ? index : t.approverIndex;

      var approvals = dataToShow == ZOOM_DATA ? t.zoomApprovals : t.approvals;
      var className = classModifier + "bubble-guide";

      var localGroup = d3.select(".detailed-group").selectAll("line." + className + approverIndex)
        .data(state.common.filterNonHidden(approvals, true), function(d,i) {return i;});

      var enteredGroup = localGroup
        .enter()
        // .insert("svg:line", ".ribbon-group")
        .append("svg:line")
        .style("opacity", 0)
        .attr("class", function(d) {return className + " " + className + approverIndex + (d.hidden ? " hidden" : "")})
        .attr("id", function(d,i) {
          return "a" + approverIndex + "g" + i; // a [approver index] g [approval index]
        })
        .attr("fill", "transparent")
        // .attr("stroke", "black")
        .attr("stroke", function (d) {
          return colorGenerator(Math.abs(d.sigmaDev));
        })
        .attr("stroke-width", 1)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", function (d) {
          return outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
        })
        .attr("transform", function (d) {
          var sampleDegrees = -180 + state.approvalsRadialStart +
            (state.approvalsRadialEnd - state.approvalsRadialStart) * (Math.abs(d.sigmaDev) / sigmaRange);
          return "rotate(" + sampleDegrees + ")";
        });

      enteredGroup
        .transition()
        .duration(150)
        .style("opacity", 1)
        .on("end", () => {
          enteredGroup.style("opacity", null);
        });

      enteredGroup
        .merge(localGroup)
        .classed("hidden", function(d) {return d.hidden;})
        .attr("stroke", function (d) {
          return colorGenerator(Math.abs(d.sigmaDev));
        })
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
    d3.selectAll(".approver-group").classed("highlight", false);
    d3.select(".detailed-group").classed("approval-highlight", false);

    if (!d3.select(".detailed-group").classed("locked")) {
      d3.select(".table-rows").classed("approval-highlight", false);
      d3.selectAll(".table-rows .data-row").classed("highlight", false);
    }
  }


  function drawSpheres(dataToShow, classModifier) {
    var valueDiameterScale = basicValueDiameterScale;
    dataToShow = false;
    classModifier = "";

    function approvalClicked(d, i) {
      d3.event.stopPropagation();
      d3.selectAll(".approval-halo").remove();
      if (d3.select(this).classed("locked")) {
        // release locked state
        releaseLockedState();
      }
      else {
        var sphereID = d3.select(this).attr("id"); //e.g.  a3b8 will be matched with guide a3g8
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

        // TODO some cleanup as we are not supposed to be in clustering mode
        // if in zoom state we highlight according to rows according to zoomBucket, otherwise use sphere ID
        if (dataToShow == ZOOM_DATA && d.zoomBucket)
          d3.select(".table-rows").selectAll(`.data-row[data-zoom=${d.zoomBucket}]`).classed("highlight", true);
        else
          d3.select("#r" + requestIndex + sphereID).classed("highlight", true); // r4a3b5 (request 4, approver 3, approval 5)

        d3.select(".table-container").classed("on", true);

      }
    }

    function approvalMouseEnter(d, i) {  // Add interactivity

      var currentApprovalCircle = d3.select(this).select(".approval-circle-foreground");
      var approvalRadius = parseFloat(currentApprovalCircle.attr("r"));

      var sphereID = d3.select(this).attr("id"); //e.g.  a3b8 will be matched with guide a3g8

      d3.select(this).classed("highlight", true);
      d3.select("#" + sphereID.replace("b","g")).classed("highlight", true);
      d3.select(".detailed-group").classed("approval-highlight", true);

      var approverIndex = parseInt(sphereID.substring(1));
      d3.select("#a" + approverIndex).classed("highlight", true); // .approver-group of specific approver

      d3.select(this).on("mouseleave", approvalMouseLeave);

      var rect = this.getBoundingClientRect();

      d3.select(".submitterTooltip")
        .style("display","block")
        .style("left", (rect.x + rect.width/2 + approvalRadius + 10) + "px")
        .style("top", (rect.y + rect.height/2) + "px");

      var sigmaX = mainObject.sigma > 0 ? (Math.abs(d.sigmaDev) / mainObject.sigma).toFixed(1) : 0;
      d3.select(".submitter-content .submitter-name").text(d.submitter);
      d3.select(".submitter-content .wait-time").text("Sigma: " + sigmaX + SigmaSymbol);
      d3.select(".submitter-content .misc").text(state.common.smartValueToText(d));
    }

    function drawBackgroundOrForeground(foreground) {
      // now drawing spheres
      subUnits.forEach(function (t, index) {

        var approverIndex = (dataToShow == ZOOM_DATA) ? index : t.approverIndex;

        var approvals = dataToShow == ZOOM_DATA ? t.zoomApprovals : t.approvals;
        var className = classModifier + (foreground ? "sphere" : "sphere-background");
        // due to general update pattern detailedGroup might be empty so selecting explicitly
        var spheresSelection = d3.select(".detailed-group").selectAll("g." + className + approverIndex)
          .data(state.common.filterNonHidden(approvals, true), function(d,i) {return i;});

        var spheres = spheresSelection
          .enter()
          .append("svg:g")
          .attr("class", className + " " + className + approverIndex)
          .attr("id", function(d,i) {
            return foreground ? ("a" + approverIndex + "b" + i) : null; // a [approver index] b [approval index]
          });

        // the first iteration will create an opaque background to hide background
        // the second iteration has some transparency to show overlapping intersections

        // add sphere or sphere background
        spheres
          .style("opacity", 0)
          .append("circle")
          .attr("class", function(d) {
            if (!foreground) return "main-circle-background";
            return "approval-circle-foreground" + (d.hidden ? " hidden" : "");
          })
          .attr("stroke", "transparent")
          .attr("fill", function (d) {
            if (!foreground) return;
            return colorGenerator(Math.abs(d.sigmaDev));
          })
          .style("mix-blend-mode", foreground ? "multiply" : null)
          .attr("cx", function (d) {
            return 0;
          })
          .attr("cy", function (d) {
            return outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
          })
          .attr("r", function (d, i) {
            // there is minimal bubble size...
            return Math.max(valueDiameterScale(d.value) / 2, minimalBubbleSize / 2);
          })
          .attr("transform", function (d) {
            var sampleDegrees = -180 + state.approvalsRadialStart +
              (state.approvalsRadialEnd - state.approvalsRadialStart) * (Math.abs(d.sigmaDev) / sigmaRange);
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
            var angle = -90 + state.approvalsRadialStart + (state.approvalsRadialEnd - state.approvalsRadialStart) * (Math.abs(d.sigmaDev) / sigmaRange);
            return Math.cos(state.common.toRadians(angle)) * radius;
          })
          .attr("y", function (d) {
            // calculate absolute position based on radius and angle
            var radius = outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
            var angle = -90 + state.approvalsRadialStart + (state.approvalsRadialEnd - state.approvalsRadialStart) * (Math.abs(d.sigmaDev) / sigmaRange);
            return Math.sin(state.common.toRadians(angle)) * radius;
          })
          .text(function (d) {
            return state.common.typedValueToTextShort(d.value, d.presentation);
          });

        var a = spheres
          .merge(spheresSelection)
          .select(".approval-circle-foreground")
          .classed("hidden", function(d) {return d.hidden})
          .attr("fill", function (d) {
            return colorGenerator(Math.abs(d.sigmaDev));
          });
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
      .attr("r", approverRadius * outerRadius)
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
        return SigmaSymbol + " = " + state.common.sigmaToText(mainObject.sigma, mainObject);
      });
    centerSphere
      .append("text")
      .attr("class", "detailed-request-percent")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "2.3em")
      .text("");

  }

  drawMainCircularShape();
  drawCircularMarkers();
  drawSigmaSlicesOuter();
  drawSpheresGuidelines();
  drawSigmaSlicesInner();
  drawSpheres();
  drawCenterSphere();

}