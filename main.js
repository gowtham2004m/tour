const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const ejs = require('ejs');
// const path = require('path');

const app = express();
const port = 3000; 

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

app.set('view engine', 'ejs');
app.set('views', 'E:/tour');
app.use((express.static("E:/tour/")));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gowtham@123',
  database: 'travel',
  connectionLimit: 10,
});
// app.set('views', path.join(__dirname, 'ejs'));


app.use(bodyParser.urlencoded({ extended: false }));

app.get("/log",(req,res)=>{
  res.sendFile(__dirname + '/log.html');
})
app.post('/submit-feedback', (req, res) => {
  const { name, email, feedbk } = req.body;
  
 
  const insertQuery = `INSERT INTO feedback (name, email, feedbk) VALUES (?, ?, ?)`;
  db.query(insertQuery, [name, email, feedbk], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error submitting feedback.');
    }

    res.redirect('http://localhost:5500/mainPage.html');
  });
});


app.post('/signup', (req, res) => {
  const firstname = req.body.fname;
  const password = req.body.password;
  const email = req.body.email;
  const city = req.body.city;
  const phone = req.body.phone;

  const sql = "INSERT INTO customer (id, fname, password, email, city, phone) VALUES (0, ?, ?, ?, ?, ?)";
  const values = [firstname, password, email, city, phone];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.write('<script>alert("Username already taken"); window.location="/signup.html";</script>');
      } else {
        throw err;
      }
    } else {
      if (firstname === "admin" && password === "ad123") {
        res.redirect("/");
      } else {
        res.redirect("/mainPage");
      }
    }
  });
});


app.post('/info',(req,res)=>{
  let city = req.body.city;
  const sql = `SELECT * FROM information WHERE pname = '${city}'`;
  db.query(sql,(err,result)=>{
    if (err) throw err;
    if(result.length>0){
      console.log(result);
      res.render('ejs/info', { result });
    }
    else{
      res.send('<script>alert("error");</script>');
    }
  })
});



app.post('/login', (req, res) => {
  const username = req.body.user;
  const password = req.body.pass;
  const d = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let i = 0;
  let usern = '';
  let passd = '';

  const que = `INSERT INTO login (user, pass, date_time) VALUES ('${username}', '${password}', '${d}')`;

  const sql = `SELECT fname, password FROM customer WHERE fname='${username}' AND password='${password}'`;

  if (username === 'admin' && password === 'ad123') {
    db.query(que, (err) => {
      if (err) throw err;
      res.redirect('/mainPage');
    });
  } else {
    db.query(sql, (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        const row = result[0];
        usern = row.fname;
        passd = row.password;

        if (usern === username && passd === password) {
          db.query(que, (err) => {
            if (err) throw err;
            res.redirect('/mainPage');
          });
        } else {
          res.send('<script>alert("Invalid username or password");</script>');
        }
      } else {
        res.send('<script>alert("Invalid username or password");</script>');
      }
    });
  }
});

app.post('/booking', (req, res) => {
  const { ffirst, flast, femail, city, fphone, fdesti } = req.body;
  const insertQuery = `INSERT INTO booking (ffirst, flast, femail, city, fphone, fdesti) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [ffirst, flast, femail, city, fphone, fdesti];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data');
    } else {
      console.log('Data inserted successfully');
      const script = `
      <script>
        alert('Data inserted successfully!');
        window.location.href = '/mainPage.html'; // Redirect after showing the alert
      </script>
    `;
    res.redirect('/mainPage.html?inserted=true');// Redirect to your desired page
    }
  });
});


// Route to display booked tickets
app.get('/displayData', (req, res) => {
  const selectQuery = 'SELECT * FROM booking'; // Modify this query to suit your table structure

  db.query(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    } else {
      // Render the displayData.ejs page and pass the fetched data to it
      res.render('displayData', { data: rows });
    }
  });
});

app.get('/mainPage',(req,res)=>{
  res.sendFile(__dirname + '/mainPage.html');
});

app.get('/signup.html', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.listen(port,() => {
  console.log(`Server running on http://localhost:${port}`);
});



