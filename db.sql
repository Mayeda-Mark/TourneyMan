--TABLES
CREATE TABLE User_info (
id serial NOT NULL,
name varchar(255) NOT NULL,
password VARCHAR(255) NOT NULL,
CONSTRAINT id PRIMARY KEY (id)
);

CREATE TABLE Week (
id serial NOT NULL,
Week int NOT NULL,
bracket_id int NOT NULL,
CONSTRAINT Week_pk PRIMARY KEY (id)
);

CREATE TABLE Participant (
id serial NOT NULL,
name varchar(255) NOT NULL,
bracket_id int NOT NULL,
seed int,
is_eliminated boolean NOT NULL,
CONSTRAINT id_pk PRIMARY KEY (id)
);

CREATE TABLE Bracket (
id serial NOT NULL,
bracketName varchar(255) NOT NULL,
-- owner_id int NOT NULL,
num_slots int NOT NULL,
-- num_elimination int NOT NULL,
-- num_conferences int NOT NULL,
num_weeks int NOT NULL,
CONSTRAINT bracket_id_pk PRIMARY KEY (id)
);

CREATE TABLE Round (
id serial NOT NULL,
bracket_id int NOT NULL,
week_num int NOT NULL,
participant_1 int,
participant_2 int,
score_1 int,
score_2 int,
winner int
);

--FOREIGN KEYS
ALTER TABLE Bracket ADD CONSTRAINT Bracket_Owner
FOREIGN KEY (id)
REFERENCES User_info (id)
NOT DEFERRABLE
INITIALLY IMMEDIATE;

ALTER TABLE Round ADD CONSTRAINT week_num
FOREIGN KEY (week_num)
REFERENCES Week (id)
NOT DEFERRABLE
INITIALLY IMMEDIATE;

ALTER TABLE Round ADD CONSTRAINT Bracket_id
FOREIGN KEY (bracket_id)
REFERENCES Bracket (id)
NOT DEFERRABLE
INITIALLY IMMEDIATE;

ALTER TABLE Round ADD CONSTRAINT participant_1
FOREIGN KEY (id)
REFERENCES Participant (id)
NOT DEFERRABLE
INITIALLY IMMEDIATE;

ALTER TABLE Round ADD CONSTRAINT participant_2
FOREIGN KEY (id)
REFERENCES Participant (id)
NOT DEFERRABLE
INITIALLY IMMEDIATE;

ALTER TABLE Participant ADD CONSTRAINT Bracket_id
FOREIGN KEY (bracket_id)
REFERENCES Bracket (id)
NOT DEFERRABLE
INITIALLY IMMEDIATE;

--TESTS
INSERT INTO User_info (name, password)
VALUES(
'Mark',
'password'
);

INSERT INTO Week (week)
VALUES (1);

INSERT INTO Participant (name, is_eliminated)
VALUES ('Test1', false), ('Test2', false);

INSERT INTO Bracket (bracketName, owner_id, num_slots, num_elimination, num_conferences, num_weeks)
VALUES ('Text Bracket', 1, 2, 1, 1, 1);