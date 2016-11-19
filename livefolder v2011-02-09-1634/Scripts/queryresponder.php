<?php

if ($debug) echo 'queryresponder.php :: l3 connection successful' . '<br />';

error_reporting(E_ALL);
require_once("model.php");
require_once("actions.php");

$mysql = mysql_connect('sqlc40b.carrierzone.com', 'bhgray-1', 'tabasco');

mysql_select_db('scifair_bhgray_site_aplus_net', $mysql);

if ($_GET['task']) {
	$reqtype = $_GET['task'];
} else {
	$reqtype = $_POST['task'];
}

if ($debug) echo 'queryresponder.php :: l.19' . '<br />';

switch ($reqtype) {

	case 'getseed':
		if ($debug) echo 'queryresponder.php :: l.24' . '<br />';
		$output = getseed();
		break;
	case 'getlogin':
		$output = getlogin();
		break;
	case 'getclasses':
		$output = getclasses();		
		break;
	case 'getgame':
		$output = getgame();
		break;
	 case 'getallstudents': 
 	 	$output = getallstudents();
 		break; 
 	case 'writeback': 
  		$output = writeback();
 		break; 
	case 'getdefaults':
		$output = getdefaults();
		break;
	case 'getcodes':
		$output = getcodes();
		break;
	case 'getstudentnames':
		$output = getstudentnames();
		break;
	case 'getstudent':
		$output = getstudent();
		break;
	case 'getuserstatus':
		$output = getuserstatus();
		break;
	case 'createuserstatus':
		$output = createuserstatus();
		break;
	case 'writebackgame':
		$output = writebackgame();
		break;
	case 'writebackround':
		$output = writebackround();
		break;
	case 'writebackuserstatus':
		$output = writebackuserstatus();
		break;
	case 'writeuserpreferences':
		$output = writeuserpreferences();
		break;
	case 'getleaderboard':
		$output = getleaderboard();
} // end switch

if (!empty($output))
{
	header("HTTP/1.1 200 OK");
    header("Content-type: text/xml");
    echo $sXMLHeader . $output;
}
else
{
    // no output means error
    // Send http status code. this is important because the javascript checks 
    // the http status code to determine whether to act on the response.
    header("HTTP/1.1 400 Bad Request");
} // end if

?>