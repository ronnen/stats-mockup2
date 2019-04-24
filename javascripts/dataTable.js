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
  console.log("refreshTable called");
  var tableRows = d3.select(".table-rows");

  if (state.freshDataLoaded) {
    tableRows.html(null);
  }

  var selectedRequestIndex = mainUnits.findIndex(function(r) {return r.selected});

  mainUnits.forEach(function(request, requestIndex) {
    request.approvers.forEach(function(approver/*, approverIndex*/) {
      approver.approvals.forEach(function(approval) {
        var dataRows = tableRows.selectAll(".data-row.r" + requestIndex + "a" + approver.approverIndex + "b" + approval.id)
          .data(approval.items /*, function(d, i) {return [requestIndex, approverIndex, i]}*/);

        var enteredDataRows = dataRows
          .enter()
          .append("div")
          .attr("id", function(d,i) {return "r" + requestIndex + "a" + approver.approverIndex + "b" + approval.id + "i" + d.itemIndex})  // r4a3b5 (request 4, approver 3, approval ID17, item 2)
          .attr("class", "data-row " + "r" + requestIndex + "a" + approver.approverIndex + "b" + approval.id) // r2a3iID15 (request 2, approver 3, id ID15)
          .attr("approval-id", function(d) {return d.parentApproval.id})
          .attr("item-index", function(d) {return d.itemIndex});

        enteredDataRows
          .append("div")
          .attr("class", "request data")
          .text(function(d) {return request.request});
        enteredDataRows
          .append("div")
          .attr("class", "time data")
          .text(function(d) {return state.common.valueToDate(d.parentApproval.time)});
        enteredDataRows
          .append("div")
          .attr("class", "approver data")
          .text(function(d) {return approver.approverName});
        enteredDataRows
          .append("div")
          .attr("class", "submitter data")
          .text(function(d) {return d.parentApproval.submitter});
        enteredDataRows
          .append("div")
          .attr("class", "value data")
          .text(function(d) {return state.common.typedValueToTextShort(d.parentApproval.reportedValue || d.parentApproval.value, d.parentApproval.presentation)});
        enteredDataRows
          .append("div")
          .attr("class", "category data")
          .text(function(d) {return d.itemCategory});
        enteredDataRows
          .append("div")
          .attr("class", "item data")
          .text(function(d) {return state.common.typedValueToTextShort(d.itemValueUSD, d.parentApproval.presentation)});
        enteredDataRows
          .append("div")
          .attr("class", "table-wait-time data")
          .text(function(d) {
            return state.common.waitDaysHoursToText(d.parentApproval.waitTime)
          });

        // update existing and new
        enteredDataRows.merge(dataRows)
          .classed("hidden", function(d) {
            if (selectedRequestIndex >= 0 && requestIndex != selectedRequestIndex)
              return true;
            return d.parentApproval.hidden;
          })
          .attr("data-zoom", function(d) {
            if (selectedRequestIndex >= 0 && requestIndex == selectedRequestIndex) {
              if (!state.valueAnomalyState && d.parentApproval.zoomBucket)
                return d.parentApproval.zoomBucket;
              else if (state.valueAnomalyState && d.anomalyZoomBucket)
                return d.anomalyZoomBucket;
              else
                return null;
            }
            else
              return null;
          });

      });

    });
  });


}