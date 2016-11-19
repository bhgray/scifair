function clearMessages() {
	var sysmess = document.getElementById('systemmessages');
	sysmess.innerHTML = "";
	var usermess = document.getElementById('usermessage');
	usermess.innerHTML = "";
}	

function refreshMenus()
{
	clearFunctions();
	setupMainMenu();
}

function refreshMessages() {
	clearMessages();
	var usermess = document.getElementById('usermessage');
	setupUserMessages();
	setupSystemMessages();
}

function clearContent() 
{
	var leftbox = document.getElementById('sidebar');
	leftbox.visibility = 'hidden';
	leftbox.innerHTML = "";

	var rightbox = document.getElementById('content');
	rightbox.innerHTML = "";
	
}

function clearContentPanel() 
{
	document.getElementById('content').innerHTML = "";
}

function clearMenus() {
	var functionsPanel = document.getElementById('menu');
	functionsPanel.innerHTML = "";
}

function clearFunctions() {
	var functionsPanel = document.getElementById('functions');
	functionsPanel.innerHTML = "";
}

function showLoginErrorMessage(msg) {
	var messagePanel = document.getElementById('usermessage');
	messagePanel.innerHTML = msg;
}

function showUserStatus(msg) {
	var sidebar = document.getElementById('sidebar');
	sidebar.innerHTML = msg;
}

function showRoundStatus(msg) {
	var sidebar = document.getElementById('sidebar');
	sidebar.innerHTML = sidebar.innerHTML + "<br /><br />" + msg;
}

function createRoundMenus() {
	clearFunctions();	
	clearContent();
	
	var mid = document.createTextNode(' [');
	var a = document.createElement('a');
	a.href="javascript:playRound()";
	var a_text = document.createTextNode('Play Round ' + currentRoundNumber + " for Game " + currentGame);
	a.appendChild(a_text);
	var post = document.createTextNode(']');
		
	var menuPanel = document.getElementById('functions');
	menuPanel.appendChild(mid);
	menuPanel.appendChild(a);
	menuPanel.appendChild(post);	
}

function setupRoundPanel()
{
	var mainPanel = document.getElementById('content');
	mainPanel.innerHTML = "";
	
	var roundform = document.createElement('form');
	roundform.setAttribute('id', 'roundform');
	roundform.setAttribute('action', 'javascript:placeBet()');
	
	var messagediv=document.createElement("div");
	messagediv.setAttribute("id", "roundinstructions");
	roundform.appendChild(messagediv);
	
	messageDiv = document.getElementById("roundinstructions");
	messagediv.innerHTML = roundInstructionString;
	
	choicesFieldSet = document.createElement('fieldset');
	choicesFieldSet.setAttribute("id", "roundfieldset");
	choicesLegend = document.createElement('legend');
	choicesLegend.setAttribute("id", "roundlegend");
	choicesLegend.appendChild(document.createTextNode('Choices for Round ' + currentRoundNumber));
	choicesFieldSet.appendChild(choicesLegend);
	
	var c1label = document.createElement('label');
	c1label.setAttribute("for", "c1");
	c1label.setAttribute("id", "c1label");
	c1label.setAttribute("class", "betlabel");
	var c1labeltext = document.createTextNode("1 : 16");
	c1label.appendChild(c1labeltext);

	var c2label = document.createElement('label');
	c2label.setAttribute("for", "c2");
	c2label.setAttribute("id", "c2label");
	c2label.setAttribute("class", "betlabel");
	var c2labeltext = document.createTextNode("1 : 8");
	c2label.appendChild(c2labeltext);

	var c3label = document.createElement('label');
	c3label.setAttribute("for", "c3");
	c3label.setAttribute("id", "c3label");
	c3label.setAttribute("class", "betlabel");
	var c3labeltext = document.createTextNode("1 : 4");
	c3label.appendChild(c3labeltext);
	
	var c4label = document.createElement('label');
	c4label.setAttribute("for", "c4");
	c4label.setAttribute("id", "c4label");
	c4label.setAttribute("class", "betlabel");
	var c4labeltext = document.createTextNode(" 1 : 2");
	c4label.appendChild(c4labeltext);

	var c1input = document.createElement('input');
	c1input.setAttribute("type", "text");
	c1input.setAttribute("id", "c1");
	c1input.setAttribute("class", "betinput");
	c1input.setAttribute("tabindex", "1");
	c1input.setAttribute("size", "12");

	var c2input = document.createElement('input');
	c2input.setAttribute("type", "text");
	c2input.setAttribute("id", "c2");
	c2input.setAttribute("class", "betinput");
	c2input.setAttribute("tabindex", "2");
	c2input.setAttribute("size", "12");
	
	var c3input = document.createElement('input');
	c3input.setAttribute("type", "text");
	c3input.setAttribute("id", "c3");
	c3input.setAttribute("class", "betinput");
	c3input.setAttribute("tabindex", "3");
	c3input.setAttribute("size", "12");
	
	var c4input = document.createElement('input');
	c4input.setAttribute("type", "text");
	c4input.setAttribute("id", "c4");
	c4input.setAttribute("class", "betinput");
	c4input.setAttribute("tabindex", "4");
	c4input.setAttribute("size", "12");
	
	roundform.appendChild(choicesFieldSet);
	
	var c1p = document.createElement('div');
	c1p.appendChild(c1label);
	c1p.appendChild(c1input);

	var c2p = document.createElement('div');	
	c2p.appendChild(c2label);
	c2p.appendChild(c2input);
	
	var c3p = document.createElement('div');
	c3p.appendChild(c3label);
	c3p.appendChild(c3input);
	
	var c4p = document.createElement('div');	
	c4p.appendChild(c4label);
	c4p.appendChild(c4input);
	
	choicesFieldSet.appendChild(c1p);
	choicesFieldSet.appendChild(c2p);
	choicesFieldSet.appendChild(c3p);
	choicesFieldSet.appendChild(c4p);
	
	var submit = document.createElement('input');
	submit.setAttribute('type', 'button');
	submit.setAttribute("id", "betsubmit");
	submit.setAttribute('tabindex', "5");
	submit.setAttribute('value', 'Place Bet');
	submit.setAttribute('onclick', 'placeBet()');
	
	choicesFieldSet.appendChild(submit);
	
	mainPanel.appendChild(roundform);
}


