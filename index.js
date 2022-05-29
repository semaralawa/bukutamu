const express = require('express');
const mysql = require('mysql');
const path = require('path');

//create connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bukutamu'
});

connection.connect();

//set up express
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    connection.query(
        'SELECT * FROM tamu',
        (error, results) => {
            res.render(path.join(__dirname, 'public/homepage.ejs'), { tamu: results });
        }
    );
});

app.post('/add-data', function (req, res) {
    var data = req.body;
    console.log(data)
    var sql = "INSERT INTO tamu SET ?";
    connection.query(sql, [data],
        (error, results) => {
            if (error) throw (error);
            console.log('add successfull');
            res.redirect('/');
        }
    );
});

app.get('/edit/:id', function (req, res) {
    connection.query(
        'SELECT * FROM tamu WHERE id=?', [req.params.id],
        (error, results) => {
            console.log(results)
            res.render(path.join(__dirname, 'public/edit.ejs'), { tamu: results });
        }
    );
});

app.post('/edit-data/:id', function (req, res) {
    var data = req.body;
    var sql = "UPDATE tamu SET ? WHERE id = ?";
    connection.query(sql, [data, req.params.id],
        (error, results) => {
            if (error) throw (error);
            console.log('update successfull');
        }
    );
    res.redirect('/');
});

app.get('/delete-data/:id', function (req, res) {
    var sql = "DELETE FROM tamu WHERE id=?";
    connection.query(sql, [req.params.id],
        (error, results) => {
            if (error) throw (error);
            console.log('delete successfull');
        }
    );
    res.redirect('/');
});

app.listen(5000, '0.0.0.0');

console.log("server started, visit http://localhost:5000/");
