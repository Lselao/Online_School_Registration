
-- user details page
SELECT *
FROM users
	INNER JOIN userDetails
	ON users.userID = userDetails.userId
WHERE users.userID = ?;


-- Delete user
DELETE FROM users 
WHERE userId = ?;

-- My courses page
SELECT *
FROM users
	INNER JOIN coursesRegistered
	ON users.userID = coursesRegistered.userId
	INNER JOIN courses
	ON coursesRegistered.courseId = courses.courseId
	INNER JOIN faculty
	ON courses.facultyId = faculty.facultyId
WHERE users.userID = ?;

-- All courses page
SELECT *
FROM courses
	INNER JOIN faculty
	ON courses.facultyId = faculty.facultyId;

-- Get courseId
SELECT courseId FROM courses 
WHERE courseName = ?;

-- Register to a course
INSERT INTO coursesRegistered (userId, courseId)
VALUES (?, ?);



