function setupLogin()
{
	window.resizeTo(850, 700);
	if (debugLogin) {alert('setupLogin() called');}
	clearMenus();
	clearFunctions();
	clearContent();
	clearMessages();
	getSeed();
	setUpLoginPanel();
}

function logout()
{
	resetLogin();
	setupLogin();
}

function resetLogin()
{
	loggedIn = false;
	hasSeed = false;
}

// getSeed method:  gets a seed from the server for this session
// 	should we switch to a cookie sessionid system?
function getSeed() 
{		
	// only get a seed if we're not logged in
	if (!loggedIn && !hasSeed) {
		if (debugLogin) {
			alert('controller.js:  getSeed()');
		}			
		var seedCallback  = 
		{
			success:	seedSuccess,
			failure:	seedFailure
		}
		url = QUERY + '?task=getseed';
		var cObj = YAHOO.util.Connect.asyncRequest('GET',url,seedCallback,null);
	} 
}

function seedSuccess(o) 
{
	if (debugLogin) {
		alert('seedCallback success!');
	}
	xmldoc = o.responseXML;
	seed_id = xmldoc.getElementsByTagName('id').item(0).firstChild.data;
	seed = xmldoc.getElementsByTagName('seed').item(0).firstChild.data;
	if (debugLogin) { alert('controller.js:  handleHttpGetSeed() with response --> ' + seed_id + ',' + seed); }
	hasSeed = true;
}

function seedFailure(o) 
{
	if (debugLogin) {
		alert('seedCallback failure with error message: ' + o.statusText);
	}
}

// validateLogin method: validates a login request
function validateLogin()
{

	// get form form elements 'username' and 'password'
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;

	// ignore if either is empty
	if (username != '' && password  != '') {
		// compute the hash of the hash of the password and the seed
		hash = hex_md5(hex_md5(password) + seed);
		if (debugLogin) {
			alert("controller.js:  validateLogin() called:  " + username + "/" + password);
		}		

		var loginCallback  = 
		{
			success:	loginSuccess,
			failure:	loginFailure
		}
		
		url = QUERY + '?task=getlogin&username='+username+'&id='+seed_id+'&hash='+hash;
		var cObj = YAHOO.util.Connect.asyncRequest('GET', url, loginCallback, null);
	}
}

function loginSuccess(o) 
{
	if (debugLogin) {
		alert('loginCallback success!');
	}
	xmldoc = o.responseXML;

	if (xmldoc.getElementsByTagName('error').item(0).hasChildNodes())
	{
		loggedIn = false;
		loginFailure(xmldoc.getElementsByTagName('error').item(0).firstChild.data);
		
	} else {
		hasSeed = false;
		loggedIn = true;
		user.name = xmldoc.getElementsByTagName('name').item(0).firstChild.data;
		user.userID = xmldoc.getElementsByTagName('idNum').item(0).firstChild.data; 
		user.privileges = xmldoc.getElementsByTagName('authlevel').item(0).firstChild.data;
		user.lastLogin = xmldoc.getElementsByTagName('lastlogin').item(0).firstChild.data;
		user.userMessage = xmldoc.getElementsByTagName('message').item(0).firstChild.data;
		user.gamesPermitted = parseInt(xmldoc.getElementsByTagName('permitted').item(0).firstChild.data);
		getDefaults();
		getUserStatus();
	}
}

function loginFailure(msg) 
{
	if (debugLogin) {
		alert('login failure with error message: ' + o.statusText);
	}
	
	window.alert(msg);
	logout();
	setupLogin();
}

function getDefaults()
{
	var defaultsCallback  = 
	{
		success:	defaultsSuccess,
		failure:	defaultsFailure
	}
	
	url = QUERY + '?task=getdefaults';
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, defaultsCallback, null);
}

