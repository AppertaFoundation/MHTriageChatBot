
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

CREATE TABLE AllQuestions(
	QuestionID INT IDENTITY PRIMARY KEY,
	QuestionNo INT,
	QuestionType VARCHAR(128),
	Question VARCHAR(MAX),
);

CREATE TABLE UserResponses(
	ResponseID INT IDENTITY PRIMARY KEY,
);



INSERT INTO AllQuestions(QuestionNo, QuestionType, Question){
	(1, 'general', 'How are you feeling today?'),
	(2, 'general', 'Would you say you''re feeling happy, anxious, or low?'),
	(3, 'general', 'What has led you to seek an assessment for how you''re feeling?'),
	(4, 'general', 'Do you know what''s triggered any negative thoughts and feelings?'),
	(5, 'general', 'What have these thoughts and feelings stopped you doing?'),
	(6, 'general', 'Do you have a care plan?'),
	(7, 'general', 'Is it working for you?'),
	(1, 'phq9', 'How many days have you had little interest or pleasure in doing things?'),
	(2, 'phq9', 'How many days have you felt down, depressed, or hopeless?'),
	(3, 'phq9','How many days have you had trouble falling or staying asleep, or sleeping too much?'),
	(4, 'phq9','How many days have you been bothered by feeling tired or having little energy?'),
	(12, 'phq9', 'How many days have you had a poor appetite or overeaten?'),
	(13, 'phq9', 'How many days have you felt bad about yourself - or that you are a failure or have let yourself or your family down?'),
	(14, 'phq9', 'How many days have you had trouble concentrating on things, such as reading the newspaper or watching television?'),
	(15, 'phq9', 'How many days have you moved or spoken so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you''ve been moving around a lot more than usual?'),
	(16, 'phq9', 'How many days have you had thoughts that you''d be better off dead or of hurting yourself in some way?'),



INSERT INTO AllQuestions (QuestionNo, QuestionType, Question)
VALUES 
	(1, 'introQs', 'How are you feeling today?'),
	(2, 'introQs', 'Would you say you''re feeling happy, anxious, or low?'),
	(3, 'introQs', 'What has led you to seek an assessment for how you''re feeling?'),
	(4, 'introQs', 'Do you know what''s triggered any negative thoughts and feelings?'),
	(5, 'introQs', 'What have these thoughts and feelings stopped you doing?'),
	(6, 'introQs', 'Do you have a care plan?'),
	(7, 'introQs', 'Is it working for you?'),
	(8, 'phq9', 'How many days have you had little interest or pleasure in doing things?'),
	(9, 'phq9', 'How many days have you felt down, depressed, or hopeless?'),
	(10, 'phq9','How many days have you had trouble falling or staying asleep, or sleeping too much?'),
	(11, 'phq9','How many days have you been bothered by feeling tired or having little energy?'),
	(12, 'phq9', 'How many days have you had a poor appetite or overeaten?'),
	(13, 'phq9', 'How many days have you felt bad about yourself - or that you are a failure or have let yourself or your family down?'),
	(14, 'phq9', 'How many days have you had trouble concentrating on things, such as reading the newspaper or watching television?'),
	(15, 'phq9', 'How many days have you moved or spoken so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you''ve been moving around a lot more than usual?'),
	(16, 'phq9', 'How many days have you had thoughts that you''d be better off dead or of hurting yourself in some way?'),
	(17, 'gad7', 'How many days have you felt nervous, anxious, or on edge?'),
	(18, 'gad7', 'How many days have you not been able to stop or control worrying'),
	(19, 'gad7', 'How many days have you worried too much about different things?'),
	(20, 'gad7', 'How many days have you had trouble relaxing?'),
	(21, 'gad7', 'How many days have you been so restless that it''s hard to sit still?'),
	(22, 'gad7', 'How many days have you become easily annoyed or irritable?'),
	(23, 'gad7', 'How many days have you felt afraid, as if something awful might happen?')

INSERT INTO AllQuestions (QuestionNo, QuestionType, Question) 
VALUES (1, 'introQs', 'How are you feeling today?'), (2, 'introQs', 'Would you say you''re feeling happy, anxious, or low?');

UPDATE AllQuestions
SET Question = 'Do you have a care plan?' 
WHERE QuestionNo = 6;

CREATE TABLE Conversations(
	ConversationID	INT IDENTITY PRIMARY KEY,
	UserID INT
);

ALTER TABLE UserResponsesNew(
	ConversationID INT
);

SELECT aq.QuestionID 
FROM AllQuestions aq JOIN UserQuestionIDs uq ON aq.QuestionID = uq.QuestionID 
WHERE UserID = 3 AND QuestionType = 'introQs'






