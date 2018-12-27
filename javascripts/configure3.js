function showConfigureView() {
  const configureRadiusMargin = 60;
  var color = state.common.colorForWaitTime(0,100);  // leveraging same generator for 100 gradient colors

  const DRAG_HANDLE_COLOR = "rgb(74,77,93)";

  if (!state.showConfigureViewShown) {
    var svg = d3.select(".svg-container svg");

    var defs = svg.append('svg:defs');

    var data = [
      { id: 0, name: 'circle', path: 'M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0', viewbox: '-10 -10 20 20' }
      , { id: 1, name: 'square', path: 'M 0,0 m -5,-5 L 5,-5 L 5,5 L -5,5 Z', viewbox: '-5 -5 10 10' }
      , { id: 2, name: 'arrow', path: 'M 0,0 m -4,-5 L 4,0 L -4,5 Z', viewbox: '-15 -15 30 30' }
      , { id: 3, name: 'arrow_rev', orient: "auto-start-reverse", path: 'M 0,0 m -4,-5 L 4,0 L -4,5 Z', viewbox: '-15 -15 30 30' }
      , { id: 4, name: 'stub', path: 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z', viewbox: '-1 -5 2 10' }
    ];

    var marker = defs.selectAll('marker')
      .data(data)
      .enter()
      .append('svg:marker')
      .attr('id', function(d){ return 'marker_' + d.name})
      .attr('markerHeight', 5)
      .attr('markerWidth', 5)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', function(d) {return d.orient || 'auto'})
      .attr('refX', function(d) {return (d.name == 'arrow' || d.name == 'arrow_rev') ? -2 : 0})   // so the butt of the path does not show
      .attr('refY', 0)
      .attr('viewBox', function(d){ return d.viewbox })
      .append('svg:path')
      .attr('d', function(d){ return d.path })
      .attr('fill', function(d,i) { return DRAG_HANDLE_COLOR});

    window.addEventListener("endConfigureState", function() {
      d3.select(".shield").classed("on light", false);
      d3.selectAll(".configure-svg").remove();
    });

    state.showConfigureViewShown = true;
  }

  if (state.configureShieldListener) window.removeEventListener("click", state.configureShieldListener);
  state.configureShieldListener = function(event) {
    window.dispatchEvent(new CustomEvent("endConfigureState", { detail: {}}));
    window.removeEventListener("click", state.configureShieldListener);
    state.configureShieldListener = null;
    drawDetailedView(selectedUnit, state.overviewParams);
  };
  window.addEventListener("click", state.configureShieldListener);

  // d3.selectAll(".main-units").classed("configure-state", true);
  var selectedUnit = d3.select(".main-units.selected");
  if (!selectedUnit.size()) return;

  d3.select(".shield").classed("on light", true);
  simulation.stop();

  var mainSVGRect = selectedUnit.node().getBoundingClientRect();

  d3.selectAll(".configure-svg").remove(); // just to make sure

  var configureSVG = d3.select("body").append("svg")
    .style("left",mainSVGRect.x)
    .style("top",mainSVGRect.y)
    .attr("width", mainSVGRect.width)
    .attr("height", mainSVGRect.height)
    .attr("class","configure-svg")
    .style("position", "fixed");

  configureSVG.append("filter")
    .attr("id", "dropshadow")
    .attr("x", "-20%")
    .attr("y", "-200%")
    .attr("width", "140%")
    .attr("height", "400%")
    .html(`<feDropShadow dx="-3" dy="-3" stdDeviation="1" flood-color="#333333" flood-opacity="0.5" />`);

  var configureGroup = configureSVG
    .selectAll(".configure-group")
    .data([selectedUnit.datum()])
    .enter()
    .append("g")
    .attr("class", "configure-group")
    .attr("transform", `translate(${mainSVGRect.width/2},${mainSVGRect.height/2})`);

  var degressGenerator = d3.scaleLinear()
    .domain([0,state.maxWait])
    .range([state.approvalsRadialStart,state.approvalsRadialEnd]);

  var colorGradientGrid = Array.from(new Array(100), (item, index) => index);
  var highWaitRadiansStep = state.common.toRadians(degressGenerator(state.maxWait))/100;

  // add path from 0 degrees to drag handle
  configureGroup
    .selectAll(".configure-path")
    .data(colorGradientGrid)
    .enter()
    .append("svg:path")
    .attr("class", "configure-path")
    .attr("stroke-width", 30)
    .attr("stroke-linecap", "butt")
    .style("fill", function(d,i) { return color(i); })
    .style("stroke", function(d,i) { return color(i); })
    .attr("d", function(d,i) {
      var s = highWaitRadiansStep;
      return state.common.arcSliceOneWay({
        radius: state.innerBubbleMaxRadius - configureRadiusMargin,
        from: i * s,
        to:   (i+1) * s + (s/10) // some overlap
      });});


  var handleGroup = configureGroup
    .append("svg:g")
    .attr("class", "configure-path-drag-group")
    .attr("transform", function(d) {
      var midWait = (d.configHighWait - d.configLowWait)/2;

      return `rotate(${degressGenerator(midWait)})`
    })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  // add path for drag handle
  handleGroup
    .append("svg:path")
    .attr("class", "configure-path-drag")
    .attr("stroke", DRAG_HANDLE_COLOR)
    .attr("stroke-width", 10)
    .attr("stroke-linecap", "butt")
    .attr('marker-end', function(d,i){ return 'url(#marker_arrow)' })
    .attr('marker-start', function(d,i){ return 'url(#marker_arrow_rev)' })
    .attr('marker-mid', function(d,i){ return 'url(#marker_circle)' })
    .style("filter", "url(#dropshadow)")
    .attr("d", function(d) {
      // var midWait = (d.configHighWait - d.configLowWait)/2;

      return state.common.arcSliceOneWay({
        radius: state.innerBubbleMaxRadius - configureRadiusMargin,
        from: state.common.toRadians(-20),
        to: state.common.toRadians(20)
      });});

  var diffSampleDegrees;

  function dragstarted(d) {
    var midWait = (d.configHighWait - d.configLowWait)/2;
    var relativeMouse = d3.mouse(this.parentNode);
    var newAngleDeg = (Math.atan2(relativeMouse[1],relativeMouse[0]) * 360 / (2* Math.PI) + 90)%360;

    diffSampleDegrees = (720 + newAngleDeg - degressGenerator(midWait))%360;
  }

  function dragged(d) {
    var relativeMouse = d3.mouse(this.parentNode);
    var newAngleDeg = Math.atan2(relativeMouse[1],relativeMouse[0]) * 360 / (2* Math.PI) + 90;
    newAngleDeg -= diffSampleDegrees;
    newAngleDeg = (720 + newAngleDeg)%360;

    newAngleDeg = Math.max(Math.min(newAngleDeg, state.approvalsRadialEnd-20),20);

    configureGroup.select(".configure-path-drag-group")
      .attr("transform", `rotate(${newAngleDeg})`);

    d.configHighWait = degressGenerator.invert(newAngleDeg) * 2 + d.configLowWait; // setting new high wait limit while dragging
  }

  function dragended(d) {
    // already updated configHighWait in dragged()
  }

  // look at https://bl.ocks.org/mbostock/4163057 for comprehensive example of gradient along stroke

}