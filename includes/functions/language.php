<?php
if ( is_session_started() === FALSE ) session_start();

if((!array_key_exists ("language", $_COOKIE) || $_COOKIE["language"] == "")){
	$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
	switch ($lang){
		case "de":
			$lang = "de";
			break;
		case "it":
			$lang = "it";
			break;
		case "en":
			$lang = "en";
			break;
		default:
			$lang = "en";
			break;
	}
	setcookie("language", $lang, time()+3600);
	define("LANGUAGE", $lang);
	header('Content-Type: text/html; charset=ISO-8859-1'); //CHARSET depending on lang
}else{
	define("LANGUAGE", validate($_COOKIE["language"]));
}

function _t($text = "", $specific_lang_folder = ""){
	if("" == $text){
		return "no text"; //drop error
	}else{
		if(@get_translation($text, $specific_lang_folder) !== false){
			//return utf8_encode(get_translation($text, $specific_lang_folder));
			return get_translation($text, $specific_lang_folder);
		}else{
			$db = new database();
			$translationscheck_sql = "SELECT id, priority FROM `translations` WHERE `original` ='$text' LIMIT 1;";
			$translationscheck_result = $db->mysql_o->query($translationscheck_sql);
			if($translationscheck_result->num_rows == 0){
				$update_translation = 'INSERT INTO `translations` SET original = "'.$text.'", min_edit_points = 10';
				$db->mysql_o->query($update_translation);
			}else{ // updating langfile if translation exists in database, if not: increasing priority here
				$original = $translationscheck_result->fetch_object();
				$original_id = $original->id;
				$original_priority = $original->priority;
				
				$translationcheck_sql = "SELECT * FROM `translations_".LANGUAGE."` WHERE `original_id` ='".$original_id."' LIMIT 1;";
				$translationcheck_result = $db->mysql_o->query($translationcheck_sql);	
				if($translationcheck_result->num_rows == 0){
					$new_priority = $original_priority + 1;
					$update_translation = 'UPDATE `translations` SET priority = "'.$new_priority.'" WHERE id = '.$original_id;
					$db->mysql_o->query($update_translation);				
				}else{
					chdir(SERVER_DIR);
					$updatet_list = "<?php\r\n";
					$translation_sql = "SELECT *, `translations`.`id` AS `id` FROM  `translations` LEFT JOIN `translations_".LANGUAGE."` ON `translations`.`id` = `translations_".LANGUAGE."`.`original_id`";
					$translation_result = $db->mysql_o->query($translation_sql);
					while($translation = $translation_result->fetch_object()){
						$translation_text = str_replace('"', '&quot;', $translation->translation); // should also happen on writing in db
						$translation_text = str_replace("'", '&#39;', $translation_text);
						if($translation->translation != "" ){
							$updatet_list .= '$lang[\''.$translation->original.'\'] = \''.utf8_decode($translation_text)."';\r\n";
						}
					}
					$updatet_list .= "?>";
					$langfile = "lang/lang_".LANGUAGE.".php";
					$handle = fopen($langfile, "wb");
					$langfile="\xEF\xBB\xBF".$langfile; // utf8 - Magie
					fputs($handle, $updatet_list);
					fclose($handle);
				}
			}
			return $text;
		}
	}
}

function get_translation($text, $specific_lang_folder, $sp = ""){
	#get standard lang package
	$old_chdir = getcwd();
	chdir(SERVER_DIR);
	include "lang/lang_".LANGUAGE.".php";
	chdir( $old_chdir );
	if(isset($lang) && isset($lang[$text]) && $lang[$text] != ""){
		if(is_array($lang[$text])){
			return $lang[$text][rand( 0,(count($lang[$text]) -1 ))];
		}else{
			return $lang[$text];
		}
	}else{
		return false;
	}
}

function _tjson($text = "", $string = true){ // translate jsonstring
	if("" == $text){
		return false; //drop error
	}elseif(!json_decode($text)){
		return false; // drop error
	}else{
		$text_arr = json_decode($text, true);
		if(count($text_arr) == 0){
			return false; // drop error
		}else{
			if($string){
				if(count($text_arr) == 1){
					return $text_arr[key($text_arr)];
				}else{
					if(array_key_exists(LANGUAGE, $text_arr)){
						return $text_arr[LANGUAGE];
					}elseif(array_key_exists("en", $text_arr)){
						return $text_arr["en"];
					}
				}
			}else{
				return $text_arr;
			}
		}
	}
}

function r_t($text){ // reverse translation
    $db = new database();
    $select_original = "SELECT original_id FROM `translations_".LANGUAGE."` WHERE translation = \"".$text."\"";
    $select_original_result = $db->mysql_o->query($select_original);
    if($select_original_result->num_rows > 0){
		$select_original_el = $select_original_result->fetch_object();
		$select_translation_sql = "SELECT original FROM `translations` WHERE id = $select_original_el->original_id";
		$select_translation_result = $db->mysql_o->query($select_translation_sql);
		if($select_translation_result->num_rows > 0){
			$select_translation_el = $select_translation_result->fetch_object();
			return $select_translation_el->original;
		}else{
			return false; // Add to db
		}
    }else{
		return strtolower($text); // Add to db
    }
}
?>