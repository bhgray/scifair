function setupLogin()
{
	window.resizeTo(850, 700);
	if (debugLogin) {alert('setupLogin() called');}
	clearMenus();
	clearFunctions();
	clearContentPanel();
	clearMessages();
//	getSeed();
	setUpLoginPanel();
	setUpIntroduction();
}

function logout()
{
	clearContent();
	clearContentPanel();
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
	// setUpLoginPanel();
	// setUpIntroduction();
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
//		hash = hex_md5(hex_md5(password) + seed);
		hash = password;
		if (debugLogin) {
			alert("controller.js:  validateLogin() called:  " + username + "/" + password);
		}		

		var loginCallback  = 
		{
			success:	loginSuccess,
			failure:	loginFailure
		}
		
//		url = QUERY + '?task=getlogin&username='+username+'&id='+seed_id+'&hash='+hash;
		url = QUERY + '?task=getlogin&username='+username+'&password='+hash;
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
		user.gamesPermitted = parseInt(xmldoc.getElementsByTagName('permitted').item(0).firstChild.data);
		user.surveyTaken = parseInt(xmldoc.getElementsByTagName('surveyTaken').item(0).firstChild.data);
		user.displayName = xmldoc.getElementsByTagName('displayName').item(0).firstChild.data;
		getDefaults();
		getUserStatus();
		getLeaderboard();
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


function saveUserPreferences()
{
	// get form form elements 'username' and 'password'
	username = document.getElementById('username').value;
	password = document.getElementById('newpassword').value;
	passwordConfirm = document.getElementById('newpasswordconfirm').value;
	var savepassword = false;
	var saveusername = false;
	
	if ((password.length > 0) && (password == passwordConfirm))
	{
		var myregexp = new RegExp('^[A-Za-z][A-Za-z0-9]*');
		if (myregexp.exec())
		{
			savepassword = true;			
		} else {
			window.alert('The new password must begin with a letter and be at least 5 characters long.');
			return;
		}
	} else if (password != passwordConfirm){
		window.alert('The passwords in both fields must match.  Please try again.');
	}
	
	if (username.length > 0) {
		saveusername = true;
	}
	
	if (savepassword && saveusername) {
		url = QUERY + '?task=writeuserpreferences&userID=' + user.userID + '&displayName=' + username + '&password=' + password;
	} else if (savepassword)
	{
		url = QUERY + '?task=writeuserpreferences&userID=' + user.userID + '&password=' + password;
	} else if (saveusername)
	{
		url = QUERY + '?task=writeuserpreferences&userID=' + user.userID + '&displayName=' + username;
	} else {
		return;
	}
	
	var userPrefsCallback  = 
	{
		success:	userPrefsSuccess,
		failure:	userPrefsFailure
	}
	
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, userPrefsCallback, null);
	clearContentPanel();
}

function userPrefsSuccess(o)
{
	window.alert("New user preferences saved.");
}

function userPrefsFailure(o)
{
	
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
//		alert('Creating new user status info.')
		createNewUserStatusInformation();			
	} else
	{			
		user_status.money = parseInt(row.getElementsByTagName('currentMoney').item(0).firstChild.data);
		user_status.lastGamePlayed = parseInt(row.getElementsByTagName('lastGamePlayed').item(0).firstChild.data);
		currentGame = user_status.lastGamePlayed;
		showLogin();
	}
}

function statusFailure(o) 
{
	if (debugDefaults) {
		alert('controller.js:  defaultsFailure() with message --> ' + o.statusText);
	}		
}

function writeUserStatus()
{
		var writeUserStatusCallback  = 
		{
			success:	writeUserStatusSuccess,
			failure:	writeUserStatusFailure
		}

		url = QUERY + '?task=writebackuserstatus&userID=' + user.userID + '&lastGamePlayed=' + user_status.lastGamePlayed + '&currentMoney=' + user_status.money;
		var cObj = YAHOO.util.Connect.asyncRequest('GET', url, writeUserStatusCallback, null);	
}

function writeUserStatusSuccess(o)
{
	
}

function writeUserStatusFailure(o)
{
	
}

