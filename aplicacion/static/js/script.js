const numberHours = document.querySelector('.number-hours');
const barSeconds = document.querySelector('.bar-seconds');
const numberElement = [];
const barElement = [];
for(let i=1;i<=12;i++){
    numberElement.push(`<span style="--index:${i}"><p>${i}</p></span>`);
}
numberHours.insertAdjacentHTML("afterbegin", numberElement.join(""));

for(let i=1;i<=60;i++){
    barElement.push(`<span style="--index:${i}"><p></p></span>`);
}
barSeconds.insertAdjacentHTML("afterbegin", barElement.join(""));

const handHours = document.querySelector('.hand.hours');
const handMinutes = document.querySelector('.hand.minutes');
const handSeconds = document.querySelector('.hand.seconds');

function getCurrentTime(){
    let date = new Date();
    let currentHours = date.getHours();
    let currentMinutes = date.getMinutes();
    let currentSeconds = date.getSeconds();

    handHours.style.transform = `rotate(${currentHours * 30 + currentMinutes / 2}deg)`;
    handMinutes.style.transform = `rotate(${currentMinutes * 6}deg)`;
    handSeconds.style.transform = `rotate(${currentSeconds * 6}deg)`;
}
getCurrentTime();
setInterval(getCurrentTime,1000);

const listInfo = document.querySelector('.list-info');
const listImg = document.querySelector('.list-img');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const bgs = document.querySelectorAll('.bg');

let index=0;
nextBtn.addEventListener('click', ()=>{
    index=(index<3)?index+1:3;
    listInfo.style.transform=`translateY(${index*-25}%)`;
    listImg.style.transform=`translateY(${index*-100}%)`;

    bgs[index].classList.add('active');
})
prevBtn.addEventListener('click', ()=>{
    indexPrev=(index>0)?index:0;
    index=(index>0)?index-1:0;
    listInfo.style.transform=`translateY(${index*-25}%)`;
    listImg.style.transform=`translateY(${index*-100}%)`;

    bgs[indexPrev].classList.remove('active');
})

//API

async function obtenerPronostico() {
    const apiKey = '90d1681adb534a6228acb9c0cf78c012'; // Tu clave API de OpenWeatherMap
    const lat = -12.0432; // Latitud de ejemplo
    const lon = -77.0282; // Longitud de ejemplo
    const urlPronostico = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=es&units=metric`;

    try {
        // Obtener el pronóstico por 5 días
        const respuestaPronostico = await fetch(urlPronostico);
        const datosPronostico = await respuestaPronostico.json();

        const forecastDiv = document.getElementById('forecast');
        let html = ``;

        // Obtener y mostrar el pronóstico diario
        const forecastByDay = {};
        datosPronostico.list.forEach((hora) => {
            const fecha = new Date(hora.dt * 1000);
            const fechaKey = fecha.toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD

            if (!forecastByDay[fechaKey]) {
                forecastByDay[fechaKey] = {
                    temp: [],
                    description: '',
                    humidity: [],
                    pressure: [],
                    windSpeed: [],
                    main: ''
                };
            }

            forecastByDay[fechaKey].temp.push(hora.main.temp);
            forecastByDay[fechaKey].description = hora.weather[0].description;
            forecastByDay[fechaKey].humidity.push(hora.main.humidity);
            forecastByDay[fechaKey].pressure.push(hora.main.pressure);
            forecastByDay[fechaKey].windSpeed.push(hora.wind.speed);
            forecastByDay[fechaKey].main = hora.weather[0].main;
        });

        const days = Object.keys(forecastByDay).slice(0, 4); // Solo los primeros 4 días
        days.forEach(day => {
            const dayData = forecastByDay[day];
            const avgTemp = (dayData.temp.reduce((a, b) => a + b, 0) / dayData.temp.length).toFixed(1);
            const avgHumidity = (dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length).toFixed(1);
            const avgPressure = (dayData.pressure.reduce((a, b) => a + b, 0) / dayData.pressure.length).toFixed(1);
            const avgWindSpeed = (dayData.windSpeed.reduce((a, b) => a + b, 0) / dayData.windSpeed.length).toFixed(1);
            let imgUrl = '';
            switch(dayData.main){
                case 'Clear':
                    imgUrl='../../static/img/clear.png';
                    break;
                case 'Rain':
                    imgUrl='../../static/img/rain.png';
                    break;
                case 'Snow':
                    imgUrl='../../static/img/snow.png';
                    break;
                case 'Clouds':
                    imgUrl='../../static/img/cloud.png';
                    break;
                case 'Mist':
                    imgUrl='../../static/img/mist.png';
                    break;
                case 'Haze':
                    imgUrl='../../static/img/mist.png';
                    break;
                default:
                    imgUrl='../../static/img/clear.png';
            }

            html += `
            <div class="box-app">
                <div class="weather-box">
                    <div class="box">
                        <div class="info-weather">
                            <div class="weather">
                                <img src="${imgUrl}">
                                <p class="temperature">${avgTemp}<span>°C</span></p>
                                <p class="description">${dayData.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="humidity">
                        <i class="bx bx-water"></i>
                        <div class="text">
                            <div class="info-humidity">
                                <span>${avgHumidity}%</span>
                            </div>
                        </div>
                    </div>

                    <div class="wind">
                        <i class="bx bx-wind"></i>
                        <div class="text">
                            <div class="info-wind">
                                <span>${avgWindSpeed}m/s</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        forecastDiv.innerHTML = html;
    } catch (error) {
        console.error('Error al obtener datos del pronóstico:', error);
        document.getElementById('forecast').innerHTML = '<p>Error al obtener datos del pronóstico. Por favor, intenta de nuevo.</p>';
    }
}

