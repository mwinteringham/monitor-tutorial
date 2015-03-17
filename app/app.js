var express    = require('express'),
    log4js     = require('log4js');
    fs         = require('fs');
    sqlite3    = require('sqlite3').verbose();

var db     = new sqlite3.Database('events.sqlt');
var logger = log4js.getLogger(),
    app    = express();

// Configure log4js

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/eventgenerator.log' }
  ]
})

// Endpoints to turn on and off the app randomisation

app.get('/start',function(req,res){
  console.log('########## EVENT GENERATOR - Starting app ##########');

  lock = true;
  dotCounter();

  res.sendStatus(200);
})

app.get('/stop',function(req,res){
  console.log('########## EVENT GENERATOR - Stopping app ##########');

  lock = false;
  
  res.sendStatus(200);
})

app.get('/purge',function(req,res){
  console.log('########## EVENT GENERATOR - Purging db and logs ##########');

  fs.writeFile('logs/eventgenerator.log', '', function (err) {
    if (err) return console.log(err);

    db.run("DELETE FROM events", function (err){
      if (err) return console.log(err);
      res.sendStatus(200);
    });
  });
})

// Start the app up and console out app usage

app.listen(8001,function(err){
  if(err) return console.error(err);
  var man = '########################\n' +
            '# EVENT GENERATOR      #\n' +
            '# By Mark Winteringham #\n' + 
            '########################\n\n' +
            'This microservice, when started, will randomly create events between intervals and\n' +
            'output the events to a log file and database that can then be monitored using the\n' + 
            'monitoring tool in this repo\n\n' +
            'Using the app:\n' +
            '- To start the app call http://localhost:8001/start to make the app create events\n' +
            '- To stop the app call http://localhost:8001/stop';

  console.log(man)
});

// Randomisation method to create app events

function dotCounter(){
  var randomnumber = Math.floor(Math.random()*6),
      type,
      msg;

  switch(randomnumber){
    case 0:
      msg = 'I\'ve been getting some interference on D channel.';
      type = "TRACE";

      logger.trace(msg);
      break;
    case 1:
      msg = 'I think you know what the problem is just as well as I do';
      type = "DEBUG";

      logger.debug(msg);
      break;
    case 2:
      msg = 'I know everything hasn\'t been quite right with me, but I can assure you now, very confidently, that it\'s going to be alright again';
      type = "INFO";

      logger.info(msg);
      break;
    case 3:
      msg = 'Just what do you think you\'re doing, Dave?';
      type = "WARN";

      logger.warn(msg);
      break;
    case 4:
      msg = 'Dave...Dave...my mind is going...I can feel it...I can feel it...my mind is going';
      type = "ERROR";

      logger.error(msg);
      break;
    case 5:
      msg = 'Daisy, Daisy, give me your answer do. I\'m half crazy, all for the love of you.';
      type = "FATAL";

      logger.fatal(msg);
      break;
  }

  db.run('INSERT INTO events VALUES ("' + type + '","' + msg + '")');

  setTimeout(function(){
    if(lock){
      dotCounter();
    }
  },1000);
}