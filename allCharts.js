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
    // return (today_date() === given_date) ? true : false
    return true
}
var hostname = window.location.origin;
console.log(hostname)
var market_index = hostname+'/highchart/getData.php?links=1';// 'http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketIndex/2022-06-06';
var market_trade = 'http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketTrade/2022-06-06';
var last_market_price = hostname+'/highchart/getData.php?links=3' //'http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketPrice';
var market_news = 'http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketNews/2022-06-06';
var company_wise_sector = hostname+'/highchart/getData.php?links=5' // 'http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/CompanyWiseSector';
// Get the SECTORNAME => INSTRUMENT =>
Highcharts.getJSON(company_wise_sector, function (data) {
    let allSector = []
    data.forEach(setSector)
    function setSector(val) {
        if (Object.keys(allSector).indexOf(val.SECTORNAME) !== -1) {
            allSector[val.SECTORNAME].push(val.INSTRUMENT)
        } else {
            allSector[val.SECTORNAME] = [val.INSTRUMENT]
        }
    }
    // console.log(allSector); // BANK = ["ABBANK", "UTTARABANK", "PRIMEBANK", "IFIC", "BRACSCBOND", "SIBL", "SBACBANK", "FIRSTSBANK","UCB", "MERCANBANK", "SOUTHEASTB", "EXIMBANK", "EBL", "PREMIERBAN", "STANDBANKL", "TRUSTBANK", "DUTCHBANGL", "BRACBANK", "NRBCBANK", "DHAKABANK", "UNIONBANK", "ISLAMIBANK", "PUBALIBANK", "ONEBANKLTD", "NBL", "BANKASIA", "SHAHJABANK", "ICBIBANK", "CITYBANK", "RUPALIBANK", "NCCBANK", "JAMUNABANK", "MTB", "ALARABANK"]
    // Get the INSTRUMENT => Data
    Highcharts.getJSON(last_market_price, function (data) {
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
        if(val['LASTTRADEPRICE'] > 0){
            // if (checkDate(val)){
            allInstrument[val.INSTRUMENT] = val["TOTALVALUE(MN)"];

            if(val["LASTTRADEPRICE"] > val["YESTARDAYCLOSEPRICE"])
                allInstrumentGL[val.INSTRUMENT] = 1;
            else if(val["LASTTRADEPRICE"] < val["YESTARDAYCLOSEPRICE"])
                allInstrumentGL[val.INSTRUMENT] = -1;
            else
                allInstrumentGL[val.INSTRUMENT] = 0;
            // }
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

        if(allInstrumentGL[k] > 0)
            gainLoss[0] += 1;
        else if(allInstrumentGL[k] < 0)
            gainLoss[1] += 1;
        else
            gainLoss[2] += 1;
        return gainLoss;
    }

    let allSectorInstrument = [];
    Object.entries(allSector).forEach(setSectorInstrument)
    // Object.entries(allSector).forEach(([key, value]) => console.log(`${key}: ${value}`));
    function setSectorInstrument([key, value]) {
        let sum = 0;
        value.forEach(k => {
            sum += parseFloat(setAllInstrument(k));
        })
        allSectorInstrument[key] = parseFloat(parseFloat(sum).toFixed(1));
        // if(key == 'BANK' ){
        //     console.log(sum);
        // }
    }

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
    // console.log(allSectorInstrument)
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
        ],
        exporting: {
            enabled: false
        }
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
        ],
        exporting: {
            enabled: false
        }
    });
}
function gainerLoserMeter(data) {
    let gainer = 0;
    let loser = 0;
    let unchanged = 0;
    data.forEach(pushData)

    function pushData(item, index) {
        if(item['LASTTRADEPRICE'] > 0){
            // if (checkDate(item)) {
            if (item['LASTTRADEPRICE'] > item['YESTARDAYCLOSEPRICE'])
                gainer++;
            else if (item['LASTTRADEPRICE'] < item['YESTARDAYCLOSEPRICE'])
                loser++;
            else
                unchanged++;
            // }
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
        exporting: {
            enabled: false
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
// DSEX => 'http://localhost/highchart/getData.php?links=1'
Highcharts.getJSON(market_index, function (data) {
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
    // console.log(typeof data);
    // console.log(data);
    data.slice().reverse().forEach(pushData)
    function pushData(item, index) {
        // if (checkDate(item)) {
            if (item['INDEXNAME'] === 'DSEX')
                series1.push([getTime(item['TIME']), parseFloat(item['INDEXVALUE'])]);
            else if (item['INDEXNAME'] === 'DSES')
                series2.push([getTime(item['TIME']), parseFloat(item['INDEXVALUE'])]);
            else if (item['INDEXNAME'] === 'DS30')
                series3.push([getTime(item['TIME']), parseFloat(item['INDEXVALUE'])]);
        // }
    }
    let categories1 = series1.map(v => v[0]);
    let categories2 = series2.map(v => v[0]);
    let categories3 = series3.map(v => v[0]);

    Highcharts.chart('container1', {
        chart: { type: "area", height: 350 },
        credits: { enabled: !1 },
        legend: { enabled: !1 },
        yAxis: { title: { text: null } },
        colors: ["pink"],
        series: [
            { threshold: null, data: series1, name: "Index", id: "Value" },
        ],
        exporting: {
            enabled: false
        },
        title: { text: "" },
        xAxis: { categories: categories1, type: "datetime" }
    });
    Highcharts.chart('container2', {
        chart: { type: "area", height: 350 },
        credits: { enabled: !1 },
        legend: { enabled: !1 },
        yAxis: { title: { text: null } },
        colors: ["pink"],
        series: [
            { threshold: null, data: series2, name: "Index", id: "Value" },
        ],
        exporting: {
            enabled: false
        },
        title: { text: "" },
        xAxis: { categories: categories2, type: "datetime" }
    });
    Highcharts.chart('container3', {
        chart: { type: "area", height: 350 },
        credits: { enabled: !1 },
        legend: { enabled: !1 },
        yAxis: { title: { text: null } },
        colors: ["pink"],
        series: [
            { threshold: null, data: series3, name: "Index", id: "Value" },
        ],
        exporting: {
            enabled: false
        },
        title: { text: "" },
        xAxis: { categories: categories3, type: "datetime" }
    });
});