// Cargar el pronóstico automáticamente cuando la página se carga
document.addEventListener('DOMContentLoaded', obtenerPronostico);

const incomeExpenseApiUrl = 'https://mocki.io/v1/0c4a17f1-30d1-4a00-845f-94af12ffd344';
        const electricityApiUrl = 'https://mocki.io/v1/e5881932-1f6b-4252-804f-301f2f205de3';
        const waterApiUrl = 'https://mocki.io/v1/cc726dea-76d2-4dac-8010-3e589fa9e30b';

        // Fetch data for income and expenses
        fetch(incomeExpenseApiUrl)
            .then(response => response.json())
            .then(data => createIncomeExpenseChart(data))
            .catch(error => console.error('Error al obtener los datos de ingresos y gastos:', error));

        // Fetch data for electricity consumption
        fetch(electricityApiUrl)
            .then(response => response.json())
            .then(data => createHorizontalBarChart(data, 'electricityChart', 'Consumo (kWh)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 159, 64, 1)'))
            .catch(error => console.error('Error al obtener los datos de electricidad:', error));

        // Fetch data for water consumption
        fetch(waterApiUrl)
            .then(response => response.json())
            .then(data => createChart(data, 'waterChart', 'Consumo (m³)', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'))
            .catch(error => console.error('Error al obtener los datos de agua:', error));

        // Function to create chart
        function createChart(data, chartId, label, bgColor, borderColor) {
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const consumosPorMes = data.reduce((acc, item) => {
                const [year, month] = item.fecha.split('-');
                const mes = `${year}-${month}`;
                if (!acc[mes]) {
                    acc[mes] = 0;
                }
                acc[mes] += item.consumo_kwh || item.consumo_m3;
                return acc;
            }, {});

            const labels = Object.keys(consumosPorMes).sort((a, b) => new Date(a) - new Date(b)).map(label => {
                const [year, month] = label.split('-');
                return monthNames[parseInt(month) - 1];
            });
            const values = Object.keys(consumosPorMes).sort((a, b) => new Date(a) - new Date(b)).map(label => consumosPorMes[label]);

            const ctx = document.getElementById(chartId).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: values,
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: 'Mes',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: label,
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
        }

        // Function to create horizontal bar chart
        function createHorizontalBarChart(data, chartId, label, bgColor, borderColor) {
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const consumosPorMes = data.reduce((acc, item) => {
                const [year, month] = item.fecha.split('-');
                const mes = `${year}-${month}`;
                if (!acc[mes]) {
                    acc[mes] = 0;
                }
                acc[mes] += item.consumo_kwh || item.consumo_m3;
                return acc;
            }, {});

            const labels = Object.keys(consumosPorMes).sort((a, b) => new Date(a) - new Date(b)).map(label => {
                const [year, month] = label.split('-');
                return monthNames[parseInt(month) - 1];
            });
            const values = Object.keys(consumosPorMes).sort((a, b) => new Date(a) - new Date(b)).map(label => consumosPorMes[label]);

            const ctx = document.getElementById(chartId).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: values,
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y', // This makes the bars horizontal
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: label,
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            }
                        },
                        y: {
                            type: 'category',
                            title: {
                                display: true,
                                text: 'Mes',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
        }

        // Function to create income vs expense chart
        function createIncomeExpenseChart(data) {
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const incomeExpenseByMonth = data.reduce((acc, item) => {
                const [year, month] = item.date.split('-');
                const mes = `${year}-${month}`;
                if (!acc[mes]) {
                    acc[mes] = { income: 0, expense: 0 };
                }
                acc[mes].income += item.income;
                acc[mes].expense += item.expense;
                return acc;
            }, {});

            const labels = Object.keys(incomeExpenseByMonth).sort((a, b) => new Date(a) - new Date(b)).map(label => {
                const [year, month] = label.split('-');
                return monthNames[parseInt(month) - 1];
            });
            const incomeValues = Object.keys(incomeExpenseByMonth).sort((a, b) => new Date(a) - new Date(b)).map(label => incomeExpenseByMonth[label].income);
            const expenseValues = Object.keys(incomeExpenseByMonth).sort((a, b) => new Date(a) - new Date(b)).map(label => incomeExpenseByMonth[label].expense);

            const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Ingresos',
                            data: incomeValues,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Gastos',
                            data: expenseValues,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'category',
                            title: {
                                display: true,
                                text: 'Mes',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Monto',
                                color: 'white'
                            },
                            ticks: {
                                color: 'white'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
        }

        // Aqui va la la funcion para el grafico Radar

        const apiUrl = 'https://mocki.io/v1/8201bb1a-3738-4141-9b0c-fdd9059012d7';

        // Función para normalizar los datos en un rango de 0 a 100
        function normalize(value, max) {
            return (value / max) * 100;
        }

        // Función para formatear los números con un punto decimal
        function formatNumber(value) {
            return parseFloat(value).toFixed(2);
        }

        // Fetch data for the environmental radar chart
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const latestData = data[data.length - 1];  // Obtener los datos más recientes

                const normalizedData = {
                    huella_carbono: formatNumber(normalize(latestData.huella_carbono, 1000)),
                    energia_renovable: formatNumber(latestData.energia_renovable),
                    residuos_generados: formatNumber(normalize(latestData.residuos_generados, 100)),
                    residuos_reciclados: formatNumber(normalize(latestData.residuos_reciclados, 100)),
                    inversion_sostenibilidad: formatNumber(normalize(latestData.inversion_sostenibilidad * 10, 1000000)),
                    cumplimiento_normativo: formatNumber(latestData.cumplimiento_normativo)
                };

                const labels = [
                    'HC(10t)',
                    'CER(%)',
                    'RG(t)',
                    'RR(t)',
                    'IS(mil$)',
                    'CNA(%)'
                ];

                const dataValues = [
                    normalizedData.huella_carbono,
                    normalizedData.energia_renovable,
                    normalizedData.residuos_generados,
                    normalizedData.residuos_reciclados,
                    normalizedData.inversion_sostenibilidad,
                    normalizedData.cumplimiento_normativo
                ];

                const ctx = document.getElementById('environmentalRadarChart').getContext('2d');
                new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Indicadores Ambientales',
                            data: dataValues,
                            backgroundColor: 'rgba(0, 123, 255, 0.5)',
                            borderColor: 'rgba(0, 123, 255, 1)',
                            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
                            borderWidth: 2,
                            pointRadius: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                angleLines: {
                                    display: true,
                                    color: 'rgba(255, 255, 255, 0.5)'
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.5)'
                                },
                                pointLabels: {
                                    color: 'white',
                                    font: {
                                        size: 14
                                    }
                                },
                                ticks: {
                                    display: true,
                                    color: 'white',
                                    backdropColor: 'rgba(0, 0, 0, 0)'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: 'white'
                                }
                            }
                        }
                    }
                });
            })
            .catch(error => console.error('Error al obtener los datos ambientales:', error));