<?php
// loader to load all important files

define('SERVER_URL', "http://".$_SERVER['SERVER_NAME']."/Strassenverbesserer/"); define('SERVER_DIR', "C:/Users/PunktSpnstNichts/Desktop/xampp/htdocs/Strassenverbesserer/");


define('DEVELOPMODE', false);

$old_chdir = getcwd();
chdir(SERVER_DIR);

function is_session_started(){
    if ( php_sapi_name() !== 'cli' ) {
        if ( version_compare(phpversion(), '5.4.0', '>=') ) {
            return session_status() === PHP_SESSION_ACTIVE ? TRUE : FALSE;
        } else {
            return session_id() === '' ? FALSE : TRUE;
        }
    }
    return FALSE;
}


function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}


#validates strings, arrays, json's against xss, sql_injections & more
include("includes/functions/f_validate.php");

#language
include("includes/functions/language.php");

#database (note that c_database.php includes the value)
include("includes/c_database.php");


#add more here


chdir($old_chdir); // resets everything
?>