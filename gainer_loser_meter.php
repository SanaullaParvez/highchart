<style>
    table, th, td {
        border: 1px solid black;
    }
</style>

<?php
require 'curl_get_file_contents.php';
$last_market_price = curl_get_file_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketPrice');
$gainer_loser = curl_get_file_contents($last_market_price);
?>
<table>
    <tr>
        <th>INSTRUMENT</th>
        <th>LASTTRADEPRICE</th>
        <th>YESTARDAYCLOSEPRICE</th>
        <th>Positive(+)</th>
        <th>Negative(-)</th>
        <th>Equal(=)</th>
    </tr>
    <?php
    $gainer = 0;
    $loser = 0;
    $unchanged = 0;
    foreach ($gainer_loser as $gl) {
        if($gl->LASTTRADEPRICE > 0){
        ?>
<tr>
    <td><?php  echo $gl->INSTRUMENT; ?></td>
    <td><?php  echo $gl->LASTTRADEPRICE; ?></td>
    <td><?php  echo $gl->YESTARDAYCLOSEPRICE; ?></td>
    <?php
        if ($gl->LASTTRADEPRICE > $gl->YESTARDAYCLOSEPRICE)
            $gainer++;
        else if ($gl->LASTTRADEPRICE < $gl->YESTARDAYCLOSEPRICE)
            $loser++;
        else
            $unchanged++;
    ?>
    <td><?php
        if ($gl->LASTTRADEPRICE > $gl->YESTARDAYCLOSEPRICE)
            echo $gainer
        ?></td>
    <td><?php
        if ($gl->LASTTRADEPRICE < $gl->YESTARDAYCLOSEPRICE)
            echo $loser
        ?></td>
    <td><?php
        if ($gl->LASTTRADEPRICE == $gl->YESTARDAYCLOSEPRICE)
            echo $unchanged
        ?></td>
</tr>
        <?php
        }
    }
    ?>
</table>