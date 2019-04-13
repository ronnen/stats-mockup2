/*
 Replace in Rubymine (if given a file which you want to turn to a string like below):

 Plant “\” character by:

 Search regex:

 \n

 and replace with

 \\n\\\r

 */

var CSVData = '\
# Enter CSV data with the following structure to replace the current view\n\
approverDept,approver,request,presentation,submitter,value,reportedValue,currency,waitTime,time\n\
Finance,Stacy Hoolahan,Change,Changes,Luke DeCoste,1,1,N/A,17.35,"Nov 9, 2018"\n\
Finance,Stacy Hoolahan,Change,Changes,Thando Nkosi,1,1,N/A,45.29,"Dec 9, 2018"\n\
Finance,Stacy Hoolahan,Change,Changes,Fei Meng ZHENG,1,1,N/A,89.05,"Oct 26, 2018"\n\
G&A,Chris McCoy,Change,Changes,Jon Estrada,1,1,N/A,25.46,"Nov 4, 2018"\n\
Finance,Stacy Hoolahan,Expense,currency,Kenn Moffitt,372.26,372.26,USD,36.04,"Dec 12, 2018"\n\
Finance,Stacy Hoolahan,Expense,currency,Patrick VonHorn,2191.88,2191.88,USD,46.27,"Nov 28, 2018"\n\
Finance,Stacy Hoolahan,Expense,currency,Nancy Mitchell,896.45,896.45,USD,125.01,"Nov 20, 2018"\n\
Finance,Stacy Hoolahan,Expense,currency,Anand Andrew Bolor,1323.76,1323.76,USD,140.42,"Oct 28, 2018"\n\
Finance,Stacy Hoolahan,Expense,currency,Selma Trenton,150.66,150.66,USD,143.51,"Oct 28, 2018"\n\
IT,Don Frampton,Expense,currency,patrick furmage,3436.22,3436.22,USD,11.6,"Dec 3, 2018"\n\
IT,Don Frampton,Expense,currency,Jeremy Huddleston,1942.3,1942.3,USD,61.02,"Nov 30, 2018"\n\
IT,Don Frampton,Expense,currency,Gaurav Pawar,1964.8,1964.8,USD,69.52,"Nov 20, 2018"\n\
IT,Don Frampton,Expense,currency,Sonny Becca,2388.13,2388.13,USD,83.05,"Dec 9, 2018"\n\
G&A,Chris McCoy,Expense,currency,Michael Harder,1077.44,1077.44,USD,49.11,"Nov 5, 2018"\n\
G&A,Chris McCoy,Expense,currency,Tim Gilday,185.71,185.71,USD,91,"Dec 7, 2018"\n\
Finance,Stacy Hoolahan,Invoice,currency,Jose Houed,108629.94,108629.94,USD,57.49,"Dec 13, 2018"\n\
Finance,Stacy Hoolahan,Invoice,currency,James Guy,95444.59,95444.59,USD,110.27,"Dec 15, 2018"\n\
Finance,Stacy Hoolahan,Invoice,currency,Tatiana Cristea,76904.1,76904.1,USD,113.24,"Nov 10, 2018"\n\
Finance,Stacy Hoolahan,Invoice,currency,Edgar Solberg,129952.12,129952.12,USD,157.53,"Nov 19, 2018"\n\
Finance,Stacy Hoolahan,Invoice,currency,Seunghyun Son,103036.76,103036.76,USD,163.38,"Dec 1, 2018"\n\
Sales,Mo Barrick,Invoice,currency,Joe Reeves,36969.28,36969.28,USD,48.46,"Dec 18, 2018"\n\
Sales,Mo Barrick,Invoice,currency,Sonny Fian,30938.22,30938.22,USD,80.41,"Nov 15, 2018"\n\
Sales,Mo Barrick,Invoice,currency,James Guy,55297.16,55297.16,USD,131.47,"Dec 17, 2018"\n\
IT,Don Frampton,Invoice,currency,Brian Jantzen,100178.36,100178.36,USD,20.01,"Dec 3, 2018"\n\
IT,Don Frampton,Invoice,currency,Kenn Moffitt,89237.6,89237.6,USD,27.04,"Nov 20, 2018"\n\
IT,Don Frampton,Invoice,currency,Ian Horwich,124233.18,124233.18,USD,145.17,"Dec 16, 2018"\n\
G&A,Chris McCoy,Invoice,currency,Jon Nickokay,128380.99,128380.99,USD,77.48,"Nov 29, 2018"\n\
Finance,Stacy Hoolahan,Leave,Days,Chris McCoy,4,4,N/A,1.22,"Nov 23, 2018"\n\
Finance,Stacy Hoolahan,Leave,Days,James Ward,12,12,N/A,80.39,"Dec 12, 2018"\n\
Sales,Mo Barrick,Leave,Days,Jesse Winding,13,13,N/A,3.6,"Nov 10, 2018"\n\
Sales,Mo Barrick,Leave,Days,Don Frampton,8,8,N/A,12.16,"Nov 2, 2018"\n\
Sales,Mo Barrick,Leave,Days,Joyana Rhone,14,14,N/A,22.45,"Dec 1, 2018"\n\
Sales,Mo Barrick,Leave,Days,Sandra Garsele,15,15,N/A,29.03,"Nov 6, 2018"\n\
Sales,Mo Barrick,Leave,Days,Susan Vale tine,4,4,N/A,36.24,"Nov 3, 2018"\n\
Sales,Mo Barrick,Leave,Days,Bruno Pereira,11,11,N/A,144.02,"Oct 28, 2018"\n\
IT,Don Frampton,Leave,Days,Dana Wyttenbachblue Diamond Ministrip,11,11,N/A,32.01,"Oct 22, 2018"\n\
IT,Don Frampton,Leave,Days,Amy Lam,5,5,N/A,79.11,"Oct 23, 2018"\n\
IT,Don Frampton,Leave,Days,Glen Seamster,10,10,N/A,88.07,"Dec 9, 2018"\n\
IT,Don Frampton,Leave,Days,Cheli Rosas,16,16,N/A,100.46,"Oct 25, 2018"\n\
IT,Don Frampton,Leave,Days,Bill Swavely,7,7,N/A,104.01,"Nov 10, 2018"\n\
IT,Don Frampton,Leave,Days,Mariam Mazhar,15,15,N/A,104.39,"Dec 16, 2018"\n\
IT,Don Frampton,Leave,Days,David Brim,8,8,N/A,110.54,"Oct 31, 2018"\n\
IT,Don Frampton,Leave,Days,Rentia Fay Henry,8,8,N/A,112.09,"Nov 28, 2018"\n\
IT,Don Frampton,Leave,Days,Mark Benjamin,11,11,N/A,113.18,"Dec 4, 2018"\n\
IT,Don Frampton,Leave,Days,MALEISA RAY,16,16,N/A,116.6,"Nov 26, 2018"\n\
IT,Don Frampton,Leave,Days,Richard Payton,7,7,N/A,121.04,"Dec 5, 2018"\n\
IT,Don Frampton,Leave,Days,Chris McCoy,10,10,N/A,123.27,"Dec 3, 2018"\n\
IT,Don Frampton,Leave,Days,Doctor Aal-Anubia,11,11,N/A,154.2,"Nov 14, 2018"\n\
G&A,Chris McCoy,Leave,Days,Joaquim Dsouza,9,9,N/A,12.11,"Dec 1, 2018"\n\
G&A,Chris McCoy,Leave,Days,Philimina Lardner,16,16,N/A,28.28,"Oct 26, 2018"\n\
G&A,Chris McCoy,Leave,Days,Rodollfo Cabrera,3,3,N/A,39.07,"Nov 27, 2018"\n\
G&A,Chris McCoy,Leave,Days,Cedric Hunter,2,2,N/A,43.44,"Dec 15, 2018"\n\
G&A,Chris McCoy,Leave,Days,Jean Guerrier,16,16,N/A,45.46,"Dec 13, 2018"\n\
G&A,Chris McCoy,Leave,Days,Sharon Vernon,12,12,N/A,57.07,"Dec 16, 2018"\n\
G&A,Chris McCoy,Leave,Days,Marie Smith,10,10,N/A,72.17,"Nov 9, 2018"\n\
G&A,Chris McCoy,Leave,Days,Nick McCaffery,10,10,N/A,90.25,"Oct 23, 2018"\n\
G&A,Chris McCoy,Leave,Days,Sherri Hoffman,4,4,N/A,94.41,"Dec 7, 2018"\n\
G&A,Chris McCoy,Leave,Days,Howard Kelly,1,1,N/A,100.37,"Nov 9, 2018"\n\
G&A,Chris McCoy,Leave,Days,Alberto Quintero,11,11,N/A,109.46,"Dec 11, 2018"\n\
G&A,Chris McCoy,Leave,Days,Sarah Carr,6,6,N/A,115.49,"Dec 18, 2018"\n\
G&A,Chris McCoy,Leave,Days,David Franzen,8,8,N/A,117.24,"Dec 3, 2018"\n\
G&A,Chris McCoy,Leave,Days,Bev Lovely,11,11,N/A,120.33,"Dec 12, 2018"\n\
G&A,Chris McCoy,Leave,Days,Douglas Doucette,16,16,N/A,120.57,"Dec 7, 2018"\n\
G&A,Chris McCoy,Leave,Days,Michele Tortorici,11,11,N/A,128.26,"Dec 14, 2018"\n\
G&A,Chris McCoy,Leave,Days,Angel Quirzones,15,15,N/A,132.47,"Nov 23, 2018"\n\
G&A,Chris McCoy,Leave,Days,Mo Barrick,15,15,N/A,154.16,"Nov 20, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Chris Saxon,79875.21,79875.21,USD,4.07,"Dec 16, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,FREQC Tester,158256.21,158256.21,USD,6.09,"Nov 20, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Mark Killeen,860.89,860.89,USD,9.1,"Nov 18, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Mark Davies,219316.14,219316.14,USD,11.25,"Nov 7, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Merwan Hade,243204.16,243204.16,USD,23.04,"Oct 23, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Mengyu Wu,158147.58,158147.58,USD,35.21,"Oct 22, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Mo Jalloh,215643.02,215643.02,USD,48.44,"Dec 19, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Anvil Dsouza,165620.98,165620.98,USD,50.52,"Nov 27, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Odesen Naidoo,15520.47,15520.47,USD,51.19,"Nov 29, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Julian Morelli,28491.96,28491.96,USD,52.25,"Nov 24, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Reto Wettstein,146398.98,146398.98,USD,52.46,"Dec 3, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Hector Gallo De Diego,200419.15,200419.15,USD,55.42,"Nov 14, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Sharansh Srivastava,263631.13,263631.13,USD,61.14,"Dec 16, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,472030.27,472030.27,USD,65.03,"Nov 6, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Germano Bertoldo,99097.11,99097.11,USD,70.12,"Oct 29, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Kumaresan MS,45194.44,45194.44,USD,74.09,"Nov 15, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Fernando Tezanos Pinto,189659.04,189659.04,USD,77.17,"Nov 13, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Lenny Advies,92327.36,92327.36,USD,80.59,"Dec 6, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Kuok Han Yong,146101.23,146101.23,USD,87.38,"Nov 14, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Danny Stamp,232022.28,232022.28,USD,89.11,"Dec 7, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Barbara Sonders,93810.32,93810.32,USD,92.34,"Nov 6, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,47372.02,47372.02,USD,97.21,"Nov 21, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Mogens B. Lassen,20959.28,20959.28,USD,100.35,"Oct 24, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Danny Melein,87458.76,87458.76,USD,103.43,"Nov 2, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Salvador Espino,180350.75,180350.75,USD,115.29,"Oct 29, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,132966.74,132966.74,USD,116.11,"Oct 27, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,96810.51,96810.51,USD,116.45,"Dec 12, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,TopApp Regression1,109088.45,109088.45,USD,119.05,"Oct 31, 2018"\n\
Finance,Chris McCoy,Purchase,currency,Willem Geyer,357392.06,357392.06,USD,126.3,"Nov 5, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Mary Bowler,168423.24,168423.24,USD,130.4,"Dec 12, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Mitja Lavri,49027,49027,USD,137.35,"Dec 17, 2018"\n\
Finance,Stacy Hoolahan,Purchase,currency,Juan Perena,251263.58,251263.58,USD,148.21,"Dec 12, 2018"\n\
Sales,Mo Barrick,Purchase,currency,Ramy Gabra,105206.25,105206.25,USD,6.14,"Oct 30, 2018"\n\
Sales,Mo Barrick,Purchase,currency,Marie Petion,159674.89,159674.89,USD,9.56,"Nov 8, 2018"\n\
Sales,Mo Barrick,Purchase,currency,Steve Lyles,21595.31,21595.31,USD,80.42,"Nov 12, 2018"\n\
Finance,Mo Barrick,Purchase,currency,Ignacio Diaz Alvarez,266475.84,266475.84,USD,98.48,"Nov 23, 2018"\n\
IT,Don Frampton,Purchase,currency,Johanna Cuevas,261467.21,261467.21,USD,3.24,"Nov 29, 2018"\n\
IT,Don Frampton,Purchase,currency,Kami Hunter,191744.57,191744.57,USD,22.07,"Oct 27, 2018"\n\
IT,Don Frampton,Purchase,currency,Chris McCoy,182783.8,182783.8,USD,31.59,"Nov 13, 2018"\n\
IT,Don Frampton,Purchase,currency,Jose Gomez,19766.41,19766.41,USD,39.41,"Nov 15, 2018"\n\
IT,Don Frampton,Purchase,currency,Chris McCoy,35380.74,35380.74,USD,65.21,"Nov 1, 2018"\n\
IT,Don Frampton,Purchase,currency,Russ Daniels,233190.49,233190.49,USD,68.34,"Oct 21, 2018"\n\
IT,Don Frampton,Purchase,currency,RYAN Lowe,111179.83,111179.83,USD,104.48,"Oct 23, 2018"\n\
IT,Don Frampton,Purchase,currency,Leslie Neal,80304.11,80304.11,USD,111.59,"Nov 10, 2018"\n\
IT,Don Frampton,Purchase,currency,Mohit Gupta,265542.9,265542.9,USD,115.03,"Dec 9, 2018"\n\
IT,Don Frampton,Purchase,currency,Ashley Kelly,130536.39,130536.39,USD,120.04,"Nov 9, 2018"\n\
IT,Don Frampton,Purchase,currency,Victor Corral,156356.97,156356.97,USD,141.17,"Dec 13, 2018"\n\
IT,Don Frampton,Purchase,currency,JoE Spearing,64873.96,64873.96,USD,143.35,"Dec 10, 2018"\n\
IT,Don Frampton,Purchase,currency,EMANUEL Gary,49759.17,49759.17,USD,147.55,"Nov 7, 2018"\n\
IT,Don Frampton,Purchase,currency,Chris McCoy,204975.94,204975.94,USD,151.28,"Nov 13, 2018"\n\
IT,Don Frampton,Purchase,currency,Muiz Murad,173187.79,173187.79,USD,155,"Nov 17, 2018"\n\
IT,Don Frampton,Purchase,currency,Salvador Espino,130547.09,130547.09,USD,157.18,"Dec 11, 2018"\n\
IT,Don Frampton,Purchase,currency,Graham Wilkinson,3063.72,3063.72,USD,163.38,"Dec 2, 2018"\n\
IT,Don Frampton,Purchase,currency,Miguel Ortiz,201847.75,201847.75,USD,164.42,"Nov 21, 2018"\n\
G&A,Chris McCoy,Purchase,currency,Evelyn Espinal,86659.03,86659.03,USD,14.18,"Oct 25, 2018"\n\
G&A,Chris McCoy,Purchase,currency,Evelyn Torres,89211.08,89211.08,USD,28.12,"Oct 30, 2018"\n\
G&A,Chris McCoy,Purchase,currency,Dennis Frimpong,7247.8,7247.8,USD,57.28,"Oct 30, 2018"\n\
G&A,Chris McCoy,Purchase,currency,Tom Tatarczuk,252423.98,252423.98,USD,60.17,"Dec 6, 2018"\n\
G&A,Chris McCoy,Purchase,currency,Sunny Davis,37698.2,37698.2,USD,76.15,"Nov 14, 2018"\n\
';

