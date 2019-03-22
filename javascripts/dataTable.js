function drawTable() {
  d3.select(".table-resize")
    .call(d3.drag()
      .on("drag", dragged));

  function dragged(d) {
    // console.log(d3.event.dx + " " + d3.event.dy + " " + d3.event.x + " " + d3.event.y);
    var tableContainerNode = this.parentNode;
    var beforeHeight = tableContainerNode.getBoundingClientRect().height;
    var afterHeight = beforeHeight - d3.event.y;

    d3.select(tableContainerNode).style('height',afterHeight + "px");
    d3.select(tableContainerNode).select('.table-rows').style('height', (afterHeight-28) + "px");
  }
}

function refreshTable(mainUnits) {
  var tableRows = d3.select(".table-rows");

  if (state.freshDataLoaded) {
    tableRows.html(null);
  }

  var selectedRequestIndex = mainUnits.findIndex(function(r) {return r.selected});

  mainUnits.forEach(function(request, requestIndex) {
    request.approvers.forEach(function(approver, approverIndex) {
      var dataRows = tableRows.selectAll(".data-row.r" + requestIndex + "a" + approverIndex)
        .data(approver.approvals/*, function(d, i) {return [requestIndex, approverIndex, i]}*/);

      var enteredDataRows = dataRows
        .enter()
        .append("div")
        .attr("id", function(d,i) {return "r" + requestIndex + "a" + approverIndex + "b" + i})  // r4a3b5 (request 4, approver 3, approval 5)
        .attr("class", "data-row " + "r" + requestIndex + "a" + approverIndex); // r2a3 (request 2, approver 3)

      enteredDataRows
        .append("div")
        .attr("class", "request data")
        .text(function(d) {return request.request});
      enteredDataRows
        .append("div")
        .attr("class", "time data")
        .text(function(d) {return state.common.valueToDate(d.time)});
      enteredDataRows
        .append("div")
        .attr("class", "approver data")
        .text(function(d) {return approver.approverName});
      enteredDataRows
        .append("div")
        .attr("class", "submitter data")
        .text(function(d) {return d.submitter});
      enteredDataRows
        .append("div")
        .attr("class", "value data")
        .text(function(d) {return state.common.typedValueToTextShort(d.reportedValue || d.value, d.presentation)});
      enteredDataRows
        .append("div")
        .attr("class", "table-wait-time data")
        .text(function(d) {
          return state.common.waitToText(d.waitTime)
        });


      // update existing and new
      enteredDataRows.merge(dataRows)
        .classed("hidden", function(d) {
          if (selectedRequestIndex >= 0 && requestIndex != selectedRequestIndex)
            return true;
          return d.hidden;
        })
        .attr("data-zoom", function(d) {
          if (selectedRequestIndex >= 0 && requestIndex == selectedRequestIndex && d.zoomBucket)
            return d.zoomBucket;
          else
            return null;
        });

    });
  });


}