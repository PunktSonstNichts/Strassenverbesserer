<?php
if(!defined('SERVER_DIR')){ // if loader isn't called yet
	include("loader.php");
}

if ( is_session_started() === FALSE ) session_start(); // If main.php is called directly
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html">
<meta charset="ISO-8859-1">
<title>Straßenverbesserer</title>
<script src="<?php echo SERVER_URL; ?>external/jquery/jquery.min.js"></script>
<script src="<?php echo SERVER_URL; ?>external/jquery/jquery-ui.js"></script>
<script src="<?php echo SERVER_URL; ?>scripte/js/lightbox.js"></script>
<script src="<?php echo SERVER_URL; ?>scripte/js/dialog.js"></script>
<script src="<?php echo SERVER_URL; ?>scripte/js/index.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo SERVER_URL; ?>scripte/css/framework.css">
<link rel="stylesheet" type="text/css" href="<?php echo SERVER_URL; ?>scripte/css/dialog.css">
<link rel="stylesheet" type="text/css" href="<?php echo SERVER_URL; ?>scripte/css/lightbox.css">
<link rel="stylesheet" type="text/css" href="<?php echo SERVER_URL; ?>scripte/css/index.css">
<link href="<?php echo SERVER_URL; ?>external/font-awesome-4.3.0/css/font-awesome.css" rel="stylesheet">
<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' />
<script src='https://api.tiles.mapbox.com/mapbox.js/v1.6.2/mapbox.js'></script>
<link href='https://api.tiles.mapbox.com/mapbox.js/v1.6.2/mapbox.css' rel='stylesheet' />
</head>
<body>
<div id="nav">
	<div class="wrapper">
		<div id="nav_flexbox">
			<div id="logo"><span>Strassenverbesserer</span></div>
			<div id="searchbar"></div>
		</div>
	</div>
</div>
<div id="mask_bg">
	<div id="mask">
		<form id="search" action="search.php" method="get" class="wide">
			<input type="text"   id="index_form_input"  class="input" name="q" placeholder="<?php echo _t("Search here"); ?>..." required>
			<input type="submit" id="index_form_submit" class="btn btn_success flat" value="<?php echo _t("search!"); ?>"/>
		</form>
		<div id="promobox">
			<span class="promo"><?php echo sprintf(_t('%d users already'), 450);?></span>
		</div>
	</div>
</div>
<div class="wrapper" id="informationbox">
<h3><?php echo _t("What is Strassenverbesserer?"); ?></h3>
<p><?php echo _t("The goal of Strassenverbesserer is to mark points or streets that needs improvement."); ?></p>
</div>
</body>
</html>