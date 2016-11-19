<?php

$debug = false;
$debugXML = false;

// the text return for the script
$output = '';


$sXMLHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

$aXMLRespTypes = Array(
'getseed' => 
'<getseed>
	<error>%s</error>
	<id>%s</id> 
	<seed>%s</seed>
 </getseed>',
 
 'getlogin' =>
 '<getlogin>
 	<error>%s</error>
 	<name>%s</name>
 	<idNum>%s</idNum>
 	<authlevel>%s</authlevel>
 	<lastlogin>%s</lastlogin>
 	<message>%s</message>
 	<permitted>%s</permitted>
  </getlogin>',
  

'getgame' =>
'<getgame>
	<error>%s</error>
	%s
</getgame>',

'getuserstatus' =>
'<getuserstatus>
	<error>%s</error>
	<lastGamePlayed>%s</lastGamePlayed>
	<currentMoney>%s</currentMoney>
</getuserstatus>',

  'getclasses' =>
  '<getclasses>
 		<error>%s</error>
 		%s
   </getclasses>',
   
   'getallstudents' =>
   
   '<getallstudents>
	   	<error>%s</error>
   		%s
   </getallstudents>',
   
   'getstudentnames' =>
   
	 '<getstudentnames>
	   	<error>%s</error>
   		%s
   	</getstudentnames>',
   
   'getstudent' =>
   
   '<getstudent>
	   	<error>%s</error>
   		%s
   </getstudent>',

'writeback' =>

'<writeback>
	<error>%s</error>
	<number>%s</number>
	<idnum>%s</idnum>
 </writeback>',
 
 'getdefaults' =>
 
 '<getdefaults>
	<error>%s</error>
	%s
	</getdefaults>',
	
'getcodes' =>
'<getcodes>
	<error>%s</error>
	%s
</getcodes>',

'getallrecords' =>
'<records>
	<error>%s</error>
	%s
</records>',
);

$sXMLDefaultTemplates = Array(
	'sXMLgameTemplate' =>
	'<game><gameid>%s</gameid><comment>%s</comment>',
	
	'sXMLroundTemplate' =>
	'<round><roundid>%s</roundid><roundnumber>%s</roundnumber><choice1>%s</choice1><choice2>%s</choice2><choice3>%s</choice3><choice4>%s</choice4><hiddenchoice1>%s</hiddenchoice1><hiddenchoice2>%s</hiddenchoice2><winningchoice>%s</winningchoice></round>',

	'sXMLcourseTemplate' =>
	'<course><courseid>%s</courseid><coursetitle>%s</coursetitle></course>',
	
	'sXMLstudentTemplate' =>
	'<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname><out>%s</out><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified><modifiedby>%s</modifiedby><codes>%s</codes></student>',
	
	'sXMLstudentNameTemplate' => 
	'<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname><modified>%s</modified></student>',

	'sXMLdefaultTemplate' => 
	'<default><key>%s</key><value>%s</value></default>',

	'sXMLcodeTemplate'	=> 
	'<code><codeid>%s</codeid><text>%s</text><order>%s</order></code>',

	'sXMLrecordTemplate' => 
	'<record><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname>%s',
	
	'sXMLcourseRecordTemplate' => 
	'<courserecord><coursetitle>%s</coursetitle><teacher>%s</teacher><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified></courserecord>'
);

?>