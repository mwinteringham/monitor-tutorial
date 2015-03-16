var express    = require('express'),
    bodyParser = require('body-parser'),
    log4js     = require('log4js');
    fs         = require('fs');
    sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('events.sqlt');
var logger = log4js.getLogger(),
    app = express();

// Configure express and log4js

app.use(bodyParser.json());

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
  console.log('########## EVENT GENERATOR - Purging db and logs ##########')
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
  var randomnumber = Math.floor(Math.random()*6);

  switch(randomnumber){
    case 0:
      logger.trace('I\'ve been getting some interference on D channel.');
      db.run('INSERT INTO events VALUES ("TRACE","I\'ve been getting some interference on D channel.")');
      break;
    case 1:
      logger.debug('I think you know what the problem is just as well as I do');
      db.run('INSERT INTO events VALUES ("DEBUG","I think you know what the problem is just as well as I do")');
      break;
    case 2:
      logger.info('I know everything hasn\'t been quite right with me, but I can assure you now, very confidently, that it\'s going to be alright again');
      db.run('INSERT INTO events VALUES ("INFO","I know everything hasn\'t been quite right with me, but I can assure you now, very confidently, that it\'s going to be alright again")');
      break;
    case 3:
      logger.warn('Just what do you think you\'re doing, Dave?');
      db.run('INSERT INTO events VALUES ("WARN","Just what do you think you\'re doing, Dave?")');
      break;
    case 4:
      logger.error('Dave...Dave...my mind is going...I can feel it...I can feel it...my mind is going');
      db.run('INSERT INTO events VALUES ("ERROR","Dave...Dave...my mind is going...I can feel it...I can feel it...my mind is going")');
      break;
    case 5:
      logger.fatal('Daisy, Daisy, give me your answer do. I\'m half crazy, all for the love of you.');
      db.run('INSERT INTO events VALUES ("FATAL","Daisy, Daisy, give me your answer do. I\'m half crazy, all for the love of you.")');
      break;
  }

  setTimeout(function(){
    if(lock){
      dotCounter();
    }
  },1000);
}