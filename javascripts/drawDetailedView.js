function drawDetailedView(selectedUnit, drawOverviewParam) {

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

  var unitNode = selectedUnit.node();
  var mainObject = selectedUnit.datum();
  var requestIndex = mainUnits.findIndex(function(a) {return a === mainObject;});
  if (requestIndex < 0) {
    console.error("Bad requestIndex");
  }

  d3.select(unitNode).raise();
  
  // compute center and radius
  var outerRadius = Math.max(mainObject.outerRadius, zoomInDiameterFactor/2 * height);
  const circleMarkersGap = (circleEndRadius - circleStartRadius) / (Math.min(state.common.countNonHidden(mainObject.approvers), state.MAX_APPROVERS) + 1);

  var colorGenerator = state.common.colorForWaitTime(mainObject.configLowWait, mainObject.configHighWait);

  // var unitGroup = selectedUnit;

  var detailedGroupBase = selectedUnit.selectAll(".detailed-group")
    .data([mainObject], function(d) {return d.request});

  var detailedGroup = detailedGroupBase
    .enter();

  detailedGroup = detailedGroup.append("svg:g")
    .attr("class", "detailed-group")
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

/*
    d3.select(this).remove();
    d3.selectAll(".main-units").classed("selected", false).each(function(d) {
      d.selected = false;
      d.fx = null;
      d.fy = null;
    });
    d3.select(".submitterTooltip")
      .style("display","none");
    d3.select(".table-rows").classed("approval-highlight", false);
    d3.selectAll(".table-rows .data-row").classed("highlight", false);

    stopSimulation();
    window.dispatchEvent(new CustomEvent("drawOverviewByCriteria", {
      detail: {  }
    }));
*/

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

    detailedGroup
      .append("text")
      .attr("class", "approval-type-label")
      .attr("dy", 3)
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", "#objectIdentityPath") //place the ID of the path here
      .style("text-anchor","middle") //place the text halfway on the arc
      .attr("startOffset", "24%")
      .text(mainObject.unitLabel);

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
      .attr("id", function(d,i) {return "a" + i})
      .on("mouseenter", approverMouseEnter)
      .on("mouseleave", approverMouseLeave);

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

    function approverMouseEnter(d, index) {
      d3.select(this).classed("highlight", true);
      d3.select(".detailed-group").classed("approver-highlight", true);
      d3.selectAll("g.sphere"+index).classed("highlight", true);
      d3.selectAll("g.zoom-sphere"+index).classed("highlight", true);
      d3.selectAll(".bubble-guide"+index).classed("highlight", true);
      d3.selectAll(".zoom-bubble-guide"+index).classed("highlight", true);
      d3.select("#average-guide" + index).classed("highlight", true);
      d3.select(".detailed-group .request-value")
        .text(state.common.typedValueToText(d.approver.value, mainObject.presentation));
      var approverPercent = (100*d.approver.value/mainObject.totalValue).toFixed(0) + "%"
      d3.select(".detailed-group .detailed-request-percent").text(approverPercent);

      d3.select(".table-rows").classed("approver-highlight", true);
      d3.selectAll(".table-rows .data-row.r" + requestIndex + "a" + index).classed("highlight", true);
    }

    function approverMouseLeave(d, i) {
      d3.select(this).classed("highlight", false);
      d3.select(".detailed-group").classed("approver-highlight", false);
      d3.selectAll(".bubble-guide").classed("highlight", false);
      d3.selectAll(".zoom-bubble-guide").classed("highlight", false);
      d3.selectAll("g.sphere").classed("highlight", false);
      d3.selectAll("g.zoom-sphere").classed("highlight", false);
      d3.selectAll(".average-guide").classed("highlight", false);
      d3.select(".detailed-group .request-value")
        .text(state.common.typedValueToText(mainObject.totalValue, mainObject.presentation));
      d3.select(".detailed-group .detailed-request-percent").text("");

      d3.select(".table-rows").classed("approver-highlight", false);
      d3.selectAll(".table-rows .data-row").classed("highlight", false);
    }

    circularGroups
      .append("svg:path")
      .attr("class", "circular-marker-2")
      .attr("fill", "transparent")
      .attr("stroke", "transparent")
      .attr("stroke-width", function(d) {
        return outerRadius * circleMarkersGap;
      })
      .attr("stroke-linejoin", "round")
      .attr("d", function(d) {return state.common.arcSliceFull({
        radius: d.radius,
        from: 0,
        to: 2*Math.PI
      });});

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

  // subUnits denote all the visible approvers
  // TODO check for potential troubles
  // var subUnits = state.common.filterNonHidden(mainObject.approvers);

  var sortedApprovers;
  switch (state.approversSortType) {
    case state.BY_VALUE:
      sortedApprovers = mainObject.approversByValue;
      break;
    case state.BY_COUNT:
      sortedApprovers = mainObject.approversByCount;
      break;
    default:
      sortedApprovers = mainObject.approvers;
  }

  var subUnits = sortedApprovers.slice(mainObject.startApproverIndex, mainObject.startApproverIndex + state.MAX_APPROVERS);

/*
  var maxValue = d3.max(subUnits.map(function(v) {
    return d3.max(v.approvals, function(a) {return a.value})
  }));
*/

  var densityFactor = mainObject.approvers.length > 5 ? 0.6 : 1;

  // values translated between 0 and diameter of
  var basicValueDiameterScale = d3.scaleLinear()
    .domain([0, mainObject.maxValue])
    .range([0, densityFactor * maxApprovalBubble * outerRadius * 2]);
  const minimalBubbleSize = minApprovalBubble * outerRadius * 2;

  function drawAverageDelayMarkers() {

    // draw average delay guideline
    var avgGuideGroup = detailedGroup.selectAll("g.average-guide")
      .data(subUnits)
      .enter()
      .append("svg:g")
      .attr("class", "average-guide")
      .attr("id", function(d,i) {return "average-guide" + i})
      .attr("transform", function (d) {
        var sampleDegrees = -180 + state.approvalsRadialStart +
          (state.approvalsRadialEnd - state.approvalsRadialStart) * (d.average / mainObject.maxWait);
        // console.log("sampleDegrees " + sampleDegrees + " " + state.common.waitToText(d.average));
        d.flipText = (sampleDegrees > 0);
        return "rotate(" + sampleDegrees + ")";
      });

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
      .attr("text-anchor", function(d) {return d.flipText ? "middle" : "middle"}) // "start" : "end"
      .attr("dy", "1.2em")
      .attr("x", function (d, index) {
        var visibleAverageLen = outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap) - approverRadius * outerRadius
        return (d.flipText ? visibleAverageLen : -visibleAverageLen) * 0.5;
      })
      .attr("y", function (d, index) {
        return outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap);
      })
      .text(function (d) {
        return state.common.waitDaysHoursToText(d.average);
      })
      .attr("transform", function (d, index) {
        var radius = outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap);
        return d3.svg.transform()
          .translate(d.flipText ? -radius : radius, radius)
          .rotate(d.flipText ? -90 : 90)();
      });
  }

  function drawSpheresGuidelines(dataToShow, classModifier) {
    // moving the cluster widget it is unnecessary to pass params to this function
    // draw static base guideline
    // classModifier = classModifier || "";
    if (state.criteria.clusterLevel) {
      dataToShow = ZOOM_DATA;
      classModifier = "zoom-";
    }
    else {
      dataToShow = false;
      classModifier = "";
    }

    // if (!dataToShow) {
      detailedGroup
        .append("svg:line")
        .attr("class", "circular-marker")
        .attr("fill", "transparent")
        .attr("stroke-width", 1)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", outerRadius - identityMargin)
        .attr("transform", "rotate(180)");
    // }

    // first drawing guide lines
    subUnits.forEach(function (t, index) {
      var approvals = dataToShow == ZOOM_DATA ? t.zoomApprovals : t.approvals;
      var className = classModifier + "bubble-guide";

      var localGroup = d3.select(".detailed-group").selectAll("line." + className + index)
        .data(state.common.filterNonHidden(approvals), function(d,i) {return i;});

      var enteredGroup = localGroup
        .enter()
        .insert("svg:line", ".ribbon-group")
        .style("opacity", 0)
        .attr("class", function(d) {return className + " " + className + index + (d.hidden ? " hidden" : "")})
        .attr("id", function(d,i) {
          return "a" + index + "g" + i; // a [approver index] g [approval index]
        })
        .attr("fill", "transparent")
        // .attr("stroke", "black")
        .attr("stroke", function (d) {
          return colorGenerator(d.waitTime);
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
            (state.approvalsRadialEnd - state.approvalsRadialStart) * (d.waitTime / mainObject.maxWait);
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
          return colorGenerator(d.waitTime);
        })
    });
  }

  function approvalMouseLeave() {
    // d3.selectAll(".approval-halo").remove();
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

  function releaseLockedState() {
    d3.selectAll(".approval-halo").remove();
    d3.selectAll(".detailed-group .sphere, .detailed-group .zoom-sphere").classed("locked", false);
    d3.select(".detailed-group").classed("locked", false);
    d3.select(".table-container").style("height",null).classed("on", false);
  }

  function drawSpheres(dataToShow, classModifier /*, valueDiameterScale*/) {
    // default dataToShow is granular approvals
    // if dataToShow == ZOOM_DATA then show approver.zoomApprovals

    // in case drawSpheres called in zoom state then force drawing of correct spheres
/*
    if (d3.select(".detailed-group").classed("zoom")) {
      dataToShow = ZOOM_DATA;
      classModifier = "zoom-";
    }

    classModifier = classModifier || "";
*/

    var zoomValueDiameterScale;

    if (state.criteria.clusterLevel) {
      dataToShow = ZOOM_DATA;
      classModifier = "zoom-";

      zoomValueDiameterScale = d3.scaleLinear()
        .domain([0, mainObject.zoomMaxValue])
        .range([0, densityFactor * maxApprovalBubble * outerRadius * 2]);

    }
    else {
      dataToShow = false;
      classModifier = "";
    }

    var valueDiameterScale = zoomValueDiameterScale || basicValueDiameterScale;

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

/*
      d3.select(".table-rows").classed("approval-highlight", true);
      d3.selectAll(".table-rows .data-row").classed("highlight", false); // in case mouseLeave was not fired

      // if in zoom state we highlight according to rows according to zoomBucket, otherwise use sphere ID
      if (dataToShow == ZOOM_DATA && d.zoomBucket)
        d3.select(".table-rows").selectAll(`.data-row[data-zoom=${d.zoomBucket}]`).classed("highlight", true);
      else
        d3.select("#r" + requestIndex + sphereID).classed("highlight", true); // r4a3b5 (request 4, approver 3, approval 5)
*/

      var approverIndex = parseInt(sphereID.substring(1));
      d3.select("#a" + approverIndex).classed("highlight", true); // .approver-group of specific approver

      d3.select(this).on("mouseleave", approvalMouseLeave);

      var rect = this.getBoundingClientRect();

      d3.select(".submitterTooltip")
        .style("display","block")
        .style("left", (rect.x + rect.width/2 + approvalRadius + 10) + "px")
        .style("top", (rect.y + rect.height/2) + "px");

      d3.select(".submitter-content .submitter-name").text(d.submitter);
      d3.select(".submitter-content .wait-time").text("Waiting " + state.common.waitDaysHoursToText(d.waitTime));
      d3.select(".submitter-content .misc").text(state.common.smartValueToText(d));
    }

    function drawBackgroundOrForeground(foreground) {
      // now drawing spheres
      subUnits.forEach(function (t, index) {

        // var x = detailedGroup;
        var approvals = dataToShow == ZOOM_DATA ? t.zoomApprovals : t.approvals;
        var className = classModifier + (foreground ? "sphere" : "sphere-background");
        // due to general update pattern detailedGroup might be empty so selecting explicitly
        var spheresSelection = d3.select(".detailed-group").selectAll("g." + className + index)
          .data(state.common.filterNonHidden(approvals), function(d,i) {return i;});

        var spheres = spheresSelection
          .enter()
          .append("svg:g")
          .attr("class", className + " " + className + index)
          .attr("id", function(d,i) {
            return foreground ? ("a" + index + "b" + i) : null; // a [approver index] b [approval index]
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
            return colorGenerator(d.waitTime);
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
              (state.approvalsRadialEnd - state.approvalsRadialStart) * (d.waitTime / mainObject.maxWait);
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
            var angle = -90 + state.approvalsRadialStart + (state.approvalsRadialEnd - state.approvalsRadialStart) * (d.waitTime / mainObject.maxWait);
            return Math.cos(state.common.toRadians(angle)) * radius;
          })
          .attr("y", function (d) {
            // calculate absolute position based on radius and angle
            var radius = outerRadius * (circleStartRadius + (index + 1) * circleMarkersGap)
            var angle = -90 + state.approvalsRadialStart + (state.approvalsRadialEnd - state.approvalsRadialStart) * (d.waitTime / mainObject.maxWait);
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
            return colorGenerator(d.waitTime);
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
        return state.common.typedValueToText(d.totalValue, d.presentation);
      });
    centerSphere
      .append("text")
      .attr("class", "detailed-request-percent")
      .attr("text-anchor", "middle")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "2.3em")
      .text("");

    if (mainObject.approvers.length <= state.MAX_APPROVERS) {
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
          radius: approverRadius * outerRadius - 13,
          to: state.common.toRadians(30),
          from: state.common.toRadians(-90)
        });
      });

    centerSphere
      .append("text")
      .attr("class", "approvers-chunk")
      .attr("dy", 3)
      .append("textPath") //append a textPath to the text element
      .attr("xlink:href", "#chunk-label") //place the ID of the path here
      .style("text-anchor","middle") //place the text halfway on the arc
      .attr("startOffset", "24%")
      .text(function(d) {
        var start = mainObject.startApproverIndex + 1,
          end = Math.min(mainObject.startApproverIndex + state.MAX_APPROVERS, mainObject.approvers.length);
        return `Showing ${start}-${end}`;
      });

    var nextChunkGroup = centerSphere
      .append("svg:g")
      .attr("transform", `rotate(190) translate(0,${approverRadius * outerRadius - 13})`);

    nextChunkGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .attr("class", "next-approvers-chunk")
      .on("mousedown", function() {
        d3.event.stopPropagation();
        if (mainObject.startApproverIndex + state.MAX_APPROVERS < mainObject.approvers.length) {
          mainObject.startApproverIndex += state.MAX_APPROVERS;
          window.dispatchEvent(new CustomEvent("drawApproversChunk", { detail : {} }));
        }
      });

    nextChunkGroup
      .append("svg:path")
      .attr("d", "M 3,5 L -5,0 L 3,-5 Z")
      .attr("class", "next-prev-marker");

    var prevChunkGroup = centerSphere
      .append("svg:g")
      .attr("transform", `rotate(105) translate(0,${approverRadius * outerRadius - 13})`);

    prevChunkGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .attr("class", "prev-approvers-chunk")
      .on("mousedown", function() {
        d3.event.stopPropagation();
        if (mainObject.startApproverIndex > 0) {
          mainObject.startApproverIndex -= state.MAX_APPROVERS;
          window.dispatchEvent(new CustomEvent("drawApproversChunk", { detail : {} }));
        }
      });

    prevChunkGroup
      .append("svg:path")
      .attr("d", "M -3,-5 L 5,0 L -3,5 Z")
      .attr("class", "next-prev-marker");

  }

  function drawColorfulRibbon() {
/*
    var arcSlice = d3.arc()
      .startAngle(state.common.toRadians(0))
      .endAngle(state.common.toRadians(2))
      .innerRadius(outerRadius * state.clockColorRibbonRadius)
      .outerRadius(outerRadius * state.clockColorRibbonRadius)(); // <=== already resolved to path
*/

    // based on my own arc
    var arcSlice = state.common.arcSliceOneWay({
      radius: outerRadius * state.clockColorRibbonRadius,
      from: 0,
      to:   state.common.toRadians(2) // some overlap
    });


    d3.select(".detailed-group").selectAll(".ribbon-group")
      .data([1])
      .enter()
      .append("svg:g")
      .attr("class", "ribbon-group");

    var ribbonData = Array.from(new Array(state.approvalsRadialEnd), (item, index) => index);

    // to force refresh of ribbon colors
    var ribbonSelection = d3.select(".ribbon-group").selectAll(".ribbon-path")
      .data(ribbonData);

    var enteredRibbon = ribbonSelection
      .enter()
      .append("svg:path")
      .attr("class", "ribbon-path")
      .attr("stroke-width", 5)
      .attr("d", arcSlice)
      .attr("transform", function(d, i) {return "rotate(" + i + ")"});

    enteredRibbon.merge(ribbonSelection)
      .attr("stroke", function(d, i) {
        return colorGenerator(i * mainObject.maxWait / state.approvalsRadialEnd); // will generate red colors beyond range as necessary
      });
  }

  function drawClockMotion() {
    function tweenArc(b) {
      return function(a) {
        var i = d3.interpolate(a, b);
        for (var key in b) a[key] = b[key]; // update data
        return function(t) {
          return arc(i(t));
        };
      };
    }

    var arc = d3.arc()
      .startAngle(function(d) {
        return d.value * 2 * Math.PI;
      })
      .endAngle(2 * Math.PI)
      .innerRadius(function(d) { return d.innerRadius; })
      .outerRadius(function(d) { return d.outerRadius; });

    var clockGroup = detailedGroup.selectAll("g.clock-group")
      .data([{value: 0, innerRadius: 0, outerRadius: outerRadius}])
      .enter()
      .append("svg:g")
      .attr("class", "clock");

    // draws clock background
    // clockGroup.append("circle").attr("r", outerRadius).attr("class", "clock-background");

    clockGroup
      .append("path")
      .attr("class", "clock-pie")
      .transition().duration(2000).ease(d3.easeLinear)
      .attrTween("d", tweenArc({ value : 1 , innerRadius: 0, outerRadius: outerRadius}))
      .transition().duration(100).style("opacity",0)
      .on("end", function() {
        clockGroup.remove();
      });

    var clockTimeGroup = clockGroup.append("svg:g").attr("class", "clock-time");

    var interpolate = d3.interpolate(0.25*Math.PI, 2.25 * Math.PI);
    var interpolateTime = d3.interpolateRound(0,30);

    var textPosition = 200;

    clockTimeGroup
      .append("circle")
      .attr("class", "clock-time-circle")
      .transition().duration(2000).ease(d3.easeLinear)
      .attr("r", 50)
      .attr("cy", 0)
      .attrTween("cx", function(d) {
        return function(t) {
          return Math.sin(interpolate(t)) * (d.outerRadius - textPosition);
        };
      })
      .attrTween("cy", function(d) {
        return function(t) {
          return -Math.cos(interpolate(t)) * (d.outerRadius - textPosition);
        };
      })
      .transition().duration(100).style("opacity",0);

    clockTimeGroup
      .append("text")
      .attr("class", "clock-time-text")
      .transition().duration(2000).ease(d3.easeLinear)
      .attr("text-anchor", "middle")
      .attrTween("x", function(d) {
        return function(t) {
          return Math.sin(interpolate(t)) * (d.outerRadius - textPosition);
        };
      })
      .attrTween("y", function(d) {
        return function(t) {
          return -Math.cos(interpolate(t)) * (d.outerRadius - textPosition);
        };
      })
      .attr("dy", "0.5em")
      .tween("text", function(d) {
        return function(t) {
          var str, days = interpolateTime(t);

          if (days == 1)
            str = "One Day";
          else
            str = days + " Days";
          d3.select(".clock-time-text").text(str);
        }
      })
      .transition().duration(100).style("opacity",0);


  }

  drawMainCircularShape();
  drawCircularMarkers();
  drawSpheresGuidelines();
  drawSpheres();
  drawColorfulRibbon();
  drawAverageDelayMarkers();
  drawCenterSphere();

  if (state.criteria.clusterLevel > 0) {
    d3.selectAll(".average-guide").raise();
    d3.select(".detailed-group .center-sphere").raise();
  }

  if (state.firstTimeDrawDetailedView) {
    state.firstTimeDrawDetailedView = !state.firstTimeDrawDetailedView;
    drawClockMotion();

    window.addEventListener("setNonZoomState", function(event) {
      // console.log("setNonZoomState: check if this is necessary");
      d3.select(".detailed-group").classed("zoom", false);
      d3.selectAll(".detailed-group .zoom-sphere").remove();
      d3.selectAll(".detailed-group .zoom-sphere-background").remove();
      d3.selectAll(".detailed-group .zoom-bubble-guide").remove();
      d3.selectAll(".detailed-group .sphere").transition().duration(200).style("opacity", 1).style("opacity", null);
      d3.selectAll(".detailed-group .bubble-guide").transition().duration(200).style("opacity", 1).style("opacity", null);
      d3.selectAll(".table-rows .data-row[data-zoom]").attr("data-zoom", null);
      if (!event.detail || !event.detail.keepWidget) d3.select(".svg-container .zoom-widget-group").remove();
    });

    window.addEventListener("windowResize", function(event) {
      releaseLockedState();
      d3.select(".svg-container svg").remove();
    });

  }

  // console.log("done");
}
