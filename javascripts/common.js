var getUrlVars = function() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
};

var toRadians = function(angle) {
  return angle * (Math.PI / 180);
};

var arcSliceFull = d3.arc()
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

var valueToText = function(value) {
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

var typedValueToText = function(value, type) {
  if (type == "currency")
    return valueToText(value);
  else
    return value + " " + type;
};

var typedValueToTextShort = function(value, type) {
  if (type == "currency")
    return valueToText(value);
  else
    return value;
};

var waitToText = function(value) {
  var waitText;
  if (value > 48) {
    waitText = Math.ceil(value/24) + " Days";
  }
  else {
    waitText = value + " HOURS";
  }

  return waitText;
};

var getTranslation = function(transform) {
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

var countNonHidden = function(array) {
  if (FADE_HIDDEN) return array.length;
  return array.reduce(function(count, element) {return count + (element.hidden ? 0 : 1)}, 0);
};

var filterNonHidden = function(array) {
  if (FADE_HIDDEN) return array;
  return array.filter(function(element) {return !element.hidden});
};

var colorForWaitTime = function(maxWaitTime) {
  var linearScale = d3.scaleLinear()
    .domain([0, maxWaitTime])
    .range([0, 2]);

  // for better gradient I divide the spectrum to 4 sections of colors
/*
  var ribbonInterpolate = [
    d3.interpolate([127,173,117], [171,173,110]),
    d3.interpolate([171,173,110], [206,164,98]),
    d3.interpolate([206,164,98], [203,128,94]),
    d3.interpolate([203,128,94],[190,94,95])
  ];
*/

  var ribbonInterpolate = [
    d3.interpolateHcl("rgb(88,141,26)", "rgb(201,193,12)"),
    d3.interpolateHcl("rgb(201,193,12)", "rgb(234,49,49)"),
    d3.interpolateHcl("rgb(234,49,49)", "rgb(184,17,24)")
  ];

  return function(waitTime) {
    var colorPoint = linearScale(waitTime);
    // if (colorPoint == 2) return ribbonInterpolate[1](1);
    return ribbonInterpolate[Math.floor(colorPoint)](colorPoint % 1);
  };
};

