var CSVData = '\
# Enter CSV data with the following structure to replace the current view\n\
approverDept,approver,request,presentation,submitter,value,waitTime\n\
"Customer Success Dept.","Tim Pence","Purchase Orders","currency","Ning Hou",92000,10\n\
"Customer Success Dept.","Tim Pence","Purchase Orders","currency","Ning Hou",64000,80\n\
"Customer Success Dept.","Tim Pence","Purchase Orders","currency","Jeremy Lambeth",8000,130\n\
"Customer Success Dept.","Tim Pence","Purchase Orders","currency","Rick Smith",120000,180\n\
"Customer Success Dept.","Tim Pence","Purchase Orders","currency","Don Mclean",3200,280\n\
"Customer Success Dept.","Sammy Davis","Purchase Orders","currency","Chelsia Hu",32000,20\n\
"Customer Success Dept.","Sammy Davis","Purchase Orders","currency","Ning Hou",42000,43\n\
"Supply Chain Dept.","Sammy Davis","Purchase Orders","currency","Derek Holmes",9500,77\n\
"Supply Chain Dept.","Sammy Davis","Purchase Orders","currency","Frank Reilly",9500,87\n\
"Supply Chain Dept.","Sammy Davis","Purchase Orders","currency","Chelsia Hu",32000,91\n\
"Customer Success Dept.","Sammy Davis","Purchase Orders","currency","Rick Smith",120000,180\n\
"Supply Chain Dept.","Sammy Davis","Purchase Orders","currency","Brian May",180000,270\n\
"Customer Success Dept.","Sammy Davis","Purchase Orders","currency","Brian May",736,280\n\
"Customer Success Dept.","Sammy Davis","Purchase Orders","currency","Frank Reilly",92000,450\n\
"Supply Chain Dept.","Sammy Davis","Purchase Orders","currency","Ning Hou",14000,460\n\
"Sales Dept.","Sam Abbasi","Purchase Orders","currency","Chelsia Hu",32000,20\n\
"Sales Dept.","Sam Abbasi","Purchase Orders","currency","Carter Dwaine",67000,43\n\
"Sales Dept.","Sam Abbasi","Purchase Orders","currency","Harper Lee",64000,80\n\
"Sales Dept.","Sam Abbasi","Purchase Orders","currency","Ning Hou",64000,270\n\
"Supply Chain Dept.","Rudy Jewels","Purchase Orders","currency","Frank Reilly",14000,10\n\
"Supply Chain Dept.","Rudy Jewels","Purchase Orders","currency","Linda Packer",32000,20\n\
"Supply Chain Dept.","Rudy Jewels","Purchase Orders","currency","Frank Reilly",14000,43\n\
"Supply Chain Dept.","Rudy Jewels","Purchase Orders","currency","Ning Hou",64000,80\n\
"Supply Chain Dept.","Rudy Jewels","Purchase Orders","currency","Brian May",180000,280\n\
"Supply Chain Dept.","Rudy Jewels","Purchase Orders","currency","Frank Reilly",64000,450\n\
"Supply Chain Dept.","Peter Ham","Purchase Orders","currency","Alex White",5000,40\n\
"Supply Chain Dept.","Peter Ham","Purchase Orders","currency","Dora Van-Halen",32000,70\n\
"Supply Chain Dept.","Peter Ham","Purchase Orders","currency","Xhi Choo Ohn",5400,466\n\
"Sales Dept.","Percy Davis","Purchase Orders","currency","Cynthia Hope",2900,10\n\
"Sales Dept.","Percy Davis","Purchase Orders","currency","Penelope Dribble",64000,43\n\
"Sales Dept.","Percy Davis","Purchase Orders","currency","Daniel Grouchko",32000,80\n\
"Sales Dept.","Percy Davis","Purchase Orders","currency","Rick Smith",120000,180\n\
"Sales Dept.","Percy Davis","Purchase Orders","currency","Frank Reilly",52000,450\n\
"Customer Success Dept.","Linda Grey","Purchase Orders","currency","Ning Hou",70000,10\n\
"Customer Success Dept.","Linda Grey","Purchase Orders","currency","Linda Packer",32000,20\n\
"Customer Success Dept.","Linda Grey","Purchase Orders","currency","Frank Reilly",70000,43\n\
"Customer Success Dept.","Linda Grey","Purchase Orders","currency","Frank Reilly",70000,80\n\
"Sales Dept.","George Wallace","Purchase Orders","currency","Jason Hobart",64000,10\n\
"Sales Dept.","George Wallace","Purchase Orders","currency","Gim Botright",32000,20\n\
"Sales Dept.","George Wallace","Purchase Orders","currency","Carley Stephanus",87000,43\n\
"Sales Dept.","George Wallace","Purchase Orders","currency","Diana Harvest",64000,80\n\
"Sales Dept.","George Wallace","Purchase Orders","currency","Louise Drexel",87000,450\n\
"Sales Dept.","Bobby McGee","Purchase Orders","currency","Jeremy Lambeth",8000,130\n\
"Supply Chain Dept.","Bobby McGee","Purchase Orders","currency","Jeremy Lambeth",8000,130\n\
"Supply Chain Dept.","Bobby McGee","Purchase Orders","currency","Rick Smith",120000,180\n\
"Sales Dept.","Bobby McGee","Purchase Orders","currency","Steve Caper, Jr.",320000,280\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Ning Hou",64000,10\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Linda Packer",32000,20\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Frank Reilly",64000,43\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Ning Hou",64000,80\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Don Mclean",180000,92\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Jeremy Lambeth",8000,130\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Rick Smith",120000,180\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Don Mclean",320000,280\n\
"R&D Dept.","Billie Hollins","Purchase Orders","currency","Frank Reilly",64000,300\n\
"Sales Dept.","Percy Davis","Asset Transfer","currency","Brian May",180000,280\n\
"Sales Dept.","Bobby McGee","Capex","currency","Rick Smith",120000,180\n\
"Customer Success Dept.","Tim Pence","Absence","Days","Linda Packer",4,20\n\
"Customer Success Dept.","Tim Pence","Absence","Days","Frank Reilly",11,43\n\
"Customer Success Dept.","Tim Pence","Absence","Days","Frank Reilly",10,450\n\
"Customer Success Dept.","Sammy Davis","Absence","Days","Frank Reilly",6,10\n\
"Supply Chain Dept.","Sammy Davis","Absence","Days","Rick Smith",10,180\n\
"Sales Dept.","Sam Abbasi","Absence","Days","Jeremy Lambeth",8,130\n\
"Sales Dept.","Sam Abbasi","Absence","Days","Rick Smith",3,180\n\
"Sales Dept.","Sam Abbasi","Absence","Days","Brian May",4,280\n\
"Sales Dept.","Sam Abbasi","Absence","Days","Zach Princeton",5,450\n\
"Supply Chain Dept.","Rudy Jewels","Absence","Days","Jeremy Lambeth",7,130\n\
"Supply Chain Dept.","Rudy Jewels","Absence","Days","Rick Smith",9,180\n\
"Supply Chain Dept.","Peter Ham","Absence","Days","Russ King",6,55\n\
"Supply Chain Dept.","Peter Ham","Absence","Days","Jennifer Pascal",2,133\n\
"Customer Success Dept.","Linda Grey","Absence","Days","Ning Hou",3,450\n\
"Supply Chain Dept.","Bobby McGee","Absence","Days","Steve Caper, Jr.",2,280\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Ning Hou",64000,10\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Chelsia Hu",32000,20\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","John Flanagan",33000,43\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Andrew Horton",18000,80\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Cynthia Van-Leer",50000,90\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Theofilia Drapes",12000,95\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Frank Reilly",64000,116\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Jeremy Lambeth",8000,130\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Rick Smith",120000,180\n\
"Supply Chain Dept.","Katie Denver","Purchase Requests","currency","Steve Caper, Jr.",320000,310\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Ning Hou",64000,10\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Chelsia Hu",32000,20\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","John Flanagan",33000,43\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Andrew Horton",18000,80\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Cynthia Van-Leer",50000,90\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Theofilia Drapes",12000,95\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Frank Reilly",64000,116\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Jeremy Lambeth",8000,130\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Rick Smith",120000,180\n\
"Customer Success Dept.","Don Flanagan","Purchase Requests","currency","Steve Caper, Jr.",320000,280\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Linda Packer",32000,40\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","John Flanagan",33000,68\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Frank Reilly",5000,73\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Andrew Horton",18000,111\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Ning Hou",64000,116\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Cynthia Van-Leer",50000,120\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Theofilia Drapes",12000,157\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Jeremy Lambeth",8000,193\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Rick Smith",120000,210\n\
"Sales Dept.","Catarina Cota","Purchase Requests","currency","Steve Caper, Jr.",320000,360\n\
"Customer Success Dept.","Terence Bing","Change","Changes","Larry Quench",8,400\n\
"Customer Success Dept.","Terence Bing","Change","Changes","Rick Smith",3,500\n\
"Customer Success Dept.","Terence Bing","Change","Changes","Pete Donovan",6,520\n\
"Supply Chain Dept.","Pierre Rocheford","Change","Changes","Larry Quench",4,180\n\
"Supply Chain Dept.","Pierre Rocheford","Change","Changes","Rick Smith",5,360\n\
"Supply Chain Dept.","Pierre Rocheford","Change","Changes","Pete Donovan",11,470\n\
"Sales Dept.","Esmail Mazza","Change","Changes","Pete Donovan",2,355\n\
"Sales Dept.","Esmail Mazza","Change","Changes","Larry Quench",6,390\n\
"Sales Dept.","Esmail Mazza","Change","Changes","Rick Smith",4,450\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Frank Reilly",64000,15\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Linda Packer",32000,33\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Chelsia Hu",32000,47\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Ning Hou",64000,50\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Frank Reilly",64000,80\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Roger Crabs",320000,120\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Rick Smith",120000,340\n\
"Marketing Dept.","Perikilis Nazario","Expenses","currency","Steve Caper, Jr.",55000,400\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Ning Hou",64000,15\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Linda Packer",32000,33\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Frank Reilly",64000,50\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Ning Hou",64000,80\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Steve Caper, Jr.",80000,120\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Jeremy Lambeth",8000,160\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Rick Smith",120000,340\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Don Mclean",320000,400\n\
"R&D Dept.","Billie Hollins","Expenses","currency","Frank Reilly",64000,520\n\
"Marketing Dept.","Perikilis Nazario","Campaign Invoices","currency","Ning Hou",64000,10\n\
"Marketing Dept.","Perikilis Nazario","Campaign Invoices","currency","Chelsia Hu",32000,20\n\
"Marketing Dept.","Perikilis Nazario","Campaign Invoices","currency","Frank Reilly",64000,80\n\
"Marketing Dept.","Perikilis Nazario","Campaign Invoices","currency","Roger Crabs",80000,92\n\
"Marketing Dept.","Perikilis Nazario","Campaign Invoices","currency","Jeremy Lambeth",8000,130\n\
"Marketing Dept.","Perikilis Nazario","Campaign Invoices","currency","Ning Hou",64000,150\n\
"Marketing Dept.","Perikilis Nazario","Vendor Payment","currency","Jeremy Lambeth",10000,150\n\
"Marketing Dept.","Perikilis Nazario","Vendor Payment","currency","Roger Crabs",55000,300\n\
"Marketing Dept.","Perikilis Nazario","Vendor Payment","currency","Roger Crabs",320000,350\n\
"Marketing Dept.","Perikilis Nazario","Vendor Payment","currency","Rick Smith",120000,370\n\
"Marketing Dept.","Perikilis Nazario","Vendor Payment","currency","Ning Hou",64000,420\n\
';

