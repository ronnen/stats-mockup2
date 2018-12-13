var freshDataLoaded = true; // being set every time fresh data is loaded
const zoomInDiameterFactor = 0.85;
var simulation;

function drawOverview(mainUnits) {
  if (freshDataLoaded) {
    calculateTotalValues(mainUnits);
    if (tableToggleState) {
      refreshTable(getAllVisibleApprovals());
    }
  }

  var width = parseInt(d3.select('.svg-container').style('width')),
      height = window.innerHeight;
      // height = Math.max(parseInt(d3.select('.svg-container').style('height')), window.innerHeight);

  mainUnits = filterNonHidden(mainUnits);

  // const maxDiameter = 0.65 * height;
  // const diameter = Math.min(width / (mainUnits.length), maxDiameter); // diameter of closed state
  // const outerRadius = diameter/2;
  const blownUpRadius = zoomInDiameterFactor/2 * height; // corresponds to radius in drawDetailedView
  const minApproverBubbleRatio = 0.5;
  const maxApproverBubbleRatio = 0.8;
  const identityMargin = 20;
  var svg, mainGroup, minCount, maxCount, minTotalFinancialValue, maxTotalFinancialValue, minValue, maxValue, minWait, maxWait, minAmount, maxAmount;

  // calculate appropriate factor for outerRadius

  // if we want to go with total value of approvals to represent bubble size
  // var sumOfTotalValue = d3.sum(mainUnits, function(d) {return d.unitTotalValue});
  // var outerRadiusFactor = width*height*0.7 / (sumOfTotalValue || 1); // measure how much space per unit given screen size

  // if we want to go with # of employees to represent bubble size

  // var sumOfTotalRequests = d3.sum(mainUnits, function(d) {return d.totalCount});
  // var outerRadiusFactor = width*height*0.7 / (sumOfTotalRequests || 1); // measure how much space per unit given screen size

  maxCount = d3.max(mainUnits.map(function(v) {
    return v.totalCount;
  }));

  minCount = d3.min(mainUnits.map(function(v) {
    return v.totalCount;
  }));

  const minToMaxOuterBubbleRatio = 0.6;

  // force min size for request count;
  var countGenerator = d3.scaleLinear()
    .domain([minCount, maxCount])
    .range([minToMaxOuterBubbleRatio,1]);

  var sumOfStandardAreas = d3.sum(mainUnits, function(d) {return countGenerator(d.totalCount)});
  var outerRadiusFactor = width*height*0.6 / (sumOfStandardAreas || 1); // measure how much space per unit given screen size

  var outerRadiusGenerator = d3.scaleLinear()
    .domain([minCount, maxCount])
    .range([countGenerator(minCount) * outerRadiusFactor, countGenerator(maxCount) * outerRadiusFactor]);


  mainUnits.forEach(function(d) {
    d.outerRadius = Math.sqrt(outerRadiusGenerator(d.totalCount) / Math.PI)
    // d.outerRadius = Math.sqrt(outerRadiusFactor / Math.PI); // not differential right now
  });

  // inner bubble should not extend beyond minToMaxOuterBubbleRatio * outerRadiusFactor
  const innerBubbleMaxRadius = Math.sqrt(minToMaxOuterBubbleRatio * outerRadiusFactor / Math.PI);

  // find min-max financial value
  maxTotalFinancialValue = d3.max(mainUnits.filter(function(r) {return r.presentation == "currency"}).map(function(v) {
    return v.totalValue;
  }));

  minTotalFinancialValue = d3.min(mainUnits.filter(function(r) {return r.presentation == "currency"}).map(function(v) {
    return v.totalValue;
  }));

  maxWait = d3.max(mainUnits.map(function(v) {
    return d3.max(v.approvers, function(approver) {
      return d3.max(approver.approvals, function(approval) {
        return approval.waitTime;
      });
    });
  }));

  minWait = d3.min(mainUnits.map(function(v) {
    return d3.min(v.approvers, function(approver) {
      return d3.min(approver.approvals, function(approval) {
        return approval.waitTime;
      });
    });
  }));

  maxValue = d3.max(mainUnits.map(function(v) {
    return d3.max(v.approvers, function(approver) {
      return d3.max(approver.approvals, function(approval) {
        return approval.presentation == "currency" ? approval.value : null;
      });
    });
  }));

  minValue= d3.min(mainUnits.map(function(v) {
    return d3.min(v.approvers, function(approver) {
      return d3.min(approver.approvals, function(approval) {
        return approval.presentation == "currency" ? approval.value : null;
      });
    });
  }));

  // collect approval type
  var approvalTypeLabels = mainUnits.map(function(r) {return r.request;});

  if (freshDataLoaded) {
    // console.log("max approver value " + maxValue);

    drawMenu({
/*
      totalValueMin: 0,
      totalValueMax: maxValue,
*/
      timeRangeMin: new Date((new Date()).getTime()- (30 * 864e5)).getTime(), // before a month
      timeRangeMax: (new Date()).getTime(), // today
      waitTimeMin: minWait,
      waitTimeMax: maxWait,
      amountMin: minValue,
      amountMax: maxValue,
      approvalTypes: approvalTypeLabels,

      getSimulation: function() {return simulation;}
    });

    freshDataLoaded = false;

    onFreshData();

    if (mainUnits.length <= 0) return;

  }

  function onFreshData() {
    d3.select("svg").remove();

    svg = d3.select(".svg-container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("click", function() {
        d3.event.stopPropagation();

        if (closeOpenFlowers()) {
          simulation.stop();
          window.dispatchEvent(new CustomEvent("drawOverviewByCriteria", { detail: { }}));
        }
      });

    mainGroup = svg.append("svg:g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
      .attr("class","main-group");

    const forceX = d3.forceX(width / 2).strength(0.015);
    const forceY = d3.forceY(height / 2).strength(0.015);

    if (mainUnits.length <= 0) {
      mainGroup
        .append("text")
        .attr("class", "all-data-hidden")
        .attr("text-anchor", "middle")
        .text("No data match your criteria");

      return;
    }

    // console.log("simulation forceSimulation with mainUnits")
    // reference: https://d3indepth.com/force-layout/
    if (simulation) {
      simulation.on('tick', null); // remove old handler
    }

    simulation = d3.forceSimulation(mainUnits)
      .alphaDecay(0.03)
      .velocityDecay(0.2)
      // .force('charge', d3.forceManyBody().strength(800))
      .force("x", forceX)
      .force("y", forceY)
      .force('collision', d3.forceCollide().radius(function(d, index) {
        if (d.selected) {
          console.log("simulation caught selected mainUnit");
        }
        return (d.selected ? blownUpRadius : d.outerRadius) + 10; // d.radius
      }))
      .on('tick', ticked);

    simulation.lastState = null;

    function belowThresholdMovement(state1, state2) {
      return !state1.some(function(s1, i) {
        if (s1.x.toFixed(1) != state2[i].x.toFixed(1) || s1.y.toFixed(1) != state2[i].y.toFixed(1))
          return true;
      });
    }

    function ticked() {
      var newData = unitGroups.data();
      if (simulation.lastState != null && belowThresholdMovement(newData, simulation.lastState)) {
        simulation.stop();
        return;
      }
      simulation.lastState = newData.map(function(d) {return {x: d.x, y: d.y}});
      unitGroups
        .attr("transform", function (d, index) {
          var y = d.y - (height/2);
          var x = d.x - (width/2);
          return "translate(" + x + "," + y + ")";
        });
    }

  }

  svg = d3.select(".svg-container").select("svg");
  mainGroup = svg.select("g.main-group");

  // DATA JOIN
  // Join new data with old elements, if any.
  // var text = g.selectAll("text")
  //   .data(data);

  var unitGroupsBase = mainGroup.selectAll("g.main-units")
    .data(filterNonHidden(mainUnits), function(d) {return d.request});

/*
  var unitGroups = unitGroupsBase
    .enter();

  unitGroups = unitGroups
*/
  // var unitGroups = unitGroupsBase

  var unitGroups = unitGroupsBase
    .enter()
    .append("svg:g")
    .attr("class", "main-units")
    .attr("transform", function (d, index) {
      if (!isNaN(parseFloat(d.fx))) {
        return d3.select(this).attr("transform");
      }
      var y = d.y - (height/2);
      var x = d.x - (width/2);
      // console.log("main-unit translate " + "translate(" + x + "," + y + ")");
      return "translate(" + x + "," + y + ")";
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  function dragstarted(d) {
    // release all other nodes
    mainUnits.forEach(function(unit) {
      delete unit.fx;
      delete unit.fy;
    });

    // console.log("dragstarted");

    d3.select(this).classed("active", true);
    if (!d3.event.active) runSimulation(0.3); // simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;

  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    d3.select(this).classed("active", false);
    // these lines commented out to fix node
    if (!d3.event.active) runSimulation(0); // simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  unitGroups
    .append("circle")
    .attr("r", function(d) {return d.outerRadius})
    .attr("class", "closed-sphere-background");

  unitGroupsBase.exit().remove();

  // draw unit identity marker

  function estimateAngleGapForText(radius, text) {
    return text.length * 8 / (radius); // gap in radians
  }

  // outer identity marker (which department and employee count)

  unitGroups // might need to change class name
    .append("svg:path")
    .attr("class", "identity circular-marker")
    .attr("fill", "transparent")
    .attr("stroke-width", function(d) {
      return 1;
    })
    .attr("stroke-linejoin", "round")
    .attr("d", function(d) {return arcSliceFull({
      radius: d.outerRadius - identityMargin,
      from: 0,
      to: 2*Math.PI
    });});

  // background for the label
  unitGroups
    .append("svg:path")
    .attr("id", function(d,index) {
      return "objectIdentityPath-" + index;
    })
    .attr("class", "background-stroke")
    .attr("fill", "transparent")
    .attr("stroke-width", 1)
    .attr("d", function(d) {
      var gap = estimateAngleGapForText(d.outerRadius - identityMargin, d.unitLabel);
      return arcSliceFull({
        radius: d.outerRadius - identityMargin,
        to: toRadians(120) + gap/2,
        from: toRadians(120) - gap/2
      })
    });

  unitGroups
    .append("text")
    .attr("class", "approval-type-label")
    .attr("dy", 3)
    .append("textPath") //append a textPath to the text element
    .attr("xlink:href", function(d,index) {
      return "#objectIdentityPath-" + index;
    }) //place the ID of the path here
    .style("text-anchor","middle") //place the text halfway on the arc
    .attr("startOffset", "76%")
    .text(function(d) {
      return d.unitLabel;
    });

  var closedBubbleScale = d3.scaleLinear()
    .domain([Math.sqrt(minTotalFinancialValue), Math.sqrt(maxTotalFinancialValue)])
    .range([minApproverBubbleRatio, maxApproverBubbleRatio]);

  var colorGenerator = colorForWaitTime(maxWait);

  unitGroups
    .append("circle")
    .attr("class", function(d) {return "request-type-closed" + (d.hidden ? " hidden" : "")})
    .attr("stroke", "transparent")
    .style("mix-blend-mode", "multiply")
    .attr("r", function(d) {
      if (d.presentation == "currency")
        return closedBubbleScale(Math.sqrt(d.totalValue)) * innerBubbleMaxRadius;
      else
        return (minApproverBubbleRatio + maxApproverBubbleRatio)/2 * innerBubbleMaxRadius;
    })
    .on("click", handleClick)
    .on("mouseenter", function(d) {
      d3.select(this).classed("highlight", true);
    })
    .on("mouseleave", function(d) {
      d3.select(this).classed("highlight", false);
    });

  // add label
  unitGroups
    .append("text")
    .attr("class", "request-name")
    .attr("text-anchor", "middle")
    .attr("dy", "-.35em")
    .text(function (d) {
      return d.request;
    });

  // add value
  unitGroups
    .append("text")
    .attr("class", "request-value")
    .attr("text-anchor", "middle")
    .attr("dy", "1em")
    .text(function (d) {
      return typedValueToText(d.totalValue, d.presentation);
    });

  // acting on the MERGE = ENTER + UPDATE
  unitGroups
    .merge(unitGroupsBase)
    .classed("selected", function(d) {
      return d.selected
    })
    .selectAll(".request-type-closed")
    .attr("class", function(d) {return "request-type-closed" + (d.hidden ? " hidden" : "")})
    .attr("fill", function (d) {
      if (d.totalCount > 0)
        return colorGenerator(d.totalWaitTime/d.totalCount);
      else
        return "#000000";
    });

  simulation
    .force('collision', d3.forceCollide().radius(function(d, index) {
/*
      if (d.selected) {
        console.log("[2] simulation caught selected mainUnit");
      }
*/
      return (d.selected ? blownUpRadius : d.outerRadius) + 10; // d.radius
    }));

  function closeOpenFlowers() {
    // there's supposed to be only one really
    var any = d3.selectAll(".main-units.selected .detailed-group").nodes().length;
    if (any) {
      d3.selectAll(".main-units.selected .detailed-group").remove();
      d3.select(".main-units.selected").on('mousedown.drag', null);
      d3.selectAll(".main-units").classed("selected", false).each(function(d) {
        d.selected = false;
        d.fx = null;
        d.fy = null;
      });
      d3.select(".submitterTooltip")
        .style("display","none");
    }

    return any;
  }

  function handleClick(d, i) {
    d3.event.stopPropagation();
    // console.log("handleClick");

    // first close all open flowers
    closeOpenFlowers();

    d.selected = true; // approver marked as selected
    simulation.stop();
    window.dispatchEvent(new CustomEvent("drawOverviewByCriteria", { detail : {selectedNode: this.parentNode} }));

  }

  function runSimulation(alphaTarget) {
    alphaTarget = alphaTarget != null ? alphaTarget : 0.3;
    simulation
      .nodes(mainUnits)
      .alphaTarget(alphaTarget).restart();
  }

  return {stopSimulation: simulation.stop, runSimulation: runSimulation, maxWait: maxWait};
}
