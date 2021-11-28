// Selecting The Required HTML Elements!
const button = document.getElementById('btn');
const inputField = document.getElementById('input-field');
const alert = document.getElementById('alert');
const cityName = document.querySelector('.current-city-text');
const countryName = document.querySelector('.current-country-text');
const currentTime = document.querySelector('.time-text');
const currentDateNow = document.querySelector('.currentDate');
const currentYearNow = document.querySelector('.currentYear');
const prayerTimeFajr = document.querySelector('.fajr');
const prayerTimeDhuhr = document.querySelector('.dhuhr');
const prayerTimeAsr = document.querySelector('.asr');
const prayerTimeMaghrib = document.querySelector('.maghrib');
const prayerTimeIsha = document.querySelector('.isha');
const sunrise = document.querySelector('.sunrise');
const weatherDiv = document.querySelector('#weatherDiv');
const loader = document.querySelector('.loader');
let currentMonthName = document.querySelector('.currentMonthName');

// Defining The Required Functions
button.addEventListener('click', buttonClicked);

// Calling To The Functions To Update The UI
window.onload = showDate();

async function buttonClicked() {
  if (inputField.value === '') {
    if (alert.classList.contains('alert-red')) {
      alert.classList.add('active');

      // Removing The alert
      setTimeout(() => {
        alert.classList.remove('active');
      }, 3000);
    }
  } else {
    //Showing The Loading GIF
    loader.classList.add('active');

    // Fetching The Salat Time Data
    await fetch(`https://muslimsalat.p.rapidapi.com/${inputField.value}.json`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'muslimsalat.p.rapidapi.com',
          'x-rapidapi-key': '37561f31c9msh44df328ddde2427p1211f2jsn032270109226',
        },
      })
      .then((res) => res.json())
      .then((data) => {

        //Removing The Loading GIF
        setTimeout(function() {
          loader.classList.remove('active');
        }, 2500)

        showResults(data);
      })
      .catch((err) => console.log(err));

    // Getting The Weather Data
    getKey(inputField.value.toLowerCase())
      .then((data) => {
        return getWeather(data.Key);
      })
      .then((data) => {
        showWeather(data);
      })
      .catch((err) => console.log(err));
  }
}

// Showing The Data To The User
function showResults(info) {
  const { city, country, query, items } = info;

  // console.log(info)

  // Destructuring The Items Array
  const [{ fajr, dhuhr, asr, maghrib, isha, shurooq }] = items;

  // Updating The UI
  cityName.innerHTML = `${city},`;
  countryName.innerHTML = country;

  if (city === '') {
    cityName.innerHTML = `${query},`;
  }

  // Updating The Times
  prayerTimeFajr.innerHTML = fajr;
  prayerTimeDhuhr.innerHTML = dhuhr;
  prayerTimeAsr.innerHTML = asr;
  prayerTimeMaghrib.innerHTML = maghrib;
  prayerTimeIsha.innerHTML = isha;
  sunrise.innerHTML = shurooq;
}

// Showing The Current Time
function showTime() {
  const time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  let session = 'AM';

  if (h == 0) {
    h = 12;
  }

  if (h >= 12) {
    h -= 12;
    // Doesn't Show 00 As 12PM
    if (h - 12 == 0) {
      h = 12;
    }
    session = 'PM';
  }

  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;

  let timeNow = `${h}:${m} ${session}    `;

  currentTime.textContent = timeNow;
}

// Calling The Showtime Function Every 1 seconds
setInterval(showTime, 1000);

// Showing Current Date/Month/Year
function showDate() {
  const date = new Date();
  let currentDate = date.getDate();
  let currentMonth = date.getMonth() + 1;
  let currentYear = date.getFullYear();

  switch (currentMonth) {
    case 1:
      currentMonthName.innerHTML = 'January';
      break;
    case 2:
      currentMonthName.innerHTML = 'February';
      break;
    case 3:
      currentMonthName.innerHTML = 'March';
      break;
    case 4:
      currentMonthName.innerHTML = 'April';
      break;
    case 5:
      currentMonthName.innerHTML = 'May';
      break;
    case 6:
      currentMonthName.innerHTML = 'June';
      break;
    case 7:
      currentMonthName.innerHTML = 'July';
      break;
    case 8:
      currentMonthName.innerHTML = 'August';
      break;
    case 9:
      currentMonthName.innerHTML = 'September';
      break;
    case 10:
      currentMonthName.innerHTML = 'October';
      break;
    case 11:
      currentMonthName.innerHTML = 'November';
      break;
    case 12:
      currentMonthName.innerHTML = 'December';
      break;
  }

  currentDateNow.innerHTML = currentDate;
  currentYearNow.innerHTML = currentYear;
}

// Don't Use My API KEY 😁
const apikey = 'BQrzKhYmqi5lRQSLA91wDV8VvGemkTFG';

// Getting The Loaction Key For Accu Weather Because They Don't Let Me Get The Weather Data Without A Fucking Location Key
async function getKey(city) {
  if (city === 'darshana') {
    const res = await fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apikey}&q=darsana`
    );
    const data = await res.json();

    return data[0];
  } else {
    const res = await fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apikey}&q=${city}`
    );
    const data = await res.json();

    return data[0];
  }
}

// Getting The Weather Data
async function getWeather(id) {
  const res = await fetch(
    `https://dataservice.accuweather.com/currentconditions/v1/${id}?apikey=${apikey}`
  );
  const data = await res.json();

  return data[0];
}

function showWeather(data) {
  const {
    WeatherText,
    Temperature: {
      Metric: { Unit, Value },
    },
  } = data;

  const updatedUI = `
    <p class="weather-location">Location: ${inputField.value}</p>
    <p class="currentTemp">Temperature: ${Value} <sup class="unit-text">${Unit}</sup></p>
    <p class="currentWeatherCond">Weather Conditions: ${WeatherText}</p>
  `;

  weatherDiv.innerHTML = updatedUI;
  weatherDiv.style.opacity = 1;
}