function setUpLoginPanel()
{
	var loginPanel = document.getElementById('login');
	loginPanel.innerHTML = "";
	
	if (debugLoginView) {alert('getElementById:  ' + loginPanel);}

	var loginform = document.createElement('form');
	loginPanel.appendChild(loginform);
	
	loginform.setAttribute('id', 'loginform');
	loginform.setAttribute('action', 'javascript:validateLogin()');
	
	var messagediv=document.createElement("div");
	messagediv.setAttribute("id", "message");
   	messagediv.setAttribute("class", "generaltext");
	loginform.appendChild(messagediv);
	
	messagediv = document.getElementById("message");
	messagediv.innerHTML = loginInstructionString;

	var usernameinputlabel = document.createElement('label');
	usernameinputlabel.setAttribute("for", "username");
	usernameinputlabel.setAttribute("id", "usernamelabel");
	usernameinputlabel.setAttribute("class", "generaltext");
	var usernameinputlabeltext = document.createTextNode('Username:     ');
	usernameinputlabel.appendChild(usernameinputlabeltext);
	
	var usernameinput = document.createElement('input');
	usernameinput.setAttribute("type", "text");
	usernameinput.setAttribute("name", "username");
	usernameinput.setAttribute("id", "username");
	usernameinput.setAttribute("tabindex", "1");
	usernameinput.setAttribute("size", "12");
	
	var passwordinputlabel = document.createElement('label');
	passwordinputlabel.setAttribute("for", "password");
	passwordinputlabel.setAttribute("id", "passwordlabel");
	passwordinputlabel.setAttribute("class", "generaltext");
	var passwordinputlabeltext = document.createTextNode('Password:     ');
	passwordinputlabel.appendChild(passwordinputlabeltext);
	
	var passwordinput = document.createElement('input');
	passwordinput.setAttribute("type", "password");
	passwordinput.setAttribute("name", "password");
	passwordinput.setAttribute("tabindex", "2");
	passwordinput.setAttribute("id", "password");
	passwordinput.setAttribute("size", "10");
	
	// create the submit button
	var linebreak = document.createElement('br');
	var submit = document.createElement('input');
	submit.setAttribute('type', 'button');
	submit.setAttribute('tabindex', "3");
	submit.setAttribute('value', 'LOGIN');
	submit.setAttribute('onclick', 'validateLogin()');
	
	loginform.appendChild(usernameinputlabel);
	loginform.appendChild(usernameinput);
	loginform.appendChild(passwordinputlabel);
	loginform.appendChild(passwordinput);
	loginform.appendChild(submit);
	

}

function showLogin() {
	if (loggedIn)
	{
		if (debugLoginView) { alert("user logged in..."); }
		
		var loginPanel = document.getElementById('login');
		loginPanel.innerHTML = '';
		// create a paragraph element
		var p = document.createElement('div');
		p.setAttribute('class', 'generaltext');
		var pre = document.createTextNode('Logged in as ');
		var strong = document.createElement('strong');
		strong_text = document.createTextNode(user.name);
		strong.appendChild(strong_text);
		var mid = document.createTextNode(' [');
		var a = document.createElement('a');
		a.href="javascript:logout()";
		a_text = document.createTextNode('logout');
		a.appendChild(a_text);
		var post = document.createTextNode(']');
		
		p.appendChild(pre);
		p.appendChild(strong);
		p.appendChild(mid);
		p.appendChild(a);
		p.appendChild(post);
		
		loginPanel.appendChild(p);

		var loginform = document.getElementById('loginform');
		if (loginform)
		{
			loginPanel.removeChild(loginform);			
		}
		// if there is a message to users, now you can display it
//		setupSystemMessages();
		// if there is a personal message to the logged in user, display that
//		setupUserMessages();
		setupMainMenu();
	}
	else
	{
		var messageElement = document.createElement('strong');
		messageElement.appendChild(document.createTextNode(' ' + messages));
		messageElement.style.color = '#ff0000';
		document.getElementById('message').appendChild(messageElement);
	}
}

