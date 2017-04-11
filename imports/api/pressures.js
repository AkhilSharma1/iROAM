import {Mongo} from 'meteor/mongo'

export const Pressures = new Mongo.Collection("pressures")

Pressures.allow({
  insert: function() {
    return true
  }
})