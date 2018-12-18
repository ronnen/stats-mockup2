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

    mainUnits.forEach(function(request, i) {
      request.configLowWait = configSliders[i].range().begin;
      request.configHighWait = configSliders[i].range().end;
    });
    callback(true);
  });

  var configContainer = d3.select(".configureDialog .config-content").html(null);

  var configSliders = [];

  mainUnits.forEach(function(request) {
    var requestLabel = request.request;

    var configItem = d3.select("#config-type-template .config-item").clone(true);
    configItem.attr("data-type", requestLabel);
    configContainer.append(function() {
      return configItem.node()
    });

    configItem = d3.select(`.config-item[data-type=${requestLabel}]`);
    var configSlider = createD3RangeSlider(state.minWait, state.maxWait, configItem.select(".config-wait-slider").nodes()[0], false);

    configItem.select(".config-wait-slider")
      .append("div")
      .attr("class","caption")
      .text(requestLabel);

    configSlider.onChange(function(newRange){
      // console.log("newRange " + newRange);
      configItem.select(".label-left").text(`Below ${state.common.waitToText(newRange.begin)} is Good`);
      configItem.select(".label-right").text(`Above ${state.common.waitToText(newRange.end)} is Bad`);
      var newLeft = parseFloat(configItem.select(".config-wait-slider .slider").style("left"));
      var bg = `linear-gradient(to right, rgb(88, 141, 26) ${newLeft}px, rgb(234, 49, 49) ${newLeft}px)`;

      configItem.select(".config-wait-slider .slider-container").style("background-image", bg);
    });

    configSlider.onRelease(function(newRange){
    });

    configSlider.range(request.configLowWait, request.configHighWait);

    configSliders.push(configSlider);
  });


}