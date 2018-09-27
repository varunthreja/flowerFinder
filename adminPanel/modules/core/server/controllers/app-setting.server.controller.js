'use strict';




var _ = require('lodash');
var path = require('path');
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var  mongoose = require('mongoose');
var AppSettings = mongoose.model('Setting');



exports.setHelpContent=function(req,res){

	/*var appSetting=new AppSettings(req.body);*/

	AppSettings.findOne({},{helpContents:1})
	.exec(function(err,appSetting){

		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(error)
			});
		}

		if(!appSetting){

			AppSettings.create({helpContents:req.body.helpContents},
				function(err, result){

					if(err){
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					}


					res.json({status:'success',data:result});

				})


		}else{

			appSetting.helpContents=req.body.helpContents;

			appSetting.save(function(saveerr){
				if(saveerr){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(error)
					});
				}


				res.json({status:'success',data:appSetting});


			})

		}

		

	})

}


exports.getHelpContent=function(req,res){

	AppSettings.findOne({},{helpContents:1})
	.exec(function(err,result){

		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(error)
			});
		}


		res.json({status:'success',data:result});

	})
}