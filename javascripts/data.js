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
approvalId,approverDept,approver,request,presentation,submitter,value,reportedValue,currency,waitTime,time,itemCategory,itemIndex,itemValue,itemCurrency,itemValueUSD\n\
ID1,Finance,Stacy Hoolahan,Change,Changes,Luke DeCoste,1,1,N/A,17.35,9-Nov-18,General,1,1,N/A,1\n\
ID2,Finance,Stacy Hoolahan,Change,Changes,Thando Nkosi,1,1,N/A,45.29,9-Dec-18,General,1,1,N/A,1\n\
ID3,Finance,Stacy Hoolahan,Change,Changes,Fei Meng ZHENG,1,1,N/A,89.05,26-Oct-18,General,1,1,N/A,1\n\
ID4,G&A,Chris McCoy,Change,Changes,Jon Estrada,1,1,N/A,25.46,4-Nov-18,General,1,1,N/A,1\n\
ID5,Finance,Stacy Hoolahan,Expense,currency,Kenn Moffitt,372.26,372.26,USD,36.04,12-Dec-18,General,1,372.26,USD,372.26\n\
ID6,Finance,Stacy Hoolahan,Expense,currency,Patrick VonHorn,2191.88,2191.88,USD,46.27,28-Nov-18,General,1,2191.88,USD,2191.88\n\
ID7,Finance,Stacy Hoolahan,Expense,currency,Nancy Mitchell,896.45,896.45,USD,125.01,20-Nov-18,General,1,896.45,USD,896.45\n\
ID8,Finance,Stacy Hoolahan,Expense,currency,Anand Andrew Bolor,1323.76,1323.76,USD,140.42,28-Oct-18,General,1,1323.76,USD,1323.76\n\
ID9,Finance,Stacy Hoolahan,Expense,currency,Selma Trenton,150.66,150.66,USD,143.51,28-Oct-18,General,1,150.66,USD,150.66\n\
ID10,IT,Don Frampton,Expense,currency,patrick furmage,3436.22,3436.22,USD,11.6,3-Dec-18,General 02,1,3436.22,USD,3436.22\n\
ID11,IT,Don Frampton,Expense,currency,Jeremy Huddleston,1942.3,1942.3,USD,61.02,30-Nov-18,General 02,1,1942.3,USD,1942.3\n\
ID12,IT,Don Frampton,Expense,currency,Gaurav Pawar,1964.8,1964.8,USD,69.52,20-Nov-18,General 02,1,1964.8,USD,1964.8\n\
ID13,IT,Don Frampton,Expense,currency,Sonny Becca,2388.13,2388.13,USD,83.05,9-Dec-18,General 02,1,2388.13,USD,2388.13\n\
ID14,G&A,Chris McCoy,Expense,currency,Michael Harder,1077.44,1077.44,USD,49.11,5-Nov-18,General 02,1,1077.44,USD,1077.44\n\
ID15,G&A,Chris McCoy,Expense,currency,Tim Gilday,185.71,185.71,USD,91,7-Dec-18,General 02,1,185.71,USD,185.71\n\
ID16,Finance,Stacy Hoolahan,Invoice,currency,Jose Houed,108629.94,108629.94,USD,57.49,13-Dec-18,General 02,1,108629.94,USD,108629.94\n\
ID17,Finance,Stacy Hoolahan,Invoice,currency,James Guy,95444.59,95444.59,USD,110.27,15-Dec-18,General 02,1,95444.59,USD,95444.59\n\
ID18,Finance,Stacy Hoolahan,Invoice,currency,Tatiana Cristea,76904.1,76904.1,USD,113.24,10-Nov-18,General 02,1,76904.1,USD,76904.1\n\
ID19,Finance,Stacy Hoolahan,Invoice,currency,Edgar Solberg,129952.12,129952.12,USD,157.53,19-Nov-18,General 03,1,129952.12,USD,129952.12\n\
ID20,Finance,Stacy Hoolahan,Invoice,currency,Seunghyun Son,103036.76,103036.76,USD,163.38,1-Dec-18,General 03,1,103036.76,USD,103036.76\n\
ID21,Sales,Mo Barrick,Invoice,currency,Joe Reeves,36969.28,36969.28,USD,48.46,18-Dec-18,General 03,1,36969.28,USD,36969.28\n\
ID22,Sales,Mo Barrick,Invoice,currency,Sonny Fian,30938.22,30938.22,USD,80.41,15-Nov-18,General 03,1,30938.22,USD,30938.22\n\
ID23,Sales,Mo Barrick,Invoice,currency,James Guy,55297.16,55297.16,USD,131.47,17-Dec-18,General 03,1,55297.16,USD,55297.16\n\
ID24,IT,Don Frampton,Invoice,currency,Brian Jantzen,100178.36,100178.36,USD,20.01,3-Dec-18,General 03,1,100178.36,USD,100178.36\n\
ID25,IT,Don Frampton,Invoice,currency,Kenn Moffitt,89237.6,89237.6,USD,27.04,20-Nov-18,General 03,1,89237.6,USD,89237.6\n\
ID26,IT,Don Frampton,Invoice,currency,Ian Horwich,124233.18,124233.18,USD,145.17,16-Dec-18,General 03,1,124233.18,USD,124233.18\n\
ID27,G&A,Chris McCoy,Invoice,currency,Jon Nickokay,128380.99,128380.99,USD,77.48,29-Nov-18,General 03,1,128380.99,USD,128380.99\n\
ID28,Finance,Stacy Hoolahan,Leave,Days,Chris McCoy,4,4,N/A,1.22,23-Nov-18,General 03,1,4,N/A,4\n\
ID29,Finance,Stacy Hoolahan,Leave,Days,James Ward,12,12,N/A,80.39,12-Dec-18,General 03,1,12,N/A,12\n\
ID30,Sales,Mo Barrick,Leave,Days,Jesse Winding,13,13,N/A,3.6,10-Nov-18,General 04,1,13,N/A,13\n\
ID31,Sales,Mo Barrick,Leave,Days,Don Frampton,8,8,N/A,12.16,2-Nov-18,General 04,1,8,N/A,8\n\
ID32,Sales,Mo Barrick,Leave,Days,Joyana Rhone,14,14,N/A,22.45,1-Dec-18,General 04,1,14,N/A,14\n\
ID33,Sales,Mo Barrick,Leave,Days,Sandra Garsele,15,15,N/A,29.03,6-Nov-18,General 04,1,15,N/A,15\n\
ID34,Sales,Mo Barrick,Leave,Days,Susan Vale tine,4,4,N/A,36.24,3-Nov-18,General 04,1,4,N/A,4\n\
ID35,Sales,Mo Barrick,Leave,Days,Bruno Pereira,11,11,N/A,144.02,28-Oct-18,General 04,1,11,N/A,11\n\
ID36,IT,Don Frampton,Leave,Days,Dana Wyttenbachblue Diamond Ministrip,11,11,N/A,32.01,22-Oct-18,General 04,1,11,N/A,11\n\
ID37,IT,Don Frampton,Leave,Days,Amy Lam,5,5,N/A,79.11,23-Oct-18,General 04,1,5,N/A,5\n\
ID38,IT,Don Frampton,Leave,Days,Glen Seamster,10,10,N/A,88.07,9-Dec-18,General 04,1,10,N/A,10\n\
ID39,IT,Don Frampton,Leave,Days,Cheli Rosas,16,16,N/A,100.46,25-Oct-18,General 04,1,16,N/A,16\n\
ID40,IT,Don Frampton,Leave,Days,Bill Swavely,7,7,N/A,104.01,10-Nov-18,General 04,1,7,N/A,7\n\
ID41,IT,Don Frampton,Leave,Days,Mariam Mazhar,15,15,N/A,104.39,16-Dec-18,General 05,1,15,N/A,15\n\
ID42,IT,Don Frampton,Leave,Days,David Brim,8,8,N/A,110.54,31-Oct-18,General 05,1,8,N/A,8\n\
ID43,IT,Don Frampton,Leave,Days,Rentia Fay Henry,8,8,N/A,112.09,28-Nov-18,General 05,1,8,N/A,8\n\
ID44,IT,Don Frampton,Leave,Days,Mark Benjamin,11,11,N/A,113.18,4-Dec-18,General 05,1,11,N/A,11\n\
ID45,IT,Don Frampton,Leave,Days,MALEISA RAY,16,16,N/A,116.6,26-Nov-18,General 05,1,16,N/A,16\n\
ID46,IT,Don Frampton,Leave,Days,Richard Payton,7,7,N/A,121.04,5-Dec-18,General 05,1,7,N/A,7\n\
ID47,IT,Don Frampton,Leave,Days,Chris McCoy,10,10,N/A,123.27,3-Dec-18,General 05,1,10,N/A,10\n\
ID48,IT,Don Frampton,Leave,Days,Doctor Aal-Anubia,11,11,N/A,154.2,14-Nov-18,General 05,1,11,N/A,11\n\
ID49,G&A,Chris McCoy,Leave,Days,Joaquim Dsouza,9,9,N/A,12.11,1-Dec-18,General 05,1,9,N/A,9\n\
ID50,G&A,Chris McCoy,Leave,Days,Philimina Lardner,16,16,N/A,28.28,26-Oct-18,General 05,1,16,N/A,16\n\
ID51,G&A,Chris McCoy,Leave,Days,Rodollfo Cabrera,3,3,N/A,39.07,27-Nov-18,General 05,1,3,N/A,3\n\
ID52,G&A,Chris McCoy,Leave,Days,Cedric Hunter,2,2,N/A,43.44,15-Dec-18,General 05,1,2,N/A,2\n\
ID53,G&A,Chris McCoy,Leave,Days,Jean Guerrier,16,16,N/A,45.46,13-Dec-18,General 05,1,16,N/A,16\n\
ID54,G&A,Chris McCoy,Leave,Days,Sharon Vernon,12,12,N/A,57.07,16-Dec-18,General 05,1,12,N/A,12\n\
ID55,G&A,Chris McCoy,Leave,Days,Marie Smith,10,10,N/A,72.17,9-Nov-18,General 06,1,10,N/A,10\n\
ID56,G&A,Chris McCoy,Leave,Days,Nick McCaffery,10,10,N/A,90.25,23-Oct-18,General 06,1,10,N/A,10\n\
ID57,G&A,Chris McCoy,Leave,Days,Sherri Hoffman,4,4,N/A,94.41,7-Dec-18,General 06,1,4,N/A,4\n\
ID58,G&A,Chris McCoy,Leave,Days,Howard Kelly,1,1,N/A,100.37,9-Nov-18,General 06,1,1,N/A,1\n\
ID59,G&A,Chris McCoy,Leave,Days,Alberto Quintero,11,11,N/A,109.46,11-Dec-18,General 06,1,11,N/A,11\n\
ID60,G&A,Chris McCoy,Leave,Days,Sarah Carr,6,6,N/A,115.49,18-Dec-18,General 06,1,6,N/A,6\n\
ID61,G&A,Chris McCoy,Leave,Days,David Franzen,8,8,N/A,117.24,3-Dec-18,General 06,1,8,N/A,8\n\
ID62,G&A,Chris McCoy,Leave,Days,Bev Lovely,11,11,N/A,120.33,12-Dec-18,General 06,1,11,N/A,11\n\
ID63,G&A,Chris McCoy,Leave,Days,Douglas Doucette,16,16,N/A,120.57,7-Dec-18,General 06,1,16,N/A,16\n\
ID64,G&A,Chris McCoy,Leave,Days,Michele Tortorici,11,11,N/A,128.26,14-Dec-18,General 06,1,11,N/A,11\n\
ID65,G&A,Chris McCoy,Leave,Days,Angel Quirzones,15,15,N/A,132.47,23-Nov-18,General 06,1,15,N/A,15\n\
ID66,G&A,Chris McCoy,Leave,Days,Mo Barrick,15,15,N/A,154.16,20-Nov-18,General 06,1,15,N/A,15\n\
ID67,Finance,Stacy Hoolahan,Purchase,currency,Chris Saxon,79875.21,79875.21,USD,4.07,16-Dec-18,General 07,1,79875.21,USD,79875.21\n\
ID68,Finance,Stacy Hoolahan,Purchase,currency,FREQC Tester,158256.21,158256.21,USD,6.09,20-Nov-18,General 07,1,158256.21,USD,158256.21\n\
ID69,Finance,Stacy Hoolahan,Purchase,currency,Mark Killeen,860.89,860.89,USD,9.1,18-Nov-18,General 07,1,860.89,USD,860.89\n\
ID70,Finance,Stacy Hoolahan,Purchase,currency,Mark Davies,219316.14,219316.14,USD,11.25,7-Nov-18,General 07,1,219316.14,USD,219316.14\n\
ID71,Finance,Stacy Hoolahan,Purchase,currency,Merwan Hade,243204.16,243204.16,USD,23.04,23-Oct-18,General 08,1,243204.16,USD,243204.16\n\
ID72,Finance,Stacy Hoolahan,Purchase,currency,Mengyu Wu,158147.58,158147.58,USD,35.21,22-Oct-18,General 08,1,158147.58,USD,158147.58\n\
ID73,Finance,Stacy Hoolahan,Purchase,currency,Mo Jalloh,215643.02,215643.02,USD,48.44,19-Dec-18,General 08,1,215643.02,USD,215643.02\n\
ID74,Finance,Stacy Hoolahan,Purchase,currency,Anvil Dsouza,165620.98,165620.98,USD,50.52,27-Nov-18,General 08,1,165620.98,USD,165620.98\n\
ID75,Finance,Stacy Hoolahan,Purchase,currency,Odesen Naidoo,15520.47,15520.47,USD,51.19,29-Nov-18,General 08,1,15520.47,USD,15520.47\n\
ID76,Finance,Stacy Hoolahan,Purchase,currency,Julian Morelli,28491.96,28491.96,USD,52.25,24-Nov-18,General 08,1,28491.96,USD,28491.96\n\
ID77,Finance,Stacy Hoolahan,Purchase,currency,Reto Wettstein,146398.98,146398.98,USD,52.46,3-Dec-18,General 08,1,146398.98,USD,146398.98\n\
ID78,Finance,Stacy Hoolahan,Purchase,currency,Hector Gallo De Diego,200419.15,200419.15,USD,55.42,14-Nov-18,General 09,1,200419.15,USD,200419.15\n\
ID79,Finance,Stacy Hoolahan,Purchase,currency,Sharansh Srivastava,263631.13,263631.13,USD,61.14,16-Dec-18,General 09,1,263631.13,USD,263631.13\n\
ID80,Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,472030.27,472030.27,USD,65.03,6-Nov-18,General 09,1,472030.27,USD,472030.27\n\
ID81,Finance,Stacy Hoolahan,Purchase,currency,Germano Bertoldo,99097.11,99097.11,USD,70.12,29-Oct-18,General 09,1,99097.11,USD,99097.11\n\
ID82,Finance,Stacy Hoolahan,Purchase,currency,Kumaresan MS,45194.44,45194.44,USD,74.09,15-Nov-18,General 09,1,45194.44,USD,45194.44\n\
ID83,Finance,Stacy Hoolahan,Purchase,currency,Fernando Tezanos Pinto,189659.04,189659.04,USD,77.17,13-Nov-18,General 09,1,189659.04,USD,189659.04\n\
ID84,Finance,Stacy Hoolahan,Purchase,currency,Lenny Advies,92327.36,92327.36,USD,80.59,6-Dec-18,General 09,1,92327.36,USD,92327.36\n\
ID85,Finance,Stacy Hoolahan,Purchase,currency,Kuok Han Yong,146101.23,146101.23,USD,87.38,14-Nov-18,General 09,1,146101.23,USD,146101.23\n\
ID86,Finance,Stacy Hoolahan,Purchase,currency,Danny Stamp,232022.28,232022.28,USD,89.11,7-Dec-18,General 09,1,232022.28,USD,232022.28\n\
ID87,Finance,Stacy Hoolahan,Purchase,currency,Barbara Sonders,93810.32,93810.32,USD,92.34,6-Nov-18,General 10,1,93810.32,USD,93810.32\n\
ID88,Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,47372.02,47372.02,USD,97.21,21-Nov-18,General 10,1,47372.02,USD,47372.02\n\
ID89,Finance,Stacy Hoolahan,Purchase,currency,Mogens B. Lassen,20959.28,20959.28,USD,100.35,24-Oct-18,General 10,1,20959.28,USD,20959.28\n\
ID90,Finance,Stacy Hoolahan,Purchase,currency,Danny Melein,87458.76,87458.76,USD,103.43,2-Nov-18,General 10,1,87458.76,USD,87458.76\n\
ID91,Finance,Stacy Hoolahan,Purchase,currency,Salvador Espino,180350.75,180350.75,USD,115.29,29-Oct-18,General 10,1,180350.75,USD,180350.75\n\
ID92,Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,132966.74,132966.74,USD,116.11,27-Oct-18,General 10,1,132966.74,USD,132966.74\n\
ID93,Finance,Stacy Hoolahan,Purchase,currency,Chris McCoy,96810.51,96810.51,USD,116.45,12-Dec-18,General 10,1,96810.51,USD,96810.51\n\
ID94,Finance,Stacy Hoolahan,Purchase,currency,TopApp Regression1,109088.45,109088.45,USD,119.05,31-Oct-18,General 10,1,109088.45,USD,109088.45\n\
ID95,Finance,Stacy Hoolahan,Purchase,currency,Mary Bowler,168423.24,168423.24,USD,130.4,12-Dec-18,General 10,1,168423.24,USD,168423.24\n\
ID96,Finance,Stacy Hoolahan,Purchase,currency,Mitja Lavri,49027,49027,USD,137.35,17-Dec-18,General 10,1,49027,USD,49027\n\
ID97,Finance,Stacy Hoolahan,Purchase,currency,Juan Perena,251263.58,251263.58,USD,148.21,12-Dec-18,General 10,1,251263.58,USD,251263.58\n\
ID98,Sales,Mo Barrick,Purchase,currency,Ramy Gabra,105206.25,105206.25,USD,6.14,30-Oct-18,General 10,1,105206.25,USD,105206.25\n\
ID99,Sales,Mo Barrick,Purchase,currency,Marie Petion,159674.89,159674.89,USD,9.56,8-Nov-18,General 10,1,159674.89,USD,159674.89\n\
ID100,Sales,Mo Barrick,Purchase,currency,Steve Lyles,21595.31,21595.31,USD,80.42,12-Nov-18,General 10,1,21595.31,USD,21595.31\n\
ID101,Finance,Mo Barrick,Purchase,currency,Ignacio Diaz Alvarez,266475.84,266475.84,USD,98.48,23-Nov-18,General 10,1,266475.84,USD,266475.84\n\
ID102,IT,Don Frampton,Purchase,currency,Johanna Cuevas,261467.21,261467.21,USD,3.24,29-Nov-18,General 10,1,261467.21,USD,261467.21\n\
ID103,IT,Don Frampton,Purchase,currency,Kami Hunter,191744.57,191744.57,USD,22.07,27-Oct-18,General 10,1,191744.57,USD,191744.57\n\
ID104,IT,Don Frampton,Purchase,currency,Chris McCoy,182783.8,182783.8,USD,31.59,13-Nov-18,General 10,1,182783.8,USD,182783.8\n\
ID105,IT,Don Frampton,Purchase,currency,Jose Gomez,19766.41,19766.41,USD,39.41,15-Nov-18,General 11,1,19766.41,USD,19766.41\n\
ID106,IT,Don Frampton,Purchase,currency,Chris McCoy,35380.74,35380.74,USD,65.21,1-Nov-18,General 11,1,35380.74,USD,35380.74\n\
ID107,IT,Don Frampton,Purchase,currency,Russ Daniels,233190.49,233190.49,USD,68.34,21-Oct-18,General 11,1,233190.49,USD,233190.49\n\
ID108,IT,Don Frampton,Purchase,currency,RYAN Lowe,111179.83,111179.83,USD,104.48,23-Oct-18,General 11,1,111179.83,USD,111179.83\n\
ID109,IT,Don Frampton,Purchase,currency,Leslie Neal,80304.11,80304.11,USD,111.59,10-Nov-18,General 11,1,80304.11,USD,80304.11\n\
ID110,IT,Don Frampton,Purchase,currency,Mohit Gupta,265542.9,265542.9,USD,115.03,9-Dec-18,General 11,1,265542.9,USD,265542.9\n\
ID111,IT,Don Frampton,Purchase,currency,Ashley Kelly,130536.39,130536.39,USD,120.04,9-Nov-18,General 11,1,130536.39,USD,130536.39\n\
ID112,IT,Don Frampton,Purchase,currency,Victor Corral,156356.97,156356.97,USD,141.17,13-Dec-18,General 12,1,156356.97,USD,156356.97\n\
ID113,IT,Don Frampton,Purchase,currency,JoE Spearing,64873.96,64873.96,USD,143.35,10-Dec-18,General 12,1,64873.96,USD,64873.96\n\
ID114,IT,Don Frampton,Purchase,currency,EMANUEL Gary,49759.17,49759.17,USD,147.55,7-Nov-18,General 12,1,49759.17,USD,49759.17\n\
ID115,IT,Don Frampton,Purchase,currency,Chris McCoy,204975.94,204975.94,USD,151.28,13-Nov-18,General 12,1,204975.94,USD,204975.94\n\
ID116,IT,Don Frampton,Purchase,currency,Muiz Murad,173187.79,173187.79,USD,155,17-Nov-18,General 12,1,173187.79,USD,173187.79\n\
ID117,IT,Don Frampton,Purchase,currency,Salvador Espino,130547.09,130547.09,USD,157.18,11-Dec-18,General 12,1,130547.09,USD,130547.09\n\
ID118,IT,Don Frampton,Purchase,currency,Graham Wilkinson,3063.72,3063.72,USD,163.38,2-Dec-18,General 12,1,3063.72,USD,3063.72\n\
ID119,IT,Don Frampton,Purchase,currency,Miguel Ortiz,201847.75,201847.75,USD,164.42,21-Nov-18,General 12,1,201847.75,USD,201847.75\n\
ID120,G&A,Chris McCoy,Purchase,currency,Evelyn Espinal,86659.03,86659.03,USD,14.18,25-Oct-18,General 12,1,86659.03,USD,86659.03\n\
ID121,G&A,Chris McCoy,Purchase,currency,Evelyn Torres,89211.08,89211.08,USD,28.12,30-Oct-18,General 12,1,89211.08,USD,89211.08\n\
ID122,G&A,Chris McCoy,Purchase,currency,Dennis Frimpong,7247.8,7247.8,USD,57.28,30-Oct-18,General 12,1,7247.8,USD,7247.8\n\
ID123,G&A,Chris McCoy,Purchase,currency,Tom Tatarczuk,252423.98,252423.98,USD,60.17,6-Dec-18,General 12,1,252423.98,USD,252423.98\n\
ID124,G&A,Chris McCoy,Purchase,currency,Sunny Davis,37698.2,37698.2,USD,76.15,14-Nov-18,General 12,1,37698.2,USD,37698.2\n\
ID125,Finance,Chris McCoy,Purchase,currency,Willem Geyer,357392.06,357392.06,USD,126.3,5-Nov-18,General,1,357392.06,USD,357392.06\n\
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
  MAX_CATEGORIES: 5, // chunk size of how many categories of line items in anomaly view

  SIGMA_CAP_LIMIT: 4,

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
    request.startCategoryIndex = 0; // the current index of category to show

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
  // sigma is computed based on the itemCategory field
  if (request.totalCount <= 0) {
    console.error("sigma: totalCount error " + request.totalCount);
    return;
  }

  var categories = {};

  // categorize and add up all line items of same category
  request.approvers.forEach(function(approver) {
    approver.approvals.forEach(function(approval) {
      approval.items.forEach(function(item) {
        item.parentApproval = approval;
        categories[item.itemCategory] = categories[item.itemCategory] || {sum: 0, count: 0, sumSqr: 0, items: []};
        categories[item.itemCategory].sum += item.itemValueUSD;
        categories[item.itemCategory].count ++;
        categories[item.itemCategory].items.push(item);
      });
    })
  });

  // calculate mean for each category
  Object.keys(categories).forEach(function(category) {
    // TODO remove after dev
    if (category == "Tolls, Taxis, Bus, Rail  ") {
      var zzz = 0;
    }
    categories[category].meanValue = categories[category].sum / (categories[category].count || 1);
  });

  // add up all squared deviations from mean
  request.approvers.forEach(function(approver) {
    approver.approvals.forEach(function(approval) {
      approval.items.forEach(function(item) {
        categories[item.itemCategory].sumSqr += Math.pow(item.itemValueUSD - categories[item.itemCategory].meanValue, 2);
      });
    })
  });

  // calculate std deviation for each category
  Object.keys(categories).forEach(function(category) {
    categories[category].sigma = Math.sqrt(categories[category].sumSqr/categories[category].count);
    // categories[category].sigmaX3 = categories[category].sigma * 3;
  });

  request.maxSigmaDev = 0;
  request.above3sigma = 0; // several line items from same approval might add to this number
  request.valueAbove3sigma = 0; // several line items from same approval might add to this number

  // compute sigma value for each line item
  request.approvers.forEach(function(approver) {
    approver.approvals.forEach(function(approval) {
      approval.sigmaDev = 0; // keeps the highest sigmaDev across all line items

      approval.items.forEach(function(item) {
        var category = categories[item.itemCategory];
        item.sigmaDev = Math.abs(item.itemValueUSD - category.meanValue)/(category.sigma || 1);

        if (item.sigmaDev > approval.sigmaDev) {
          approval.sigmaDev = item.sigmaDev;
          approval.maxItemCategory = item.itemCategory; // the most offending category
        }
        if (item.sigmaDev > request.maxSigmaDev) {
          request.maxSigmaDev = item.sigmaDev;
        }
        if (item.sigmaDev >= 3) {
          request.above3sigma ++;
          request.valueAbove3sigma += item.itemValueUSD;
        }
      });
    })
  });

  // plant category name
  Object.keys(categories).forEach(function(c) {categories[c].categoryName = c;});
  // sort categories alphabetically
  categories = Object.keys(categories).sort().map(function(c) {return categories[c]});
  request.categories = categories;

  console.log("# of categories " + request.categories.length);
  console.log("Categories: " + request.categories.map(c => c.categoryName));

};

