DROP DATABASE IF EXISTS sky;
DELETE FROM EMAIL;
DELETE FROM FAVORITELINKS;
DELETE FROM ABOUTME;

CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'testing123';
GRANT ALL PRIVILEGES ON *.* TO 'newuser'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE EMAIL (
  ID INT AUTO_INCREMENT,
  USERNAME VARCHAR(100) NOT NULL,
  DATE DATE NOT NULL,
  IMAGE TEXT,
  MESSAGE TEXT,
  PRIMARY KEY (ID)
);

INSERT INTO `EMAIL` ( ID, `USERNAME`, `DATE`, `IMAGE`, `MESSAGE`)  VALUES (1, 'FUDGEMAN', '2012-04-11', "https://upload.wikimedia.org/wikipedia/en/9/99/Gundam.jpg", "your website is garbage");

CREATE TABLE FAVORITELINKS (
  ID INT AUTO_INCREMENT,
  NAME TEXT,
  URL TEXT,
  PRIMARY KEY (ID)
);

INSERT INTO `FAVORITELINKS` (`ID`, `NAME`, `URL`)  VALUES(0, "codewars",          "https://www.codewars.com/users/hectron"  );
INSERT INTO `FAVORITELINKS` (`ID`, `NAME`, `URL`)  VALUES(1, "technologyreview",  "https://www.technologyreview.com"        );

CREATE TABLE ABOUTME (
  ID INT AUTO_INCREMENT,
  YEAR YEAR NOT NULL,
  DATA TEXT,
  PRIMARY KEY (ID)
);

INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(0, '0000',  "Thinker, Gamer, Engineer, Runner, Basketball/Football Fan, PSU Alum, NYU-POLY Alum, BootCamp Alum");
INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(1, '0000',  " Hectors’s never been one to brag, which is why he hated creating this webpage. Lacking vain and more of an observer, Hector is more of a people person, not a person in need :). Welp let's get on with it, right...");
INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(2, '0000',  "Hector has 6 years experience as an Electrical/Embedded Engineer where  he worked in different industries: research, manufacturing, and start-up. That is a lot to pack in 6 years, and for Hector he was always trying to find the best environment for growth and technical depth. Hector has always been a driver wherever he has landed and always pushed the status quo trying to get into new technologies. Who was the one who said “anyone who has never made a mistake has never friend anything new”. Hector is fierce and always learning");
INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(3, '0000',  " Hector currently spends time building his GitHub page improving coding skills daily because Hector understands the nature of technology, it’s always in constant flux spawning into something new every decade. One thing that is most important is the ability to code, and that is what Hector loves to do. Better stated, he loves solving problems, and solving problems by finding a programmable solver is important, is the present, and is the future");

INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(4, '2020', "Gained Full Stack experience because it's important to know how to create web pages. Completed boot camp at Hack Reactor");
INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(5, '2020', "Historic year for the United States of America electing their first Multiracial Female Vice President." );
INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(6, '2020', "Covid 19 shutdown forced me and my partner to spend alot of time at home. I'm a homebody but I am also an adventurous. I spent time finding some new games on my XBOX. I'm so proud of video game developers are always creating unique diverse games. I'm not sure what I would do without video games(there are board games...duh!)" );
INSERT INTO `aboutme` (`ID`, `YEAR`, `DATA`)  VALUES(7, '2020',  "Presently while I type this, Penn State(🔵⚪️🦁) is the worst team in the Big 10 Conference sitting at 0-3");
