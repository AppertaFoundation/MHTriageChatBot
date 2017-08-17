
-- Create User Table

CREATE TABLE Users
(
UserID	INT IDENTITY PRIMARY KEY,
UserName	NVARCHAR(128) NOT NULL, 
Password	NVARCHAR(128) NOT NULL
)

CREATE TABLE Users2
(
UsersID INT PRIMARY KEY,
UserName NVARCHAR(128) NOT NULL,
Password NVARCHAR(128) NOT NULL
);

INSERT INTO Users2 (UsersID, UserName, Password) VALUES (1, 'Hello', 'Goodbye');

SELECT * FROM Users2

-- See all tables
SELECT* FROM sysobjects WHERE xtype='U';

DROP TABLE Users

CREATE TABLE Users
(
	UsersID INT IDENTITY PRIMARY KEY,
	UserName NVARCHAR(128) NOT NULL,
	Password NVARCHAR(128) NOT NULL
);

INSERT INTO Users (UserName, Password) VALUES ('Mairi', 'Mairi');

INSERT INTO Users(UserName, Password) VALUES ('Sam', 'Sam');

CREATE TABLE Q1
(
QuestionID      INT IDENTITY,
UserResponse    NVARCHAR(128),
UsersID INT,
BotMsgTime      TIME(7),
UserMsgTime     TIME(7)
);

CREATE TABLE Q1
(
QuestionID	INT IDENTITY,
UserResponse	NVARCHAR(128),
UsersID INT,
BotMsgTime	DATETIME(8),
UserMsgTime	DATETIME(8),
TimeLapse	TIME(5)
);

CREATE TABLE UserResponses(
	QuestionID INT IDENTITY PRIMARY KEY,
	QuestionNo INT,
	UserID INT,
	UserResponse	TEXT,
	BotMsgTime	DATETIME,
	UserMsgTime	DATETIME,
	TimeLapse	TIME,
	SentimentScore	FLOAT,
	KeyWords	TEXT
);

CREATE TABLE Keywords(
	KeywordID INT IDENTITY PRIMARY KEY,
	QuestionID INT,
	Keyword VARCHAR(MAX)
);

EXEC sp_rename 'Users.UsersID', 'UserID', 'COLUMN';

ALTER TABLE UserResponses
ALTER COLUMN UserResponse varchar(max);

CREATE TABLE UserResponsesNew(
QuestionID      INT IDENTITY PRIMARY KEY,
UserResponse    VARCHAR(MAX)
}

CREATE TABLE Sentiment(
QuestionID INT PRIMARY KEY,
SentimentScore  FLOAT
)

CREATE TABLE TimeStamps(
	QuestionID	INT PRIMARY KEY,
	BotMsgTime	DATETIME,
	UserMsgTime	DATETIME,
	TimeLapse	TIME
)

CREATE TABLE UserQuestionIDs(
QuestionID      INT,
UserID  INT
)

ALTER TABLE UserQuestionIDs 
ALTER COLUMN QuestionID INT NOT NULL

ALTER TABLE UserQuestionIDs 
ALTER COLUMN UserID INT NOT NULL

CREATE TABLE QNosAndIDs(
QuestionID      INT PRIMARY KEY,
QuestionNo      INT
)

CREATE TABLE Phq9Scores(
QuestionID	INT PRIMARY KEY,
Phq9Score	INT,
)

CREATE TABLE Phq9Totals(
	TotalID	INT IDENTITY PRIMARY KEY,
	UserID	INT,
	Phq9Total	INT,
	DateCompleted	DATETIME
)

CREATE TABLE Gad7Totals(
	TotalID	INT IDENTITY PRIMARY KEY,
	UserID INT,
	Gad7TotaL	INT,
	DateCompleted DATETIME
)






