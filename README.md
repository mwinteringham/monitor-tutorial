# monitor-tutorial

Monitor tutorial has two applications

1. /app     - Event Generator
2. /monitor - Monitor 		  

## Setup

Before you run either app you will need to run

```npm install```

To pull down relevant dependencies for both app.

## Event Generator

Located in /app, Event Generator is a small app that when started will randomly write events to both a log file and a database as well as an additional function to stop writing events and purge both log files and the database of content.

It can be run by navigating to the /app folder and running:

```node app.js```

The app has three endpoints that can all be accessed via a web browser:

- http://localhost:8001/start - Triggers the service to start generating random events.  You will see them appear in the console, the databaseand in a log file name eventgenerator.log
- http://localhost:8001/stop  - Stops the service from generating random events.
- http://localhost:8001/purge - Clears both the database and eventgenerator.log of content.  Can be triggered when the service is running.

## Monitor

Located in /monitor, the monitor can be used with or without Event Generator running (Although it's more effective in it's demonstration if Event Generator is running).

It can be run by navigating to the /monitor folder and running:

```node monitor.js```

Once monitor is running you can access it in your web browser at http://localhost:8000/

There are other endpoints that can be used in monitor to get counts from the log file or database which can also be accessed via a web browser

- http://localhost:8000/log/<search query> - Updating <search query> with a string will return a count of how many times that string appears in the log file.  If an error occurs or no strings are found it will return a 404 error.
- http://localhost:8000/db/<search query> - Updating <search query> with a string will return a count of how many times that string appears in the eventDescription column of the database.  If an error occurs or no strings are found it will return a 500 error.