state.approvalsRadialStart = 0; // where bubbles start to show in degrees
state.approvalsRadialEnd = 300; // where bubbles start to show in degrees

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

state.common.valueToText = function(value) {
  var totalValueText;
  if (value > 1000000) {
    totalValueText = (value/1000000).toFixed(1) + "M";
  }
  else if (value > 1000) {
    totalValueText = (value/1000).toFixed(0) + "K";
  }
  else {
    totalValueText = value.toFixed(0);
  }
  
  return "$" + totalValueText;
};

state.common.typedValueToText = function(value, type) {
  if (type == "currency")
    return state.common.valueToText(value);
  else
    return value + " " + type;
};

state.common.typedValueToTextShort = function(value, type) {
  if (type == "currency")
    return state.common.valueToText(value);
  else
    return value;
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

