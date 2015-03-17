var express = require('express');

var app = express();

app.get('/log/:logtype',function(req,res){
  res.sendStatus(200);
})

app.get('/db/:term',function(req,res){
  res.sendStatus(200);
})

app.listen(8000,function(err){
	if(err) return console.error(err);
});