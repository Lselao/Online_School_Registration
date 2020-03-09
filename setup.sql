
USE master;
GO

CREATE DATABASE SchoolDB; 
GO

USE SchoolDB;
GO

-- Dropping users table
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users
(
	userId int IDENTITY(1, 1) PRIMARY KEY CLUSTERED NOT NULL,
	fname varchar(80) NOT NULL,
	lname varchar(80) NOT NULL,
	email varchar(80) NOT NULL,
	passw varchar(100) NOT NULL
);

INSERT INTO users
	(
	fname,
	lname,
	email,
	passw
	)
VALUES
	('admin', 'admin', 'admin@test.com', '$2a$10$gu1ZHW7UGIB2oXvLKNKA3.Jk/uHSwBxR3l4MvhPR9d3NsnNTC7v.W')
GO

-- Dropping userdetails table
DROP TABLE IF EXISTS userDetails;

-- Create userdetails table
CREATE TABLE userDetails
(
	userId int FOREIGN KEY REFERENCES users(userId),
	phone int NOT NULL,
	dob date NOT NULL,
	gender varchar(1) NOT NULL,
	IDnum int NOT NULL,
	CONSTRAINT dob CHECK (dob < (GetDate()))
);

-- Dropping faculty table
DROP TABLE IF EXISTS faculty;

-- Create faculty table
CREATE TABLE faculty
(
	facultyId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
	facultyName varchar(80) NOT NULL
);

INSERT INTO faculty
	(
	facultyName
	)
VALUES
	('Engineering'),
	('Sciences'),
	('Economics'),
	('Media'),
	('Humanities');
GO

-- Dropping courses table
DROP TABLE IF EXISTS courses;

-- Create courses table
CREATE TABLE courses
(
	courseId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
	courseName varchar(80) NOT NULL,
	facultyId int FOREIGN KEY REFERENCES faculty(facultyId)
);

INSERT INTO courses
	(
	courseName,
	facultyId
	)
VALUES
	('Computer Science', 1),
	('Business Studies', 2),
	('Film', 4),
	('Graphic Design', 4),
	('Education - phase 2', 5);
GO

-- Dropping coursesregistered table
DROP TABLE IF EXISTS coursesRegistered;

-- Create coursesregistered table
CREATE TABLE coursesRegistered
(
	regId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
	userId int FOREIGN KEY REFERENCES users(userId),
	courseId int FOREIGN KEY REFERENCES courses(courseId)
);
