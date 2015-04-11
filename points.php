<?php
session_start();
include("loader.php");
$response = array();
$response["status"] = "ok";
$response["msg"] = "";
$response["points"] = array();

$db = new database;

$ne_lat = (isset($_GET["ne_lat"])) ? validate($_GET["ne_lat"]) : false;
$ne_lon = (isset($_GET["ne_lon"])) ? validate($_GET["ne_lon"]) : false;
$sw_lat = (isset($_GET["sw_lat"])) ? validate($_GET["sw_lat"]) : false;
$sw_lon = (isset($_GET["sw_lon"])) ? validate($_GET["sw_lon"]) : false;

if(!$ne_lat || !$ne_lon || !$sw_lat || !$sw_lon){
	$response["status"] = "error";
	$response["msg"] = _t("data_transmitting_error");
}else{
	$point_sql = "SELECT point.id, point.title, point.description, 
				  x( location ) AS lat, y( location ) AS lon
				  FROM `point` 
				  WHERE (x( location ) BETWEEN '$sw_lat' AND '$ne_lat') AND
				  (y( location ) BETWEEN '$sw_lon' AND '$ne_lon');";
	#echo $point_sql;
	$point_result = $db->mysql_o->query($point_sql);
	if($point_result->num_rows == 1){
		while($point = $point_result->fetch_array(MYSQLI_ASSOC)){
			$response["points"][] = $point;
		}
	}
}
echo json_encode(utf8ize($response));
?>
