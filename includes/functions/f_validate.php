<?php
function validate($clientside_var){
	if(is_numeric($clientside_var)){
		return $clientside_var; // no security issue
	}elseif(@json_decode($clientside_var, true) && count(@json_decode($clientside_var, true)) >= 1){
		return html_entity_decode(json_encode(search_array(json_decode($clientside_var, true))));
	}elseif(is_array($clientside_var) && count($clientside_var) >= 1){
		return search_array($clientside_var);
	}else{ // handle as string
		return html_entity_decode(strip_tags_content($clientside_var, "<b><i><div><img><br></br><span>"));
	}

}

function search_array($array){
$return_arr = array();
if(!is_array($array)){
	return false;
}
foreach($array as $key => $value){
	$newkey = htmlspecialchars($key);
	if(is_array($value)){
		$newvalue = search_array($value);
	}else{
		$newvalue = strip_tags_content($value, "<b><i><div><img><br></br>");
	}
	$return_arr[$newkey] = $newvalue;
}
return $return_arr;
}
function strip_tags_content($text, $tags = '', $invert = FALSE) {  //http://php.net/manual/de/function.strip-tags.php //needed for function validate

  preg_match_all('/<(.+?)[\s]*\/?[\s]*>/si', trim($tags), $tags); 
  $tags = array_unique($tags[1]); 
    
  if(is_array($tags) AND count($tags) > 0) { 
    if($invert == FALSE) { 
      return preg_replace('@<(?!(?:'. implode('|', $tags) .')\b)(\w+)\b.*?>.*?</\1>@si', '', $text); 
    } 
    else { 
      return preg_replace('@<('. implode('|', $tags) .')\b.*?>.*?</\1>@si', '', $text); 
    } 
  } 
  elseif($invert == FALSE) { 
    return preg_replace('@<(\w+)\b.*?>.*?</\1>@si', '', $text); 
  } 
  return $text; 
}

function highlight($text, $words) {
    // return $text if there is no strings given.
    if(strlen($text) < 1 || strlen($words) < 1) {
        return $text;
    }
    preg_match_all("/$words+/i", $text, $matches);
    if (is_array($matches[0]) && count($matches[0]) >= 1) {
        foreach ($matches[0] as $match) {
            $text = str_replace($match, '<span style="background-color:'.$highlightColorValue.';">'.$match.'</span>', $text);
        }
    }
    return $text;
}
?>