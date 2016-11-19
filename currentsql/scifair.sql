DROP TABLE IF EXISTS `int_defaults`;
CREATE TABLE `int_defaults` (
	`pk_id` int(11) NOT NULL auto_increment,
	`key` varchar(50) default NULL,
	`value` varchar(50) default NULL,
	PRIMARY KEY (`pk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `int_defaults` VALUES (1,'school_name','JR Masterman School'),(2,'school_st_address','1699 Spring Garden Street'),(3,'school_city','Philadelphia'),(4,'school_zip','19130'),(5,'school_telephone','215-299-4661'),(6,'current_mp','2'),(7,'system_opens','1108900000'),(8,'system_closes','1238900000'), (9,'message','Welcome to the Science Fair Experiment'), (10,'system_closes','1238900000');

--
-- Table structure for table `int_seeds`
--

DROP TABLE IF EXISTS `int_seeds`;
CREATE TABLE `int_seeds` (
  `id` int(11) NOT NULL auto_increment,
  `seed` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `int_teachers`
--

DROP TABLE IF EXISTS `int_users`;
CREATE TABLE `int_users` (
  `pk_ID` int(11) NOT NULL auto_increment,
  `lastName` varchar(50) default NULL,
  `firstName` varchar(50) default NULL,
  `username` varchar(20) default NULL,
  `active` char(1) character set latin1 collate latin1_bin default '0',
  `password` varchar(40) default NULL,
  `auth_level` varchar(5) character set latin1 collate latin1_bin NOT NULL default '00001',
  `last_login` double default '0',
  `last_modified` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `message` varchar(100) default 'Welcome to the Science Fair',
  PRIMARY KEY  (`pk_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `int_users` VALUES ('1','REARDON','L','REARDONL','1','password','11111',0,'2006-02-02 14:37:01','Welcome to your Science Fair Project'),
('2','GRAY','B','GRAYB','1','password','11111',0,'2006-02-02 14:37:01','Welcome to your Science Fair Project');


