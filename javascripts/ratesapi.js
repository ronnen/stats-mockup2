// based on a public service at https://ratesapi.io/
// GET https://ratesapi.io/api/latest

function refreshCurrencyRates() {
  if(!localStorage.getItem('latestCurrencyRates')) {
    getLatestCurrencies();
  } else {
    state.latestCurrencyRates = JSON.parse(localStorage.getItem('latestCurrencyRates'));
  }

  function getLatestCurrencies() {
    console.log("Going to refresh exchange rates...");
    httpGetAsync('https://ratesapi.io/api/latest?base=USD', function(response) {
      localStorage.setItem('latestCurrencyRates', response);
      try {
        state.latestCurrencyRates = JSON.parse(response);
      } catch(error) {
        console.error("could not parse response: " + response);
      }
    });
  }

  function httpGetAsync(theUrl, callback)
  {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  }
}

