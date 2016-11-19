<?php

function clearSeeds() 
{
	
	$sql = 'TRUNCATE `int_seeds`';
	mysql_query($sql);	
	
}

function getseed() 
{

	global $debug, $aXMLRespTypes;

	clearSeeds();
	mysql_query('INSERT INTO int_seeds VALUES()');
	if ($debug) {
		echo 'actions.php :: getseed() l.6 OK' . '<br />';
	}
	$result = mysql_query('SELECT id, seed FROM int_seeds');
	$error = '';

	if (!$result) {
		$error = mysql_error();
	} else {
		$error = '';
	}

	$row = mysql_fetch_assoc($result);
	// avoid putting NULL into the variables
	if ($row['id']) {
		$id = $row['id'];
	} else {
		$id = '';
	}
	
	if ($row['seed']) {
		$seed = $row['seed'];
	} else {
		$seed = '';
	}
	if ($debug) {
		echo 'actions.php :: getseed() l.32 OK' . '<br />';
		echo '$output = ' . $id . '; ' . $seed;
	}

	$output = sprintf($aXMLRespTypes['getseed'], $error, $id, $seed);
	
	if ($debug) {
		echo 'actions.php :: getseed() l.38 OK' . '<br />';
		echo $aXMLRespTypes['getseed'];
		echo '$output = ' . $output;
	}
	
	return $output;
}

function getlogin() 
{
	global $debug, $aXMLRespTypes;
	
	if ($_GET['username']) {
		$username = $_GET['username'];
	} else {
		$username = $_POST['username'];
	}
	
	if ($_GET['id']) {
		$id = $_GET['id'];
	} else {
		$id = $_POST['id'];
	}
	
	if ($_GET['hash']) {
		$hash = $_GET['hash'];
	} else {
		$hash = $_POST['hash'];
	}

	$sql = 'SELECT * FROM int_users WHERE username = \'' . mysql_real_escape_string($username) . '\'';
	$result = mysql_query($sql);
	$error = '';

	if (!$result) {
		$error = mysql_error();				
	} else {
		$error = '';
	}

	$user_row = mysql_fetch_assoc($result);
	if (!$user_row) {
		$error = 'Bad username/password combination';
	}
	$sql = 'SELECT * FROM int_seeds WHERE id=' . (int)$id;
	$result = mysql_query($sql);
			// fetch the seed (the only one in the db)
	$seed_row = mysql_fetch_assoc($result);

	if (!$seed_row) {
		$error = 'Hacking attempt; login failed';
	}

	clearSeeds();
	
	if ( (md5(md5($user_row['password']) . $seed_row['seed']) == $hash) ) {
		// success!  the user has logged in
		$name = $user_row['firstName'] . ' ' . $user_row['lastName'];
		$sdid = $user_row['pk_ID'];
		$auth = $user_row['auth_level'];
		
		$lastlogin = $user_row['last_login'];
		
		// update last_login to the current date/time
		$sql = 'UPDATE `scifair_bhgray_site_aplus_net`.`int_users` SET `last_login` = `NOW()` WHERE `int_users`.`pk_ID` = ' . (int)$id . ' LIMIT 1;'; 
		mysql_query($sql);

		// is user has never logged in, then set the last_login to now() also....
		if ($lastlogin == NULL) {
			$sql = 'SELECT `last_login` FROM int_users WHERE `int_users`.`pk_ID` = ' . (int)$id . ';';
			$result = mysql_query($sql);
			$login_row = mysql_fetch_assoc($result);
			$lastlogin = $login_row['last_login'];
		}

		$message = $user_row['message'];
		if ($message == NULL) {
			$message = ' ';
		}	
		
		$permitted = $user_row['gamesPermitted'];
		$surveyTaken = $user_row['surveyTaken'];
		$displayName = $user_row['displayName'];
	} else {
		$error = $error . 'Invalid username/password combination';
		$name = '';
		$sdid = '';
		$auth = '';
		$lastlogin = '';
		$message = '';
		$permitted = '';
		$surveyTaken = '';
		$displayName = '';
	}
	$output = sprintf($aXMLRespTypes['getlogin'], $error, $name, $sdid, $auth, $lastlogin, $message, $permitted, $surveyTaken, $displayName);
	return $output;
}

