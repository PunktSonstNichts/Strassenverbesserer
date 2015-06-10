<?php
if(!defined('SERVER_DIR')){ // if loader isn't called yet
	include("loader.php");
}

if( is_session_started() === FALSE ) session_start(); // If main.php is called directly

$user_id = isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : false;
if(!$user_id){ // log in or register
?>
<link rel="stylesheet" type="text/css" href="<?php echo SERVER_URL; ?>scripte/css/addpoint.css">
<div id="popupbox">
	<div id="popupbox_heading" class="btn_success flat">
		<span id="heading_span"><?php echo _t("Log in or register if you want to add a point to the map."); ?></span>
		<span id="popupbox_close" data-type="close">&times;</span>
	</div>
	<div id="loginorregister">
		<div id="popup_interaction_wrapper">
			<div id="login">
				<form id="login_form" action="" method="" class="asynch">
					<div class="input_wrapper">
						<span class="error-text" data-refferer="first_name"></span>
						<div class="input_holder">
							<label for=""><?php echo _t("name or email"); ?></label><input type="text" name="user" placeholder="<?php echo _t("Your name or email"); ?>" />
						</div>
					</div>
					<div class="input_wrapper">
						<span class="error-text" data-refferer="first_name"></span>
						<div class="input_holder">
							<label for=""><?php echo _t("password"); ?></label><input type="text" name="passw" placeholder="<?php echo _t("password"); ?>"/>
						</div>
					</div>
				</form>
			</div>
			<div id="register" style="display: none;">
				<form id="register_form" action="" method="" class="asynch">
					<div class="input_wrapper">
						<span class="error-text" data-refferer="first_name"></span>
						<div class="input_holder">
							<label for=""><?php echo _t("first name"); ?></label><input type="text" name="first_name" placeholder="<?php echo _t("first name"); ?>"/>
						</div>
					</div>
					<div class="input_wrapper">
						<span class="error-text" data-refferer="last_name"></span>
						<div class="input_holder">
							<label for=""><?php echo _t("last name"); ?></label><input type="text" name="last_name" placeholder="<?php echo _t("last name"); ?>"/>
						</div>
					</div>
					
					<div class="input_wrapper">
						<span class="error-text" data-refferer="email"></span>
						<div class="input_holder">
							<label for=""><?php echo _t("email"); ?></label><input type="text" name="email" placeholder="<?php echo _t("email"); ?>"/>
						</div>
					</div>

					<div class="input_wrapper">
						<span class="error-text" data-refferer="email"></span>
						<div class="input_holder">
							<label for=""><?php echo _t("password"); ?></label><input type="text" name="passw" placeholder="<?php echo _t("password"); ?>"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<div id="submit_area">
			<div id="login_submit"><button class="btn btn_success flat" type="submit" form="login_form"><?php echo _t("log in"); ?></button></div>
			<div id="register_submit"><button class="btn btn_success flat" type="submit" form="register_form"><?php echo _t("register"); ?></button></div>
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