import {Mongo} from 'meteor/mongo'

export const Pulses = new Mongo.Collection("pulses")

Pulses.allow({
  insert: function() {
    return true
  }
})