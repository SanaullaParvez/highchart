<?php
header("Access-Control-Allow-Origin: *");
// Read the JSON file

$market_index = file_get_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketIndex/2022-06-06');
$market_trade = file_get_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketTrade/2022-06-06');
$last_market_price = file_get_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketPrice');
$market_news = file_get_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/MarketNews/2022-06-06');
$company_wise_sector = file_get_contents('http://i-trade.idlc.com/IDLCCapitalMarketDataService/CapMarketDataService.svc/CompanyWiseSector');
// Decode the JSON file
//$json_data = json_decode($json,true);

// Display data
if ($_GET['links'] == 1)
    print_r($market_index);
elseif ($_GET['links'] == 2)
    print_r($market_trade);
elseif ($_GET['links'] == 3)
    print_r($last_market_price);
elseif ($_GET['links'] == 4) {
//    $json = file_get_contents('http://localhost/highchart/getData.php?links=4');
    $news_data = json_decode($market_news);
    //$news_data = $json;
    //echo typeof()
    $all_news = [];
    $today = strtotime(date('Y-m-d 00:00:00'));
    foreach ($news_data as $news) {
        $news_time = strtotime($news->NEWSTIME);
        //    if(date('d/m/y') == date('d/m/y', $news_time)){
        if ($news_time > $today) {
            //        $all_news[date('G:i:s', $news_time)] = [$news->INSTRUMENT,$news->NEWS];
            $all_news[$news->INSTRUMENT] = $news->NEWS;
        }
    }
    print_r(json_encode($all_news));
} elseif ($_GET['links'] == 5)
    print_r($company_wise_sector);
elseif ($_GET['links'] == 6) {
//    $json = file_get_contents('http://localhost/highchart/getData.php?links=4');
    $gainer_loser = json_decode($last_market_price);

    //////////////////////**********************************////////////////////////////////
    require 'DBConnection.php';
    $sql = "SELECT stock,group_concat(price) price,group_concat(volume) volume
            FROM dhcp.gainer_loser 
            where DATE(created_date) = CURDATE() 
            group by stock";
    $result = $conn->query($sql);
    $all_volumn = [];
    $all_price = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $all_volumn[$row["stock"]] = $row["volume"];
            $all_price[$row["stock"]] = $row["price"];
//            echo "Stock: " . $row["stock"]. " - Price: " . $row["price"]. " Volume: " . $row["volume"]. "<br>";
        }
    } else {
        echo "0 results";
    }
    $conn->close();
    //////////////////////**********************************////////////////////////////////
    $all_news = [];
    $today = strtotime(date('Y-m-d 00:00:00'));
    foreach ($gainer_loser as $gl) {
        $all_gl = [];
//        $news_time = strtotime($gl->TIME);
//        if($news_time > $today){
        $all_gl['Stocks'] = $gl->INSTRUMENT;
        $all_gl['LTP'] = $gl->LASTTRADEPRICE;
        $all_gl['YCP'] = $gl->YESTARDAYCLOSEPRICE;
//        $all_gl['%'] = round((($gl->YESTARDAYCLOSEPRICE - $gl->LASTTRADEPRICE)/$gl->YESTARDAYCLOSEPRICE)*100,2)
        if ($gl->LASTTRADEPRICE == 0 || $gl->YESTARDAYCLOSEPRICE == 0) {
            $all_gl['GL'] = 'E';
            $all_gl['%'] = 0;
        } else {
            if ($gl->LASTTRADEPRICE > $gl->YESTARDAYCLOSEPRICE) {
                $all_gl['GL'] = 'G';
            } else if ($gl->LASTTRADEPRICE < $gl->YESTARDAYCLOSEPRICE) {
                $all_gl['GL'] = 'L';
            } else {
                $all_gl['GL'] = 'E';
            }
            $all_gl['%'] = round((($gl->LASTTRADEPRICE - $gl->YESTARDAYCLOSEPRICE) / $gl->YESTARDAYCLOSEPRICE) * 100, 2);
        }
        $all_gl['Value'] = $gl->{'TOTALVALUE(MN)'};
        $all_gl['Volume'] = $gl->TOTALVOLUME;
        $all_gl['Trade'] = $gl->TOTALTRADES;
        $all_gl['Price'] = $all_price[$gl->INSTRUMENT];//$gl->OPENPRICE;
        $all_gl['Volumes'] = $all_volumn[$gl->INSTRUMENT];//$gl->TOTALVOLUME;

//        }
        array_push($all_news, $all_gl);
    }
    if ($_GET['sort_key'] == 'top_value') {
        array_multisort(array_column($all_news, 'Value'), SORT_DESC, $all_news);
    } else if ($_GET['sort_key'] == 'top_gainer') {
        array_multisort(array_column($all_news, '%'), SORT_DESC, $all_news);
    } else if ($_GET['sort_key'] == 'top_loser') {
        array_multisort(array_column($all_news, '%'), SORT_ASC, $all_news);
    } else if ($_GET['sort_key'] == 'top_volume') {
        array_multisort(array_column($all_news, 'Volume'), SORT_DESC, $all_news);
    } else if ($_GET['sort_key'] == 'top_trade') {
        array_multisort(array_column($all_news, 'Trade'), SORT_DESC, $all_news);
    }
    print_r(json_encode(array_slice($all_news,0,10)));
}elseif ($_GET['links'] == 'get_gl') {
//    $json = file_get_contents('http://localhost/highchart/getData.php?links=4');
    $gainer_loser = json_decode($last_market_price);
    //$news_data = $json;
    //echo typeof()
    $all_news = [];
    $today = strtotime(date('Y-m-d 00:00:00'));
    foreach ($gainer_loser as $gl) {
        $all_gl = [];
        $all_gl['INSTRUMENT'] = $gl->INSTRUMENT;
        $all_gl['OPENPRICE'] = $gl->OPENPRICE;
        $all_gl['TOTALVOLUME'] = $gl->TOTALVOLUME;
        $all_gl['TIME'] = $date = date('Y-m-d H:i:s', strtotime($gl->TIME));
        array_push($all_news, $all_gl);
    }
    print_r(json_encode($all_news));
}elseif ($_GET['links'] == 'set_gl') {
    require 'DBConnection.php';
    $sql = "SELECT stock,group_concat(price) price,group_concat(volume) volume
            FROM dhcp.gainer_loser 
            where DATE(created_date) = CURDATE() 
            group by stock order by created_date ASC";
    $result = $conn->query($sql);
    $all_volumn = [];
    $all_price = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $all_volumn[$row["stock"]] = $row["volume"];
            $all_price[$row["stock"]] = $row["price"];
//            echo "Stock: " . $row["stock"]. " - Price: " . $row["price"]. " Volume: " . $row["volume"]. "<br>";
        }
    } else {
        echo "0 results";
    }
    $conn->close();
//    echo $all_volumn['BDAUTOCA'];
//    print_r($all_volumn);
//    print_r($all_price);

} else
    print_r([]);


?>