function defaultsSuccess(o) 
{
	defaults = new Array();
	var rows = o.responseXML.getElementsByTagName('default');
	if (debugDefaults) { alert('controller.js:  defaultsSuccess() returned OK with ' + rows.length + ' rows.');}
	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		key = row.getElementsByTagName('key').item(0).firstChild.data;
		value = row.getElementsByTagName('value').item(0).firstChild.data;
		if (debugDefaults) { alert('defaultsSuccess() adding defaults[' + key + '] = ' + value); }
		defaults[key] = value;
	}
	if (debugDefaults) {
		alert('controller.js:  handleHttpDefaults():  defaults are --> ' + defaults);
	}
}

function defaultsFailure(o) 
{
	if (debugDefaults) {
		alert('controller.js:  defaultsFailure() with message --> ' + o.statusText);
	}		
}

function getUserStatus()
{
	var userStatusCallback  = 
	{
		success:	statusSuccess,
		failure:	statusFailure
	}
	
	url = QUERY + '?task=getuserstatus&id=' + user.userID;
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, userStatusCallback, null);
}

function statusSuccess(o) 
{
//	alert('statusSuccess.')
	var row = o.responseXML;
	if (debugDefaults) { alert('controller.js:  getuserstatus() returned OK with ' + rows.length + ' rows.'); }
	if (row.getElementsByTagName("error")[0].childNodes.length)
	{
		alert('Error detected.  Creating new user status info.')
		createNewUserStatusInformation();			
	} else
	{			
		user_status.money = parseInt(row.getElementsByTagName('currentMoney').item(0).firstChild.data);
		user_status.lastGamePlayed = parseInt(row.getElementsByTagName('lastGamePlayed').item(0).firstChild.data);
		showUserStatus('Current Bank:  ' + user_status.money + '<br />Games Remaining:  ' + (user.gamesPermitted - user_status.lastGamePlayed));
		showLogin();
	}
}

function statusFailure(o) 
{
	if (debugDefaults) {
		alert('controller.js:  defaultsFailure() with message --> ' + o.statusText);
	}		
}

function createNewUserStatusInformation()
{
	alert('createNewUserStatusInformation()')
	var userStatusCreationCallback  = 
	{
		success:	createstatusSuccess,
		failure:	createstatusFailure
	}
	
	url = QUERY + '?task=createuserstatus&id=' + user.userID;
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, userStatusCreationCallback, null);
}

function createstatusSuccess(o) 
{
	var rows = o.responseXML.getElementsByTagName('getuserstatus');
	if (debugDefaults) { alert('controller.js:  getuserstatus() returned OK with ' + rows.length + ' rows.');}
	if (rows.length > 0)
	{
		user_status.money = parseInt(row.getElementsByTagName('currentMoney').item(0).firstChild.data);
		user_status.lastGamePlayed = parseInt(row.getElementsByTagName('currentMoney').item(0).firstChild.data);
		showUserStatus(createUserStatusString());
		showLogin();
	} 
}

function createUserStatusString()
{
	return 'Current Bank:  ' + user_status.money + '<br />Games Remaining:  ' + (user.gamesPermitted - user_status.lastGamePlayed);
}

function createstatusFailure(o) 
{
	if (debugDefaults) {
		alert('controller.js:  defaultsFailure() with message --> ' + o.statusText);
	}		
}

function findDefaultWithKey(key)
{
	if (debugDefaults) { 
		alert('controller.js:  findDefaultWithKey:  finding ' + key);
	}
	if (!(temp = defaults[key])) {
		return ""; 
	} else {
		return defaults[key];
	}
}

function startGame()
{
	if (user_status.lastGamePlayed < user.gamesPermitted)
	{
		currentGame = user_status.lastGamePlayed + 1;
		
		window.alert("You are about to play game number " + currentGame + " of " + user.gamesPermitted);
		getRounds(currentGame);
	} else {
		window.alert("I'm sorry.  You have played all the games!");
	}
}