function getLeaderboard()
{
	var leaderboardCallback  = 
	{
		success:	leaderboardSuccess,
		failure:	leaderboardFailure
	}
	
	url = QUERY + '?task=getleaderboard';
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, leaderboardCallback, null);
}

function leaderboardSuccess(o)
{
	if (!YAHOO.util.Connect.isCallInProgress(cObj)) {
//		window.alert((new XMLSerializer()).serializeToString(o.responseXML));
		var rows = o.responseXML.getElementsByTagName('leader');
		// loop through the rounds; at the end of the loop, each array entry will contain
		// an array with the fields from the db
		for (i = 0; i < rows.length; i++) {
			if (rows[i].getElementsByTagName('displayname').item(0).childNodes.length)
			{
				name = new String(rows[i].getElementsByTagName('displayname').item(0).firstChild.data);
			}
			money = parseInt(rows[i].getElementsByTagName('money').item(0).firstChild.data);
			gamesPlayed = parseInt(rows[i].getElementsByTagName('gamesplayed').item(0).firstChild.data);
			leaderBoard[i] = new Leader(name, money, gamesPlayed, '0');
		}
		if (leaderBoard.length > 0) {
//			window.alert("Leaderboard created.");
		}
	}
}

function leaderboardFailure(o)
{
	window.alert("no leaderboard...");
}

function writeGame()
{
	var writeGameCallback  = 
	{
		success:	writeGameSuccess,
		failure:	writeGameFailure
	}
	
	var netResult = (user_status.money - userMoneyAtGameStart);
	netResult = netResult + ''; 
	url = QUERY + '?task=writebackgame&playerID=' + user.userID + '&gameNumber=' + currentGame + '&moneyAtStart=' + userMoneyAtGameStart + '&netResult=' + netResult;
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, writeGameCallback, null);
}

function writeGameSuccess(o)
{
	//	alert('writeGameSuccess.')
	var row = o.responseXML;
	if (debugDefaults) { alert('controller.js:  writeGameSuccess() returned OK with ' + rows.length + ' rows.'); }
	if (row.getElementsByTagName('error')[0].childNodes.length)
	{
		errorText = row.getElementsByTagName('error')[0].firstChild.data;		
//		window.alert('writeGameSuccess error' + errorText);
	}	
}

function writeGameFailure(o)
{
	window.alert(o.statusText);
}


// start here.... make sure that the callbacks don't overlap... check the code from writeing multiple students
function writeRounds()
{
	if (!YAHOO.util.Connect.isCallInProgress(cObj)) {
	
		for (i = 0; i < playedRounds.length; i++) {
			writeRound(playedRounds[i]);
		}
		
	}
	
}

function writeRound(r)
{
	var writeRoundCallback  = 
	{
		success:	writeRoundSuccess,
		failure:	writeRoundFailure
	}
	
	url = QUERY + '?task=writebackround&roundNumber=' + r.roundNumber + '&gameNumber=' + r.gameNumber + '&moneyBet=' + r.moneyBet + '&moneyAtStart=' + r.moneyAtStart + '&choiceSelected=' + r.choiceSelected + '&netResult=' + r.netResult + '&winningChoice=' + r.winningChoice + '&timestamp=' + r.timestamp + '&playerID=' + user.userID;
//	window.alert(url);
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, writeRoundCallback, null);
}

function writeRoundSuccess(o)
{
//	window.alert('writeRoundSuccess');
}

function writeRoundFailure(o)
{
	window.alert('writeRoundFailure');
}

function createNewUserStatusInformation()
{
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
		user_status.money = 0;
		user_status.lastGamePlayed = 0;
		currentGame = user_status.lastGamePlayed;
		showUserStatus(createUserStatusString());
		showLogin();
	} 
}

function createUserStatusString()
{
	return 'Grand Total:  ' + user_status.money + '<br />Games Remaining:  ' + (user.gamesPermitted - currentGame);
}

function createRoundStatusString()
{
	return 'Current round total:  ' + roundMoney + '<br />Rounds Remaining: ' + (ROUNDS_PER_GAME - currentRoundNumber);
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
		gameInProgress = true;
		currentGame++;
		currentRoundNumber = 1;
		window.alert("You are about to play game number " + currentGame + " of " + user.gamesPermitted);
		setupSidebar();
		createRoundMenus();
		userMoneyAtGameStart = user_status.money;
		roundMoney = roundMoneyAtStart;
		// clear the playgame command out of the menu
		setupSidebar();
		setupMainMenu();
	} else {
		gameInProgress = false;
		window.alert("I'm sorry.  You have played all the games!");
	}
}

