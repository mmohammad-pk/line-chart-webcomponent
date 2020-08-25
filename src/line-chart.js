import { LitElement, css, html } from 'lit-element';
import { sampleData } from './sample-data';

class LineChart extends LitElement {

    static get styles() {
        return css`
            .highcharts-figure, .highcharts-data-table table {
                width: auto;
                margin: 1em auto;
            }

            #container {
                height: 400px;
            }

            .highcharts-data-table table {
                font-family: Verdana, sans-serif;
                border-collapse: collapse;
                border: 1px solid #EBEBEB;
                margin: 10px auto;
                text-align: center;
                width: 100%;
            }
            .highcharts-data-table caption {
                padding: 1em 0;
                font-size: 1.2em;
                color: #555;
            }
            .highcharts-data-table th {
                font-weight: 600;
                padding: 0.5em;
            }
            .highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
                padding: 0.5em;
            }
            .highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
                background: #f8f8f8;
            }
            .highcharts-data-table tr:hover {
                background: #f1f7ff;
            }
            
            .select-container {
                background: #fff url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAYCAYAAACIhL/AAAAAAXNSR0IArs4c6QAAAWBJREFUSA3Nl00OgjAQRmnDeQhwBjcu3HIIXXgZ8SpuvAJh7yW8AAnO1zTElkHaWn6a1DJ22nk2fSGKpmluSZJcqO+x1aLv+7Rt2weNhz0RCiGeRVEcJT10aZpWNL72AggWzdRJQGVZ9pZSnmjivTUkGMACJrAoQDzkeY4TrKh3iDdqqF1pFoUwACIqy/JJ9Fc1s8EHaoPhu7QBiAm6mHca6u+klZ5rXdsoJ4xIB2ubTfdOGUvj6HqNThCMSFzLbKo1GMsdFguIxDXMJjjDWC9AJC9s9shYb0AsWMpsztggQCzSdsHuWO3OGcttzlrMJcYym+7dpLFc3UlJ7OQYZs8Za9dE7AyI5H/MdjEWNezmBYjFgWY7GWvDIfYGxCJfs12Nxd52CwLEJh5mOxtrwyF2tphbPGe2r7FcjeATVL/uxzs7xNjogNiQMzvU2EUAsalldrCxHGDU7+jf4Rk95qYfkiGLtr7wLgYAAAAASUVORK5CYII=') no-repeat calc(100% - 10px) center;
                background-size: 10px;
                border: 1px solid #7cb5ec;
                border-radius: 5px;
                cursor: pointer;
                display: inline-block;
                overflow: hidden;
                min-width: 150px;
            }
            .select-container select {
                background: none;
                border: 0;
                cursor: pointer;
                outline: none;
                padding: 10px 40px 10px 10px;
                width: 100%;
                -webkit-appearance: none;
                -moz-appearance: none;
                color: grey;
                font-size: 12px;
            }
            
            .select-container option{
                font-size: 16px;
            }

            .select-container.shadow {
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .select-container.depth {
                background-color: #F8F8F8;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1), inset 0 2px 5px rgba(255,255,255,1), inset 0 -2px 5px rgba(0,0,0,0.05);
            }
            
            .filter-container {
                display: flex;
                justify-content: space-around;
            }
            
            .filter-container > div {
                display: flex;
                flex-direction: column;
            }
            
            .filter-container .label {
                color: #333333;
                margin-bottom: 3px;
            }
            
            .filter-container [type="date"] {
                background:#fff url(https://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/calendar_2.png)  97% 50% no-repeat ;
            }
            .filter-container [type="date"]::-webkit-inner-spin-button {
                display: none;
            }
            .filter-container [type="date"]::-webkit-calendar-picker-indicator {
                opacity: 0;
            }
            
            .filter-container [type="date"] {
                height: 34px;
                border: 1px solid #7cb5ec;
                border-radius: 5px;
                color: grey;
                font-family: sans-serif;
            }
        `;
    }

    static get properties() {
        return { data: { type: Array } };
    }

