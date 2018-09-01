
# TBL_STUDENT
# ------------------------------------------------------------

DROP TABLE IF EXISTS `TBL_STUDENT`;

CREATE TABLE `TBL_STUDENT` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(254) NOT NULL DEFAULT '',
  `SUSPEND_IND` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`ID`),
  CONSTRAINT `UC_STUDENT_EMAIL` UNIQUE (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `TBL_STUDENT` WRITE;

INSERT INTO `TBL_STUDENT` (`ID`, `EMAIL`, `SUSPEND_IND`)
VALUES
	(1,'commonstudent1@gmail.com','N'),
	(2,'commonstudent2@gmail.com','N'),
	(3,'student_only_under_teacher_ken@gmail.com','N'),
	(4,'studentagnes@gmail.com','N'),
	(5,'studentmary@gmail.com','Y'),
	(6,'studentjon@gmail.com','N'),
	(7,'studenthon@gmail.com','N'),
	(8,'studentmiche@gmail.com','N');

UNLOCK TABLES;


# TBL_TEACHER
# ------------------------------------------------------------

DROP TABLE IF EXISTS `TBL_TEACHER`;

CREATE TABLE `TBL_TEACHER` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(254) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`),
  CONSTRAINT `UC_TEACHER_EMAIL` UNIQUE (`EMAIL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `TBL_TEACHER` WRITE;

INSERT INTO `TBL_TEACHER` (`ID`, `EMAIL`)
VALUES
	(1,'teacherken@gmail.com'),
	(2,'teacherjoe@gmail.com'),
	(3,'teacherang@gmail.com');

UNLOCK TABLES;


# TBL_TEACHER_STUDENT_JUNCTION
# ------------------------------------------------------------

DROP TABLE IF EXISTS `TBL_TEACHER_STUDENT_JUNCTION`;

CREATE TABLE `TBL_TEACHER_STUDENT_JUNCTION` (
  `TEACHER_ID` int(11) unsigned NOT NULL,
  `STUDENT_ID` int(11) unsigned NOT NULL,
  PRIMARY KEY (`TEACHER_ID`,`STUDENT_ID`),
  CONSTRAINT `FK_TBL_TEACHER_STUDENT_JUNCTION_STUDENT` FOREIGN KEY (`STUDENT_ID`) REFERENCES `TBL_STUDENT` (`ID`),
  CONSTRAINT `FK_TBL_TEACHER_STUDENT_JUNCTION_TEACHER` FOREIGN KEY (`TEACHER_ID`) REFERENCES `TBL_TEACHER` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `TBL_TEACHER_STUDENT_JUNCTION` WRITE;

INSERT INTO `TBL_TEACHER_STUDENT_JUNCTION` (`TEACHER_ID`, `STUDENT_ID`)
VALUES
	(1,1),
  (1,2),
  (1,3),
  (1,6),
	(1,7),
	(2,1),
  (2,2),
	(3,1);

UNLOCK TABLES;

# Indexes
# ------------------------------------------------------------

CREATE INDEX `IDX_TEACHER`
ON `TBL_TEACHER` (`EMAIL`);

CREATE INDEX `IDX_STUDENT`
ON `TBL_STUDENT` (`EMAIL`,`SUSPEND_IND`);