var mainUnits;

function calculateTotalValues(originalData) {
  originalData.forEach(function(request) {
    var stats = request.approvers.reduce(function(c, approver) {
      // [count, value, waitTime]
      var reduced = approver.approvals.reduce(function(c, approval) {
          return [c[0] + 1, c[1] + approval.value, c[2] + approval.waitTime];
        }, [0, 0, 0]);

      approver.average = reduced[0] > 0 ? reduced[2]/reduced[0] : 0;

      return [c[0] + reduced[0], c[1] + reduced[1], c[2] + reduced[2]];
    }, [0, 0, 0]);

    request.approvers = request.approvers.sort(function(a,b) {
      if (a.approverName > b.approverName) return -1;
      if (a.approverName < b.approverName) return 1;
      return 0;
    });

    request.totalCount = stats[0];
    request.totalValue = stats[1];
    request.totalWaitTime = stats[2];
    request.unitLabel = request.request + ". " + request.totalCount + " requests. " + waitToText(request.totalWaitTime/request.totalCount) + " Average delay.";
  });

}

function filterDataByCriteria(criteria) {
  // criteria {totalValueMin, totalValueMax, waitTimeMin, waitTimeMax, typesFilter}

  // hide approvals that are outside wait time range
  mainUnits.forEach(function(unit) {
    unit.hidden = (criteria.typesFilter.indexOf(unit.request) < 0);
    unit.approvers.forEach(function(approver) {
      approver.approvals.forEach(function(approval) {
        if (unit.hidden) {
          approval.hidden = true;
          return;
        }
        approval.hidden = false;
        if (criteria.waitTimeMin == null && criteria.amountMin == null)
          approval.hidden = false;
        else {
          if (criteria.amountMin !== null && approval.presentation != "currency") approval.hidden = true;
          if (!approval.hidden && criteria.waitTimeMin !== null) approval.hidden = !(approval.waitTime >= criteria.waitTimeMin && approval.waitTime <= criteria.waitTimeMax);
          if (!approval.hidden && criteria.amountMin !== null) approval.hidden = !(approval.value >= criteria.amountMin && approval.value <= criteria.amountMax);
        }
      });
      approver.hidden = approver.approvals.every(function(t) {return t.hidden});
    })
  });

  // hide irrelevant approvals types
  mainUnits.forEach(function(unit) {
    unit.hidden = (criteria.typesFilter.indexOf(unit.request) < 0);
    if (!unit.hidden) {
      unit.hidden = unit.approvers.every(function(t) {return t.hidden});
    }
  });

  return mainUnits;
}

