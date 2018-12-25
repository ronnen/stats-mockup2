function showConfigureView() {
  const configureRadiusMargin = 60;
  var color = state.common.colorForWaitTime(0,100);  // leveraging same generator for 100 gradient colors

  if (!state.showConfigureViewShown) {
    var svg = d3.select(".svg-container svg");
    var defs = svg.append('svg:defs');

    var data = [
      { id: 0, name: 'circle', path: 'M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0', viewbox: '-6 -6 12 12' }
      , { id: 1, name: 'square', path: 'M 0,0 m -5,-5 L 5,-5 L 5,5 L -5,5 Z', viewbox: '-5 -5 10 10' }
      , { id: 2, name: 'arrow', path: 'M 0,0 m -4,-5 L 4,0 L -4,5 Z', viewbox: '-15 -15 30 30' }
      , { id: 3, name: 'stub', path: 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z', viewbox: '-1 -5 2 10' }
    ];

    var marker = defs.selectAll('marker')
      .data(data)
      .enter()
      .append('svg:marker')
      .attr('id', function(d){ return 'marker_' + d.name})
      .attr('markerHeight', 5)
      .attr('markerWidth', 5)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', -1)   // so the butt of the path does not show
      .attr('refY', 0)
      .attr('viewBox', function(d){ return d.viewbox })
      .append('svg:path')
      .attr('d', function(d){ return d.path })
      .attr('fill', function(d,i) { return color(96); /*state.RED_COLOR*/});

    window.addEventListener("endConfigureState", function() {
      d3.selectAll(".main-units").classed("configure-state", false);
      d3.selectAll(".main-units").select(".configure-group").remove();
      drawOverview(mainUnits);
      state.overviewParams.runSimulation();
    });

    state.showConfigureViewShown = true;
  }

  d3.selectAll(".main-units").classed("configure-state", true);

  var configureGroup = d3.selectAll(".main-units")
    .append("g")
    .attr("class", "configure-group");

  // place a middle label styled differently for configuration
  configureGroup
    .append("text")
    .attr("class", "configure-request-name")
    .attr("text-anchor", "middle")
    .attr("dy", ".5em")
    .text(d => d.request)
    .each(d => {
      d.degressGenerator = d3.scaleLinear()
        .domain([0,state.maxWait])
        .range([state.approvalsRadialStart,state.approvalsRadialEnd]);
    });

/*
  // add path from 0 degrees to drag handle - was replaced by array of gradient paths
  configureGroup
    .append("svg:path")
    .attr("class", "configure-path")
    .attr("stroke-width", 30)
    .attr("stroke-linecap", "butt")
    .attr("d", function(d) {
      return state.common.arcSliceOneWay({
        radius: state.innerBubbleMaxRadius - configureRadiusMargin,
        from: 0,
        to: state.common.toRadians(d.degressGenerator(d.configHighWait))
      });});
*/

  var colorGradientGrid = Array.from(new Array(100), (item, index) => index);

  configureGroup
    .each(function(d) {
      d.highWaitRadiansStep = state.common.toRadians(d.degressGenerator(d.configHighWait))/100;
    });

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
      var s = d3.select(this.parentNode).datum().highWaitRadiansStep;
      return state.common.arcSliceOneWay({
        radius: state.innerBubbleMaxRadius - configureRadiusMargin,
        from: i * s,
        to:   (i+1) * s + (s/10) // some overlap
      });});

  // add path for drag handle
  configureGroup
    .append("svg:path")
    .attr("class", "configure-path-drag")
    .attr("stroke", color(96) /*state.RED_COLOR*/)
    .attr("stroke-width", 30)
    .attr("stroke-linecap", "butt")
    .attr('marker-end', function(d,i){ return 'url(#marker_arrow)' })
    .attr("d", function(d) {
      return state.common.arcSliceOneWay({
        radius: state.innerBubbleMaxRadius - configureRadiusMargin,
        from: state.common.toRadians(Math.max(0,d.degressGenerator(d.configHighWait) - 20)),
        to: state.common.toRadians(d.degressGenerator(d.configHighWait))
      });})
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  function dragstarted(d) {
    d3.select(this.parentNode).select(".configure-drag-handle").classed("active", true);
    var relativeMouse = d3.mouse(this.parentNode);
    var newAngleDeg = (Math.atan2(relativeMouse[1],relativeMouse[0]) * 360 / (2* Math.PI) + 90)%360;

    d.diffSampleDegrees = (720 + newAngleDeg - d.degressGenerator(d.configHighWait))%360;

  }

  function dragged(d) {
    var relativeMouse = d3.mouse(this.parentNode);
    var newAngleDeg = Math.atan2(relativeMouse[1],relativeMouse[0]) * 360 / (2* Math.PI) + 90;
    newAngleDeg -= d.diffSampleDegrees;
    newAngleDeg = (720 + newAngleDeg)%360;

    newAngleDeg = Math.max(Math.min(newAngleDeg, state.approvalsRadialEnd),20);

    var newHandleD = state.common.arcSliceOneWay({
      radius: state.innerBubbleMaxRadius - configureRadiusMargin,
      from: state.common.toRadians(newAngleDeg - 20),
      to: state.common.toRadians(newAngleDeg)
    });

    d3.select(this).attr("d", newHandleD);

    d.configHighWait = d.degressGenerator.invert(newAngleDeg); // setting new high wait limit while dragging
    var s = d.highWaitRadiansStep = state.common.toRadians(d.degressGenerator(d.configHighWait))/100;

/*
    var newLongD = state.common.arcSliceOneWay({
      radius: state.innerBubbleMaxRadius - configureRadiusMargin,
      from: 0,
      to: state.common.toRadians(newAngleDeg)
    });
    d3.select(this.parentNode).select(".configure-path").attr("d", newLongD);
*/

    d3.select(this.parentNode)
      .selectAll(".configure-path")
      .data(colorGradientGrid)
      .attr("d", function(d,i) {
        return state.common.arcSliceOneWay({
          radius: state.innerBubbleMaxRadius - configureRadiusMargin,
          from: i * s,
          to:   (i+1) * s + (s/10) // some overlap
        });});

    d3.select(this.parentNode).select(".configure-drag-handle").attr("transform", `rotate(${newAngleDeg-180-5})`);

  }

  function dragended(d) {
    d3.select(this.parentNode).select(".configure-drag-handle").classed("active", false);
    var relativeMouse = d3.mouse(this.parentNode);
    var newAngleDeg = Math.atan2(relativeMouse[1],relativeMouse[0]) * 360 / (2* Math.PI) + 90;
    newAngleDeg -= d.diffSampleDegrees;
    newAngleDeg = (newAngleDeg+720)%360;
    // console.log("dragended " + newAngleDeg);

    d.configHighWait = d.degressGenerator.invert(newAngleDeg); // setting new high wait limit

  }

  configureGroup
    .append("circle")
    .attr("class", "configure-drag-handle")
    .attr("stroke-dasharray", "2, 2")
    .attr("r", 12)
    .attr("cx", 0)
    .attr("cy", state.innerBubbleMaxRadius - configureRadiusMargin)
    .attr("transform", function(d) {
      return `rotate(${d.degressGenerator(d.configHighWait)-180-5})`;
    });


  // look at https://bl.ocks.org/mbostock/4163057 for comprehensive example of gradient along stroke

}