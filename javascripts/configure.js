function openConfigDialog(callback) {
  d3.select(".config-wait-slider").html(null);
  d3.select(".shield").classed("on", true);
  d3.select(".configureDialog").classed("on", true);

  d3.select(".cancel-config").on("click", function() {
    d3.select(".shield").classed("on", false);
    d3.select(".configureDialog").classed("on", false);
  });

  d3.select(".set-config").on("click", function() {
    d3.select(".shield").classed("on", false);
    d3.select(".configureDialog").classed("on", false);

    callback(configSlider.range());
  });

  var configSlider = createD3RangeSlider(state.minWait, state.maxWait, ".config-wait-slider", false);
  // d3.select(".config-content .label-left").text(`Below ${state.minWait} is Good`);
  // d3.select(".config-content .label-right").text(`Above ${state.maxWait} is Bad`);

  configSlider.onChange(function(newRange){
    // console.log("newRange " + newRange);
    d3.select(".config-content .label-left").text(`Below ${state.common.waitToText(newRange.begin)} is Good`);
    d3.select(".config-content .label-right").text(`Above ${state.common.waitToText(newRange.end)} is Bad`);
    var newLeft = parseFloat(d3.select(".config-wait-slider .slider").style("left"));
    var bg = `linear-gradient(to right, rgb(88, 141, 26) ${newLeft}px, rgb(234, 49, 49) ${newLeft}px)`;

    d3.select(".config-wait-slider .slider-container").style("background-image", bg);
  });

  configSlider.onRelease(function(newRange){
  });

  configSlider.range(state.configLowWait, state.configHighWait);


}