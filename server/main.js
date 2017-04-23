import { Meteor }from 'meteor/meteor';
import { Moment } from 'meteor/momentjs:moment';
import mqtt from 'mqtt';
import request from 'request';
import {Pulses} from '../imports/api/pulses';
import {lForce, rForce } from '../imports/api/pressures';

const client = mqtt.connect('mqtt://broker.hivemq.com');
const initialstateUrlElder = 'https://groker.initialstate.com/api/events?accessKey=pCbpAlqWxhACTiWbXAehfWogxlQaEoyL&bucketKey=ElderDemo';
const initialstateUrlRehab = 'https://groker.initialstate.com/api/events?accessKey=pCbpAlqWxhACTiWbXAehfWogxlQaEoyL&bucketKey=RehabDemo';
/*const dummylForceParams = `&e_lForce=-1&d_lForce=-1&w_lForce=-1`;
const dummyrForceParams = `&e_rForce=-1&d_rForce=-1&w_rForce=-1`;*/
const dummylForceParams = `&e_lForce=Left%20Side%20:scales:`;
const dummyrForceParams = `&e_rForce=:scales:%20Right%20Side`;
const dummyPulseParams = `&e_pulse=`;
const dummyStepParams = `&e_step=:walking:`;
const lowPulseEmoji = ':broken_heart:';
const normalPulseEmoji = ':heart:';
const highPulseEmoji = ':heartbeat:';
const lowPulseThreshold = 40;
const highPulseThreshold = 180;


let stepCounterUpdateFlag = false;

client.on('connect', () => {
  client.subscribe('iROAM/pulse');
  client.subscribe('iROAM/lForce');
  client.subscribe('iROAM/rForce');
});

client.on('message', Meteor.bindEnvironment((topic, message) => {
  let dataType = topic.split("/")[1];
  let dataValue = parseInt(message,10);
  let urlParams = '';

  if (dataType === 'pulse') {
    // console.log('pulse is : ' + dataValue);
    urlParams += `&pulse=${dataValue}` + dummyPulseParams ;
    if(dataValue < lowPulseThreshold){
      var nodemailer = require('nodemailer');
      var smtpTransport = require('nodemailer-smtp-transport');
      var transporter = nodemailer.createTransport(smtpTransport({
          service: 'gmail',
          auth: {
              user: 'srg.ba6@gmail.com', // my mail
              pass: 'yatra@1234'
          }
      }));
      var mailOptions = {
          from: '"iROAM Admin" <srg.ba6@gmail.com>', // sender address
          to: 'siddg@ufl.edu', // list of receivers
          subject: 'Heartbeat Alert!', // Subject line
          text: 'Testing', // plaintext body
          html: '<b>This is to alert you that Johnny\'s heartbeat has gone below the lower threshold. Please attend to this as soon as possible.' + 
          '<br><br>To view the current conditions, kindly go to the <a href="https://mcproject-enigmasidd.c9users.io/">iROAM dashboard</a>.</b>' // html body
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
      urlParams+=lowPulseEmoji ;
    }else if(dataValue > highPulseThreshold){
      var nodemailer = require('nodemailer');
      var smtpTransport = require('nodemailer-smtp-transport');
      var transporter = nodemailer.createTransport(smtpTransport({
          service: 'gmail',
          auth: {
              user: 'srg.ba6@gmail.com', // my mail
              pass: 'yatra@1234'
          }
      }));
      var mailOptions = {
          from: '"iROAM Admin" <srg.ba6@gmail.com>', // sender address
          to: 'siddg@ufl.edu', // list of receivers
          subject: 'Heartbeat Alert!', // Subject line
          text: 'Testing', // plaintext body
          html: '<b>This is to alert you that Johnny\'s heartbeat has gone above the higher threshold. Please attend to this as soon as possible.' + 
          '<br><br>To view the current conditions, kindly go to the <a href="https://mcproject-enigmasidd.c9users.io/">iROAM dashboard</a>.</b>' // html body
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
     urlParams+=highPulseEmoji ;
    }else{
      urlParams+=normalPulseEmoji; 
    }
    
    insertIntoTable(Pulses, dataValue);
  }else if (dataType === 'lForce') {
    urlParams += `&lForce=${dataValue}` + dummylForceParams;
    insertIntoTable(lForce, dataValue);
  }else if (dataType === 'rForce') {
    if (dataValue != 0) {
      urlParams += `&rForce=${dataValue}` + dummyrForceParams;
      insertIntoTable(rForce, dataValue);
    }
    urlParams = incrementStepCounter(dataValue, urlParams); //update step counter
  }
  
  sendRequests(urlParams);
}));

Meteor.startup(() => {

  Meteor.setInterval(() => {
    // will run once every 24 hours

    let m = Date.now();
    let now = moment(m)
    let yesterday = moment(m)
    yesterday.subtract(1, 'day');
    let nowInt = now.valueOf();
    let yesterdayInt = yesterday.valueOf();


    let pulseAvg = getAvgFromTable(Pulses,nowInt, yesterdayInt);
    let lForceAvg = getAvgFromTable(lForce,nowInt, yesterdayInt);
    let rForceAvg = getAvgFromTable(rForce,nowInt, yesterdayInt);


    // console.log(`daily pulse total: ${pulseTotal}`);
    console.log(`daily pulse avg: ${pulseAvg}`);
    console.log(`daily lForce avg: ${lForceAvg}`);
    console.log(`daily rForce avg: ${rForceAvg}`);

    let avgUrlParams = `&pulseAvg=${pulseAvg}&lForceAvg=${lForceAvg}&rForceAvg=${rForceAvg}`;
    sendRequests(avgUrlParams);

  }, 86400000);
});

function getAvgFromTable(table, end, start ){
  let total,count = 0;
      table.find({
        timestamp: {
          $lt: end,
          $gt: start
        }})
      .map((p) => {
        total += p.value;
        count++;
      });
  return total/count;
}

function insertIntoTable(table, data){
  table.insert({
      timestamp: Date.now(),
      value: data
    });
}

function sendRequests(urlParams){
 // console.log('url params: ' + urlParams);
  sendRequest(initialstateUrlElder+urlParams);
  sendRequest(initialstateUrlRehab+urlParams);
  console.log(urlParams);
}

function sendRequest(url) {
  request.get(url, (err, res, body) => {
    if (err) {
      console.log(`error sending data inetrstate ${err}`);
    }
   
  });
}

function incrementStepCounter(dataValue, urlParams) {
    if (stepCounterUpdateFlag === true && dataValue === 0) {
    console.log('updating step counter');
    stepCounterUpdateFlag = false;
    urlParams = `${urlParams}&stepCounter=1`;
    urlParams += dummyStepParams; 
  }
  else if (dataValue != 0) {
    stepCounterUpdateFlag = true;
  }
  return urlParams;
}
