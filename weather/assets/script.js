const iconBase = "assets/icons/";
const apiBase = "https://api.openweathermap.org/data/2.5";
const options = {
	units: "imperial",
	appid: "093ab36bdb3a853b4fb679b7592d7ccd",
};
const todayEl = document.getElementById("today");
const weekEl = document.getElementById("next-week");
const weekDays = weekEl.querySelectorAll("time");
const dayArray = Array.apply(null, weekDays);
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const searchform = document.querySelector("form");

searchform.addEventListener("submit", (event) => {
	event.preventDefault();
	const { zip } = Object.fromEntries(new FormData(event.target));
	setWeather(zip);
	searchform.dataset.show = "false";
});

const fetchJsonData = async (url) => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

const showForm = () => {
	searchform.dataset.show = "true";
};

const getTemps = (today, days) => {
	const tomorrow = today + 3600 * 24;
	const todayAll = days.filter((day) => day.dt >= today && day.dt < tomorrow);
	const maxes = todayAll
		.map((day) => day.main.temp_max)
		.sort()
		.reverse();
	const mins = todayAll.map((day) => day.main.temp_min).sort();
	return { min: parseInt(mins[0]), max: parseInt(maxes[0]) };
};
const weather = document.querySelector(".weather");

const setToday = (data) => {
	const icon = `${iconBase}${data.weather[0].icon}.svg`;

	todayEl.innerHTML = `

	<div class="text">
		<div class="location">
			${data.name}
			<button title="edit" onclick="showForm()">
				<img src="${iconBase}edit-2.svg" alt="" />
			</button>
		</div>
		<div class="big-temp">
			${parseInt(data.main.temp)}
		</div>
		<div class="degree">°</div>
		<div class="hi-lo">
			<div class="temp hi">${parseInt(data.main.temp_max)}°</div>
			<div class="seperator"></div>
			<div class="temp lo">${parseInt(data.main.temp_min)}°</div>
		</div>
		
	</div>
	<div class="icon">
		<img src="${icon}" alt="${data.weather[0].description}">
	</div>`;

	todayEl.dataset.hydrated = "true";
};
const setWeek = (data) => {
	const d = new Date();
	[new Date().getDay()];
	for (var i = 0; i <= 3; i++) {
		const timestamp = d.setHours(24, 0, 0, 0);
		const today = Math.floor(timestamp / 1000);
		const todayData = data.list.find((day) => day.dt >= today + 3600 * 12);
		const temps = getTemps(today, data.list);

		const icon = `${iconBase}${todayData.weather[0].icon}.svg`;
		dayArray[i].innerHTML = `
		<div class="icon">
			<img src="${icon}" alt="${todayData.weather[0].description}">
		</div>
		<div class="dayname">${dayNames[new Date(todayData.dt_txt).getDay()]}</div>
		<div class="hi-lo">
			<div class="temp hi">${temps.max}°</div>
			<div class="seperator"></div>
			<div class="temp lo">${temps.min}°</div>
		</div>`;
		dayArray[i].dataset.hydrated = "true";
	}
};
const setWeather = (zip = "90210") => {
	options.zip = zip;
	const queryString = new URLSearchParams(options).toString();
	const weatherUrl = `${apiBase}/weather?${queryString}`;
	const forecastUrl = `${apiBase}/forecast?${queryString}`;
	fetchJsonData(weatherUrl).then((data) => {
		setToday(data);
	});

	fetchJsonData(forecastUrl).then((data) => {
		setWeek(data);
	});
};
setWeather();
