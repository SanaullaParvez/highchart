$('#analytical-tab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})
$('#top-gainer-loser-tab a').on('click', function (e) {
    e.preventDefault()
    $(this).tab('show')
})
function today_date() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    return date;
}
function checkDate(val) {
    var given_time = new Date(val['TIME']);
    var given_date = given_time.getFullYear() + '-' + (given_time.getMonth() + 1) + '-' + given_time.getDate();
    return (today_date() === given_date) ? true : false
}


Highcharts.getJSON('http://localhost/highchart/getData.php?links=5', function (data) {
    let allSector = []
    data.forEach(setSector)
    function setSector(val) {
        if (Object.keys(allSector).indexOf(val.SECTORNAME) !== -1) {
            allSector[val.SECTORNAME].push(val.INSTRUMENT)
        } else {
            allSector[val.SECTORNAME] = [val.INSTRUMENT]
        }
    }
    Highcharts.getJSON('http://localhost/highchart/getData.php?links=3', function (data) {
        gainerLoserMeter(data)
        todaysValue(data, allSector)
    })
});
function todaysValue(data, allSector) {
    // return data.INSTRUMENT
    let allInstrument = []
    let allInstrumentGL = []
    data.forEach(setInstrument)

    function setInstrument(val) {
        if (checkDate(val)){
            allInstrument[val.INSTRUMENT] = val["TOTALVALUE(MN)"];

            if(val["LASTTRADEPRICE"] > val["YESTARDAYCLOSEPRICE"])
                allInstrumentGL[val.INSTRUMENT] = 1;
            else if(val["LASTTRADEPRICE"] < val["YESTARDAYCLOSEPRICE"])
                allInstrumentGL[val.INSTRUMENT] = -1;
            else
                allInstrumentGL[val.INSTRUMENT] = 0;
        }
    }

    function setAllInstrument(k) {
        if (Object.keys(allInstrument).indexOf(k) !== -1) {
            return allInstrument[k];
        } else {
            return 0;
        }
    }
    function calculateGainLoss(k){
        let gainLoss = [0,0,0]
        // if (Object.keys(allSectorInstrumentGL).indexOf(val.INSTRUMENT) === -1) {
        //     allSectorInstrumentGL[k] = [0,0,0];
        // }
        if(allInstrumentGL[k] > 0)
            gainLoss[0] += 1;
        else if(allInstrumentGL[k] < 0)
            gainLoss[1] += 1;
        else
            gainLoss[2] += 1;
        return gainLoss;
    }

    // console.log(allSector);
    // console.log(allInstrument);
    let allSectorInstrument = [];
    Object.entries(allSector).forEach(setSectorInstrument)
    // Object.entries(allSector).forEach(([key, value]) => console.log(`${key}: ${value}`));
    function setSectorInstrument([key, value]) {
        let sum = 0;
        value.forEach(k => {
            sum += setAllInstrument(k);
        })
        allSectorInstrument[key] = parseFloat(parseFloat(sum).toFixed(1));
    }

    // console.log(allSectorInstrument)
    // console.log(Object.entries(allSectorInstrumentGL).map(([k,v]) => k))
    // console.log(Object.entries(allSectorInstrumentGL).map(([k,v]) => v[1]))
    // console.log(Object.entries(allSectorInstrumentGL).map(([k,v]) => v[2]))
    // Object.entries(allSectorInstrumentGL).forEach(([k,v]) => {
    //     console.log(`${k}: ${v}`);
    // });

    const keysSorted = Object.keys(allSectorInstrument).sort((a, b) => allSectorInstrument[b] - allSectorInstrument[a]);
    const result = {};
    let allSectorInstrumentGL = [];
    keysSorted.forEach(key => {
        result[key] = allSectorInstrument[key];
        /*Industry Update - Gainer Loser*/
        let gainLoss = [0,0,0];
        allSector[key].forEach(k => {
            if(allInstrumentGL[k] > 0)
                gainLoss[0] += 1;
            else if(allInstrumentGL[k] < 0)
                gainLoss[1] += 1;
            else
                gainLoss[2] += 1;
        })
        allSectorInstrumentGL[key] = gainLoss;
    })

    // console.log(allSectorInstrumentGL)
    // console.log('After Sorting')
    Highcharts.chart('container5', {
        chart: {type: "bar"},
        colors: ["#00B0FF", "#6f6f6f"],
        title: {text: "Today's Value"},
        xAxis: {categories: Object.keys(result), title: {text: null}},
        yAxis: {
            min: 0,
            title: {text: null},
            labels: {overflow: "justify"},
        },
        tooltip: {valueSuffix: " m"},
        plotOptions: {bar: {dataLabels: {enabled: !0}}},
        credits: {enabled: !1},
        series: [
            {
                name: 'Today',
                data: Object.values(result)
            },
            // {
            //     name: 'Yesterday',
            //     data: [1216, 1001, 4436, 738, 40]
            // },
        ]
    });
    Highcharts.chart('container6', {
        chart: { type: "bar" },
        colors: ["#61C46E", "#FF5A5A", "#00B0FF"],
        title: { text: "Gainer Loser" },
        credits: { enabled: !1 },
        xAxis: {categories: Object.entries(allSectorInstrumentGL).map(([k,v]) => k)},
        yAxis: { min: 0, title: { text: null } },
        legend: { reversed: !0 },
        plotOptions: { series: { stacking: "normal" } },
        series: [
            {
                name: 'Gainer',
                data: Object.entries(allSectorInstrumentGL).map(([k,v]) => v[0])
            },
            {
                name: 'Looser',
                data: Object.entries(allSectorInstrumentGL).map(([k,v]) => v[1])
            },
            {
                name: 'Unchanged',
                data: Object.entries(allSectorInstrumentGL).map(([k,v]) => v[2])
            }
        ]
    });
}
function gainerLoserMeter(data) {
    let gainer = 0;
    let loser = 0;
    let unchanged = 0;
    data.forEach(pushData)

    function pushData(item, index) {
        if (checkDate(item)) {
            if (item['LASTTRADEPRICE'] > item['YESTARDAYCLOSEPRICE'])
                gainer++;
            else if (item['LASTTRADEPRICE'] < item['YESTARDAYCLOSEPRICE'])
                loser++;
            else
                unchanged++;
        }
    }

    const total = parseInt(gainer) + parseInt(loser) + parseInt(unchanged);
    const percentGainer = percentage(gainer, total);
    const percentLoser = percentage(loser, total);
    const percentUnchanged = percentage(unchanged, total);

    function percentage(percent, total) {
        return ((percent / total) * 100).toFixed(2)
    }

    // console.log(gainer,loser,unchanged,total);
    // console.log(percentGainer,percentLoser,percentUnchanged);
    Highcharts.chart('container4', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: !1,
            marginTop: -50,
            marginBottom: -75,
            marginLeft: 0,
            marginRight: 0,
        },
        title: {
            text: "DSE Gainer Loser Meter",
            align: "center",
            verticalAlign: "top",
            y: 40,
        },
        legend: {
            verticalAlign: "bottom",
            labelFormatter: function () {
                return this.name + (" " + this.percentage.toFixed(1) + "%");
            },
        },
        credits: {enabled: !1},
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: !0,
                    distance: -50,
                    style: {fontWeight: "bold"},
                },
                showInLegend: !0,
                startAngle: -90,
                endAngle: 90,
                center: ["50%", "75%"],
                colors: ["#61C46E", "#FF5A5A", "#00B0FF"],
            },
        },
        series: [{
            type: 'pie',
            name: 'Percentage',
            innerSize: '50%',
            data: [
                ['Gainer', parseFloat(percentGainer)],
                ['Loser', parseFloat(percentLoser)],
                ['Unchanged', parseFloat(percentUnchanged)]
            ]
        }]
    });
}
Highcharts.getJSON('http://localhost/highchart/getData.php?links=1', function (data) {

    // const data1 = [
    //     {
    //         "INDEXNAME": "DSES",
    //         "INDEXVALUE": "1387.67740",
    //         "INDEXCHANGE": "-7.15243",
    //         "TIME": "6/14/2022 2:45:00 PM"
    //     }
    // ]
    // const cats1 = cats2 = cats3 = {}
    // data.filter(checkDate1).forEach((o) => cats1[getTime(o.TIME)] = 1);
    // data.filter(checkDate2).forEach((o) => cats2[getTime(o.TIME)] = 1);
    // data.filter(checkDate3).forEach((o) => cats3[getTime(o.TIME)] = 1);
    //
    // function checkDate1(val) {
    //     var given_time = new Date(val['TIME']);
    //     var given_date = given_time.getFullYear() + '-' + (given_time.getMonth() + 1) + '-' + given_time.getDate();
    //     return (val['INDEXNAME'] == 'DSEX' && today_date() === given_date) ? true : false
    // }
    //
    // function checkDate2(val) {
    //     var given_time = new Date(val['TIME']);
    //     var given_date = given_time.getFullYear() + '-' + (given_time.getMonth() + 1) + '-' + given_time.getDate();
    //     return (val['INDEXNAME'] == 'DSES' && today_date() === given_date) ? true : false
    // }
    //
    // function checkDate3(val) {
    //     var given_time = new Date(val['TIME']);
    //     var given_date = given_time.getFullYear() + '-' + (given_time.getMonth() + 1) + '-' + given_time.getDate();
    //     return (val['INDEXNAME'] == 'DS30' && today_date() === given_date) ? true : false
    // }
    // const categories1 = Object.keys(cats1)
    // const categories2 = Object.keys(cats2)
    // const categories3 = Object.keys(cats3)
    function addZero(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i;
    }

    function getTime(val) {
        let d = new Date(val);
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let s = addZero(d.getSeconds());
        let time = h + ":" + m + ":" + s;
        return time;
    }

    let series1 = [];
    let series2 = [];
    let series3 = [];
    data.slice().reverse().forEach(pushData)
    function pushData(item, index) {
        if (checkDate(item)) {
            if (item['INDEXNAME'] === 'DSEX')
                series1.push([getTime(item['TIME']), parseFloat(item['INDEXVALUE'])]);
            else if (item['INDEXNAME'] === 'DSES')
                series2.push([getTime(item['TIME']), parseFloat(item['INDEXVALUE'])]);
            else if (item['INDEXNAME'] === 'DS30')
                series3.push([getTime(item['TIME']), parseFloat(item['INDEXVALUE'])]);
        }
    }
    let categories1 = series1.map(v => v[0]);
    let categories2 = series2.map(v => v[0]);
    let categories3 = series3.map(v => v[0]);

    // console.log(categories1.sort(),series1)
    // console.log(categories1,series1)
    // console.log(series1.map(v => v[0]))
    // console.log(categories2,series2)
    // console.log(categories3,series3)
    Highcharts.chart('container1', {

        chart: {type: "area", height: 350},
        credits: {enabled: !1},
        legend: {enabled: !1},
        title: {
            text: 'DSEX Index'
        },
        xAxis: {
            categories: categories1
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#F4BFCB'],
                        [1, Highcharts.color('#F4BFCB').setOpacity(0.5).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            threshold: null,
            name: 'Index',
            data: series1
        }]
    });
    Highcharts.chart('container2', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'DSES Index'
        },
        xAxis: {
            categories: categories2
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'Index',
            data: series2
        }]
    });
    Highcharts.chart('container3', {
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'DS30 Index'
        },
        xAxis: {
            categories: categories3
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            type: 'area',
            name: 'Index',
            data: series3
        }]
    });
});