function getRounds(forGame)
{
	var roundsCallback =
	{
		success:   roundsSuccess,
		failure:   roundsFailure 
	}
	
	url = 	QUERY + '?task=getgame&id=' + forGame;
//	window.alert(url);
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, roundsCallback, null);
}

function roundsSuccess(o)
{
		var results;
		rounds = new Array();
		var rows = o.responseXML.getElementsByTagName('round');
		// loop through the rounds; at the end of the loop, each array entry will contain
		// an array with the fields from the db
		for (i = 0; i < rows.length; i++) {
			id = rows[i].getElementsByTagName('roundid').item(0).firstChild.data;
			num = new String(rows[i].getElementsByTagName('roundnumber').item(0).firstChild.data);
			dbid = parseInt(rows[i].getElementsByTagName('roundid').item(0).firstChild.data);
			c1 = new String(rows[i].getElementsByTagName('choice1').item(0).firstChild.data);
			c2 = new String(rows[i].getElementsByTagName('choice2').item(0).firstChild.data);
			c3 = new String(rows[i].getElementsByTagName('choice3').item(0).firstChild.data);
			c4 = new String(rows[i].getElementsByTagName('choice4').item(0).firstChild.data);
			hc1 = new String(rows[i].getElementsByTagName('hiddenchoice1').item(0).firstChild.data);
			hc2 = new String(rows[i].getElementsByTagName('hiddenchoice2').item(0).firstChild.data);
			wc = new String(rows[i].getElementsByTagName('winningchoice').item(0).firstChild.data);
			rounds[id] = new Round(num, dbid, c1, c2, c3, c4, hc1, hc2, wc);
		}
		if (rounds.length > 0) {
			createRoundMenus();
			showUserStatus(createUserStatusString());			
		}
		currentRoundNumber = 1;
}

function roundsFailure(o)
{
	
}

function placeBet()
{
	showUserStatus(createUserStatusString());
	c1 = document.getElementById('c1').value;
	c2 = document.getElementById('c2').value;
	c3 = document.getElementById('c3').value;
	c4 = document.getElementById('c4').value;
	
	c1filled = (c1.length > 0);
	c2filled = (c2.length > 0);
	c3filled = (c3.length > 0);
	c4filled = (c4.length > 0);
		
	var bet = 0;
	var netResult = 0;
	var choiceNumber = 0;
	var choiceString = '';
//	window.alert("Bets:  " + c1 + ", " + c2 + ", " + c3 + ", " + c4);

	// ^ xor operator
	if (c1filled ^ c2filled ^ c3filled ^ c4filled)
	{
		if (c1filled)
		{
			bet = c1;
			choiceNumber = 1;
			odds = currentRound.choice1;
		} else if (c2filled)
		{
			bet = c2;
			choiceNumber = 2;
			odds = currentRound.choice2;
		} else if (c3filled)
		{
			bet = c3;
			choiceNumber = 3;
			odds = currentRound.choice3;
		} else if (c4filled)
		{
			bet = c4;
			choiceNumber = 4;
			odds = currentRound.choice4;
		}
		
//		window.alert(choiceNumber + " : " + bet + " : " + odds);
//		window.alert(user_status.money);

		if (bet <= user_status.money) {
			netResult = validateBet(choiceNumber, bet, odds);
			user_status.money = user_status.money + netResult;
			if ((currentRoundNumber <= ROUNDS_PER_GAME) && (user_status.money > 0))
			{
				// reset to next round IF we are not done the game AND if the user still has any money
				currentRoundNumber++;		
				createRoundMenus();
				clearContentPanel();
			} else {
				// the game is complete!
				if (user_status.money <= 0)
				{
					// user cannot play any more games.
					user.userMessage = 'You ran out of money.';
				} else if (user_status.lastGamePlayed >= user.gamesPermitted) {
					user.userMessage = 'All games completed!';					
				} else {
					// user cannot play any more games!
					user_status.lastGamePlayed = user_status.lastGamePlayed + 1;
				}
				clearContentPanel();
				refreshMessages();
				refreshMenus();		
			}
			showUserStatus(createUserStatusString());	
		} else {
			window.alert('You bet too much money.  You have ' + user_status.money + ' remaining!');
			showUserStatus(createUserStatusString());
			playRound();		
		}
	} else {
		window.alert("You can only place a single bet.  Please try again!");
		showUserStatus(createUserStatusString());
		playRound();
	}
}

