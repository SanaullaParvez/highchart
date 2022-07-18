<?php
require 'DBConnection.php';
require 'curl_get_file_contents.php';
$date = date('Y-m-d H:i:s', strtotime("6/22/2022 12:32:03 PM"));
$last_market_price = curl_get_file_contents($http_host.'/getData.php?links=get_gl');
$gainer_loser = json_decode($last_market_price);
$query = "INSERT INTO gainer_loser (`stock`, `price`, `volume`, `created_date`) VALUES ";
foreach ($gainer_loser as $gl) {
    $query .= "('{$gl->INSTRUMENT}',{$gl->OPENPRICE},{$gl->TOTALVOLUME},'{$gl->TIME}'),";
}
$sql = substr($query, 0, -1);
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
$conn->close();
?>
