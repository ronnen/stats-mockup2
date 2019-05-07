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

/*
    var timeGenerator = d3.scaleLinear()
      .domain([0,1])
      .rangeRound([Date.now()-60*864e5, Date.now()-864e5]); // dates in the last 2 months or so
*/

    var re = /,/gi;

    results.data.forEach(function(row) {
      var request = requests[row.request] = requests[row.request] || {};
      var approver = request[row.approver] = request[row.approver] || {};
      var approval = approver[row.approvalId];

      if (approver[row.approvalId] === undefined) {
        approval = approver[row.approvalId] = {
          id: row.approvalId,
          submitter: row.submitter,
          value: parseFloat(row.value.replace(re,"")),
          reportedValue: parseFloat(row.reportedValue.replace(re,"")),
          currency: row.currency,
          waitTime: parseFloat(row.waitTime),
          presentation: row.presentation,
          approverDept: row.approverDept,
          time: (new Date(row.time)).getTime(),
          items: []
        }
      }

      // pushing line item to approval
      approval.items.push({
        parentApproval: approval,
        approvalId: row.approvalId, // is it necessary?
        itemCategory: row.itemCategory,
        itemIndex: parseInt(row.itemIndex.replace(re,"")),
        itemValue: parseFloat(row.itemValue.replace(re,"")),
        itemCurrency: row.itemCurrency,
        itemValueUSD: parseFloat(row.itemValueUSD.replace(re,"")),
        // time: timeGenerator(Math.random())
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
        objApprover.approvals = Object.keys(objApprover.approvals).map(function(approvalId) {
          return objApprover.approvals[approvalId]
        });
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
      "approvalId,approverDept,approver,request,presentation,submitter,value,reportedValue,currency,waitTime,time,itemCategory,itemIndex,itemValue,itemCurrency,itemValueUSD\n";
    units.forEach(function(unit) {
      unit.approvers.forEach(function(approver) {
        approver.approvals.forEach(function(approval) {
          approval.items.forEach(function(item) {
            result +=
              "\"" + approval.id + "\"," +
              "\"" + approval.approverDept.replace(/\"/g, "\"\"") + "\"," +
              "\"" + approver.approverName.replace(/\"/g, "\"\"") + "\"," +
              "\"" + unit.request + "\"," +
              "\"" + approval.presentation + "\"," +
              "\"" + approval.submitter.replace(/\"/g, "\"\"") + "\"," +
              approval.value + "," +
              approval.reportedValue + "," +
              "\"" + approval.currency + "\"," +
              approval.waitTime + "," +
              "\"" + state.common.valueToDate(approval.time) + "\"," +
              "\"" + item.itemCategory.replace(/\"/g, "\"\"") + "\"," +
              "\"" + item.itemIndex + "\"," +
              item.itemValue + "," +
              "\"" + item.itemCurrency + "\"," +
              item.itemValueUSD + "\n";
          });
        });
      });
    });

    return result;
  }

  d3.select(".shield").classed("on", true);
  d3.select(".loadDataDialog").classed("on", true);
  d3.select("body").classed("dialog-on", true);

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
    d3.select("body").classed("dialog-on", false);
  });

  d3.select(".load-edit").on("click", function() {
    d3.select(".loading-shield").classed("on", true);

    setTimeout(function() {
      mainUnits = parseCSV(editor.getValue());

      d3.select(".shield").classed("on", false);
      d3.select(".loadDataDialog").classed("on", false);
      d3.select("body").classed("dialog-on", false);

      drawOverview(mainUnits);
    }, 100);

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