function getuserstatus()
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;

	if ($_GET['id']) {
		$id = $_GET['id'];
	} else {
		$id = $_POST['id'];
	}	
	
	$sql = 'SELECT * FROM int_user_status WHERE fk_userID = \'' . mysql_real_escape_string($id) . '\'';
	$result = mysql_query($sql);
	$error = '';
	if (!$result) {
		$error = mysql_error();
	} else {
		$error = '';
	}
	
	$user_status_row = mysql_fetch_assoc($result);
	if (!$user_status_row)
	{
		$error = 'No User Status Found.';
	} else
	{
		$error = '';
		$lastGamePlayed = $user_status_row['fk_lastGamePlayed'];
		$currentMoney = $user_status_row['currentMoney'];		
	}
	
	$output = sprintf($aXMLRespTypes['getuserstatus'], $error, $lastGamePlayed, $currentMoney);	
	return $output;
}

function createuserStatus()
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;

	if ($_GET['id']) {
		$id = $_GET['id'];
	} else {
		$id = $_POST['id'];
	}	

	$sql = 'INSERT INTO `scifair_bhgray_site_aplus_net`.`int_user_status` (`fk_userID`, `fk_lastGamePlayed`, `currentMoney`) VALUES (\'' . mysql_real_escape_string($id) . '\', \'0\', \'0\')';
	$result = mysql_query($sql);
	$error = '';
	if (!$result) {
		$error = mysql_error();
	} else {
		$error = '';
	}
	
	$sql = 'SELECT * FROM int_user_status WHERE pk_id = \'' . mysql_real_escape_string($id) . '\'';
	$result = mysql_query($sql);
	$error = '';
	if (!$result) {
		$error = mysql_error();
	} else {
		$error = '';
	}

	$user_status_row = mysql_fetch_assoc($result);

	if (!$user_status_row)
	{
		$error = 'No User Status Found';
		$lastGamePlayed = '';
		$currentMoney = '';
	} else
	{
		$lastGamePlayed = $user_status_row['fk_lastGamePlayed'];
		$currentMoney = $user_status_row['currentMoney'];		
	}
	
	$output = sprintf($aXMLRespTypes['getuserstatus'], $error, $lastGamePlayed, $currentMoney);
	return $output;	
}

function getgame()
{
//	echo 'getGame()';
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
	
	if ($_GET['id']) {
		$tid = $_GET['id'];
	} else {
		$tid = $_POST['id'];
	}
	$sql = 'SELECT * FROM `int_Round` WHERE `fk_gameID` = ' . $tid . ' LIMIT 0, 30';
	
	$result = mysql_query($sql);
	$error = '';
	if (!$result) {
		$error = mysql_error();				
	} else {
		$error = '';
	}
	// we should now have a bunch of rows of rounds for the current game
	/*
	<round>
		<roundid>%s</roundid>
		<roundnumber>%s</roundnumber>
		<choice1>%s</choice1>
		<choice2>%s</choice2>
		<choice3>%s</choice3>
		<choice4>%s</choice4>
		<hiddenchoice1>%s</hiddenchoice1>
		<hiddenchoice2>%s</hiddenchoice2>
		<winningchoice>%s</winningchoice>
	</round>
	*/
	$roundstring = '';
	while ($round_row = mysql_fetch_assoc($result)) {
		$roundstring = $roundstring . sprintf($sXMLDefaultTemplates['sXMLroundTemplate'], $round_row['pk_roundID'], $round_row['roundNumber'], $round_row['choice1'], $round_row['choice2'], $round_row['choice3'], $round_row['choice4'], $round_row['hiddenChoice1'],$round_row['hiddenChoice2'],$round_row['winningChoice']);
	}
	$output = sprintf($aXMLRespTypes['getgame'], $error, $roundstring);
	return $output;
	
		
}

