<?php
if(!defined('SERVER_DIR')){ // if loader isn't called yet
	include("loader.php");
}

if ( is_session_started() === FALSE ) session_start(); // If main.php is called directly

$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : false;
if(!$user_id){ // log in or register
?>
<link rel="stylesheet" type="text/css" href="<?php echo SERVER_URL; ?>scripte/css/addpoint.css">
<div id="popupbox">
	<div id="loginorregister">
		<div id="heading">
			<?php echo _t("Log in or register if you want to add a point to the map."); ?>
		</div>
		<div id="popup_interaction_wrapper">
			<div id="login">
				<input type="text" name="user" placeholder="<?php echo _t("Your name or email"); ?>" />
				<input type="text" name="passw" placeholder="<?php echo _t("password"); ?>" />
			</div>
			<div id="popup_interaction_wrapper_divider"></div>
			<div id="register">
			
			</div>
		</div>
	</div>
</div>
<?php
}else{
?>
<div id="popupbox">

</div>
<?php
}
?>