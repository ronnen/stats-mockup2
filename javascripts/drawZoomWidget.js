function drawZoomWidget(drawCallback) {
  // for great svg path tutorial https://css-tricks.com/svg-path-syntax-illustrated-guide/

  const ZOOM_LEVELS = 9;

  var zoomWidget = d3.select(".svg-container svg .zoom-widget-group");
  if (zoomWidget.size()) {
    return;
  }

  var request = mainUnits.find(function(a) {return a.selected;});

  var slider1 = d3.sliderHorizontal()
    .min(0)
    .max(ZOOM_LEVELS)
    .width(150)
    .step(1)
    // .tickFormat(d3.format('.2%'))
    // .ticks(5)
    .default(0)
    .handle('M 0, 0 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0')
    .on('onchange', val => {
      state.dataFunc.zoomLevel(val);
    });

  var width = parseInt(d3.select('.svg-container svg').attr('width')),
      height = parseInt(d3.select('.svg-container svg').attr('height'));

  var group1 = d3.select(".svg-container svg")
    .append("g")
    .attr("class","zoom-widget-group")
    .attr("transform", `translate(${width-250},${state.tableToggleState ? 70 : height-100})`)
    .on('click', () => {d3.event.stopPropagation()});

  group1
    .append("rect")
    .attr("rx", 8)
    .attr("ry", 8)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 250)
    .attr("height", 40)
    .attr("transform", "translate(-50,-20)")
    .attr('class', 'zoom-widget-background');

  group1.call(slider1);

  var zoomIn = group1.append("g")
    .attr("class", "zoom-in")
    .attr("transform", `translate(${-30},${0})`)
    .on('click', () => {
      if (slider1.value() > 0) slider1.value(slider1.value()-1);
    });

  zoomIn
    .append('path')
    .attr('d', 'M -10,0 a 10,10 0 1,1 20,0 a 10,10 0 1,1 -20,0 M -6,0 l 12,0 M 0,-6 l 0,12')
    .attr('class', 'zoom-path');

  var zoomOut = group1.append("g")
    .attr("class", "zoom-in")
    .attr("transform", `translate(${150+30},${0})`)
    .on('click', () => {
      if (slider1.value() < ZOOM_LEVELS) slider1.value(slider1.value()+1);
    });

  zoomOut
    .append('path')
    .attr('d', 'M -10,0 a 10,10 0 1,1 20,0 a 10,10 0 1,1 -20,0 M -6,0 l 12,0')
    .attr('class', 'zoom-path');

  if (state.zoomWidgetShouldMove) window.removeEventListener("tableStateChanged" , state.zoomWidgetShouldMove);
  state.zoomWidgetShouldMove = function(event) {
    // console.log("table state changed " + event.detail.state); // true - table is showing

    if (d3.select(".zoom-widget-group").size()) {
      if (event.detail.state) {
        d3.select(".zoom-widget-group").transition().duration(300)
          .attr("transform",`translate(${width-250},${70})`);
      }
      else {
        d3.select(".zoom-widget-group").transition().duration(300)
          .attr("transform",`translate(${width-250},${height-100})`);
      }
    }
  };
  window.addEventListener("tableStateChanged", state.zoomWidgetShouldMove);

/*
  window.addEventListener("setNonZoomState", function(event) {
    d3.select(".detailed-group").classed("zoom", false);
    d3.selectAll(".detailed-group .zoom-sphere").remove();
    d3.selectAll(".detailed-group .zoom-sphere-background").remove();
    d3.selectAll(".detailed-group .zoom-bubble-guide").remove();
    d3.selectAll(".detailed-group .sphere").transition().duration(200).style("opacity", 1).style("opacity", null);
    d3.selectAll(".detailed-group .bubble-guide").transition().duration(200).style("opacity", 1).style("opacity", null);
    d3.selectAll(".table-rows .data-row[data-zoom]").attr("data-zoom", null);
    if (!event.detail || !event.detail.keepWidget) d3.select(".svg-container .zoom-widget-group").remove();
  });
*/

  function zoomLevel(level) {
    level = Math.floor(level);
    if (!level) {
      // restore non-zoom classes
      window.dispatchEvent(new CustomEvent("setNonZoomState", {detail: {keepWidget: true}}));
      return;
    }

    level = ZOOM_LEVELS +1 - level;  // for convenience

    var bucketing = d3.scaleLinear()
      .domain([state.minWait, state.maxWait])
      .rangeRound([0, level]);

    request.approvers.forEach((approver, approverIndex) => {
      var data = [];

      approver.approvals.forEach(approval => {
        var bucketedIndex = Math.min(bucketing(approval.waitTime), level-1);
        if (!data[bucketedIndex]) data[bucketedIndex] = {waitTime: 0, value: 0, count: 0, hidden: 0};
        data[bucketedIndex].waitTime += approval.waitTime;
        data[bucketedIndex].value += approval.value;
        data[bucketedIndex].hidden += approval.hidden ? 1 : 0;
        data[bucketedIndex].count ++;
        approval.zoomBucket = "a" + approverIndex + "b" + bucketedIndex;
        data[bucketedIndex].zoomBucket = "a" + approverIndex + "b" + bucketedIndex; // to keep track of which approvals belongs to each bucket
      });

      data = data.filter(t => t !== undefined);
      data.forEach(a => {
        a.waitTime = a.waitTime / a.count;
        a.presentation = request.presentation;
        a.hidden = a.hidden / a.count > 0.5; // if majority is hidden then we consider it hidden as well
        a.submitter = a.count + " request(s)";
      });
      approver.zoomApprovals = data;
    });

    request.zoomMaxValue = d3.max(state.common.filterNonHidden(request.approvers).map(function(v) {
      return d3.max(v.zoomApprovals, function(a) {return a.value})
    }));

    drawCallback();
  }
}