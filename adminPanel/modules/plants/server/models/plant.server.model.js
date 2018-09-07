'use strict';

/**
 * Module dependencies
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
 var validateLocalStrategyProperty = function (property) {
  return (!this.updated || property.length);
};

//More options => Height; spread; light exposure; rate of growth; water requirements;maintenance level, Color; special features; Growing tips; Pest and Problems; design suggestion

/**
 * User Schema
 */
 var PlantSchema = new Schema({
  commonName: {
    type: String,
    trim: true,
    default: '',
  },
  scientificName: {
    type: String,
    trim: true,
    default: '',    
  },
  description: {
    type: String,
    trim: true,
    default: '',    
  },
  careTips: {
    type: String,
    default: ''
  },
  moreOptions:[{
    _id : false ,
    name: {
      type: String,
    },
    value: {
      type: String,
    }     
  }],
  careReminders:[{
   name: {
    type: String,
  },
  type : {
    type: String,
  },
   customDateTime : {
    type: Date,
  },
  description : {
    type: String,
    default:''
  },
  isOn :{
    type: Boolean,
    default:false
  }        
}],
region: {
  type: [],
  default: []
},
pictures: {
  type: [],
  default: []    
}, 
updated: {
  type: Date
},
created: {
  type: Date,
  default: Date.now
}

});

 mongoose.model('Plant', PlantSchema);
