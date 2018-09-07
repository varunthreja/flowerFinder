'use strict';

/**
 * Module dependencies
 */
 var mongoose = require('mongoose'),

 Schema = mongoose.Schema,
 crypto = require('crypto'),
 validator = require('validator');



/**
 * A Validation function for local strategy properties
 */
 var validateLocalStrategyProperty = function (property) {
  return (!this.updated || property.length);
};



/**
 * User Schema
 */
 var ReminderSchema = new Schema({

   userId:{
     type: Schema.Types.ObjectId,
     ref: 'User',
     unique: 'User already exists in reminder db',
   },
   lastModified: {
     type: Date
   },
   userReminders:[{
     reminderId: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    type : {
      type: String,
    },
    description : {
      type: String,
      default:''
    }, 
    customDateTime : {
      type: Date,
    },
    plantId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Plant',
    },
    isOn: {
      type: Boolean,
      default:true
    },
    isDeleted: {
      type: Boolean,
      default:false
    },
    isSnoozed: {
      type: Boolean,
      default:false
    },
    snoozeDate:{
      type: Date
    },
    updated: {
      type: Date
    },
    created: {
      type: Date,
      default: Date.now
    },        
  }],
  scheduledReminders:[{
    reminderId: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    type : {
      type: String,
    },
    description : {
      type: String,
      default:''
    }, 
    customDateTime : {
      type: Date
    },
    plantId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Plant',
    }         
  }]

});


 mongoose.model('Reminder', ReminderSchema);
