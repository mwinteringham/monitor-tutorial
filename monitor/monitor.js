var express = require('express'),
    grep    = require('grep1'),
    fs      = require('fs'),
    sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('../app/events.sqlt');

var app = express();

app.get('/log/:logtype',function(req,res){
  grep([req.params.logtype,'-c','../app/eventgenerator.log'],function(err, stdout, stderr){
    if (err || stderr) {
      res.sendStatus(404);
    } else {
      res.status(200).send(stdout);
    }
  })
})

app.get('/db/:term',function(req,res){
  db.all('SELECT * FROM events WHERE eventDescription LIKE "%' + req.params.term + '%"',function(err, row){
    if(err){
      res.sendStatus(500);
    } else {
      res.status(200).send(row.length.toString());
    }
  })
})

app.get('/', function (req, res) {
  fs.readFile(__dirname + '/monitor.html', function (err, data) {
    if (err) return send404(res);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data, 'utf-8');
    res.end();
  });
});

app.listen(8000,function(err){
  if(err) return console.error(err);
});