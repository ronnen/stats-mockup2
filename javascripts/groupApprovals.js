function groupApprovals() {
  // will open a dialog that let's you set the fields that determine same line item
  // in order to deduplicate line items in anomaly detection view

  d3.select(".shield").classed("on", true);
  d3.select(".group-approvals-dialog").classed("on", true);
  d3.select("body").classed("dialog-on", true);

  d3.select(".group-approvals-dialog .cancel")
    .on("click", function() {
      d3.select(".shield").classed("on", false);
      d3.select(".group-approvals-dialog").classed("on", false);
      d3.select("body").classed("dialog-on", false);
    });
}