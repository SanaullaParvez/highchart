<?php
$servername = "localhost";
$username = "admin";
$password = "D@cker";
$dbname = "idlc";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}