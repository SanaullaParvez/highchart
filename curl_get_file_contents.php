<?php
//header("Access-Control-Allow-Origin: *");
// Read the JSON file
function curl_get_file_contents($URL)
{
    $c = curl_init();
    curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($c, CURLOPT_URL, $URL);
    $contents = curl_exec($c);
    curl_close($c);

    if ($contents) return $contents;
    else return FALSE;
}
$http_host = 'http://'.$_SERVER['HTTP_HOST'].'/highchart';
