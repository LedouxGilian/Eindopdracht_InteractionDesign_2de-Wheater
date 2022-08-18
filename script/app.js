let isDarkMode = false;
let chartFontColor = '#1a1a1a';

const updateAppInterface = function() {
  document.body.classList.remove('darkMode');
  chartFontColor = '#1a1a1a';

  if (isDarkMode) {
    document.body.classList.add('darkMode');
    chartFontColor = '#ffffff';
  }
}

const handleSlideToggle = function() {
  isDarkMode = !isDarkMode;
  updateAppInterface();
}

const getLocation = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getMeteostatAPI);
  } else { 
    console.warn("Geolocation is not supported by this browser.");
  }
}

// function showPosition(position) {
//   console.log("Latitude: " + position.coords.latitude + " - Longitude: " + position.coords.longitude);
// }

const getStations = async function(position) {
  console.log("Latitude: " + position.coords.latitude + " - Longitude: " + position.coords.longitude);
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'eefdd20f81msh3829a1344f1340fp1b6761jsn17d1655bfe6d',
      'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
    }
  };

  let result = await fetch(`https://meteostat.p.rapidapi.com/stations/nearby?lat=${position.coords.latitude}&lon=${position.coords.longitude}`, options)
    .catch(err => console.error(err));

    let data = await result.json();
    console.log(data.data);
};

const getMeteostatAPI = async function (position) {
  startDate = document.querySelector('.js-startDate').value;
  endDate = document.querySelector('.js-endDate').value;
  // searchresult = document.querySelector('.js-searchBar').value;
  // console.log(`${startDate} - ${endDate} - ${searchresult}`)

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'eefdd20f81msh3829a1344f1340fp1b6761jsn17d1655bfe6d',
      'X-RapidAPI-Host': 'meteostat.p.rapidapi.com'
    }
  };

  let result = await fetch(`https://meteostat.p.rapidapi.com/point/daily?lat=${position.coords.latitude}&lon=${position.coords.longitude}&start=${startDate}&end=${endDate}`, options)
    .catch(err => console.error(err));

  let data = await result.json();
  console.log(data.data);
  drawChart(data.data);
};

const getOpenweatherAPI = async function (cityName) {
  const options = {
    method: 'GET'
  };

  let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=fcad25174e6e62ff01ee75aa7a5ac07b`, options)
    .catch(err => console.error(err));

  let data = await result.json();
  console.log(data);
  showWheaterInfo(data);
};

const showWheaterInfo = function (results) {
  tempC = results.main.temp - 273.15
  iconType = results.weather[0].icon
  console.log(iconType);

  const img = document.querySelector(".js-wheaterIcon");
  img.src = `img/svg/${iconType}@2x.svg`;

  // img.src = `img/svg/03n@2x.svg`;

  // const info = document.querySelector('.js-wheaterInfo');
  // const temp = document.createTextNode(`${tempC.toFixed(1)}°C`);
  // info.appendChild(temp);
};

// const switchTheme = function () {
//   var element = document.body;
//   element.classList.toggle("dark-mode");
// };

// const showResult = function(data) {
//   tempF = data.main.temp
//   tempC = data.main.temp - 273.15

//   document.querySelector('.js-searchBar').value = tempC.toFixed(1);
// };

// const getQuery = async function() {
//     searchresult = document.querySelector('.js-searchBar').value;
//     console.log(searchresult);
// };

const getEventListeners = function () {
  // document.querySelector('.js-searchBar').addEventListener('keyup', function (event) {
  //   if (event.keyCode === 13) { getMeteostatAPI(); }
  // });

  document.querySelector('.js-startDate').addEventListener('change', function (event) {
    getLocation();
  });

  document.querySelector('.js-endDate').addEventListener('change', function (event) {
    getLocation();
  });

  document.querySelector('.js-dayNight-toggle').addEventListener('click', function (event) {
    handleSlideToggle();
  });

  document.querySelector('.js-form').addEventListener('submit', (e) => { e.preventDefault(); });
};

const drawChart = function (json) {
  // var xValues = [0,10,20,30,40,50,60,70,80,90,100];
  var xValues = []
  var yValues = []

  for (let i = 0; i < json.length; i++) {
    yValues.push(json[i].tavg);
  };

  for (let i = 0; i < json.length; i++) {
    xValues.push(json[i].date);
  };

  var chart = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        data: yValues,
        borderColor: "white",
        fill: true
      }]
    },
    options: {
      responsive: false,
      scales: {
        yAxes: [{
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              return value + '°C';
            },
            fontColor: chartFontColor,
            fontSize: '13'
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: chartFontColor,
            fontSize: '13'
          }
        }]
      },
      legend: { display: false },
      title: {
        display: true,
        fontColor: 'white',
        text: 'Daily average temp'
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', async function () {
  console.log("Script Loaded")
  getEventListeners();
  getOpenweatherAPI('Viane');
  getLocation();
  //getAPI();
})