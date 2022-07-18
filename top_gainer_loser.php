<?php
require 'curl_get_file_contents.php';
?>
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
                $market_json = curl_get_file_contents($http_host.'/getData.php?links=6&sort_key=top_value');
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
                $market_json = curl_get_file_contents($http_host.'/getData.php?links=6&sort_key=top_gainer');
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
                $market_json = curl_get_file_contents($http_host.'/getData.php?links=6&sort_key=top_loser');
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
                $market_json = curl_get_file_contents($http_host.'/getData.php?links=6&sort_key=top_volume');
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
                $market_json = curl_get_file_contents($http_host.'/getData.php?links=6&sort_key=top_trade');
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