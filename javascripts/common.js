state.approvalsRadialStart = 0; // where bubbles start to show in degrees
state.approvalsRadialEnd = 300; // where bubbles start to show in degrees
state.clockColorRibbonRadius = 0.3; // where to place ribbon relative to outer radius

state.common.getUrlVars = function() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
};

state.common.toRadians = function(angle) {
  return angle * (Math.PI / 180);
};

state.common.arcSliceFull = d3.arc()
  .startAngle(function (d) {
    return d.from;
  })
  .endAngle(function (d) {
    return d.to;
  })
  .innerRadius(function (d) {
    return d.radius;
  })
  .outerRadius(function (d) {
    return d.radius;
  });

/*
state.common.arcSliceOneWay = function(d, i) {
  var a = state.common.arcSliceFull(d,i);
  var myString = a.split(/[A-Z]/);
  // console.log("arcSliceOneWay " + myString.join("\n"));
  return "M" + myString[1] + "A" + myString[2]
};
*/

state.common.arcSliceOneWay = function(d, i) {
  // rX,rY rotation, arc, sweep, eX,eY

  var radius = d.radius;
  var fromY = -Math.cos(d.from) * radius,
      fromX = Math.sin(d.from) * radius;
  var toY = -Math.cos(d.to) * radius,
      toX = Math.sin(d.to) * radius;

  var largeArc = (Math.abs(d.to - d.from) <= Math.PI) ? "0" : "1";
  // console.log("to: " + d.to + " from " + d.from + " largeArc " + largeArc);

  return `M ${fromX},${fromY} A ${radius},${radius} 0 ${largeArc},1 ${toX},${toY}`

};

state.common.valueToDate = function(value) {
  // can take many parameters for formatting and loc.
  return (new Date(value)).toLocaleDateString('en-US',{ year: 'numeric', month: 'short', day: 'numeric' });
};

state.common.valueToText = function(value, object) {
  var totalValueText;
  if (value > 1000000) {
    totalValueText = (value/1000000).toFixed(1) + "M";
  }
  else if (value > 1000) {
    totalValueText = (value/1000).toFixed(0) + "K";
  }
  else {
    try {
      totalValueText = value.toFixed(0);
    } catch(e) {
      console.log("error parsing value");
    }
  }

  return "$" + totalValueText;
};

state.common.typedValueToText = function(value, type) {
  if (type == "currency")
    return state.common.valueToText(value);
  else {
    // ugly way to deduce singular from plural (as I don't get it from the data feed)
    var typeSingularOrPlural = (value == 1 && type.length > 1 && type.slice(-1) == "s")
      ? type.slice(0,-1) : type;
    return value + " " + typeSingularOrPlural;
  }
};

state.common.typedValueToTextShort = function(value, type, object) {
  if (type == "currency")
    return state.common.valueToText(value, object);
  else
    return value;
};

state.common.smartValueToText = function(object) {
  if (object.presentation == "currency") {
    var str;
    if (object.reportedValue !== undefined) {
      str = new Intl.NumberFormat('us-US', { style: 'currency', currency: object.currency }).format(object.reportedValue);
    }
    else {
      str = new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(object.value);
    }
    return "Total Value: " + str;
  }
  else {
    return "Total Value: " + object.value;
  }
};

state.common.waitToText = function(value) {
  var waitText;
  if (value > 48) {
    waitText = Math.ceil(value/24) + " Days";
  }
  else {
    waitText = value.toFixed(0) + " HOURS";
  }

  return waitText;
};

state.common.waitDaysHoursToText = function(value) {
  var days = Math.floor(value/24), hours = Math.round(value%24);
  return `${days}d:${hours}h`;
};

state.common.clusterLevelToText = function(value) {
  switch (value) {
    case 0:
      return "HOURS";
    case 1:
      return "DAYS";
    case 2:
      return "WEEKS";
    case 3:
      return "MONTHS";
    default:
      return "HOURS";
  }
};

state.common.getTranslation = function(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);

  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix.
  var matrix = g.transform.baseVal.consolidate().matrix;

  // As per definition values e and f are the ones for the translation.
  return [matrix.e, matrix.f];
};

state.common.countNonHidden = function(array, overrideFade) {
  if (!overrideFade && FADE_HIDDEN) return array.length;
  return array.reduce(function(count, element) {return count + (element.hidden ? 0 : 1)}, 0);
};

state.common.filterNonHidden = function(array, overrideFade) {
  if (!overrideFade && FADE_HIDDEN) return array;
  return array.filter(function(element) {return !element.hidden});
};

state.common.colorForWaitTime = function(minWaitTime, maxWaitTime) {
  var linearScale = d3.scaleLinear()
    .domain([minWaitTime, maxWaitTime])
    .range([0, 2]);

  // for better gradient I divide the spectrum to 3 sections of colors

  var ribbonInterpolate = [
    d3.interpolateHcl(state.GREEN_COLOR, "rgb(201,193,12)"),
    d3.interpolateHcl("rgb(201,193,12)", state.RED_COLOR),
    d3.interpolateHcl(state.RED_COLOR, "rgb(184,17,24)")
  ];

  return function(waitTime) {
    var colorPoint = linearScale(waitTime);
    if (colorPoint < 0) return state.GREEN_COLOR;
    if (colorPoint >= 2) return state.RED_COLOR;

    return ribbonInterpolate[Math.floor(colorPoint)](colorPoint % 1);
  };
};

state.common.showTooltip = function(dialogClass, anchorNode, position) {
  d3.selectAll(".tooltip")
    .classed("on", false);

  if (!anchorNode) return;
  var anchorRect = anchorNode.getBoundingClientRect();


  var dialog = d3.select("." + dialogClass).classed("on", true);
  var dialogRect = dialog.node().getBoundingClientRect();
  dialog.select(".tip").classed("on", true);

  var left, top;

  if (position.relate == 'above') {
    top = anchorRect.top - dialogRect.height - (position.margin || 0);
    dialog.select(".tip")
      .style("left", dialogRect.width/2 + "px")
      .style("top", dialogRect.height + "px");
  }

  switch (position.align) {
    case 'left':
      left = anchorRect.left;
      break;
    case 'right':
      left = anchorRect.right - dialogRect.width;
      break;
    case 'center':
      left = (anchorRect.left + anchorRect.right) / 2 - dialogRect.width/2;
      break;
  }

  dialog
    .style("left", left + "px")
    .style("top", top + "px");

  dialog
    .select(".close")
    .on("click", function(e) {
      dialog.classed("on", false);
      dialog.select(".tip").classed("on", false);
      if (state.common.showTooltip.timer) {
        clearTimeout(state.common.showTooltip.timer);
        state.common.showTooltip.timer = null;
      }
    })
    .call(function() {
      if (state.common.showTooltip.timer) {
        clearTimeout(state.common.showTooltip.timer);
      }
      state.common.showTooltip.timer = setTimeout(function() {
        dialog.classed("on", false);
        dialog.select(".tip").classed("on", false);
      }, position.duration || 3000);
    });

};