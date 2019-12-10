CREATE TABLE Tournament (
    id serial  NOT NULL,    
    Event_name varchar(225)  NOT NULL, 
    num_participants integer NOT NULL,
    Num_rounds integer NOT NULL,
    CONSTRAINT Tournament_pk PRIMARY KEY (id)
);

CREATE TABLE Builder (   
    id serial NOT NULL,
    Running_total integer,
    Active_participants integer,
    Round_num integer,
    Score integer,
    Winner boolean,
    CONSTRAINT Builder_pk PRIMARY KEY (id)
);

CREATE TABLE Participant (
    id serial NOT NULL,
    Name varchar(225) NOT NULL,
    Seed integer,
    CONSTRAINT Participant_pk PRIMARY KEY (id)
);

INSERT INTO Participant (name, seed)
VALUES('Test 1', 1);

INSERT INTO Participant (name, seed)
VALUES('Test 2', 2);

INSERT INTO Participant (name, seed)
VALUES('Test 3', 3);

INSERT INTO Participant (name, seed)
VALUES('Test 4', 4);

INSERT INTO Participant (name, seed)
VALUES('Test 5', 5);

INSERT INTO Participant (name, seed)
VALUES('Test 6', 6);

INSERT INTO Participant (name, seed)
VALUES('Test 8', 8);

INSERT INTO Participant (name, seed)
VALUES('Test 8', 8);

INSERT INTO Builder (Round_num)
VALUES(1);

INSERT INTO Builder (Round_num)
VALUES(2);

INSERT INTO Builder (Round_num)
VALUES(3);