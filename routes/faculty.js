var express = require('express');
var router = express.Router();
const sql = require('mssql/msnodesqlv8');

const config = {
  user: 'Tafa',
  password: '12345',
  server: 'localhost', 
  database: 'SchoolDB' 
};

const conn = new sql.ConnectionPool(config);

conn.connect().then(() => {
	console.log('DB CONNECTED - HELLS YEAH!!');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.loggedin);
  
  if (req.session.loggedin)
    res.render('faculty', { title: 'Express' });
  else
    res.redirect('/login');
});

router.get('/physics', function(req, res){
  res.render('Physics');
});
router.get('/medical', function(req, res){
  res.render('Medical');
});
router.get('/sScience', function(req, res){
  res.render('S_science');
});
router.get('/oral', function(req, res){
  res.render('Oral');
});
router.get('/media', function(req, res){
  res.render('Media');
});
router.get('/gScience', function(req, res){
  res.render('G_science');
});
router.get('/education', function(req, res){
  res.render('Education');
});
router.get('/compScience', function(req, res){
  res.render('Comp_science');
});
router.get('/clinical', function(req, res){
  res.render('Clinical');
});
router.get('/biology', function(req, res){
  res.render('Biology');
});
router.get('/art', function(req, res){
  res.render('Art');
});

router.get('/anatomy', function(req, res){
  res.render('Anatomy');
});

router.get('/courseRegister', function(req, res){
  console.log("we're in");

  function approveRegistration(courseId, userId){
    console.log('ready to finish registration');
    conn.query(
      "INSERT INTO coursesRegistered (userId, courseId) VALUES ('" +
        userId +
        "', '" +
        courseId +
        "');",
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          console.log(result);
          res.redirect('http://localhost:3000/faculty');
        }
      }
    );
    
  }

  function alreadyRegistered(courseId, userId){
    console.log('inside our function');
    let registered = 0;
    
    conn.query(
			"SELECT * FROM coursesRegistered WHERE courseId = '" + courseId + "' AND userId = '" + userId + "';",
			(err, results) => {
				if (err) {
					console.log(err);
				}
        
				if (results.recordset.length > 0) {
          results = results.recordset[0];
          registered++;
        }
        console.log(registered);
        
        if (!registered){
          approveRegistration(courseId, userId);
        }
        else
          res.send("Already registered to this course");//fix here
      }
    );
  }

  if (req.session.loggedin){
    let courseName = req.query.course;
    let userId = req.session.userId;
    let found = 0;
    let courseId;
    console.log(courseName);
    
    conn.query(
			"SELECT courseId FROM courses WHERE courseName = '" + courseName + "';",
			(err, results) => {
				if (err) {
					console.log(err);
				}
        
				if (results.recordset.length > 0) {
          results = results.recordset[0];
          courseId = results.courseId;
          found++;
				}
        console.log(courseId);
        // res.end();
        if (found)
          alreadyRegistered(courseId, userId);
			}
		); 
  }
});

router.get('/myCourses', function(req, res){
  
  function next(regArr, reqArr){
    console.log(regArr[0], 'results');
    conn.query(
      "SELECT * FROM courses",
      (err, results) => {
        if (err) {
          console.log(err);
        }

      if (results.recordset.length > 0) {
        let finalList = new Array();
        let j = 0;
        for(i=0; i<results.recordset.length; i++){
          result = results.recordset[i];
          
          if (regArr.includes(result.courseId)){
            finalList[j] = result.courseName;
            j++;
          }
        }
        console.log('herr');
        
        res.render('mycourses', {courses:finalList, reqId:reqArr});
      }
      // res.end();
    }
  );
  }
  if (req.session.loggedin){console.log('logged in nyCourses');
    let countCourses = 0;
    let regId;
    let userId = req.session.userId;

    conn.query(
			"SELECT courseId, regId FROM coursesRegistered WHERE userId = '" + userId + "';",
			(err, results) => {
				if (err) {
					console.log(err);
				}
			
        // console.log(results);
				if (results.recordset.length > 0) {
          console.log(results.recordset.length);
          
          let resultsArray = new Array(results.recordset.length);
          let reqArray = new Array(results.recordset.length);

          for(i=0;i<resultsArray.length;i++){
            result = results.recordset[i];
            // console.log(result);
            resultsArray[i] = result.courseId;
            reqArray[i] =  result.regId;
          }
          next(resultsArray, reqArray);
        }
        
  else{
    console.log('fdf');
    
    res.render('myCourses');
  }
        
				// res.end();
			}
      );
      
  }
});

router.post('/deleteCourse', (req, res) => {
  console.log('got here');
  let reg = req.body.regId;
  console.log(reg, 'this is reg');
  
  conn.query("DELETE FROM coursesRegistered WHERE regId = " + reg + ";", (err, results) => {
    if (err) {
      console.log(err);
    };
    if (results) {
      
      res.redirect('localhost:3000/faculty/myCourses')
    }
  });
})
module.exports = router;
