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
                <div class="tab-pane fade show active" id="top-value" role="tabpanel" aria-labelledby="top-value-tab">
                    <div class="top-chart-container ng-scope">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered table-responsive">
                                <thead>
                                <tr>
                                    <th>Stocks</th>
                                    <th>LTP</th>
                                    <th>%</th>
                                    <th>Value</th>
                                    <th>Volume</th>
                                    <th>Trade</th>
                                    <th>Price</th>
                                    <th>Volume</th>
                                </tr>
                                </thead>
                                <tbody>
                                <!-- ngRepeat: value in topVal -->
                                <?php
                                $market_json = file_get_contents('http://localhost/highchart/getData.php?links=6&sort_key=top_value');
                                $market_price = json_decode($market_json);
                                foreach ($market_price as $k => $v) { ?>
                                    <tr ng-repeat="value in topVal" class="ng-scope" style="">
                                        <?php //print_r($v); ?>
                                        <td class="ng-binding"><?php echo $v->Stocks; ?></td>
                                        <td class="ng-binding"><?php echo $v->LTP; ?></td>
                                        <td class="ng-binding">
                                            <?php
                                            if ($v->GL == 'G')
                                                echo '<i class="fa fa-thin fa-long-arrow-up text-success"></i>';
                                            else if ($v->GL == 'L')
                                                echo '<i class="fa fa-thin fa-long-arrow-down text-danger"></i>';
                                            else
                                                echo '<i class="fa fa-thin fa-arrows-v text-success"></i>';
                                            ?><?php echo $v->{'%'}; ?> %
                                        </td>
                                        <td class="ng-binding"><?php echo $v->Value; ?></td>
                                        <td class="ng-binding"><?php echo $v->Volume; ?></td>
                                        <td class="ng-binding"><?php echo $v->Trade; ?></td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Price; ?>
                                            <div data-price="<?php echo $v->Price; ?>"
                                                 id="gainerloser1Price<?php echo $k; ?>"></div>
                                        </td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Volumes; ?>
                                            <div data-volume="<?php echo $v->Volumes; ?>"
                                                 id="gainerloser1Volume<?php echo $k; ?>"></div>
                                        </td>
                                    </tr>
                                <?php } ?>
                                <!-- end ngRepeat: value in topVal -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="top-gainer" role="tabpanel" aria-labelledby="top-gainer-tab">
                    <div class="top-chart-container ng-scope">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered table-responsive">
                                <thead>
                                <tr>
                                    <th>Stocks</th>
                                    <th>LTP</th>
                                    <th>%</th>
                                    <th>Value</th>
                                    <th>Volume</th>
                                    <th>Trade</th>
                                    <th>Price</th>
                                    <th>Volume</th>
                                </tr>
                                </thead>
                                <tbody>
                                <!-- ngRepeat: value in topVal -->
                                <?php
                                $market_json = file_get_contents('http://localhost/highchart/getData.php?links=6&sort_key=top_gainer');
                                $market_price = json_decode($market_json);
                                foreach ($market_price as $k => $v) { ?>
                                    <tr ng-repeat="value in topVal" class="ng-scope" style="">
                                        <?php //print_r($v); ?>
                                        <td class="ng-binding"><?php echo $v->Stocks; ?></td>
                                        <td class="ng-binding"><?php echo $v->LTP; ?></td>
                                        <td class="ng-binding">
                                            <?php
                                            if ($v->GL == 'G')
                                                echo '<i class="fa fa-thin fa-long-arrow-up text-success"></i>';
                                            else if ($v->GL == 'L')
                                                echo '<i class="fa fa-thin fa-long-arrow-down text-danger"></i>';
                                            else
                                                echo '<i class="fa fa-thin fa-arrows-v text-success"></i>';
                                            ?><?php echo $v->{'%'}; ?> %
                                        </td>
                                        <td class="ng-binding"><?php echo $v->Value; ?></td>
                                        <td class="ng-binding"><?php echo $v->Volume; ?></td>
                                        <td class="ng-binding"><?php echo $v->Trade; ?></td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Price; ?>
                                            <div data-price="<?php echo $v->Price; ?>"
                                                 id="gainerloser2Price<?php echo $k; ?>"></div>
                                        </td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Volumes; ?>
                                            <div data-volume="<?php echo $v->Volumes; ?>"
                                                 id="gainerloser2Volume<?php echo $k; ?>"></div>
                                        </td>
                                    </tr>
                                <?php } ?>
                                <!-- end ngRepeat: value in topVal -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="top-loser" role="tabpanel" aria-labelledby="top-loser-tab">
                    <div class="top-chart-container ng-scope">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered table-responsive">
                                <thead>
                                <tr>
                                    <th>Stocks</th>
                                    <th>LTP</th>
                                    <th>%</th>
                                    <th>Value</th>
                                    <th>Volume</th>
                                    <th>Trade</th>
                                    <th>Price</th>
                                    <th>Volume</th>
                                </tr>
                                </thead>
                                <tbody>
                                <!-- ngRepeat: value in topVal -->
                                <?php
                                $market_json = file_get_contents('http://localhost/highchart/getData.php?links=6&sort_key=top_loser');
                                $market_price = json_decode($market_json);
                                foreach ($market_price as $k => $v) { ?>
                                    <tr ng-repeat="value in topVal" class="ng-scope" style="">
                                        <?php //print_r($v); ?>
                                        <td class="ng-binding"><?php echo $v->Stocks; ?></td>
                                        <td class="ng-binding"><?php echo $v->LTP; ?></td>
                                        <td class="ng-binding">
                                            <?php
                                            if ($v->GL == 'G')
                                                echo '<i class="fa fa-thin fa-long-arrow-up text-success"></i>';
                                            else if ($v->GL == 'L')
                                                echo '<i class="fa fa-thin fa-long-arrow-down text-danger"></i>';
                                            else
                                                echo '<i class="fa fa-thin fa-arrows-v text-success"></i>';
                                            ?><?php echo $v->{'%'}; ?> %
                                        </td>
                                        <td class="ng-binding"><?php echo $v->Value; ?></td>
                                        <td class="ng-binding"><?php echo $v->Volume; ?></td>
                                        <td class="ng-binding"><?php echo $v->Trade; ?></td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Price; ?>
                                            <div data-price="<?php echo $v->Price; ?>"
                                                 id="gainerloser3Price<?php echo $k; ?>"></div>
                                        </td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Volumes; ?>
                                            <div data-volume="<?php echo $v->Volumes; ?>"
                                                 id="gainerloser3Volume<?php echo $k; ?>"></div>
                                        </td>
                                    </tr>
                                <?php } ?>
                                <!-- end ngRepeat: value in topVal -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="top-volume" role="tabpanel" aria-labelledby="top-volume-tab">
                    <div class="top-chart-container ng-scope">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered table-responsive">
                                <thead>
                                <tr>
                                    <th>Stocks</th>
                                    <th>LTP</th>
                                    <th>%</th>
                                    <th>Value</th>
                                    <th>Volume</th>
                                    <th>Trade</th>
                                    <th>Price</th>
                                    <th>Volume</th>
                                </tr>
                                </thead>
                                <tbody>
                                <!-- ngRepeat: value in topVal -->
                                <?php
                                $market_json = file_get_contents('http://localhost/highchart/getData.php?links=6&sort_key=top_volume');
                                $market_price = json_decode($market_json);
                                foreach ($market_price as $k => $v) { ?>
                                    <tr ng-repeat="value in topVal" class="ng-scope" style="">
                                        <?php //print_r($v); ?>
                                        <td class="ng-binding"><?php echo $v->Stocks; ?></td>
                                        <td class="ng-binding"><?php echo $v->LTP; ?></td>
                                        <td class="ng-binding">
                                            <?php
                                            if ($v->GL == 'G')
                                                echo '<i class="fa fa-thin fa-long-arrow-up text-success"></i>';
                                            else if ($v->GL == 'L')
                                                echo '<i class="fa fa-thin fa-long-arrow-down text-danger"></i>';
                                            else
                                                echo '<i class="fa fa-thin fa-arrows-v text-success"></i>';
                                            ?><?php echo $v->{'%'}; ?> %
                                        </td>
                                        <td class="ng-binding"><?php echo $v->Value; ?></td>
                                        <td class="ng-binding"><?php echo $v->Volume; ?></td>
                                        <td class="ng-binding"><?php echo $v->Trade; ?></td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Price; ?>
                                            <div data-price="<?php echo $v->Price; ?>"
                                                 id="gainerloser4Price<?php echo $k; ?>"></div>
                                        </td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Volumes; ?>
                                            <div data-volume="<?php echo $v->Volumes; ?>"
                                                 id="gainerloser4Volume<?php echo $k; ?>"></div>
                                        </td>
                                    </tr>
                                <?php } ?>
                                <!-- end ngRepeat: value in topVal -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="top-trade" role="tabpanel" aria-labelledby="top-trade-tab">
                    <div class="top-chart-container ng-scope">
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered table-responsive">
                                <thead>
                                <tr>
                                    <th>Stocks</th>
                                    <th>LTP</th>
                                    <th>%</th>
                                    <th>Value</th>
                                    <th>Volume</th>
                                    <th>Trade</th>
                                    <th>Price</th>
                                    <th>Volume</th>
                                </tr>
                                </thead>
                                <tbody>
                                <!-- ngRepeat: value in topVal -->
                                <?php
                                $market_json = file_get_contents('http://localhost/highchart/getData.php?links=6&sort_key=top_trade');
                                $market_price = json_decode($market_json);
                                foreach ($market_price as $k => $v) { ?>
                                    <tr ng-repeat="value in topVal" class="ng-scope" style="">
                                        <?php //print_r($v); ?>
                                        <td class="ng-binding"><?php echo $v->Stocks; ?></td>
                                        <td class="ng-binding"><?php echo $v->LTP; ?></td>
                                        <td class="ng-binding">
                                            <?php
                                            if ($v->GL == 'G')
                                                echo '<i class="fa fa-thin fa-long-arrow-up text-success"></i>';
                                            else if ($v->GL == 'L')
                                                echo '<i class="fa fa-thin fa-long-arrow-down text-danger"></i>';
                                            else
                                                echo '<i class="fa fa-thin fa-arrows-v text-success"></i>';
                                            ?><?php echo $v->{'%'}; ?> %
                                        </td>
                                        <td class="ng-binding"><?php echo $v->Value; ?></td>
                                        <td class="ng-binding"><?php echo $v->Volume; ?></td>
                                        <td class="ng-binding"><?php echo $v->Trade; ?></td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Price; ?>
                                            <div data-price="<?php echo $v->Price; ?>"
                                                 id="gainerloser5Price<?php echo $k; ?>"></div>
                                        </td>
                                        <td style="width: 200px">
                                            <?php //echo $v->Volumes; ?>
                                            <div data-volume="<?php echo $v->Volumes; ?>"
                                                 id="gainerloser5Volume<?php echo $k; ?>"></div>
                                        </td>
                                    </tr>
                                <?php } ?>
                                <!-- end ngRepeat: value in topVal -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
                            <ul class="demo1">
                                <?php
                                $json = file_get_contents('http://localhost/highchart/getData.php?links=4');
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
<script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function () {
        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < 10; j++) {
                let id_name = 'gainerloser' + i + 'Price' + j;
                let price_data = document.getElementById(id_name).getAttribute('data-price').split(',').map(element => {
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
                let volume_id_name = 'gainerloser' + i + 'Volume' + j;
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
    });

</script>
</body>
</html>
<!--CREATE TABLE `dhcp`.`gainer_loser` (-->
<!--`id` INT NOT NULL,-->
<!--`stock` VARCHAR(200) NOT NULL,-->
<!--`price` FLOAT(10,2) NOT NULL,-->
<!--`volume` INT(20) NOT NULL,-->
<!--`time` DATETIME NOT NULL,-->
<!--PRIMARY KEY (`id`));-->