/*
function filterApproverDataByCriteria(approver, criteria) {

  approver.approvalTypes.forEach(function(approvalType) {
    approvalType.approvals.forEach(function(approval) {
      approval.hidden = !(criteria.waitTimeMin == null || (approval.waitTime >= criteria.waitTimeMin && approval.waitTime <= criteria.waitTimeMax));
    })
  });

  approver.approvalTypes.forEach(function(t) {
    t.hidden = !(criteria.typesFilter.indexOf(t.label) >= 0) ||
      t.approvals.every(function(approval) {return approval.hidden});
  });

  return approver;

}
*/

function getAllVisibleApprovals() {
  var result = [];
  mainUnits.forEach(function(request) {
    request.approvers.forEach(function(approver) {
      result = result.concat(filterNonHidden(approver.approvals, true).map(function(approval) {
        return {
          request: request.request,
          approver: approver.approverName,
          submitter: approval.submitter,
          value: approval.value,
          waitTime: approval.waitTime
        }
      }))
    });
  });
  return result.sort(function(a,b) {
    if (a.waitTime > b.waitTime) return -1;
    if (b.waitTime > a.waitTime) return 1;
    return 0;
  });
}

function getRequestVisibleApprovals(request) {
  var result = [];
  request.approvers.forEach(function(approver) {
    result = result.concat(filterNonHidden(approver.approvals, true).map(function(approval) {
      return {
        request: request.request,
        approver: approver.approverName,
        submitter: approval.submitter,
        value: approval.value,
        waitTime: approval.waitTime
      }
    }))
  });

  return result.sort(function(a,b) {
    if (a.waitTime > b.waitTime) return -1;
    if (b.waitTime > a.waitTime) return 1;
    return 0;
  });
}