function writebackgame()
{
	global $debug, $aXMLRespTypes;
	
	if ($_GET['playerID']) { 
		$playerID = $_GET['playerID']; 
	} else { 
		$playerID = $_POST['playerID']; 
	} 
	
	if ($_GET['gameNumber']) { 
		$gameNumber = $_GET['gameNumber']; 
	} else { 
		$gameNumber = $_POST['gameNumber']; 
	} 
	
	if ($_GET['moneyAtStart']) { 
		$moneyAtStart = $_GET['moneyAtStart']; 
	} else { 
		$moneyAtStart = $_POST['moneyAtStart']; 
	} 
	
	if ($_GET['netResult']) { 
		$netResult = $_GET['netResult']; 
	} else { 
		$netResult = $_POST['netResult']; 
	} 

	$sql = sprintf("INSERT INTO `scifair_bhgray_site_aplus_net`.`int_PlayedGame` (`pk_playedGameID`, `gameNumber`, `datePlayed`, `moneyAtStart`, `netResult`, `fk_playerID`) VALUES (NULL, %d, NOW(), %d, 0, %d);", 
		$gameNumber, $moneyAtStart, $playerID);

	$result = mysql_query($sql); 

	$error = ''; 
	if (!$result) { 
		$error = mysql_error();				 
	} else { 
		$error = ''; 
	} 

	$output = sprintf($aXMLRespTypes['writebackgame'], $error, mysql_affected_rows(), $playerID); 
	return $output;	
}

function writeuserpreferences()
{
	global $debug, $aXMLRespTypes;
	
	if ($_GET['userID']) { 
		$userID = $_GET['userID']; 
	} else { 
		$userID = $_POST['userID']; 
	} 
	
	if ($_GET['displayName']) { 
		$displayName = $_GET['displayName']; 
	} else { 
		$displayName = $_POST['displayName']; 
	} 
	
	if ($_GET['password']) { 
		$password = $_GET['password']; 
	} else { 
		$password = $_POST['password']; 
	}
	
	
	if (strlen($displayName) > 0)
	{
		$changeName = true;
	} 
	
	if (strlen($password) > 0)
	{
		$changePassword = true;
	}
	
	
	if ($changeName && $changePassword)
	{
		$sql = sprintf("UPDATE `scifair_bhgray_site_aplus_net`.`int_users` SET `password` = '%s', `displayName` = '%s'  WHERE `int_users`.`pk_ID` = %d LIMIT 1", mysql_real_escape_string($password), mysql_real_escape_string($displayName), $userID);
	} else if ($changeName)
	{
		$sql = sprintf("UPDATE `scifair_bhgray_site_aplus_net`.`int_users` SET `displayName` = '%s'  WHERE `int_users`.`pk_ID` = %d LIMIT 1", mysql_real_escape_string($displayName), $userID);
	} else if ($changePassword)
	{
		$sql = sprintf("UPDATE `scifair_bhgray_site_aplus_net`.`int_users` SET `password` = '%s'  WHERE `int_users`.`pk_ID` = %d LIMIT 1", mysql_real_escape_string($password), $userID);
	}

//	echo $sql;
	$result = mysql_query($sql); 

	$error = ''; 
	if (!$result) { 
		$error = mysql_error();				 
	} else { 
		$error = ''; 
	} 

	$output = sprintf($aXMLRespTypes['writeuserpreferences'], $error, mysql_affected_rows(), $userID); 
	return $output;	
}

function writebackuserstatus()
{
	global $debug, $aXMLRespTypes;
	
	if ($_GET['userID']) { 
		$userID = $_GET['userID']; 
	} else { 
		$userID = $_POST['userID']; 
	} 

	if ($_GET['lastGamePlayed']) { 
		$lastGamePlayed = $_GET['lastGamePlayed']; 
	} else { 
		$lastGamePlayed = $_POST['lastGamePlayed']; 
	} 

	if ($_GET['currentMoney']) { 
		$currentMoney = $_GET['currentMoney']; 
	} else { 
		$currentMoney = $_POST['currentMoney']; 
	} 


	$sql = sprintf("UPDATE `scifair_bhgray_site_aplus_net`.`int_user_status` SET `fk_lastGamePlayed` = '%s', `currentMoney` = '%s'  WHERE `int_user_status`.`fk_userID` = %d LIMIT 1;", $lastGamePlayed, $currentMoney, $userID);

//	echo $sql;
	
	$result = mysql_query($sql); 

	$error = ''; 
	if (!$result) { 
		$error = mysql_error();				 
	} else { 
		$error = ''; 
	} 

	$output = sprintf($aXMLRespTypes['writebackuserstatus'], $error, mysql_affected_rows(), $playerID); 
	return $output;	

	
}

