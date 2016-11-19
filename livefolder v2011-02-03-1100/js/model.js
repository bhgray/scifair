// debug
var debugLoginView = false;
var debugLogin = false;
var debugDefaults = false;
var debugMenuView = false;
var debugClassesMenu = false;
var debugStudentNames = false;
var debugEditInterims = false;
var debugInterimsPane = false;

var ROUNDS_PER_GAME = 10;

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
}

// current user's status

var user_status =
{
	money: '',
	lastGamePlayed: '',
}

var currentGame;
var currentGameDBID;

// contains the rounds for the current game
var rounds = new Array();
var currentRoundNumber = 1;
var currentRound;
function Round(number, dbid, c1, c2, c3, c4, hc1, hc2, wc)
{
	this.forgame = currentGame;
	this.roundNumber = number;
	this.roundDBID = dbid;
	this.choice1 = c1;
	this.choice2 = c2;
	this.choice3 = c3;
	this.choice4 = c4;
	this.hiddenchoice1 = hc1;
	this.hiddenchoice2 = hc2;
	this.winningchoice = wc;
}

var playedRounds = new Array();
function PlayedRound(forRoundID, betAmount, moneyAtStart, choice, result, time)
{
	this.fkRoundID = forRoundID;
	this.moneyBet = betAmount;
	this.moneyAtStart = moneyAtStart;
	this.choiceSelected = choice;
	this.netResult = result;
	this.timestamp = time;
}

function Code(id, text) 
{
	this.id = id;
	this.text = text;
}

// studentsArray should contain Student objects
var studentsArray = new Array();
function Student(id, name, mod)
{
	this.id = id;
	this.name = name;
	this.status = mod;
	this.out = '';
	this.sat = '';
	this.unsat = '';
	this.fail = '';
	this.comments = '';
	this.codes = '';
	
	this.setOut = function(value) {
		this.out = value;
	}
	this.setSat = function(value) {
		this.sat = value;
	}
	this.setUnsat = function(value) {
		this.unsat = value;
	}
	this.setFail = function(value) {
		this.fail = value;
	}
	this.setComments = function(value) {
		this.comments = value;
	}	
	this.setCodes = function(value) {
		this.codes = value;
	}
	
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
