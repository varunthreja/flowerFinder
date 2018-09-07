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
 var RecognitionSchema = new Schema({
  hrUserId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'User',
  },
  userId:{
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'User',
  },
  plantId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Plant',
  },
  recognitionNo :{
    type:String,
    trim: true,
    unique: 'Please fill unique recognition number',
  },
  recognitionImageURL :{
    type: String,
    validate: [validateLocalStrategyProperty, 'Please fill in your recognition image']
  },

  recognitionThumbImageURL  :{
    type: String,
    /*validate: [validateLocalStrategyProperty, 'Please fill in your recognition thumb image']*/
    default : ''
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default:false
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },

});


 mongoose.model('Recognition', RecognitionSchema);
