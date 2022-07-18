<?php
require 'curl_get_file_contents.php';
?>
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HDCP</title>
    <style type="text/css">
        #container1, #container2, #container3, #container4, #container5, #container6 {
            height: 400px;
            min-width: 310px;
            /*display: none;*/
        }

        .highcharts-credits {
            display: none;
        }

        .news-item {
            list-style: none;
        }

        .news-item h5 {
            margin: 0;
            padding: 0 0 5px;
            font-size: 14px;
            font-weight: 700;
            color: #ed1d24;
        }
        .nav .nav-item .nav-link {
            color: #000;
        }
        .nav .nav-item .nav-link.active {
            color: #fff;
            background-color: #ed1d24;
        }
        .list-vertical {
            height: 400px;
            overflow-y: scroll;
        }
        .buttonload {
            background-color: #04AA6D; /* Green background */
            border: none; /* Remove borders */
            color: white; /* White text */
            padding: 12px 16px; /* Some padding */
            font-size: 16px /* Set a font size */
        }
    </style>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

</head>
<body>
<div class="container">
    <h1 class="text-center m-4">Analytical View of the Market</h1>
    <div class="row">
        <div class="col-sm">
            <ul class="nav nav-pills mb-3" id="analytical-tab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
                       aria-controls="pills-home" aria-selected="true">DSEX</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab"
                       aria-controls="pills-profile" aria-selected="false">DSES</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#pills-contact" role="tab"
                       aria-controls="pills-contact" aria-selected="false">DS30</a>
                </li>
            </ul>
            <div class="tab-content" id="analytical-tabContent">
                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div id="container1"></div>
                </div>
                <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div id="container2"></div>
                </div>
                <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
                    <div id="container3"></div>
                </div>
            </div>
        </div>
        <div class="col-sm">
            <div id="container4"></div>
        </div>
    </div>
    <h1 class="m-5 text-center">Industry Update</h1>
    <div class="row">
        <div class="col-sm">
            <div id="container5"></div>
        </div>
        <div class="col-sm">
            <div id="container6"></div>
        </div>
    </div>
    <h1 class="m-5 text-center">Top Gainers/Losers</h1>
    <div class="row">
        <div class="col-sm justify-content-end">
            <ul class="nav nav-pills mb-3 justify-content-center" id="top-gainer-loser-tab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#top-value" role="tab"
                       aria-controls="pills-home" aria-selected="true">Top Value</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#top-gainer" role="tab"
                       aria-controls="pills-profile" aria-selected="false">Top Gainer</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#top-loser" role="tab"
                       aria-controls="pills-contact" aria-selected="false">Top Loser</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#top-volume" role="tab"
                       aria-controls="pills-contact" aria-selected="false">Top Volume</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="pills-contact-tab" data-toggle="pill" href="#top-trade" role="tab"
                       aria-controls="pills-contact" aria-selected="false">Top Trade</a>
                </li>
            </ul>
        </div>
    </div>
    <div class="row">
        <div class="col-sm">
            <div class="tab-content" id="top-gainer-loser-tabContent">
<!--                <button class="buttonload">-->
                <div style="text-align: center;margin: 100px;">
                    <i class="fa fa-spinner fa-spin"></i> Loading ...
                </div>
<!--                </button>-->
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm">
            <div class="card">
                <div class="card-header">
                    <h3 class="text-center">Market News</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-xs-12">
                            <ul class="list-vertical">
                                <?php
//                                echo $http_host.'/getData.php?links=4';
                                $json = curl_get_file_contents($http_host.'/getData.php?links=4');
                                $news_data = json_decode($json);
                                foreach ($news_data as $k => $v) { ?>
                                    <li class="news-item">
                                        <h5><?php echo $k; ?></h5>
                                        <p><?php echo $v; ?></p>
                                    </li>
                                <?php } ?>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-footer">

                </div>
            </div>
        </div>
    </div>

</div>

<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
        integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
<script src="https://kit.fontawesome.com/652946a218.js" crossorigin="anonymous"></script>
<script src="Highcharts-Stock-10.1.0/highstock.js"></script>
<script src="Highcharts-Stock-10.1.0/modules/data.js"></script>
<script src="Highcharts-Stock-10.1.0/modules/exporting.js"></script>
<script src="Highcharts-Stock-10.1.0/modules/export-data.js"></script>
<script src="Highcharts-Stock-10.1.0/modules/accessibility.js"></script>
<script src="allCharts.js"></script>
<script src="jquery-3.6.0.min.js"></script>
<script type="text/javascript">
    $(document).ready(function (e) {
        $('#top-gainer-loser-tabContent').load('top_gainer_loser.php',function () {
            setTimeout(function() {
                gainer_loser_chart();
            }, 1000);
        });
    });
    function gainer_loser_chart(){
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 10; j++) {
                let id_name = 'gainerloser' + i + 'Price' + j;
                let price_data = [];
                if(document.getElementById(id_name) !== null){
                    price_data = document.getElementById(id_name).getAttribute('data-price').split(',').map(element => {
                        return Number(element);
                    });


                    Highcharts.chart(id_name, {
                        chart: {
                            margin: [0, 0, 0, 0],
                            height: 50,
                            style: {overflow: "visible"},
                            colors: ["#FF5A5A"]
                        },
                        title: {text: ""},
                        credits: {enabled: !1},
                        legend: {enabled: !1},
                        xAxis: {labels: {enabled: !1}, tickLength: 0},
                        yAxis: {
                            title: {text: null},
                            labels: {enabled: !1},
                            tickLength: 0,
                        },
                        series: [{
                            fillColor: "rgba(124, 181, 236, 0.3)",
                            type: "area",
                            name: 'Price',
                            data: price_data
                        }],
                        exporting: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                },
                                pointStart: 1
                            }
                        }
                    });
                }
                let volume_id_name = 'gainerloser' + i + 'Volume' + j;
                if(document.getElementById(volume_id_name) !== null) {
                    let volume_data = document.getElementById(volume_id_name).getAttribute('data-volume').split(',').map(element => {
                        return Number(element);
                    });
                    Highcharts.chart(volume_id_name, {
                        chart: {
                            margin: [0, 0, 0, 0],
                            height: 50,
                            style: {overflow: "visible"},
                            colors: ["#FF5A5A"]
                        },
                        title: {text: ""},
                        credits: {enabled: !1},
                        legend: {enabled: !1},
                        xAxis: {labels: {enabled: !1}, tickLength: 0},
                        yAxis: {
                            title: {text: null},
                            labels: {enabled: !1},
                            tickLength: 0,
                        },
                        series: [{
                            fillColor: "rgba(124, 181, 236, 0.3)",
                            type: "column",
                            name: "Volume",
                            data: volume_data
                        }],
                        exporting: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                },
                                pointStart: 1
                            }
                        }
                    });
                }
            }
        }
    }
    // document.addEventListener("DOMContentLoaded", function () {
    //
    // });

</script>
</body>
</html>
<!--CREATE TABLE `gainer_loser` (
`id` int NOT NULL AUTO_INCREMENT,
`stock` varchar(200) NOT NULL,
`price` float(10,2) NOT NULL,
`volume` int NOT NULL,
`created_date` datetime NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;-->