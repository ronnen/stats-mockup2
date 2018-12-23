function showBenchmarks() {
  d3.select(".shield").classed("on darkest", true);
  d3.select(".benchmark-dialog").classed("on", true);
  d3.select(".benchmark-rows").html(null);

  d3.select(".benchmark-dialog .close").on("click", () => {
    console.log("close clicked");
    d3.select(".benchmark-dialog .legend").classed("on", false);
    d3.select(".benchmark-dialog").classed("on", false);
    d3.select(".shield").classed("on darkest", false);
  });

  var benchmarkData = [
    {
      process: "Average Supplier On-Boarding Cycle Time",
      unit: "Days",
      range: [0, 25],
      goodRange: [10,16],
      median: 13.9,
    },
    {
      process: "Average Expense Report Approval Cycle Time",
      unit: "Hours",
      range: [0, 60],
      goodRange: [18,42],
      median: 24.8,
    },
    {
      process: "Average Invoice Approval Cycle Time",
      unit: "Hours",
      range: [0, 100],
      goodRange: [17,48],
      median: 23.1,
    },
    {
      process: "Average Purchase Requisition to Order Cycle Time",
      unit: "Hours",
      range: [0, 30],
      goodRange: [9.3,15],
      median: 11.6,
    },
  ];

  const gaugesInRow = 2;
  const markersMargin = 45;

/*
  var width = window.innerWidth,
      height = window.innerHeight;
*/

  var rowsData = new Array(Math.ceil(benchmarkData.length/gaugesInRow));
  rowsData = rowsData.map((a,i) => i);

  d3.select(".benchmark-dialog .benchmark-rows").selectAll(".benchmark-row")
    .data(rowsData)
    .enter()
    .append("div")
    .attr("class","benchmark-row")
    .attr("id", (d,i) => "benchmarkRow" + i);

  var tileContainer = d3.select(".benchmark-dialog").selectAll(".benchmark-tile")
    .data(benchmarkData);

  tileContainer    // this complexity of using "each" in adding tiles is because I lay them down in rows and tiles
    .enter()
    .each((t, i) => {
      var row = d3.select("#benchmarkRow" + Math.floor(i/gaugesInRow));
      row
        .append("div")
        .attr("class", "benchmark-tile")
        .datum(t);
    });

  var rect = d3.select(".benchmark-tile").node().getBoundingClientRect();
  d3.selectAll(".benchmark-tile").style("max-width", rect.height*1.33 + "px");

  var tiles = d3.selectAll(".benchmark-tile");

  tiles
    .append("div")
    .attr("class","caption")
    .text((d) => d.process);

  var svgSide = rect.height
    - d3.select(".benchmark-tile .caption").node().getBoundingClientRect().height
    - parseFloat(d3.select('.benchmark-tile').style("padding-bottom"));

  var svg = tiles
    .append("svg")
    .attr("width", svgSide)
    .attr("height", svgSide);

  var mainGroups = svg
    .append("g")
    .attr("class","bm-group")
    .attr("transform", `translate(${svgSide/2},${svgSide/2})`);

  var mainR = svgSide / 2 - markersMargin;  // some margin between circle and border

  mainGroups
    .append("circle")
    .attr("class", "bm-background")
    .attr("r", mainR);

  setTimeout(animateBenchmarks, 100);

  var arc = d3.arc()
    .startAngle(d => d.from)
    .endAngle(d => d.to)
    .innerRadius(function(d) { return d.innerRadius; })
    .outerRadius(function(d) { return d.outerRadius; });

  function animateBenchmarks() {
    console.log("started animation");

    var tweenNumber = function(d) {
      var i = d3.interpolate(0, d.median);
      var $this = this;

      return function(t) {
        d3.select($this).text((i(t)).toFixed(1));
      }
    };

    var tweenRay = function(range, rayRange) {
      var radScale = d3.scaleLinear()
        .domain(range)
        .range([0, 2*Math.PI]);

      var i = d3.interpolate([0,0], rayRange);

      return function(t) {
        var current = i(t);
        return arc({
          from: radScale(current[0]),
          to: radScale(current[1]),
          innerRadius: 0,
          outerRadius: mainR,
        });
      };
    };

    var tweenMedian = function(range, median) {
      var degScale = d3.scaleLinear()
        .domain(range)
        .range([0, 360]);

      var i = d3.interpolate(0, median);

      return function(t) {
        var current = degScale(i(t));
        return "rotate(" + current + ")";
      };
    };

    setTimeout(() => {
      d3.select(".benchmark-dialog .legend").classed("on", true);

    }, 1000);

    mainGroups
      .append("path")
      .transition().duration(500).ease(d3.easeLinear)
      .attrTween("d", d => tweenRay(d.range, d.goodRange))
      .attr("class", "bm-good-range");

    mainGroups
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x1", 0)
      .attr("y1", -mainR)
      .attr("class", "bm-median")
      .transition().duration(500).ease(d3.easeLinear)
      .attrTween("transform", d => tweenMedian(d.range, d.median))
      .on("end", function(d) {
        console.log(d.median);
        var degScale = d3.scaleLinear()
          .domain(d.range)
          .range([0, 360]);

        var markerGroup = d3.select(this.parentNode).selectAll(".bm-median-marker")
          .data([d.goodRange[0],d.median,d.goodRange[1]])
          .enter()
          .append("g")
          .attr("class", "bm-median-marker");

        markerGroup
          .transition().duration(500).ease(d3.easeElastic.amplitude(2))
          .attrTween("transform", (d) => {
            var scaleBehavior = d3.scaleLinear()
              .range([0.5,1]);

            return function(t) {
              var scale = scaleBehavior(t);
              return `rotate(${degScale(d)}) translate(0,${-mainR-25}) scale(${scale},${scale})`;
            }
          });

        markerGroup
          .append("circle")
          .attr("class", "bm-median-marker-circle")
          .style("fill", (d,i) => i == 0 ? "#428bca" : (i == 1) ? "seagreen" : "orange")
          .attr("r", 15);

        markerGroup
          .append("text")
          .attr("class", "bm-median-marker-text")
          .attr("text-anchor", "middle")
          .attr("dy","0.5em")
          .attr("transform", (d) => `rotate(${-degScale(d)})`) // anti rotate
          .text(d => d);
      });

    mainGroups
      .append("circle")
      .attr("class", "bm-center-circle")
      .attr("r", Math.min(40, mainR - 30));

    mainGroups
      .append("text")
      .attr("class", "bm-center-value")
      .attr("text-anchor", "middle")
      .transition().duration(500).ease(d3.easeLinear)
      .tween("text", tweenNumber);

    mainGroups
      .append("text")
      .attr("class", "bm-center-unit")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .text(d => d.unit);
  }

  function showLegend()  {

  }

}