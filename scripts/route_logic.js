const routeData = {
    trainName: "Поезд №123",
    stations: [
        { city: "Москва", name: "Рижская", time: "30 мин", arrivalTime: "12:00", departureTime: "12:30", delay: "0 мин", isCurrent: false },
    ],
};

function renderStations() {
    const stationsContainer = document.querySelector(".route__rows");
    stationsContainer.innerHTML = ""; // Очищаем контейнер

    let length = routeData.stations.length;
    let addition = false;
    if (length % 2 !== 0) {
        length--;
        addition = true;
    }

    for (let i = 0; i < length; i+=2) {
        const station = routeData.stations[i];
        const next_station = routeData.stations[i + 1];

        stationsContainer.innerHTML += `
            <div class="route__row">
                <div class="left route__row_elem ${station.isCurrent ? `active` : ``}">
                    <h2>${station.name}</h2>
                    <h3>Город: ${station.city}</h3>
                    <div class="elem_data">
                        <p class="arrivalTime">Время прибытия: ${station.arrivalTime}</p>
                        <p class="departureTime">Время отправления: ${station.departureTime}</p>
                    </div>
                </div>
                <div class="route__row_line">
                    <div class="dot"></div>
                    <div class="vertL"></div>
                    <div class="dot"></div>
                    ${((i + 1) !== length - 1) ? `<div class="vertL"></div>` : (addition ? `<div class="vertL"></div>` : ``)}
                </div>
                <div class="right route__row_elem ${next_station.isCurrent ? `active` : ``}">
                    <h2>${next_station.name}</h2>
                    <h3>Город: ${next_station.city}</h3>
                    <div class="elem_data">
                        <p class="arrivalTime">Время прибытия: ${next_station.arrivalTime}</p>
                        <p class="departureTime">Время отправления: ${next_station.departureTime}</p>
                    </div>
                </div>
            </div>
        `;
    }

    if (addition) {
        const station = routeData.stations[length];

        stationsContainer.innerHTML += `
            <div class="route__row">
                <div class="left route__row_elem ${station.isCurrent ? `active` : ``}">
                    <h2>${station.name}</h2>
                    <h3>Город: ${station.city}</h3>
                    <div class="elem_data">
                        <p class="arrivalTime">Время прибытия: ${station.arrivalTime}</p>
                        <p class="departureTime">Время отправления: ${station.departureTime}</p>
                    </div>
                </div>
                <div class="route__row_line">
                    <div class="dot"></div>
                </div>
                <div class="right route__row_elem" style="visibility: hidden">
                    
                </div>
            </div>
        `;
    }
}
function renderStationsMobile() {
    const stationsContainer = document.querySelector(".route__rows-mobile");
    stationsContainer.innerHTML = ""; // Очищаем контейнер

    for (let i = 0; i < routeData.stations.length; i++) {
        const stationM = routeData.stations[i];

        stationsContainer.innerHTML += `
            <div class="mobileRoute">
                <div class="mobileRoute__elem middle ${stationM.isCurrent ? `active` : ``}">
                    <h2>${stationM.name}</h2>
                    <h3>Город: ${stationM.city}</h3>
                    <div class="elem_data">
                        <p class="arrivalTime">Время прибытия: ${stationM.arrivalTime}</p>
                        <p class="departureTime">Время отправления: ${stationM.departureTime}</p>
                    </div>
                </div>
                <div class="mobileRoute__line">
                    ${i !== routeData.stations.length - 1 ? `<div class="vertL"></div>` : ``}
                </div>
            </div>
        `;
    }
}

function updateRouteInfo() {
    const currentStation = routeData.stations.find(station => station.isCurrent);
    const nextStation = routeData.stations[routeData.stations.indexOf(currentStation) + 1];
    document.getElementById("train-name").textContent = routeData.trainName;
    document.getElementById("current-station").textContent = currentStation?.name || "-";
    document.getElementById("next-station").textContent = nextStation?.name || "-";
}


async function loadData() {
    const response = await fetch("./scripts/routeTrain.json");
    return await response.json();
}

async function init() {
    const data = await loadData();
    routeData.trainName = data.trainName;
    routeData.stations = data.stations;
    renderStations();
    renderStationsMobile();
    updateRouteInfo();
}

document.addEventListener("DOMContentLoaded", init);