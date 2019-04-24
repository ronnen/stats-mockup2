function drawMenu(criteria) {
  drawTable(); // to be moved to a menu option
  // criteria {totalValueMin, totalValueMax, waitTimeMin, waitTimeMax, amountMin, amountMax, approvalTypes}

  var timeRangeMin = criteria.timeRangeMin || 0, timeRangeMax = criteria.timeRangeMax || 100;
  var waitTimeMin = criteria.waitTimeMin || 0, waitTimeMax = criteria.waitTimeMax || 100000000;
  var amountMin = criteria.amountMin || 0, amountMax = criteria.amountMax || 100000000;
  var clusterLevel = criteria.clusterLevel || 0;

  var amountFilterState = false;
  var timeFilterState = true;
  var waitFilterState = true;
  var clusterFilterState = true;
  state.valueAnomalyState = false;

  function setTimeRangeLabels() {
    d3.select("#time-range-filter .label-left").text(!timeFilterState ? "START DATE" : state.common.valueToDate(timeRangeMin));
    d3.select("#time-range-filter .label-right").text(!timeFilterState ? "END DATE" : state.common.valueToDate(timeRangeMax));
  }

  function setAmountLabels() {
    d3.select("#amount-filter .label-left").text(!amountFilterState ? "LOWEST" : state.common.valueToText(amountMin));
    d3.select("#amount-filter .label-right").text(!amountFilterState ? "HIGHEST" : state.common.valueToText(amountMax));
  }

  function setWaitTimeLabels() {
    d3.select("#wait-time-filter .label-left").text(!waitFilterState ? "SHORTEST" : state.common.waitToText(waitTimeMin));
    d3.select("#wait-time-filter .label-right").text(!waitFilterState ? "LONGEST" : state.common.waitToText(waitTimeMax));
  }

  function setClusterLabels() {
    d3.select("#cluster-filter .label-left").text(!clusterFilterState ? "GRANULAR" : "");
    d3.select("#cluster-filter .label-right").text(!clusterFilterState ? "CLUSTERED" : "");
    d3.select("#cluster-filter .label-middle").text(!clusterFilterState ? "" : state.common.clusterLevelToText(clusterLevel, state.valueAnomalyState));
  }

  setTimeRangeLabels();
  setAmountLabels();
  setWaitTimeLabels();
  setClusterLabels();

  d3.selectAll(".stats-slider").html(null);
  d3.select("#cluster-filter .stats-slider") // special case for special slider
    .append("div")
    .attr("class","slider-container");

  var approvalSwitchContainer = d3.select("#approval-type-switches");
  approvalSwitchContainer.html(null);
  var approvalSwitchTemplate = d3.select("#type-filter-template");

  criteria.approvalTypes.forEach(function(t) {
    var addedType = approvalSwitchTemplate.clone(true);
    addedType.attr("id", null);
    addedType.attr("data-type-filter", t);
    addedType.select(".stats-filter-title").text(t);
    approvalSwitchContainer.append(function() {
      return addedType.node()
    });
  });

  // Time Range filter
  d3.select("#time-range-filter .switch-container")
    .on("click", timeSliderClick);

  function timeSliderClick() {
    d3.select("#time-range-filter").classed("on", !timeFilterState);
    timeFilterState = !timeFilterState;
    setTimeRangeLabels();
    drawOverviewByCriteria();
  }

  var timeSlider = createD3RangeSlider(timeRangeMin, timeRangeMax, "#time-range-filter .stats-slider", false);

  timeSlider.onChange(function(newRange){
    d3.select("#time-range-filter .label-left").text(state.common.valueToDate(newRange.begin));
    d3.select("#time-range-filter .label-right").text(state.common.valueToDate(newRange.end));
  });

  timeSlider.onRelease(function(newRange){
    drawOverviewByCriteria();
  });

  // timeSlider.range(timeRangeMin,timeRangeMax);

  // Amount filter
  d3.select("#amount-filter").classed("on", amountFilterState);

  d3.select("#amount-filter .switch-container")
    .on("click", amountSliderClick);

  function amountSliderClick() {
    d3.select("#amount-filter").classed("on", !amountFilterState);
    amountFilterState = !amountFilterState;
    setAmountLabels();
    drawOverviewByCriteria();
  }

  var amountSlider = createD3RangeSlider(amountMin, amountMax, "#amount-filter .stats-slider", false);

  amountSlider.onChange(function(newRange){
    d3.select("#amount-filter .label-left").text(state.common.valueToText(newRange.begin));
    d3.select("#amount-filter .label-right").text(state.common.valueToText(newRange.end));
  });

  amountSlider.onRelease(function(newRange){
    drawOverviewByCriteria();
  });

  // amountSlider.range(amountMin,amountMax);

  // Wait Time filter
  d3.select("#wait-time-filter .switch-container")
    .on("click", waitSliderClick);

  function waitSliderClick() {
    d3.select("#wait-time-filter").classed("on", !waitFilterState);
    waitFilterState = !waitFilterState;
    setWaitTimeLabels();
    drawOverviewByCriteria();
  }

  var waitSlider = createD3RangeSlider(waitTimeMin, waitTimeMax, "#wait-time-filter .stats-slider", false);

  waitSlider.onChange(function(newRange){
    d3.select("#wait-time-filter .label-left").text(state.common.waitToText(newRange.begin));
    d3.select("#wait-time-filter .label-right").text(state.common.waitToText(newRange.end));
  });

  waitSlider.onRelease(function(newRange){
    drawOverviewByCriteria();
  });

  // cluster filter
  d3.select("#cluster-filter").classed("on", clusterFilterState);

  d3.select("#cluster-filter .switch-container")
    .on("click", clusterSliderClick);

  function clusterSliderClick() {
    d3.select("#cluster-filter").classed("on", !clusterFilterState);
    clusterFilterState = !clusterFilterState;
    setClusterLabels();
    drawOverviewByCriteria(); // TODO check if necessary or do something less disruptive
  }

  var sliderWidth = d3.select("#cluster-filter .filter-header").node().getBoundingClientRect().width;

  var clusterSlider = d3.sliderHorizontal()
    .min(0)
    .max(state.ZOOM_LEVELS)
    .width(sliderWidth - 20)
    .step(1)
    .default(0)
    .handle('M 0, 0 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0')
    .strokeLinecap('square')
    .on('onchange', val => {
      state.criteria.clusterLevel = clusterLevel = val;
      setClusterLabels();
      state.valueAnomalyState ? drawValueAnomaliesViewByZoomLevel() : drawDetailedViewByZoomLevel();
    });

  d3.select("#cluster-filter .stats-slider .slider-container")
    .append("svg")
    .attr("height", 40)
    .attr("class", "cluster-filter-svg")
    .call(clusterSlider);

  // approval type filters
  d3.selectAll("#approval-type-switches .switch-container")
    .on("click", approvalTypeClick);

  function approvalTypeClick() {
    var currentState = d3.select(this.parentElement).classed("on");
    d3.select(this.parentElement).classed("on", !currentState);
    drawOverviewByCriteria();
  }

  function drawOverviewByCriteriaHandler(event) {
    // console.log("drawOverviewByCriteriaHandler");
    if (event.detail.selectedNode) {
      var selectedUnit = d3.select(event.detail.selectedNode).datum();
      if (selectedUnit.selected) {
        // set initial clustering if there are too many nodes
        switch (state.approversSortType) {
          case state.BY_VALUE:
            if (selectedUnit.firstByValueChunkCount > 100) {
              state.criteria.clusterLevel = 1;
              clusterSlider.value(state.criteria.clusterLevel);
              setClusterLabels();
            }
            break;
          case state.BY_COUNT:
            if (selectedUnit.firstByCountChunkCount > 100) {
              state.criteria.clusterLevel = 1;
              clusterSlider.value(state.criteria.clusterLevel);
              setClusterLabels();
            }
            break;
          default:

        }
      }
    }
    drawOverviewByCriteria(event.detail);
  }

  // sort type filter

  // initial state
  state.approversSortType = state.BY_VALUE;
  d3.select("#approver-sort-order .sort-toggle.sort-by-value").classed("on", true);

  d3.selectAll("#approver-sort-order .sort-toggle")
    .on("click", approversSortTypeClick);

  function approversSortTypeClick() {
    if (d3.select(this).classed("on")) return;

    d3.selectAll("#approver-sort-order .sort-toggle").classed("on", false);
    d3.select(this).classed("on", true);
    if (d3.select(this).classed("sort-by-value"))
      state.approversSortType = state.BY_VALUE;
    else if (d3.select(this).classed("sort-by-count"))
      state.approversSortType = state.BY_COUNT;

    if (d3.select(".main-units.selected").size()) {
      d3.select(".main-units.selected").datum().startApproverIndex = 0;
      window.dispatchEvent(new CustomEvent("drawApproversChunk", { detail : {} }));
    }
  }

  // anomalies view
  d3.select("#value-anomaly").classed("on", state.valueAnomalyState);

  d3.select("#value-anomaly .switch-container")
    .on("click", valueAnomalyClick);

  function valueAnomalyClick() {
    d3.select("#value-anomaly").classed("on", !state.valueAnomalyState);
    state.valueAnomalyState = !state.valueAnomalyState;
    if (state.valueAnomalyState) {
      // cannot coexist with clustering
      state.criteria.clusterLevel = 0;
      clusterSlider.value(state.criteria.clusterLevel);
    }
    setClusterLabels();
    drawOverviewByCriteria();
  }

  // Table Toggle

  d3.select("#table-toggle-container .switch-container")
    .on("click", tableToggleClick);

  function tableToggleClick() {
    d3.select("#table-toggle-container .table-toggle").classed("on", !state.tableToggleState);
    d3.select(".table-container").classed("on", !state.tableToggleState);
    state.tableToggleState = !state.tableToggleState;
    if (state.tableToggleState) {
      refreshTable(mainUnits);
    }
    window.dispatchEvent(new CustomEvent("tableStateChanged", { detail: {state: state.tableToggleState}}));

  }

  if (state.drawOverviewListener) window.removeEventListener("drawOverviewByCriteria" , state.drawOverviewListener);
  state.drawOverviewListener = drawOverviewByCriteriaHandler;
  window.addEventListener("drawOverviewByCriteria", state.drawOverviewListener);

  // drawApproversChunk handler
  if (state.drawApproversChunkListener) window.removeEventListener("drawApproversChunk", state.drawApproversChunkListener);
  state.drawApproversChunkListener = function() {
    var selectedNode = d3.select(".main-units.selected");
    d3.selectAll('.detailed-group').remove();
    drawDetailedView(selectedNode, state.overviewParams);
  };
  window.addEventListener("drawApproversChunk", state.drawApproversChunkListener);

  // drawCategoriesChunk handler
  if (state.drawCategoriesChunkListener) window.removeEventListener("drawCategoriesChunk", state.drawCategoriesChunkListener);
  state.drawCategoriesChunkListener = function() {
    var selectedNode = d3.select(".main-units.selected");
    d3.selectAll('.detailed-group').remove();
    drawValueAnomaliesView(selectedNode, state.overviewParams);
  };
  window.addEventListener("drawCategoriesChunk", state.drawCategoriesChunkListener);

  function drawDetailedViewByZoomLevel() {
    // state.noInteraction = false;

    var currentClusterValue = clusterSlider.value();

    if (d3.select(".main-units.selected").size()) {
      state.overviewParams = drawOverview(mainUnits);
      var selectedNode = d3.select(".main-units.selected");
      if (!selectedNode.size()) return;

      state.dataFunc.zoomLevel(selectedNode.datum(), currentClusterValue); // will create the necessary bucketed data

      // consider moving to drawDetailedView
      d3.selectAll(".detailed-group .zoom-sphere").remove();
      d3.selectAll(".detailed-group .zoom-sphere-background").remove();
      d3.selectAll(".detailed-group .zoom-bubble-guide").remove();

      if (currentClusterValue > 0) {
        d3.selectAll(".detailed-group .sphere").style("opacity", 0);
        d3.selectAll(".detailed-group .bubble-guide").style("opacity", 0);

        d3.select(".detailed-group").classed("zoom", true);
      }

      drawDetailedView(selectedNode, state.overviewParams);

      if (currentClusterValue > 0) {
        refreshTable(mainUnits); // update rows with zoom bucket data
      }
    }

  }

  function drawValueAnomaliesViewByZoomLevel() {
    // state.noInteraction = false;

    var currentClusterValue = clusterSlider.value();

    if (d3.select(".main-units.selected").size()) {
      state.overviewParams = drawOverview(mainUnits);
      var selectedNode = d3.select(".main-units.selected");
      if (!selectedNode.size()) return;

      state.dataFunc.anomaliesZoomLevel(selectedNode.datum(), currentClusterValue); // will create the necessary bucketed data

      // consider moving to drawDetailedView
      d3.selectAll(".detailed-group .zoom-sphere").remove();
      d3.selectAll(".detailed-group .zoom-sphere-background").remove();
      d3.selectAll(".detailed-group .zoom-bubble-guide").remove();

      if (currentClusterValue > 0) {
        d3.selectAll(".detailed-group .sphere").style("opacity", 0);
        d3.selectAll(".detailed-group .bubble-guide").style("opacity", 0);

        d3.select(".detailed-group").classed("zoom", true);
      }

      drawValueAnomaliesView(selectedNode, state.overviewParams);

      if (currentClusterValue > 0) {
        refreshTable(mainUnits); // update rows with zoom bucket data
      }
    }

  }

  function drawOverviewByCriteria(params) {
    // state.noInteraction = false;

    // either refreshes the whole svg based on current criteria. or
    // refreshes just the open flower (selected unit) from criteria applied to a fresh copy of unit
    var currentTimeRange = timeSlider.range();
    // var currentValueRange = valueSlider.range();
    var currentAmountRange = amountSlider.range();
    var currentWaitRange = waitSlider.range();

    window.dispatchEvent(new CustomEvent("endConfigureState", { detail : {} }));
    window.dispatchEvent(new CustomEvent("setNonZoomState", {detail: {}}));

    var typesFilter = [];
    d3.selectAll("#approval-type-switches .type-filter")
      .each(function(d) {
        if (d3.select(this).classed("on")) typesFilter.push(d3.select(this).attr("data-type-filter"));
      });

    state.criteria = {
      timeRangeMin: timeFilterState ? currentTimeRange.begin : null,
      timeRangeMax: timeFilterState ? currentTimeRange.end : null,
      amountMin: amountFilterState ? currentAmountRange.begin : null,
      amountMax: amountFilterState ? currentAmountRange.end : null,
      waitTimeMin: waitFilterState ? currentWaitRange.begin : null,
      waitTimeMax: waitFilterState ? currentWaitRange.end : null,
      clusterLevel: clusterFilterState ? clusterSlider.value() : null, // null should be similar to 0 zoom level

      typesFilter: typesFilter
    };

    state.dataFunc.filterDataByCriteria(state.criteria);

    // if one flower is open then update only its content
    if (d3.select(".main-units.selected").size() || (params && params.selectedNode)) {

      state.overviewParams = drawOverview(mainUnits);
      var selectedNode = d3.select(".main-units.selected");

      var currentClusterValue = clusterSlider.value();
      if (currentClusterValue > 0) state.dataFunc.zoomLevel(selectedNode.datum(), currentClusterValue); // will refresh the bucketed data (hidden spheres) based on new criteria

      if (selectedNode.size()) {
        d3.selectAll('.detailed-group').remove();
        if (state.valueAnomalyState) {
          drawValueAnomaliesView(selectedNode, state.overviewParams);
        }
        else {
          drawDetailedView(selectedNode, state.overviewParams);
        }
      }
      state.overviewParams.centerSelected();

      if (state.tableToggleState) {
        refreshTable(mainUnits);
      }

    }
    else {
      // update the whole thing
      mainUnits.forEach(function(unit) {
        delete unit.fx;
        delete unit.fy;
      });

      state.overviewParams = drawOverview(mainUnits);
      state.overviewParams.runSimulation(0.3);

      if (state.tableToggleState) {
        refreshTable(mainUnits);
      }
    }

  }

  d3.select(".legend-button")
    .on("click", legendClickEvent);

  function legendClickEvent(event) {
    const identityMargin = 20;

    // we try to find enough visible bubbles to show the different legend elements
    d3.event.preventDefault();
    d3.event.stopPropagation();

    if (state.legendToggle) {
      d3.selectAll('.legend-svg').remove();
      d3.select(".shield").classed("on dark", false).on("click", null);
      d3.select(".mainObjectLegend")
        .style("display","none");
      d3.select(".bigDiameterLegend")
        .style("display","none");
      d3.select(".smallDiameterLegend")
        .style("display","none");
      d3.selectAll(".main-units").classed("legend-unit", false);
      state.legendToggle = !state.legendToggle;
      return;
    }

    closeMenu();

    var w = window,
      d = document,
      e = d.documentElement,
      g = d.querySelector('.svg-container'),
      screenWidth = /*w.innerWidth || e.clientWidth ||*/ g.clientWidth,
      screenHeight = /*w.innerHeight || e.clientHeight ||*/ g.clientHeight;

    if (criteria.getSimulation) {
      criteria.getSimulation().stop();
    }

    var svg = d3.select("svg");

    function findLargestVisibleUnit(selection) {
      if (selection.size() > 0) {
        // find most visible unit
        var mostVisible = 0, mostVisibleIndex = -1;
        selection.each(function(d,i) {
          var rect = this.getBoundingClientRect();
          var left = Math.max(0, rect.left);
          var right = Math.min(screenWidth, rect.right);
          var top = Math.max(0, rect.top);
          var bottom = Math.min(screenHeight, rect.bottom);
          if ((right-left)*(bottom-top) > mostVisible) {
            mostVisibleIndex = i;
            mostVisible = (right-left)*(bottom-top);
          }
        });
        if (mostVisible) {
          return d3.select(selection.nodes()[mostVisibleIndex]);
        }
        else
          return null;
      }
    }

    if (!d3.select(".main-units.selected").size()) {
      var closedUnit = d3.select(".main-units"); // arbitrary first one
      closedUnit.datum().selected = true;
      window.addEventListener("flowerOpenAtCenter", showLegend);
      window.dispatchEvent(new CustomEvent("drawOverviewByCriteria", { detail : {selectedNode: closedUnit.node()} }));
    }
    else {
      showLegend();
    }

    function showLegend() {
      simulation.stop();

      var selectedUnit = d3.select(".main-units.selected").size() ? d3.select(".main-units.selected") : findLargestVisibleUnit(d3.selectAll(".main-units"));
      if (!selectedUnit) return;

      var circle = selectedUnit.select(".detailed-group circle").size() ? selectedUnit.select(".detailed-group circle") : selectedUnit.select(".closed-sphere-background");
      if (circle.size() <= 0) return;
      var outerRadius = parseFloat(circle.attr("r"));
      selectedUnit.classed("legend-unit legend-round", true);

      var requestLegendUnit = d3.selectAll(".main-units").filter(function(d, i) {
        return !d3.select(this).classed("legend-unit")
      });

      requestLegendUnit = findLargestVisibleUnit(requestLegendUnit)

      if (requestLegendUnit) {
        requestLegendUnit.classed("legend-unit request-legend", true);

        // find most visible unit
        var mostVisible = 0, mostVisibleIndex = -1;
        requestLegendUnit.each(function(d,i) {
          var rect = this.getBoundingClientRect();
          var left = Math.max(0, rect.left);
          var right = Math.min(screenWidth, rect.right);
          var top = Math.max(0, rect.top);
          var bottom = Math.min(screenHeight, rect.bottom);
          if ((right-left)*(bottom-top) > mostVisible) {
            mostVisibleIndex = i;
            mostVisible = (right-left)*(bottom-top);
          }
        });
        if (mostVisible) {
          requestLegendUnit = d3.select(requestLegendUnit.nodes()[mostVisibleIndex]);
          requestLegendUnit.classed("legend-unit request-legend", true);
        }
        else
          requestLegendUnit = null;
      }

      var arcLegendCircle = d3.arc()
        .startAngle(0)
        .endAngle(state.common.toRadians(330))
        .innerRadius(outerRadius - identityMargin)
        .outerRadius(outerRadius - identityMargin);

      d3.selectAll('.legend-svg').remove(); // just to make sure
      d3.select(".shield").classed("on dark", true).on("click",legendClickEvent);

      var mainSVGRect = svg.node().getBoundingClientRect();

      var legendSVG = d3.select("body").append("svg")
        .attr("x",mainSVGRect.x)
        .attr("y",mainSVGRect.y)
        .attr("width", mainSVGRect.width)
        .attr("height", mainSVGRect.height)
        .attr("class","legend-svg")
        .style("position", "fixed");

      var legendScreen = legendSVG
        .append("svg:g")
        .attr("class", "main-legend-group");

      // by now the transform of the detailed sphere has change due to forceSimulation so
      // need to sample it again.
      var rect = selectedUnit.node().getBoundingClientRect();

      var legendGroup = legendScreen
        .append("svg:g")
        .attr("class", "legend-group")
        .attr("transform", "translate(" + (rect.x + rect.width/2) + "," + (rect.y + rect.height/2) + ")");

      // add circular legend
      legendGroup
        .append("svg:path")
        .attr("class", "circular-legend")
        .attr("d", arcLegendCircle());

      var pX = Math.cos(state.common.toRadians(240))*(outerRadius - identityMargin),
        pY = Math.sin(state.common.toRadians(240))*(outerRadius - identityMargin);

      legendGroup
        .append("line")
        .attr("class", "circular-legend")
        .attr("x1", pX).attr("y1", pY).attr("x2", pX-40).attr("y2", pY);
      legendGroup
        .append("line")
        .attr("class", "circular-legend")
        .attr("x1", pX).attr("y1", pY).attr("x2", pX).attr("y2", pY+40);

      d3.select(".mainObjectLegend")
        .style("display","block")
        .style("left", (rect.x + rect.width/2) + "px")
        .style("top", (rect.y + rect.height/2) + "px")
        .raise();

      if (requestLegendUnit) {
        // add diameter to employee legend unit
        rect = requestLegendUnit.node().getBoundingClientRect();

        var diameter1 = legendScreen
          .append("svg:g")
          .attr("class", "legend-group")
          .attr("transform", "translate(" + (rect.x + rect.width / 2) + "," + (rect.y + rect.height / 2) + ")");

        var requestUnitRadius = requestLegendUnit.datum().outerRadius;
        diameter1
          .append("line")
          .attr("class","diameter-legend")
          .attr("x1", -requestUnitRadius)
          .attr("x2", requestUnitRadius)
          .attr("y1", 0)
          .attr("y2", 0);

        d3.select(".bigDiameterLegend")
          .style("display","block")
          .style("left", (rect.right + 20) + "px")
          .style("top", (rect.y + rect.height/2) + "px")
          .raise();

        var valueRadius = parseFloat(requestLegendUnit.select(".request-type-closed").attr("r"));

        diameter1
          .append("line")
          .attr("class","diameter-legend")
          .attr("x1", -valueRadius)
          .attr("x2", valueRadius)
          .attr("y1", 0)
          .attr("y2", 0)
          .attr("transform", "rotate(-50)");

        var rad50 = (50/360)*2*Math.PI;

        diameter1
          .append("line")
          .attr("class","diameter-legend")
          .attr("x1", valueRadius)
          .attr("y1", 0)
          .attr("x2", valueRadius + 30)
          .attr("y2", 30 * Math.tan(rad50))
          .attr("transform", "rotate(-50)");

        d3.select(".smallDiameterLegend")
          .style("display","block")
          .style("left", (rect.x + rect.width/2 + Math.cos(rad50) * valueRadius) + "px")
          .style("top", (rect.y + rect.height/2 - Math.sin(rad50) * valueRadius) + "px")
          .raise();

      }

      window.removeEventListener("flowerOpenAtCenter", showLegend);

      state.legendToggle = !state.legendToggle;

    }

  }

  d3.select(".load-data")
    .on("click", openEditDialog);

  d3.select(".config-button")
    .on("click", function() {
      d3.event.stopImmediatePropagation();

      if (!d3.select(".main-units.selected").size()) {
        state.common.showTooltip("notice-dialog", this, {relate: "above", align: "center", margin: 10});
        return;
      }

      closeMenu();
      showConfigureView();
    });

  d3.select(".show-benchmarks")
    .on("click", function() {
      closeMenu();
      showBenchmarks(function() {

      })
    });

  if (!state.endBenchmarkStateListener) {
    state.endBenchmarkStateListener = function(event) {
      showMenu();
    };
    window.addEventListener("endBenchmarkState", state.endBenchmarkStateListener);
  }

  function showMenu() {
    d3.select(".menu-right").style("right", 0);
    d3.select(".mobile-menu-tab").classed("on", false);
    d3.select(".mobile-menu-close").classed("on", true);
  }

  function closeMenu() {
    d3.select(".menu-right").style("right", 1000 + "px");
    d3.select(".mobile-menu-close").classed("on", false);
    d3.select(".mobile-menu-tab").classed("on", true);
  }

  d3.select(".mobile-menu-tab")
    .on("click", function() {
      window.dispatchEvent(new CustomEvent("mobileMenuOpen", { detail: {}}));
      showMenu();
    });

  d3.select(".mobile-menu-close")
    .on("click", function() {
      closeMenu();
    });

  // at some point worth considering a better event management framework to notify all components of events like resize
  if (!state.windowResizeListener) {
    state.windowResizeListener = function(event) {
      // console.log("resize event intercepted");
      clearTimeout(state.resizeTimeout);
      state.resizeTimeout = setTimeout(function() {
        console.log("ACTUAL resize");
        window.dispatchEvent(new CustomEvent("endConfigureState", { detail : {} }));
        window.dispatchEvent(new CustomEvent("windowResize", { detail : {} }));
        state.freshDataLoaded = true; // ugly but force svg creation
        drawOverview(mainUnits);
      }, 1000);
    };
    window.addEventListener("resize", state.windowResizeListener);
  }

  d3.select(".blobs")
    .on("click", function() {
      d3.select(this).selectAll(".blob").classed("closing",true);
      var $this = this;

      d3.select("#blobWithID").on("animationend", function() {
        console.log("here here");
        d3.select($this).classed("hidden",true);
      })
    });

  /*
    if (state.noInteraction) {
      window.addEventListener("openLargestUnit", function() {
        var units = d3.selectAll(".main-units"), largestUnitIndex = -1;

        for (var i=0;i<mainUnits.length;i++) {
          if (largestUnitIndex < 0 || mainUnits[i].outerRadius > mainUnits[largestUnitIndex].outerRadius) {
            largestUnitIndex = i;
          }
        }

        var largestUnit = d3.selectAll(".main-units").filter(function(d, i) {
          return i == largestUnitIndex;
        });

        largestUnit.datum().selected = true;
        window.dispatchEvent(new CustomEvent("drawOverviewByCriteria", { detail : {selectedNode: largestUnit.node()} }));

      });
    }
  */

}