function userEligible()
{
//	window.alert("games: " + user_status.lastGamePlayed + "; money: " + user_status.money);
	return ((user_status.lastGamePlayed <= user.gamesPermitted) && (user_status.money > 0));
}


// this doesn't GET CALLED? == START HERE!!!
function validateBet(choiceNumber, bet, odds)
{
	var result = 0;
	var resultString = 'The winner was:  ' + odds + ':1.';
	if (choiceNumber == currentRound.winningchoice)
	{
		result = bet * odds;
		resultString = resultString + 'You won ' + result + '.';
	} else {
		result = (-1) * bet;
		resultString = resultString + 'You lost ' + result + '.';
	}
	window.alert(resultString);	
	return result;
}

function getClasses() 
{

	var classesCallback  = 
	{
		success:	classesSuccess,
		failure:	classesFailure
	}
	
	url = QUERY + '?task=getclasses&teacherid=' + user.teacherID;
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, classesCallback, null);
}

function classesSuccess(o) 
{
	/*
		return is as follows:  
		<getclasses>
			<number></number>
			<course>
				<courseid></courseid>
				<coursetitle></coursetitle>
			</course>
		</getclasses>
	
	*/
	user.courses = new Array();
	rows = o.responseXML.getElementsByTagName('course');
	for (i = 0; i < rows.length; i++) {
		// put the comma-separated strings into the classesArray, thus
		// each entry would look like:  6824-1, Algebra 2
		courseid = rows[i].getElementsByTagName('courseid').item(0).firstChild.data;
		coursetitle = rows[i].getElementsByTagName('coursetitle').item(0).firstChild.data;					
		user.courses[courseid] = coursetitle;
	}
	createClassesMenu();
}

function classesFailure(o) 
{
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugClassesMenu) { alert('controller.js:  handleHttpGetClasses returned error --> ' + error.data); }
	}
}

function editClassInterims() 
{
	clearContent();	
	var classes = document.getElementById('classes');
	var selectedOption = classes.selectedIndex;
	var selectedClassID = classes.options[selectedOption].value;
	currentClassName = classes.options[selectedOption].text;
	
	if (debugEditInterims) {
		alert('controller.js:  editWithClass() value --> ' + selectedClassID);
	}

	// get an array of all the students in the class
	getStudentNames(selectedClassID);
}

function namesSuccess(o) 
{
	/*
	<student>
		<studentid></studentid>
		<firstname></firstname>
		<lastname></lastname>
		<status></status>
	</student>
	*/
	if (!YAHOO.util.Connect.isCallInProgress(cObj)) {
		var results;
		studentsArray = new Array();
		var rows = o.responseXML.getElementsByTagName('student');
		if (debugStudentNames) { alert('controller.js ::  namesSuccess() returned ' + rows.length + ' rows'); }	
		// loop through the students; at the end of the loop, each array entry will contain
		// an array with the fields from the db
		for (i = 0; i < rows.length; i++) {
			id = rows[i].getElementsByTagName('studentid').item(0).firstChild.data;
			lastName = new String(rows[i].getElementsByTagName('lastname').item(0).firstChild.data);
			firstName = new String(rows[i].getElementsByTagName('firstname').item(0).firstChild.data);
			name = lastName.toUpperCase();
			name = name + ', ';
			name = name + firstName.substring(0, 1).toUpperCase() + firstName.substr(1).toLowerCase();
			modified = rows[i].getElementsByTagName('modified').item(0).firstChild.data;
			studentsArray[id] = new Student(id, name, modified);
		}
		if (studentsArray.length > 0) {
			createNamesMenu();
		}
		YAHOO.util.Connect.releaseObject(cObj);
	} else if (debugStudentNames) {
		alert('controller.js :: namesSuccess is in progress')
	}
}

