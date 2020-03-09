
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
	passw varchar(100) NOT NULL,
	phone int NOT NULL,
	dob date,
	gender varchar(1) NOT NULL,
	IDnum bigint NOT NULL,
	CONSTRAINT dob CHECK (dob < (GetDate()))
);

INSERT INTO users
	(
	fname,
	lname,
	email,
	passw,
	phone,
	dob,
	gender,
	IDnum
	)
VALUES
	('admin', 'admin', 'admin@test.com', '$2a$10$gu1ZHW7UGIB2oXvLKNKA3.Jk/uHSwBxR3l4MvhPR9d3NsnNTC7v.W', 23, '2012-05-23', 'F', 2)
GO

/*
-- Dropping userdetails table
DROP TABLE IF EXISTS userDetails;

-- Create userdetails table
CREATE TABLE userDetails
(
	userId int FOREIGN KEY REFERENCES users(userId) ON DELETE CASCADE,
	phone int NOT NULL,
	dob date NOT NULL,
	gender varchar(1) NOT NULL,
	IDnum int NOT NULL,
	CONSTRAINT dob CHECK (dob < (GetDate()))
);
*/


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
	('Science'),
	('Health Science'),
	('Humanities');
GO

-- Dropping courses table
DROP TABLE IF EXISTS courses;

-- Create courses table
CREATE TABLE courses
(
	courseId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
	courseName varchar(80) NOT NULL,
	facultyId int FOREIGN KEY REFERENCES faculty(facultyId) ON DELETE CASCADE
);

INSERT INTO courses
	(
	courseName,
	facultyId
	)
VALUES
	('Physics', 1),
	('Geoscience', 1),
	('Computer Science', 1),
	('Biology', 1),
	('Clinical Medicine', 2),
	('Oral Health Science', 2),
	('Medical Sience', 2),
	('Anatomy', 2),
	('Art', 3),
	('Social Sciences', 3),
	('Media', 3),
	('Education', 3);
GO

-- Dropping coursesregistered table
DROP TABLE IF EXISTS coursesRegistered;

-- Create coursesregistered table
CREATE TABLE coursesRegistered
(
	regId int IDENTITY(1, 1) PRIMARY KEY NOT NULL,
	userId int FOREIGN KEY REFERENCES users(userId) ON DELETE CASCADE,
	courseId int FOREIGN KEY REFERENCES courses(courseId) ON DELETE CASCADE
);
GO

CREATE VIEW allCourses
AS
SELECT courseId, courseName, faculty.facultyId, facultyName
FROM courses, faculty
	WHERE courses.facultyId = faculty.facultyId;
GO

CREATE PROCEDURE addUser
	@fname varchar(80) ,
	@lname varchar(80) ,
	@email varchar(80) ,
	@passw varchar(100),
	@phone int ,
	@dob date,
	@gender varchar(1) ,
	@IDnum bigint
	AS
	INSERT INTO users VALUES (@fname, @lname, @email, @passw, @phone, @dob, @gender, @IDnum)
	