function writebackround()
{
	global $debug, $aXMLRespTypes;
	
	if ($_GET['roundNumber']) { 
		$roundNumber = $_GET['roundNumber']; 
	} else { 
		$roundNumber = $_POST['roundNumber']; 
	} 
	
	if ($_GET['gameNumber']) { 
		$gameNumber = $_GET['gameNumber']; 
	} else { 
		$gameNumber = $_POST['gameNumber']; 
	} 
	
	if ($_GET['moneyBet']) { 
		$moneyBet = $_GET['moneyBet']; 
	} else { 
		$moneyBet = $_POST['moneyBet']; 
	} 
	
	if ($_GET['moneyAtStart']) { 
		$moneyAtStart = $_GET['moneyAtStart']; 
	} else { 
		$moneyAtStart = $_POST['moneyAtStart']; 
	} 

	if ($_GET['choiceSelected']) { 
		$choiceSelected = $_GET['choiceSelected']; 
	} else { 
		$choiceSelected = $_POST['choiceSelected']; 
	} 

	if ($_GET['netResult']) { 
		$netResult = $_GET['netResult']; 
	} else { 
		$netResult = $_POST['netResult']; 
	}
	
	if ($_GET['winningChoice']) { 
		$winningChoice = $_GET['winningChoice']; 
	} else { 
		$winningChoice = $_POST['winningChoice']; 
	}
	
	if ($_GET['timestamp']) { 
		$timestamp = $_GET['timestamp']; 
	} else { 
		$timestamp = $_POST['timestamp']; 
	}

	if ($_GET['playerID']) { 
		$playerID = $_GET['playerID']; 
	} else { 
		$playerID = $_POST['playerID']; 
	}

	$sql = sprintf("INSERT INTO `scifair_bhgray_site_aplus_net`.`int_PlayedRound` (`pk_PlayedRoundID`, `roundNumber`, `gameNumber`, `moneyBet`, `moneyAtStart`, `choiceSelected`, `netResult`, `winningChoice`, `timestamp`, `fk_playerID`) VALUES (NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s);", 
		mysql_real_escape_string($roundNumber), mysql_real_escape_string($gameNumber), mysql_real_escape_string($moneyBet), mysql_real_escape_string($moneyAtStart), mysql_real_escape_string($choiceSelected), mysql_real_escape_string($netResult), $winningChoice, mysql_real_escape_string($timestamp), mysql_real_escape_string($playerID));

//	echo $sql;

	$result = mysql_query($sql); 

	$error = ''; 
	if (!$result) { 
		$error = mysql_error();				 
	} else { 
		$error = ''; 
	} 

	$output = sprintf($aXMLRespTypes['writebackround'], $error, mysql_affected_rows(), $playerID); 
	return $output;	
	
	
}

function getdefaults ( )
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
	
	$sql = "SELECT * from `int_defaults`";
	$result = mysql_query($sql);
	$error = '';
	
	if (!$result) {
		$error = mysql_error();	
	} else {
		$error = '';
	}

	$defaultsstring = '';
	while ($row = mysql_fetch_assoc($result)) {
		$key = $row['key'];
		$value = $row['value'];
		$defaultsstring = $defaultsstring . sprintf($sXMLDefaultTemplates['sXMLdefaultTemplate'], $key, $value);
	}
	$output = sprintf($aXMLRespTypes['getdefaults'], $error, $defaultsstring);
	return $output;
}

function getcodes (  )
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;

	$sql = sprintf("SELECT * from `int_codes` ORDER BY displayOrder");
	$result = mysql_query($sql);
	$error = '';
	if (!$result) {
		$error = mysql_error();				
	} else {
		$error = '';
	}

	$codesstring = '';
	while ($row = mysql_fetch_assoc($result)) {
		$code = $row['code'];
		$text = $row['text'];
		$order = $row['displayOrder'];
		$codesstring = $codesstring . sprintf($sXMLDefaultTemplates['sXMLcodeTemplate'], $code, $text, $order);
	}
	$output = sprintf($aXMLRespTypes['getcodes'], $error, $codesstring);
	return $output;
}

