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
 var SettingSchema = new Schema({
 	helpContents: {
 		type: String,
 		trim: true,
 		default: '',
 	}

 });

 mongoose.model('Setting', SettingSchema);
