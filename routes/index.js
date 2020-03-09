var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');

// var sql = require("mssql");
const sql = require('mssql/msnodesqlv8')

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
  res.render('index', { status: req.session.loggedin });
});

router.get('/home', function(req, res, next) {
  res.render('Success');
});

router.get('/signup', function(req, res, next) {
  // let
  res.render('signup', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {

  let errors = [];



	if (req.body.password.length < 6) {console.log("pass length");
		errors.push({
			text: 'Password must be mininum 6 characters'
		});
	}
	if (errors.length > 0) {console.log("error mode");
		res.render('signup', {
			errors: errors,
			title: 'Register'
    });
    
  }
  else{
    var email = req.body.email;

    console.log("before sql query");
    // sql.connect(config, function (err){
    //   var request = new sql.Request();
      conn.query('SELECT * FROM users WHERE email = ' + "'" + email + "';", (err, result) => {
        
        if (err) {
					console.log(err);
        }
        
				if (result.recordset.length > 0) {
          console.log(result);
					let errors = [];

					errors.push({
						text: 'Email already exists'
					});

					res.render('signup', {
						errors: errors,
						title: 'Register'
          });
          
				} else {
					// var salt = bcrypt.genSaltSync(10);
          // var hash = bcrypt.hashSync(req.body.password, salt);
          var hash = passwordHash.generate(req.body.password);
// console.log(hash);

					var fname = req.body.fname;
					var lname = req.body.lname;
					var email = req.body.email;
					var phone = req.body.phone;
					var dob = req.body.dob;
					var gender = req.body.gender;
					var IDnum = req.body.ID;
          
					conn.query(
						"INSERT INTO users (fname, lname, email, passw, phone, dob, gender, IDnum) VALUES ('" +
							fname +
							"', '" +
							lname +
							"', '" +
							email +
							"', '" +
							hash + "', '" + phone + "', '" + dob + "', '" + gender + "', '" + IDnum +
							"');",
						(err, result) => {
							if (err) {
								console.log(err);
							}
							if (result) {
								console.log(result);
								res.render('login');
							}
						}
					);
				}
			})
    };
});

router.get('/login', function(req, res, next){
  res.render('login');
});

router.post('/login', function(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;

	let errors = [];

	if (email && password) {
		conn.query(
			"SELECT * FROM users WHERE email = '" + email + "';",
			(err, results) => {
				if (err) {
					console.log(err);
				}
				if (results) {
					// console.log(results);
					console.log('results.recordset.length = ' + results.recordset.length);
				}
				if (results.recordset.length > 0) {
					results = results.recordset[0];
					// console.log(results);
					
					

					var masterpass = results.passw;
					// console.log(masterpass);
					
					if (!passwordHash.verify(password, masterpass)) {
						res.redirect('/');
						// res.end();
					} else if (passwordHash.verify(password, masterpass)) {
						console.log("loggedIn");
							req.session.loggedin = true;
							req.session.userId = results.userId;
							req.session.username = results.fname;
							req.session.lastname = results.lname;

							console.log(req.session.loggedin);
							
							res.redirect('/');
						}
				} else {
					res.send('Incorrect Email and/or Password!');
				}
				// res.render('index');
				res.end();
			}
		);
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

router.get('/logout', function(req, res){
	req.session.destroy();
	req.session.loggedin = false;
	res.render('login', {sess:req.session.loggedin});
});

router.get('/contact', function(req, res){
	res.render('contact',{status:req.session.loggedin});
});

router.get('/profile', function(req, res){
	console.log(req.session.loggedin);
	
	if (req.session.loggedin){
		console.log('jsjs');
		
		res.render('profile', {fname:req.session.username, lname:req.session.lastname});
	}
	else
		res.render('/');
});
module.exports = router;