function playRound()
{
	window.alert("You will now play round " + currentRoundNumber + " out of a maximum of 10.");
	setupSidebar();
	setupRoundPanel();
	clearFunctions();
}

function gettimestamp()
{
	return Math.round(new Date().getTime() / 1000);
}


/*
	At the end of a game, write back the rounds information and the user_status to the DB, reset all variables
	write:  
	
		from (user.userID, user_status.lastGamePlayed, create timestamp, userMoneyAtGameStart, (user_status.money - userMoneyAtGameStart))
		new int_PlayedGame(fk_playerID, gameNumber, datePlayed, moneyAtStart, netResult)
		new int_PlayedRound
			from model variable playedRounds
			each round (roundNumber, gameNumber, moneyBet, moneyAtStart, choiceSelected, netResult, winningChoice, timestamp) 
			-> int_PlayedRound (roundNumber, gameNumber, moneyBet, moneyAtStart, choiceSelected, netResult, winningChoice, timestamp)
		
		user_status (user.userID, user_status.lastGamePlayed, user_status.money) 
		-> int_user_status (fk_userID, fk_lastGamePlayed, currentMoney)
	
	
	this.roundNumber = forRound;
	this.moneyBet = betAmount;
	this.moneyAtStart = moneyAtStart;
	this.choiceSelected = choice;
	this.netResult = result;
	this.winningChoice = winner;
	this.timestamp = time;
}
	
*/
function cleanUpGameVariables()
{
	gameInProgress = false;
	user_status.money = user_status.money + roundMoney + currentRoundNumber - 1;
	user_status.lastGamePlayed++;	
	
	// create new game object and save back
	writeGame();
	// create new round objects and save back
	writeRounds();
	// update the user status
	writeUserStatus();

	getLeaderboard();

	roundMoney = 0;
	playedRounds = new Array();
	setupMainMenu();
	setupSidebar();
}

function placeBet()
{

	setupSidebar();
	
	var c16bet = document.getElementById('c1').value;
	var c8bet = document.getElementById('c2').value;
	var c4bet = document.getElementById('c3').value;
	var c2bet = document.getElementById('c4').value;
	
	var c16betfilled = (c16bet.length > 0);
	var c8betfilled = (c8bet.length > 0);
	var c4betfilled = (c4bet.length > 0);
	var c2betfilled = (c2bet.length > 0);
		
	//	window.alert("Bets:  " + c1 + ", " + c2 + ", " + c3 + ", " + c4);

	// ^ xor operator
	var onebet = (c16betfilled ^ c8betfilled ^ c4betfilled ^ c2betfilled);
	if (!onebet)
	{
		roundTryAgain('You can only place a single bet.  Please try again!');
		return;
	} 

	var bet = 0;
	var netResult = 0;
	var choiceNumber = 0;
	var choiceString = '';
	var odds = 0;
	
	if (c16betfilled)
	{
		bet = c16bet;
		odds = 16;
	} else if (c8betfilled)
	{
		bet = c8bet;
		odds = 8;
	} else if (c4betfilled)
	{
		bet = c4bet;
		odds = 4;
	} else if (c2betfilled)
	{
		bet = c2bet;
		odds = 2;
	}

	if (!testNumeric(bet))
	{
		roundTryAgain('Please enter a number.');
		return;
	}
		
	if (bet > roundMoney)
	{
		roundTryAgain('You bet too much.  You have ' + roundMoney + ' remaining!');
		return;
	}
	var winner = determineWinningChoice();
	// (forRound, betAmount, moneyAtStart, choice, result, winner, time)
	netResult = validateBet(bet, odds, winner);
	playedRounds.push(new PlayedRound(currentRoundNumber, currentGame, bet, roundMoney, odds, netResult, winner, gettimestamp()));
	roundMoney = roundMoney + netResult;
	if ((currentRoundNumber < ROUNDS_PER_GAME) && (roundMoney > 0))
	{
		// reset to next round IF we are not done the game AND if the user still has any money
		currentRoundNumber++;
		createRoundMenus();
		clearContentPanel();
		setupSidebar();
	} else 
	{
		// the game is complete one way or another!
		if (roundMoney <= 0)
		{
			// user cannot play any more games.
			user.userMessage = 'You ran out of points.';
		} else if (user_status.lastGamePlayed >= user.gamesPermitted) 
		{
			// user cannot play any more games!
			user.userMessage = 'All games completed!';					
		} else 
		{
			//user has completed this game, and lastGamePlayed increments.
			user_status.lastGamePlayed = currentGame;
		}
		cleanUpGameVariables();
		clearContentPanel();
		refreshMenus();
		setupSidebar();
	}
}