var mainUnits;
var state = {
  freshDataLoaded: true, // being set every time fresh data is loaded
  legendToggle: false,
  tableToggleState: false,
  drawOverviewListener: null,
  firstTimeDrawDetailedView: true,
  // noInteraction: true, // was any widget interacted? used to automate first bubble open if nothing has happened

  GREEN_COLOR: "rgb(88,141,26)",
  RED_COLOR: "rgb(234,49,49)",

  ZOOM_LEVELS: 3,
  MAX_APPROVERS: 10, // chunk size of how many approvers to show in an open flower

  BY_VALUE: 1, // approvers sorted by value / or anomaly view by value
  BY_COUNT: 2, // approvers sorted by count of approvals

  BY_TIME: 5, // anomaly view by time

  common: {}, // common functions
  dataFunc: {}, // data manipulation functions
  criteria: {},
};

state.dataFunc.calculateTotalValues = function(originalData) {
  originalData.forEach(function(request) {
    var stats = request.approvers.reduce(function(c, approver, approverIndex) {
      approver.approverIndex = approverIndex; // sticky index to sustain sorting
      // [count, value, waitTime]
      var reduced = approver.approvals.reduce(function(c, approval) {
        approval.approverIndex = approverIndex;
          return [c[0] + 1, c[1] + approval.value, c[2] + approval.waitTime];
        }, [0, 0, 0]);

      approver.average = reduced[0] > 0 ? reduced[2]/reduced[0] : 0;
      approver.count = reduced[0];
      approver.value = reduced[1];

      return [c[0] + reduced[0], c[1] + reduced[1], c[2] + reduced[2]];
    }, [0, 0, 0]);

    request.approvers = request.approvers.sort(function(a,b) {
      if (a.approverName > b.approverName) return -1;
      if (a.approverName < b.approverName) return 1;
      return 0;
    });

    request.approversByValue = request.approvers.slice(0).sort(function(a,b) {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    });
    request.firstByValueChunkCount = request.approversByValue.slice(0,Math.min(request.approversByValue.length, state.MAX_APPROVERS))
      .reduce(function(c, approver) {
        return c + approver.approvals.length;
      }, 0);

    request.approversByCount = request.approvers.slice(0).sort(function(a,b) {
      if (a.count < b.count) return 1;
      if (a.count > b.count) return -1;
      return 0;
    });
    request.firstByCountChunkCount = request.approversByCount.slice(0,Math.min(request.approversByCount.length, state.MAX_APPROVERS))
      .reduce(function(c, approver) {
        return c + approver.approvals.length;
      }, 0);

    request.startApproverIndex = 0; // the current index of approver to show

    request.totalCount = stats[0];
    request.visibleValue = request.totalValue = stats[1];
    request.totalWaitTime = stats[2];
    request.unitLabel = request.request + ". " + request.totalCount + " requests. " + state.common.waitToText(request.totalWaitTime/request.totalCount) + " Average delay.";

    request.maxValue = d3.max(state.common.filterNonHidden(request.approvers).map(function(v) {
      return d3.max(v.approvals, function(a) {return a.value})
    }));
    request.maxWait = d3.max(request.approvers.map(function(v) {
      return d3.max(v.approvals, function(a) {return a.waitTime})
    }));
    request.minWait = d3.min(request.approvers.map(function(v) {
      return d3.min(v.approvals, function(a) {return a.waitTime})
    }));

    request.selected = false; // for cases when a reset is required
    delete request.fx;
    delete request.fy;

  });

};