    constructor() {
        super();
        console.log(sampleData);
        this.chart = undefined;
        this.selectedCountry = '';
        this.selectedFromDate = '';
        this.selectedToDate = '';
        this.countryArr = Object.keys(sampleData.countryList);
        this.parsedResponse = this.parseData(sampleData.countryDetail);
        this.selectedDates = this.parsedResponse[this.countryArr[0]].dates;
        this.selectedTestedData = this.parsedResponse[this.countryArr[0]].tested;
        this.selectedConfirmedData = this.parsedResponse[this.countryArr[0]].confirmed;
        this.selectedCountry = this.countryArr[0];
    }

    parseData(countryDetail) {
        if (countryDetail && Array.isArray(countryDetail) && countryDetail.length > 0) {
            const countriesData = {};

            countryDetail.forEach(eachCountry => {
                if (!countriesData[eachCountry.name]) {
                    countriesData[eachCountry.name] = {
                        data: []
                    };
                }
                const dataOfWeek = {
                    week: eachCountry.week,
                    tested: eachCountry.countOfTests,
                    positive: eachCountry.percentPositive
                };
                countriesData[eachCountry.name].data.push(dataOfWeek);
            });

            for (let eachCountry in countriesData) {
                const sampleCountryData = countriesData[eachCountry].data;
                const sortedCountryData = sampleCountryData.sort((a, b) => a.week - b.week);
                countriesData[eachCountry].dates = [];
                countriesData[eachCountry].tested = [];
                countriesData[eachCountry].confirmed = [];
                sortedCountryData.forEach(eachWeek => {
                    countriesData[eachCountry].dates.push(this.getDateOfWeek(eachWeek.week));
                    countriesData[eachCountry].tested.push(eachWeek.tested);
                    countriesData[eachCountry].confirmed.push(eachWeek.positive);
                });
            }

            return countriesData;
        }
    }

    getDateOfWeek(week) {
        week += '';
        const w = week.slice(4, 6);
        const y = week.slice(0, 4);
        var d = (1 + (w - 1) * 7);
        const tempDate = new Date(y, 0, d);
        let monthNames = ["Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"];
        let day = tempDate.getDate();
        let monthIndex = tempDate.getMonth();
        let monthName = monthNames[monthIndex];
        let year = tempDate.getFullYear();
        return `${monthName} ${day}`;
    }

    firstUpdated(changedProperties) {
        this.chart = Highcharts.chart(this.shadowRoot.getElementById('container'), {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: '',
                align: 'left',
                floating: true
            },
            xAxis: [{
                categories: this.selectedDates,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value}%',
                    style: {
                        color: 'grey'
                    }
                },
                title: {
                    text: 'Weekly Positive %',
                    style: {
                        color: 'grey'
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Tested',
                    style: {
                        color: 'grey'
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: 'grey'
                    }
                },
                opposite: true
            }],
            tooltip: {
                shared: false
            },
            legend: {
                layout: 'horizontal',
                verticalAlign: 'top',
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || // theme
                    'rgba(255,255,255,0.25)'
            },
            series: [{
                name: 'Tested',
                type: 'column',
                yAxis: 1,
                color: '#5585DB',
                data: this.selectedTestedData

            }, {
                name: 'Weekly Positive %',
                type: 'spline',
                data: this.selectedConfirmedData,
                color: '#FFBF00',
                tooltip: {
                    valueSuffix: '%'
                },
                marker: {
                    enabled: false
                }
            }]
        });
    }

    countryChange(e) {
        this.selectedCountry = e.target.value;
        this.selectedTestedData = this.parsedResponse[this.selectedCountry].tested;
        this.selectedConfirmedData = this.parsedResponse[this.selectedCountry].confirmed;
        this.chart.series[0].setData(this.selectedTestedData);
        this.chart.series[1].setData(this.selectedConfirmedData);
    }

    fromDateChange(e) {
        this.selectedFromDate = e.target.value;
    }

    toDateChange(e) {
        this.selectedToDate = e.target.value;
    }

    render() {
        return html`
            <figure class="highcharts-figure">
            <div class="filter-container">
                <div>
                    <div class="label">
                        <label for="countries">Country</label>
                    </div>
                    <div class="select-container">
                        <select name="" id="countries" @change="${this.countryChange}">
                            ${this.countryArr.map(eachCountry => {
            return html`<option value="${eachCountry}">${eachCountry}</option>`
        })}
                        </select>
                    </div>
                </div>
            </div>
            <div id="container"></div>
            </figure>
        `;
    }
}

customElements.define('line-chart-webcomponent', LineChart);