function setupUserMessages() {
		// set up the message, if any
		var p1 = document.getElementById('usermessage');
		var intro = document.createElement('div');
		intro.setAttribute('class', 'message');
		var login = new Date();
		login.setTime(user.lastLogin*1000);
		if (debugLoginView) { alert('setupUserMessages():  lastlogin->' + user.lastLogin + '; login -> ' + login.toLocaleString()); }
		intro.appendChild(document.createTextNode('Last Login:  ' + login.toLocaleString()));
		intro.appendChild(document.createElement('br'));
		intro.appendChild(document.createTextNode('User Message:  ' + user.userMessage));
		p1.appendChild(intro);		
}

function setupSystemMessages()
{
	// put system information and any systemwide messages out
	var m = new String(findDefaultWithKey(MESSAGES_KEY));
	if (m == "undefined") { m = "Welcome to the Interims System."; }
	var target = document.getElementById('systemmessages');
	var linebreak = document.createElement('br');
	var intro = document.createElement('div');
	intro.setAttribute('class', 'message');
	intro.appendChild(document.createTextNode('System Message:  '));
	intro.appendChild(document.createTextNode(m));
	target.appendChild(intro);
}

function setupMainMenu() {

	var menuPanel = document.getElementById('menu');
	menuPanel.innerHTML = '';
	if (debugMenuView) { alert('(privileges & VIEW_PERMISSION) == (' + user.privileges + ' & ' + VIEW_PERMISSION + ') == ' + (user.privileges & VIEW_PERMISSION)); }
	if (((user.privileges & VIEW_PERMISSION) == VIEW_PERMISSION) && userEligible() && !gameInProgress) {
		var mid1 = document.createTextNode(' [');
		var a1 = document.createElement('a');
		a1.href="javascript:startGame()";
		var a1_text = document.createTextNode('Play Game ' + (user_status.lastGamePlayed + 1));
		a1.appendChild(a1_text);
		var post1 = document.createTextNode(']');
			
		menuPanel.appendChild(mid1);
		menuPanel.appendChild(a1);
		menuPanel.appendChild(post1);
	}
	
	if (debugMenuView) { alert('(privileges & SINGLE_ACCOUNT_ADMIN) == (' + user.privileges + ' & ' + SINGLE_ACCOUNT_ADMIN + ') == ' + (user.privileges & SINGLE_ACCOUNT_ADMIN)); }
	if ((user.privileges & SINGLE_ACCOUNT_ADMIN) == SINGLE_ACCOUNT_ADMIN) {
		var mid2 = document.createTextNode(' [');
		var a2 = document.createElement('a');
		a2.href="javascript:showAccountFunctions()";
		var a2_text = document.createTextNode('Account');
		a2.appendChild(a2_text);
		var post2 = document.createTextNode(']');
			
		menuPanel.appendChild(mid2);
		menuPanel.appendChild(a2);
		menuPanel.appendChild(post2);
	}

	if (debugMenuView) { alert('(privileges & SUPERUSER) == (' + user.privileges + ' & ' + SUPERUSER + ') == ' + (user.privileges & SUPERUSER)); }
	if ((user.privileges & SUPERUSER) == SUPERUSER) {
		var mid3 = document.createTextNode(' [');
		var a3 = document.createElement('a');
		a3.href="javascript:showAdminFunctions()";
		var a3_text = document.createTextNode('Admin');
		a3.appendChild(a3_text);
		var post3 = document.createTextNode(']');
			
		menuPanel.appendChild(mid3);
		menuPanel.appendChild(a3);
		menuPanel.appendChild(post3);
	}
}

function showAccountFunctions() {
	
	if (gameInProgress)
	{
		gameInProgress = false;
		currentGame--;
		setupMainMenu();
	} 
	clearFunctions();	
	clearContent();
	
	var mid = document.createTextNode(' [');
	var a = document.createElement('a');
	a.href="javascript:editPassword()";
	var a_text = document.createTextNode('Change Password');
	a.appendChild(a_text);
	var post = document.createTextNode(']');
		
	var menuPanel = document.getElementById('functions');
	menuPanel.appendChild(mid);
	menuPanel.appendChild(a);
	menuPanel.appendChild(post);
}

function setUpIntroduction()
{
	var contentPanel = document.getElementById('content');
	contentPanel.innerHTML = introHTML;
}
