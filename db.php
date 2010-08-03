<?php

if(isset($_SERVER['PATH_INFO'])) $short = route($_SERVER['PATH_INFO']);

function db_connect(){
	/***** Start configuration ******/
	$username = 'root';
	$password = '';
	$hostname = 'localhost';
	$database = 'tenkiwi';
	/***** End configuration ******/
	
	if(!($link = mysql_connect($hostname, $username, $password))) 
		return cleanup();
	if(!mysql_select_db($database))
		return cleanup('', $link);
	mysql_set_charset('utf8', $link);
	return $link;
}
function cleanup($val = '', $link = false, $result = false){
	if($result) mysql_free_result($result);
	if($link) mysql_close($link);
	return $val;
}

function route($route){
	if($route=='/save'){save();}
	if($route=='/load'){load();}
}
function save(){
	$link = db_connect();
	$page = mysql_real_escape_string($_POST['title']);
	$content = mysql_real_escape_string($_POST['content']);
	$q = sprintf("INSERT INTO pages (title, content) VALUES ('%s', '%s') ON DUPLICATE KEY UPDATE content='%s'", $page, $content, $content);
	$res = mysql_query($q); 
	cleanup('', $link);
	echo 'saved '.$page. ' with '.$q;
}
function load(){
	$link = db_connect();
	$page = mysql_real_escape_string($_REQUEST['title']);
	$q = sprintf("SELECT * FROM pages WHERE title = '%s'",$page);
	$res = mysql_query($q); 
	if($r = mysql_fetch_assoc($res)){
		$r['error'] = false;
		$r['b'] = $_REQUEST['b'];
		echo json_encode($r);
	}
	else{
		echo json_encode(array('error' => true, 'title' => $_REQUEST['title'], 'b' => $_REQUEST['b']));
	}
	cleanup('', $link);
}