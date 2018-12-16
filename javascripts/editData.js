function parseCSV(csvString) {
  try {
    var results = Papa.parse(csvString, {
      header: true,
      delimiter: ",",
      comments: true,
      skipEmptyLines: true
    });

    if (results.errors.length) {
      alert("following error(s) where encountered: \n" + results.errors.map(function(e) {return e.message}).join("\n"));
      return;
    }

    var requests = {};

    results.data.forEach(function(row) {
      var request = requests[row.request] = requests[row.request] || {};
      var approver = request[row.approver] = request[row.approver] || [];
      approver.push({
        submitter: row.submitter,
        value: parseFloat(row.value),
        waitTime: parseFloat(row.waitTime),
        presentation: row.presentation,
        approverDept: row.approverDept
      });
    });

    var result = [];

    Object.keys(requests).forEach(function(request) {
      var obj = {
        request: request,
        approvers: []
      };
      Object.keys(requests[request]).forEach(function(approver) {
        var objApprover = {
          approverName: approver,
          approvals: requests[request][approver]
        };
        objApprover.approvals = objApprover.approvals.sort(function(a,b) {
          if (a.waitTime < b.waitTime) return -1;
          if (a.waitTime > b.waitTime) return 1;
          return 0;
        });
        obj.approvers.push(objApprover);
      });
      obj.presentation = obj.approvers[0].approvals[0].presentation; // get presentation from first approval
      result.push(obj);
    });

    state.freshDataLoaded = true;
    mainUnits = result;

    return result;
  }
  catch(err) {
    console.log("illegal json provided..." + err);
    alert("Please provide a valid JSON object");
  }
}

function openEditDialog() {
  function flattenJSON(units) {
    var result =
      "# Enter CSV data with the following structure to replace the current view\n" +
      "approverDept,approver,request,presentation,submitter,value,waitTime\n";
    units.forEach(function(unit) {
      unit.approvers.forEach(function(approver) {
        approver.approvals.forEach(function(approval) {
          result +=
            "\"" + approval.approverDept + "\"," +
            "\"" + approver.approverName + "\"," +
            "\"" + unit.request + "\"," +
            "\"" + approval.presentation + "\"," +
            "\"" + approval.submitter + "\"," +
            approval.value + "," +
            approval.waitTime + "\n";
        });
      });
    });

    return result;
  }

  d3.select(".shield").classed("on", true);
  d3.select(".loadDataDialog").classed("on", true);

  var editor = ace.edit("editor", {
    mode: "ace/mode/text",
    selectionStyle: "text"
  });
  editor.setTheme("ace/theme/monokai");
  var csv = flattenJSON(mainUnits);
  editor.setValue(csv);
  editor.selection.clearSelection();
  editor.moveCursorTo(0,0);
  editor.focus();

  d3.select(".cancel-edit").on("click", function() {
    d3.select(".shield").classed("on", false);
    d3.select(".loadDataDialog").classed("on", false);
  });

  d3.select(".load-edit").on("click", function() {
    mainUnits = parseCSV(editor.getValue());

    d3.select(".shield").classed("on", false);
    d3.select(".loadDataDialog").classed("on", false);

    drawOverview(mainUnits);

  });

  d3.select(".view-json").on("click", function() {
    editor.session.setMode("ace/mode/json");
    editor.setValue(JSON.stringify(mainUnits, function(name, val) {
      if (typeof val == "object") {
        // Array.isArray(val) to check if it's an arry
        return val;
      }
      else {
        return ([
          "unitTotalValue",
          "unitLabel",
          "approverTotalValue",
          "outerRadius",
          "x","y","vx","vy",
          "index",
          "hidden",
          "average",
          "selected",
          "flipText"
        ].indexOf(name) >= 0) ? undefined : val;
      }
    }, '\t'));
    editor.setReadOnly(true);
    editor.selection.clearSelection();
    editor.moveCursorTo(0,0);
    editor.focus();
  });
}