function roundTryAgain(msg)
{
	clearContentPanel();
	window.alert(msg);
	playRound();	
}

function testNumeric(str)
{
	return (str == parseFloat(str));
}

function determineWinningChoice()
 {
    // random from 1..32
    var event = Math.floor(Math.random() * 32) + 1;

	// return the actual winning number, now that the distributions are set

    if (event <= 2)
    {
		// hidden choice 1 or 2: equiprobable
        return 0;
    } else if (event <= 4)
    {
        // 2/32
        return 16;
    } else if (event <= 8)
    {
        //  4/32
        return 8;
    } else if (event <= 16)
    {
        // 8/32
        return 4;
    } else if (event <= 32) {

        // 16/32
        return 2;
    }
    // bad... very bad...
    return -1;
}

function userEligible()
{
	return (user_status.lastGamePlayed <= user.gamesPermitted);
}


function validateBet(bet, odds, winner)
{
	var result = 0;
	var resultString = '';
	if (odds == winner)
	{
		result = bet * odds;
		resultString = resultString + 'You won ' + result + '.';
	} else {
		result = (-1) * bet;
		resultString = resultString + 'You lost ' + bet + '.';
	}
	window.alert(resultString);	
	return result;
}

function submitSurvey()
{
	var submitSurveyCallback  = 
	{
		success:	submitSurveySuccess,
		failure:	submitSurveyFailure
	}

	q1ans = getCheckedRadioButton(document.getElementsByName('gender'));
	q2ans = getCheckedRadioButton(document.getElementsByName('q2'));
	q3ans = getCheckedRadioButton(document.getElementsByName('q3'));
	q4ans = getCheckedRadioButton(document.getElementsByName('q4'));
	q5ans = getCheckedRadioButton(document.getElementsByName('q5'));
	
	if (!(q1ans && q2ans  && q3ans  && q4ans  && q5ans))
	{
		window.alert("Please answer all the questions.\n\nYou might have to click multiple times to check the appropriate radio box.");
		setupSurvey();
		return;
	}
		
	url = QUERY + '?task=writesurvey&userid=' + user.userID + '&q1ans=' + q1ans + '&q2ans=' + q2ans + '&q3ans=' + q3ans + '&q4ans=' + q4ans  + '&q5ans=' + q5ans;

	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, submitSurveyCallback, null);
	document.getElementById('surveySubmitButton').enabled = false;
}

function submitSurveySuccess(o)
{
	markSurveyComplete();
}

function submitSurveyFailure(o)
{
	window.alert('The survey failed to save.  Please submit again.  Sorry for the inconvenience.');
	document.getElementById('surveySubmitButton').enabled = true;	
}

function markSurveyComplete()
{
	var markSurveyCompleteCallback  = 
	{
		success:	markSurveyCompleteSuccess,
		failure:	markSurveyCompleteFailure
	}
	
	url = QUERY + '?task=marksurveycomplete&userid=' + user.userID;
	var cObj = YAHOO.util.Connect.asyncRequest('GET', url, markSurveyCompleteCallback, null);
	
}

function markSurveyCompleteSuccess(o)
{
	window.alert(thanksyousurveystring);
	user.surveyTaken = 1;
	clearContentPanel();
	clearContent();
	setupMainMenu();
}

function markSurveyCompleteFailure(o)
{
	
}

function getCheckedRadioButton(els)
{
	for (i = 0; i < els.length; i++)
	{
		if (els[i].checked)
		{
			return els[i].value;
		}
	}
}