function getstudentnames (  )
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
		
	if ($_GET['courseid']) {
		$cid = $_GET['courseid'];
	} else {
		$cid = $_POST['courseid'];
	}
	
	$sql = sprintf("SELECT * from `int_rosters`, `int_students` WHERE int_rosters.courseID = '%s' AND int_rosters.studentID = int_students.studentID ORDER BY int_students.lastName, int_students.firstName", mysql_real_escape_string($cid));
	$result = mysql_query($sql);
	$error = '';
	if (!$result) {
		$error = mysql_error();				
	} else {
		$error = '';
	}
	
	if (mysql_affected_rows() == 0 ) {
		$error = 'no rows for course ' . $cid;	
	}
	
	$studentsstring = '';
	while ($student_row = mysql_fetch_assoc($result)) {
		$firstname = $student_row['firstName'];
		$lastname = $student_row['lastName'];
		$studentid = $student_row['studentID'];
		$modified = $student_row['modified'];
		$studentsstring = $studentsstring . sprintf($sXMLDefaultTemplates['sXMLstudentNameTemplate'], $studentid, $firstname, $lastname, $modified);
	}
	
	$output = sprintf($aXMLRespTypes['getstudentnames'], $error, $studentsstring);
	return $output;
}

function getleaderboard()
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
	$sql = "SELECT s.fk_userID, s.currentMoney, u.displayName, u.username, s.fk_lastGamePlayed, u.pk_ID FROM int_user_status AS s, int_users AS u WHERE (s.currentMoney > 0 and s.fk_userID = u.pk_ID) ORDER BY s.currentMoney ASC LIMIT 20";
	$result = mysql_query($sql);
	$error = '';

	if (count($result) == 0) {
		$error = mysql_error();
		if (strlen($error) == 0) {
			$error = 'no leaders yet!';
		}
	}
	
	$leaderstring = '';
	
	while ($leader_row = mysql_fetch_assoc($result)) {
		$displayName = $leader_row['displayName'];
		$money = $leader_row['currentMoney'];
		$gamesPlayed = $leader_row['fk_lastGamePlayed'];
		$highestGame = $leader_row['highestGame'];
		$leaderstring = $leaderstring . sprintf($sXMLDefaultTemplates['sXMLleaderTemplate'], $displayName, $money, $gamesPlayed, $highestGame);
	}
	$output = sprintf($aXMLRespTypes['getleaderboard'], $error, $leaderstring);
	return $output;
}

function getstudent ( )
{
	global $debug, $debugXML, $aXMLRespTypes, $sXMLDefaultTemplates;
	
	if ($_GET['courseid']) {
		$cid = $_GET['courseid'];
	} else {
		$cid = $_POST['courseid'];
	}
	if ($_GET['studentid']) {
		$sid = $_GET['studentid'];
	} else {
		$sid = $_POST['studentid'];
	}
	
	$sql = sprintf("SELECT * from int_students, int_rosters WHERE int_students.studentID = int_rosters.studentID AND int_rosters.studentID = '%s' AND int_rosters.courseID = '%s'", mysql_real_escape_string($sid), mysql_real_escape_string($cid));
	$result = mysql_query($sql);
	$error = '';

	if (count($result) == 0) {
		$error = mysql_error();
		if (strlen($error) == 0) {
			$error = 'no record found for class: ' . $cid . '; student: ' . $sid;
		}
	}
	
	$studentsstring = '';
	
	while ($student_row = mysql_fetch_assoc($result)) {
		$firstname = $student_row['firstName'];
		$lastname = $student_row['lastName'];
		$studentid = $student_row['studentID'];
		$out = $student_row['outstanding'];
		if ($out == NULL) {
				$out = '0';
			}
		$sat = $student_row['satisfactory'];
		if ($sat == NULL) {
				$sat = '0';
			}
		$unsat = $student_row['unsatisfactory'];
		if ($unsat == NULL) {
				$unsat = '0';
			}
		$fail = $student_row['failing'];
		if ($fail == NULL) {
				$fail = '0';
			}
		$comm = $student_row['comments'];
		if ($comm == NULL) {
				$comm = ' ';
			}
		$mod = $student_row['modified'];
		if ($mod == NULL) {
				$mod = ' ';
			}
		$modby = $student_row['modified_by'];
		if ($modby == NULL) {
				$modby = ' ';
		}
		$codes = $student_row['codes'];
		if ($codes == NULL) {
				$codes = ' ';
		}
		$studentsstring = $studentsstring . sprintf($sXMLDefaultTemplates['sXMLstudentTemplate'], $studentid, $firstname, $lastname, $out, $sat, $unsat, $fail, $comm, $mod, $modby, $codes);
	}
	
	$output = sprintf($aXMLRespTypes['getstudent'], $error, $studentsstring);
	
	return $output;
}

?>