function namesFailure(o) 
{
	if (debugNames) {
		alert('namesFailure');
	}

}

function getStudentNames(selectedClassID) 
{	
	if (debugStudentNames) { alert('controller.js:  getStudentNames(): ' + selectedClassID); }
	var namesCallback  = 
	{
		success:	namesSuccess,
		failure:	namesFailure
	}
	url = QUERY + '?task=getstudentnames&courseid=' + selectedClassID;
	cObj = YAHOO.util.Connect.asyncRequest('GET', url, namesCallback, null);
}

function getStudentInterim (studentID, courseID)
{
	var readInterimCallback =
	{
		success:	readInterimSuccess,
		failure:	readInterimFailure
	}

	targetRow = document.getElementById(studentID);
	targetRow.className = 'active';
	url = QUERY + '?task=getstudent&courseid=' + courseID + '&studentid=' + studentID;
	cObj = YAHOO.util.Connect.asyncRequest('GET', url, readInterimCallback, null);
}

// 	todo:  read in interim and create the view

function readInterimSuccess (o)
{
	if (!YAHOO.util.Connect.isCallInProgress(cObj)) {
		// there will only be one row, hopefully :-(
		result = o.responseXML.getElementsByTagName('student').item(0);
		
		studentid = result.getElementsByTagName('studentid').item(0).firstChild.data;
		student = studentsArray[studentid];
		student.setOut(result.getElementsByTagName('out').item(0).firstChild.data);
		student.setSat(result.getElementsByTagName('sat').item(0).firstChild.data);
		student.setUnsat(result.getElementsByTagName('unsat').item(0).firstChild.data);
		student.setFail(result.getElementsByTagName('failing').item(0).firstChild.data);
		student.setComments(result.getElementsByTagName('comments').item(0).firstChild.data);
		student.setCodes(result.getElementsByTagName('codes').item(0).firstChild.data);
		createInterimEditPane(student);
		YAHOO.util.Connect.releaseObject(cObj);
	}
}

function readInterimFailure (o)
{

}

function getCodes() 
{
	var codesCallback = 
	{
		success:	codesSuccess,
		failure:	codesFailure
	}
	url = QUERY + '?task=getcodes';
	cobj = YAHOO.util.Connect.asyncRequest('GET', url, codesCallback, null);
	return cobj;
}

function codesSuccess(o) 
{
	rows = o.responseXML.getElementsByTagName('code');
	codesArray = new Array();
	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		id = row.getElementsByTagName('codeid').item(0).firstChild.data;
		text = row.getElementsByTagName('text').item(0).firstChild.data;
		display = row.getElementsByTagName('order').item(0).firstChild.data;
		code = new Code(id, text);
		codesArray[display] = code;
	}
}

function codesFailure(o)
{
	alert('codes failure');
}

function validateCheckboxPairs(thesource) 
{
	checkboxes = document.getElementsByName(thesource);
	if (!checkboxes[0] || !checkboxes[1]) { return; }
	if (checkboxes[0].checked && checkboxes[1].checked) {
		alert('Error:  only one checkbox may be selected for this interim code category');
		checkboxes[0].checked = false;
		checkboxes[1].checked = false;
	}
}

function resetAllRowStatus() 
{
	t = document.getElementById('ntable');
	for (i = 0; i < t.rows.length; i++) {
		row = t.rows[i];
		alert('resetting:  ' + row.id + " to " + studentsArray[row.id].modified);
		if (studentsArray[row.id].modified > findDefaultWithKey(OPENS_KEY)) {
			row.className = 'edited';
		} else {
			row.className = 'unedited';
		}
	}
}