state.dataFunc.filterDataByCriteria = function(criteria) {
  // criteria {totalValueMin, totalValueMax, waitTimeMin, waitTimeMax, typesFilter}

  // hide approvals that are outside wait time range
  mainUnits.forEach(function(unit) {
    unit.hidden = (criteria.typesFilter.indexOf(unit.request) < 0);
    unit.visibleValue = 0;
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
          if (!approval.hidden && criteria.timeRangeMin !== null) approval.hidden = !(approval.time >= criteria.timeRangeMin && approval.time <= criteria.timeRangeMax);
        }
      });
      approver.hidden = approver.approvals.every(function(t) {return t.hidden});
      if (!approver.hidden) unit.visibleValue +=
        approver.approvals.reduce((sum, a) => a.hidden ? 0 : sum + a.value, 0);
    })
  });

  // hide irrelevant approvals types
  mainUnits.forEach(function(unit) {
    unit.hidden = (criteria.typesFilter.indexOf(unit.request) < 0);
    if (!unit.hidden) {
      unit.hidden = unit.approvers.every(function(t) {return t.hidden});
    }
    if (unit.hidden) unit.visibleValue = 0;
  });

  return mainUnits;
};

state.dataFunc.zoomLevel = function(request, level) {
  level = Math.floor(level);
  if (!level) {
    // restore non-zoom classes
    window.dispatchEvent(new CustomEvent("setNonZoomState", {detail: {keepWidget: true}}));
    return;
  }

  const levelGranularity = [1, 24, 24*7, 24*30]; // hours, days, weeks, months (30 days actually)
  var upperRoundedLimit = Math.ceil(state.maxWait / levelGranularity[level]) * levelGranularity[level];
  var buckets = upperRoundedLimit / levelGranularity[level];

  // level = state.ZOOM_LEVELS +1 - level;  // for convenience

  var bucketing = d3.scaleLinear()
    .domain([0, upperRoundedLimit])
    .range([0, buckets]);

  request.approvers.forEach((approver, approverIndex) => {
    var data = [];

    approver.approvals.forEach(approval => {
      var bucketedIndex = Math.min(Math.floor(bucketing(approval.waitTime)), buckets-1);
      if (!data[bucketedIndex]) data[bucketedIndex] = {waitTime: 0, value: 0, count: 0, hidden: 0};
      data[bucketedIndex].waitTime += approval.waitTime;
      data[bucketedIndex].value += approval.value;
      data[bucketedIndex].hidden += approval.hidden ? 1 : 0;
      data[bucketedIndex].count ++;
      approval.zoomBucket = "a" + approverIndex + "b" + bucketedIndex;
      data[bucketedIndex].zoomBucket = "a" + approverIndex + "b" + bucketedIndex; // to keep track of which approvals belongs to each bucket
    });

    data = data.filter(t => t !== undefined);
    data.forEach(a => {
      a.waitTime = a.waitTime / a.count;
      a.presentation = request.presentation;
      a.hidden = a.hidden / a.count > 0.5; // if majority is hidden then we consider it hidden as well
      a.submitter = a.count + (a.count == 1 ? " request" : " requests");
    });
    approver.zoomApprovals = data;
  });

  request.zoomMaxValue = d3.max(state.common.filterNonHidden(request.approvers).map(function(v) {
    return d3.max(v.zoomApprovals, function(a) {return a.value})
  }));

};

state.dataFunc.sigma = function(request) {
  if (request.totalCount <= 0) {
    console.error("sigma: totalCount error " + request.totalCount);
    return;
  }
  request.meanValue = request.totalValue/request.totalCount;

  var sumSqrs = request.approvers.reduce(function(c, approver) {
    var reduced = approver.approvals.reduce(function(c, approval) {
      return c + Math.pow(approval.value - request.meanValue, 2);
    }, 0);

    return c + reduced;
  }, 0);

  request.sigma = Math.sqrt(sumSqrs/request.totalCount);
  request.maxAbsoluteDev = 0;
  request.above3sigma = 0;
  var sigmaX3 = 3*request.sigma;

  request.approvers.forEach((approver, approverIndex) => {

    approver.approvals.forEach(approval => {

      approval.sigmaDev = approval.value - request.meanValue;
      if (Math.abs(approval.sigmaDev) > request.maxAbsoluteDev) {
        request.maxAbsoluteDev = Math.abs(approval.sigmaDev);
      }
      if (Math.abs(approval.sigmaDev) > sigmaX3) {
        request.above3sigma ++;
      }
    });
  });

};