state.dataFunc.anomaliesZoomLevel = function(request, level) {
  level = Math.floor(level);
  if (!level) {
    // restore non-zoom classes
    window.dispatchEvent(new CustomEvent("setNonZoomState", {detail: {}}));
    return;
  }

  const levelGranularity = [0, 0.1, 0.2, 0.5]; // rounding level based on sigma value
  var buckets = Math.ceil(state.SIGMA_CAP_LIMIT / levelGranularity[level]);
  // var buckets = upperRoundedLimit / levelGranularity[level];

  // level = state.ZOOM_LEVELS +1 - level;  // for convenience

/*
  var bucketing = d3.scaleLinear()
    .domain([0, upperRoundedLimit])
    .range([0, buckets]);
*/

  request.categories.forEach((category, categoryIndex) => {
    var data = [];

    category.items.forEach(item => {
      var bucketedIndex = Math.min(Math.round(item.sigmaDev/levelGranularity[level]), buckets-1);
      if (!data[bucketedIndex]) data[bucketedIndex] = {sigmaDev: 0, itemValueUSD: 0, count: 0};
      data[bucketedIndex].sigmaDev += item.sigmaDev;
      data[bucketedIndex].itemValueUSD += item.itemValueUSD;
      // data[bucketedIndex].hidden += item.hidden ? 1 : 0;
      data[bucketedIndex].count ++;
      // TODO review class markers
      item.anomalyZoomBucket = "a" + categoryIndex + "b" + bucketedIndex;
      data[bucketedIndex].anomalyZoomBucket = "a" + categoryIndex + "b" + bucketedIndex; // to keep track of which approvals belongs to each bucket
    });

    data = data.filter(t => t !== undefined);
    data.forEach(a => {
      a.sigmaDev = a.sigmaDev / a.count;
      a.presentation = request.presentation;
      a.submitter = a.count + (a.count == 1 ? " request" : " requests");
    });
    category.zoomItems = data;
  });

/*
  request.zoomMaxValue = d3.max(state.common.filterNonHidden(request.approvers).map(function(v) {
    return d3.max(v.zoomApprovals, function(a) {return a.value})
  }));
*/

};


