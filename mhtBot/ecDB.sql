
CREATE TABLE `users` (
  `UserID` int(10) AUTO_INCREMENT NOT NULL,
  `Username` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, /* email added */
  `Birthday` date NOT NULL,
  `PictureID` int(10), /* NOT NULL removed */
  PRIMARY KEY (`UserID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `friendships` (
    `UserOne`   int(10) NOT NULL,
    `UserTwo`   int(10) NOT NULL,
    PRIMARY KEY (`UserOne`, `UserTwo`),
    CONSTRAINT fk_UserID FOREIGN KEY (`UserOne`) 
    REFERENCES users(`UserID`)
);

CREATE TABLE `pictures`(
    `PictureID` int(10) AUTO_INCREMENT NOT NULL,
    `Time`      timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, /* default to current timestamp added */
    `Picture`   varchar(200) NOT NULL, 
    `AlbumID`   int(10) NOT NULL, /* AlbumID added */
    PRIMARY KEY (`PictureID`),
    CONSTRAINT fk_AlbumID FOREIGN KEY (`AlbumID`) 
    REFERENCES albums(`AlbumID`)
);

CREATE TABLE `groups`(
    `GroupID`   int(10) AUTO_INCREMENT NOT NULL,
    `Name`      varchar(100) NOT NULL,
    `PictureID` int(10),
    `Privacy` enum('Friends','Circles','FriendsOfFriends') NOT NULL,
    PRIMARY KEY (`GroupID`), /*Privacy removed */
    CONSTRAINT fk_PictureID FOREIGN KEY (`PictureID`) 
    REFERENCES pictures(`PictureID`)
);

CREATE TABLE `group_members`(
    `GroupID`   int(10) NOT NULL,
    `UserID`    int(10) NOT NULL,
    PRIMARY KEY (`GroupID`, `UserID`),
    CONSTRAINT fk_GroupID FOREIGN KEY (`GroupID`) 
    REFERENCES groups(`GroupID`),
    CONSTRAINT fk_UserID FOREIGN KEY (`UserID`) 
    REFERENCES users(`UserID`)
);

CREATE TABLE `blog_wall`(
    `BlogID`    int(10) AUTO_INCREMENT NOT NULL,
    `OwnerID`   int(10) NOT NULL,
    `Privacy`   enum('Friends', 'Circles', 'FriendsOfFriends', 'Public') NOT NULL,
    PRIMARY KEY (`BlogID`),
  CONSTRAINT fk_UserID FOREIGN KEY (`OwnerID`) 
    REFERENCES users(`UserID`)
);

CREATE TABLE `posts`(
    `PostID`    int(10) AUTO_INCREMENT NOT NULL,
    `BlogID`    int(10) NOT NULL,
    `Time`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `text`      varchar(100),
    `PictureID`   int(10),
    PRIMARY KEY (`PostID`),
    CONSTRAINT fk_PictureID FOREIGN KEY (`PictureID`) 
    REFERENCES pictures(`PictureID`),
    CONSTRAINT fk_BlogID FOREIGN KEY (`BlogID`) 
    REFERENCES blog_wall(`BlogID`)
);

CREATE TABLE `albums`(
    `AlbumID`   int(10) AUTO_INCREMENT NOT NULL, /* AI added */
    `AlbumName` varchar(100) DEFAULT 'My Album', /* Album name added */
    `OwnerID`   int NOT NULL,
    `Time`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, /* default to current timestamp added */
    `Privacy`   enum('Friends', 'Circles', 'FriendsOfFriends', 'Public') NOT NULL DEFAULT 'Friends', /* 'Public' added */
    PRIMARY KEY (`AlbumID`),
  CONSTRAINT fk_UserID FOREIGN KEY (`OwnerID`) 
    REFERENCES users(`UserID`)
);

CREATE TABLE `comments`(
    `CommentID` int(10) AUTO_INCREMENT NOT NULL,
    `Time`      datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, /* added default to current timestamp */
    `Text`      text NOT NULL, /* varchar(6) changed to text */
    `PostID`    int(10) NOT NULL,
    `isPictures` boolean NOT NULL, /*if the post is a picture, enable commenting on it*/
    `UserID`    int(10) NOT NULL,
    PRIMARY KEY (`CommentID`),
    CONSTRAINT fk_UserID FOREIGN KEY (`UserID`) 
    REFERENCES users(`UserID`),
    CONSTRAINT fk_PostID FOREIGN KEY (`PostID`) 
    REFERENCES posts(`PostID`)
);


CREATE TABLE `sentiments`(
    `UserID`    int(10) NOT NULL,
    `EntityID`    int(10) NOT NULL,
    `Sentiment` enum('positive','neutral','negative') NOT NULL DEFAULT 'neutral',
    PRIMARY KEY (`UserID`, `EntityID`),
    CONSTRAINT fk_UserID FOREIGN KEY (`UserID`) 
    REFERENCES users(`UserID`), 
   CONSTRAINT fk_EntityID FOREIGN KEY (`EntityID`) 
    REFERENCES entity(`EntityID`) 
);

CREATE TABLE `entity`(
    `EntityID`    int(10) NOT NULL AUTO_INCREMENT,
    `Entity`    varchar(100) NOT NULL,
    PRIMARY KEY (`EntityID`),
    CONSTRAINT fk_EntityID FOREIGN KEY (`EntityID`) 
    REFERENCES sentiments(`EntityID`)
);

CREATE TABLE `message`(
    `MessageID` int(10) AUTO_INCREMENT NOT NULL, /* added AUTO_INCREMENT */
    `ChatID`    int(10) NOT NULL,
    `UserID`    int(10) NOT NULL,
    `Text`      text(1000) NOT NULL, /* changed length of type to 1000 */
    `Photo`     varchar(200), /* changed data type from longblob to varchar(200) */
    `DateTime`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, /* added DEFAULT CURRENT_TIMESTAMP and removed length */
    PRIMARY KEY (`MessageID`),
   CONSTRAINT fk_UserID FOREIGN KEY (`UserID`) 
    REFERENCES users(`UserID`),
    CONSTRAINT fk_ChatID FOREIGN KEY (`ChatID`) 
    REFERENCES users(`ChatID`) 
);

CREATE TABLE `chat`(
    `ChatID`    int(10) AUTO_INCREMENT NOT NULL, /* auto_increment added */
    `ChatTitle` varchar(100) NOT NULL, /* data type changed to varchar */
    PRIMARY KEY (`ChatID`)
);


CREATE TABLE `chat_members` (
    `ChatID`    int(10) NOT NULL,
    `UserID`    int(10) NOT NULL,
    PRIMARY KEY (`ChatID`, `UserID`),
  CONSTRAINT fk_ChatID FOREIGN KEY (`ChatID`) 
  REFERENCES chat(`ChatID`), 
  CONSTRAINT fk_UserID FOREIGN KEY (`UserID`) 
  REFERENCES users(`UserID`) 
);
    
CREATE TABLE `friend_requests` (
    `id` INT(10) AUTO_INCREMENT NOT NULL, 
    `user_from` INT(10) NOT NULL, 
    `user_to` INT(10) NOT NULL, 
    PRIMARY KEY(`id`), 
    CONSTRAINT fk_user_from FOREIGN KEY (`user_from`) 
    REFERENCES users(`UserID`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE, 
    CONSTRAINT fk_user_to FOREIGN KEY (`user_to`) 
    REFERENCES users(`UserID`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE 
);
