import { Meteor } from 'meteor/meteor'
import { Moment } from 'meteor/momentjs:moment'
import mqtt from 'mqtt'
import request from 'request'

import {Pulses} from '../imports/api/pulses'
import {Pressures} from '../imports/api/pressures'

const client = mqtt.connect('mqtt://broker.hivemq.com')
const initialstateUrl = 'https://groker.initialstate.com/api/events?accessKey=pCbpAlqWxhACTiWbXAehfWogxlQaEoyL&bucketKey=S7NBGLXFEM4H'

// const pressure_param = '&pressure='
// const pulse_param = '&pulse='

client.on('connect', () => {
  client.subscribe('iROAM/pulse')
  client.subscribe('iROAM/pressure')
})

client.on('message', Meteor.bindEnvironment((topic, message) => {
  console.log(`${topic} : ${message}`)
  
  dataType = topic.split("/")[1]
  dataValue = parseInt(message)
  url = initialstateUrl
  
  // sendDataToInitialstate(dataType, dataValue)
  
  if (dataType === 'pulse') {
    url += `&pulse=${dataValue}`
    Pulses.insert({
      timestamp: Date.now(),
      value: dataValue
    })
  }
  
  if (dataType === 'pressure') {
    url += `&pressure=${dataValue}`
    Pressures.insert({
      timestamp: Date.now(),
      value: dataValue
    })
  }
  
  console.log(`sending url : ${url}`)
  request.get(url, (err, res, body) => {
    if (err) {
      console.log(`error sending data inetrstate ${err}`)
    }
    
    if(res.statusCode !== 200 ) {
      console.log(`statuscode is ${res.statusCode}`)
    }
  })
}))

Meteor.startup(() => {
  // code to run on server at startup
  
  Meteor.setInterval(() => {
    // will run once every 24 hours
    
    let m = Date.now()
    let now = moment(m)
    let yesterday = moment(m)
    yesterday.subtract(1, 'day')
    nowInt = now.valueOf()
    yesterdayInt = yesterday.valueOf()
    console.log(nowInt)
    console.log(yesterdayInt)
    
    let pulseTotal = 0
    let pulseCount = 0
    let pressureTotal = 0
    let pressureCount = 0
    
    Pulses.find({ timestamp: { $lt: nowInt, $gt: yesterdayInt } })
      .map((p) => {
        console.log(p.value)
        pulseTotal += p.value
        pulseCount++
      })
    Pressures.find({ timestamp: { $lt: nowInt, $gt: yesterdayInt } })
      .map((p) => {
        console.log(p.value)
        pressureTotal += p.value
        pressureCount++
      })
    
    let pulseAvg = pulseTotal / pulseCount
    let pressureAvg = pressureTotal / pressureCount
    
    console.log(`daily total: ${pulseTotal}`)
    console.log(`daily avg: ${pulseAvg}`)
    console.log(`daily total: ${pressureTotal}`)
    console.log(`daily avg: ${pressureAvg}`)
    
    let avgUrl = `${initialstateUrl}&pulseAvg=${pulseAvg}&pressureAvg=${pressureAvg}`
    request.get(avgUrl, (err, res, body) => {
      if (err) {
        console.log(`error sending data inetrstate ${err}`)
      }
      if(res.statusCode !== 200 ) {
        console.log(`statuscode is ${res.statusCode}`)
      }
    })
  }, 86400000)
})

// sendDataToInitialstate(target, message) {
//   let param
//   
//   if (target.includes('pulse')) {
//     param = pulse_param + message
//   } else if (target.includes('pressure')) {
//     param = pressure_param + message
//   }
//   
//   let url = initialstateUrl + param
//   console.log(`sending url : ${url}`)
//   
//   request.get(url, (err,res,body) => {
//     if(err) {
//       console.log(`error sending data inetrstate ${err}`)
//     }
//   
//     if(res.statusCode !== 200 ) {
//       console.log(`statuscode is ${res.statusCode}`)
//     }
//   })
// }