var express = require('express'),
    grep    = require('grep1');

var app = express();

app.get('/log/:logtype',function(req,res){
  grep([req.params.logtype,'-c','../app/logs/eventgenerator.log'],function(err, stdout, stderr){
    if (err || stderr) {
      res.sendStatus(404);
    } else {
      res.status(200).send(stdout);
    }
  })
})

app.get('/db/:term',function(req,res){
  res.sendStatus(200);
})

app.listen(8000,function(err){
  if(err) return console.error(err);
});