// debug
var debugLoginView = false;
var debugLogin = false;
var debugDefaults = false;
var debugMenuView = false;
var debugClassesMenu = false;
var debugStudentNames = false;
var debugEditInterims = false;
var debugInterimsPane = false;

var QUERY = 'scripts/queryresponder.php';
// current connection object
var cObj;

// status items
var hasSeed = false;
var loggedIn = false;
var seed_id = 0;
var seed = 0;
var systemopens = Date();

// current user
var user = 
{
	name: '',
	userID: '',
	privileges: '00000',
	lastLogin: '',
	userMessage: '',
	gamesPermitted: '',
	surveyTaken: '',
	displayName: '',
}

function Leader(dn, m, games, highest) 
{
	this.displayName = dn;
	this.money = m;
	this.gamesPlayed = games;
	this.highestGame = highest;
}

var leaderBoard = new Array();

// current user's status

var user_status =
{
	money: '',
	lastGamePlayed: '',
}

var userMoneyAtGameStart = 0;
var currentGame = 0;
var currentGameDBID;
var gameInProgress = false;
var currentRoundNumber = 1;
var ROUNDS_PER_GAME = 16;

var roundMoneyAtStart = 10;
var roundMoney = 10;
var playedRounds = new Array();
function PlayedRound(forRound, forGame, betAmount, moneyAtStart, choice, result, winner, time)
{
	this.roundNumber = forRound;
	this.gameNumber = forGame;
	this.moneyBet = betAmount;
	this.moneyAtStart = moneyAtStart;
	this.choiceSelected = choice;
	this.netResult = result;
	this.winningChoice = winner;
	this.timestamp = time;
}

function Code(id, text) 
{
	this.id = id;
	this.text = text;
}

var codesArray = new Array();
var defaults = new Array();

var OPENS_KEY = 'system_opens';
var MESSAGES_KEY = 'message';

// user permissions
var VIEW_PERMISSION = 1;
var EDIT_PERMISSION = 2;
var SINGLE_ACCOUNT_ADMIN = 4;
var EDIT_USERS_ADMIN = 8;
var SUPERUSER = 32;
