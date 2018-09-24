'use strict';

let http = require('http');
let moment = require('moment');
var mongoose = require('mongoose');
var app = require('express')();
const Agenda=  require('agenda');
let mongoConnectionString= 'mongodb://localhost/agenda-test';



// Configuring Agenda
const agenda = new Agenda({db: {address: mongoConnectionString}}, function(err) {
    if (err) {
      console.log(err);
      throw err;
    }
    agenda.start();
  });

var cors = require('cors');
var serverPort = 8000;

app.use(cors());

  mongoose.connect(mongoConnectionString);

  agenda.on('ready', function() {
      // once agenda is ready we define the jobs
    agenda.define('print_result', (job, done) => {
        console.log(job.attrs.data)
        // Perform your job here
      });

      // current time
      let timestamp = new Date()

      // current time in unix format converted to integer
      let nowdate =parseInt(moment(timestamp).unix());

      // creating my scheduled time
      let date=moment(timestamp)
        .add(5, 'seconds');

        //scheduled time in unix format converted to integer
        let scheduledate = parseInt(moment(date).unix());
     
      agenda.schedule(`in ${scheduledate-nowdate} seconds`, 'print_result', {data: "job is done"}  )
    });


  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

    http.createServer(app).listen(serverPort, function () {
      console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
      console.log("wait for 5 seconds, your job will be done")
  });