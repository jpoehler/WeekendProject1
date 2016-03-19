var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var pg = require('pg');

var connectionString = '';

if (process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
  //console.log('DB is connected');
} else {
  connectionString = 'postgres://localhost:5432/employees';
  //console.log('Connected to DB');
}

router.post('/employees', function(req, res) {
  console.log('body: ', req.body);
pg.connect(connectionString, function(err, client, done){
  if (err) {
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
      done();
    } else {
      var start = client.query('CREATE TABLE IF NOT EXISTS employees (' +
                              'id SERIAL NOT NULL,' +
                              'first_name varchar(80) NOT NULL,' +
                              'last_name varchar(80) NOT NULL,' +
                              'idnumber varchar(10) NOT NULL,' +
                              'jobtitle varchar(80) NOT NULL,' +
                              'annualsalary varchar(10) NOT NULL,' +
                              'CONSTRAINT employees_pkey PRIMARY KEY (id))');

      var first_name = req.body.first_name;
      var last_name = req.body.last_name;
      var idnumber = req.body.idnumber;
      var jobtitle = req.body.jobtitle;
      var annualsalary = req.body.annualsalary;


      var query = client.query('INSERT INTO employees (first_name, last_name, idnumber, jobtitle, annualsalary) VALUES ($1, $2, $3, $4, $5)' +
                                'RETURNING id, first_name, last_name, idnumber, jobtitle, annualsalary', [first_name, last_name, idnumber, jobtitle, annualsalary]);

      var result = [];

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
})


router.get('/employees', function(req, res) {
  //console.log('body: ', req.body);
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var idnumber = req.body.idnumber;
  var jobtitle = req.body.jobtitle;
  var annualsalary = req.body.annualsalary;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('SELECT * FROM employees ORDER BY id DESC;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

router.get('/*', function(req, res){
var filename = req.params[0] || 'views/index.html';
res.sendFile(path.join(__dirname, '../public/', filename));

});


module.exports = router;
