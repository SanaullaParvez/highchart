<style>
    table, th, td {
        border: 1px solid black;
    }
</style>

<?php
require 'curl_get_file_contents.php';
$company_wise_sector = curl_get_file_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/CompanyWiseSector');
$last_market_price = curl_get_file_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketPrice');
$companies = json_decode($company_wise_sector);
$gainer_loser = json_decode($last_market_price);
?>
<table>
    <tr>
        <th>SECTORNAME</th>
        <th>INSTRUMENT</th>
    </tr>
    <?php
    $allSector = [];
    $allValue = [];
    foreach ($companies as $val) {
        if (array_key_exists($val->SECTORNAME,$allSector)){
            array_push($allSector[$val->SECTORNAME],$val->INSTRUMENT);
        } else {
            $allSector[$val->SECTORNAME] = array($val->INSTRUMENT);
        }
    }
    foreach ($gainer_loser as $val) {
        $allValue[$val->INSTRUMENT] = $val->{'TOTALVALUE(MN)'};
    }
    foreach ($allSector as $k=>$v) {
        $total = 0;
        ?>
<tr>
    <td><?php  echo $k; ?></td>
    <td>
        <table>
            <tr>
                <th>Name</th>
                <th>Value</th>
            </tr>
            <?php
            foreach ($v as $val) {
            ?>
            <tr>
                <td><?php echo $val;?></td>
                <td><?php echo $allValue[$val];$total += $allValue[$val];?></td>
            </tr>
            <?php } ?>
            <tr>
                <th>Total</th>
                <th><?php echo $total;?></th>
            </tr>
        </table>
    </td>
</tr>
        <?php

    }
    ?>
</table>
<?php  print_r($allValue); ?>
