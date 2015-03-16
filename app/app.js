var express    = require('express'),
    bodyParser = require('body-parser'),
    log4js     = require('log4js');

var app = express();
  app.use(bodyParser.json());

var logger = log4js.getLogger();
var lock;

app.get('/start',function(req,res){
  logger.debug('GET /start - Starting app');
  lock = true;
  dotCounter();
  res.sendStatus(200);
})

app.get('/stop',function(req,res){
  logger.debug('GET /stop - Stopping app');
  lock = false;
  res.sendStatus(200);
})

app.listen(8001,function(err){
  if(err) return console.error(err);
  var man = '########################\n' +
            '# EVENT GENERATOR      #\n' +
            '# By Mark Winteringham #\n' + 
            '#########################\n\n' +
            'This microservice, when started, will randomly create events between intervals and\n' +
            'output the events to a log file and database that can then be monitored using the\n' + 
            'monitoring tool in this repo\n\n' +
            'Using the app:\n' +
            '- To start the app call http://localhost:8001/start to make the app create events\n' +
            '- To stop the app call http://localhost:8001/stop';

  console.log(man)
});

function dotCounter(){
  console.log("PING");
  setTimeout(function(){
    if(lock){
      dotCounter();
    }
  },2000);
}