//var cron = require('node-cron');
var path = require('path'),
mongoose = require('mongoose'),
Users = mongoose.model('User'),
Reminders = mongoose.model('Reminder');
var HelperController =require('./helper.server.controller');
var crontab = require('node-crontab');
var moment=require('moment');
var un_=require('underscore');




var _ = require('lodash'),
config = require(path.resolve('./config/config')),
chalk = require('chalk'),
fs = require('fs'),
winston = require('winston');

// list of valid formats for the logging
var validFormats = ['combined', 'common', 'dev', 'short', 'tiny'];

// Instantiating the default winston application logger with the Console
// transport
var logger = new winston.Logger({
	transports: [
	new winston.transports.Console({
		level: 'info',
		colorize: true,
		showLevel: true,
		handleExceptions: true,
		humanReadableUnhandledException: true
	})
	],
	exitOnError: false
});

// A stream object with a write function that will call the built-in winston
// logger.info() function.
// Useful for integrating with stream-related mechanism like Morgan's stream
// option to log all HTTP requests to a file
logger.stream = {
	write: function(msg) {
		logger.info(msg);
	}
};

/**
 * Instantiate a winston's File transport for disk file logging
 *
 */
 logger.setupFileLogger = function setupFileLogger() {

 	var fileLoggerTransport = this.getLogOptions();
 	if (!fileLoggerTransport) {
 		return false;
 	}

 	try {
    // Check first if the configured path is writable and only then
    // instantiate the file logging transport
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
    	logger.add(winston.transports.File, fileLoggerTransport);
    }

    return true;
} catch (err) {
	if (process.env.NODE_ENV !== 'test') {
		console.log();
		console.log(chalk.red('An error has occured during the creation of the File transport logger.'));
		console.log(chalk.red(err));
		console.log();
	}

	return false;
}

};

/**
 * The options to use with winston logger
 *
 * Returns a Winston object for logging with the File transport
 */
 logger.getLogOptions = function getLogOptions() {

 	var _config = _.clone(config, true);
 	var configFileLogger = _config.log.fileLogger;

 	if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.fileName')) {
 		console.log('unable to find logging file configuration');
 		return false;
 	}

 	var logPath = configFileLogger.directoryPath + '/' + configFileLogger.cronLogFileName;

 	return {
 		level: 'debug',
 		colorize: false,
 		filename: logPath,
 		timestamp: true,
 		maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
 		maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
 		json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
 		eol: '\n',
 		tailable: true,
 		showLevel: true,
 		handleExceptions: true,
 		humanReadableUnhandledException: true
 	};

 };


 logger.setupFileLogger();


 /* Daily: 9:30 AM local time
    Twice weekly: Wednesday and Saturday //30 9 * * 3,6
    Weekly: Saturday //30 9 * * 6
    Every two weeks: every other Saturday //30 9 8-14,22-28 * 6 or 30 9 * * 6#2,4
    Monthly: first Saturday of the month OR first day of the month (whichever is easier)   //30 9 1-8 * 6
    Quarterly: Jan1, April 1, July 1, and Oct 1 //30 9 1 1,4,7,10 *
    Every six months: April 1 and Oct 1 //30 9 1 4,10 *
    Season: Spring: March 20 //30 9 20 3 *
    Season: Fall: September 22 //30 9 22 9 *
    Season: Winter: Dec 21 //30 9 21 12 *
    Season: Summer: June 20 //30 9 20 6 *
    Other: define

    (all should be set for 9:30 AM local time)*/

/*
# 1. Entry: Minute when the process will be started [0-60]
# 2. Entry: Hour when the process will be started [0-23]
# 3. Entry: Day of the month when the process will be started [1-28/29/30/31]
# 4. Entry: Month of the year when the process will be started [1-12]
# 5. Entry: Weekday when the process will be started [0-6] [0 is Sunday]
*/
function minutesToStr(minutes) {  
	var sign ='';  
	if(minutes < 0){  
		sign = '-';  
	}  

	var hours = leftPad(Math.floor(Math.abs(minutes) / 60));  
	var minutes = leftPad(Math.abs(minutes) % 60);  

	return hours+':'+minutes+':00:000Z';

}  


function leftPad(number) {    
	return number;
   //((number < 10 && number >= 0) ? '0' : '') + number;  
}  



function getAllActiveRemindersByQuery(isByType,type,callback){


	//var matchType={ $regex: new RegExp("^" + type.toUperCase(), "i") };
	//{$elemMatch: {type: type,isOn:true, isDeleted:false}}
	//,userId:'58ca5520bdc4f20601e3ec9e'

	Reminders.find({'userReminders.type':type,'userReminders.isOn':true, 'userReminders.isDeleted':false},{userId:1,userReminders:1})
	.populate({path:'userReminders.plantId',select: '_id commonName scientificName description pictures'})
	.populate({path:'userId',select: '_id displayName timeZoneAndUtcOffset'})
	.exec(function(error,result){
		if(error){
			return callback(error,null)
		}
		callback(null,result)
	})


}


function scheduleReminderUsingType(type,callback){

	getAllActiveRemindersByQuery(true,type,function(error,result){


		if(error){
			return callback(error,null);
		}

		/*console.log("ressssssssssss",result);*/
		/*return false;*/

		if(!result){
			return false;
		}

		var todayDate=new Date();

		for(var i in result){

			if(!result[i].userId){
				return false;
			}


			var reminders=result[i].userReminders.toObject();
			var timeZoneAndUtcOffset =(result[i].userId)?result[i].userId.timeZoneAndUtcOffset:'ACST_09:30';//"SAMT_04:00:00";
			var utcOffset=(timeZoneAndUtcOffset)?timeZoneAndUtcOffset.split('_')[1]:'00:00';
			var reminderUserId=result[i].userId._id;
			var userTimeToSend=0;
  			var timeAtzero=570; //at 9:30 am into minute;

  			var totalMIn=moment.duration(utcOffset).asMinutes();  //330

  		//var totalMIn=moment.duration().minutes();

  		//console.log("totalMIntotalMIn, utcOffset , timeZoneAndUtcOffset",totalMIn,utcOffset,timeZoneAndUtcOffset);

  		

  		if(timeAtzero>totalMIn || timeAtzero==totalMIn){
  			userTimeToSend=timeAtzero-totalMIn;  //570-330 = 240 
  		}else{
  			userTimeToSend=1440-(timeAtzero-totalMIn);
  		}


  		if(userTimeToSend>0){   		

  			var hrsAndMin = minutesToStr(userTimeToSend).split(':'); 

   			//console.log("userTimeToSend hrsAndMinhrsAndMin",userTimeToSend,hrsAndMin);

   			var datat= todayDate.getDate();
   			var month=todayDate.getMonth();
   			var year=todayDate.getFullYear();
   			var hours=parseInt(hrsAndMin[0]);
   			var minutes=parseInt(hrsAndMin[1]);

   			var fullDate=new Date(year, month, datat,hours,minutes,0,0);
   			//fullDate.setUTCMilliseconds(0);

   			fullDate.setUTCHours(hours);
   			fullDate.setUTCMinutes(minutes);

   			var scheduledReminders=[];
   			var scheduledReminderObject={}

   			for(var j in  reminders)
   			{ 
   				scheduledReminderObject={};

   				if(reminders[j].isOn && !reminders[j].isDeleted && reminders[j].type===type && reminders[j].plantId){ 

   					scheduledReminderObject.reminderId=reminders[j].reminderId;
   					scheduledReminderObject.name=reminders[j].name;
   					scheduledReminderObject.description=reminders[j].description;
   					scheduledReminderObject.type=reminders[j].type;
   					scheduledReminderObject.plantId=reminders[j].plantId._id;
   					scheduledReminderObject.customDateTime=fullDate.toISOString();

   					scheduledReminders.push(scheduledReminderObject);

   				}
   			} 


   			Reminders.update({userId:reminderUserId},{ $pushAll:{scheduledReminders:scheduledReminders}}).exec(function(err,success
   				){
   				if(err){
   					return callback(err,null);
   				}
   				return callback(null,success);
   			})



   		}else{

   			//Send now notification
   			var reminders=result[i].userReminders.toObject();
   			for(var j in  reminders)
   			{	
   				if(reminders[j].isOn && !reminders[j].isDeleted && reminders[j].type===type && reminders[j].plantId){	

   					var message = {
   						text:reminders[j].name+' Reminder for plant:'+reminders[j].plantId.commonName,
   						data : reminders[j],
   						type:'reminder'
   					};

   					logger.info(JSON.stringify(message)+' UserId : '+result[i].userId);
   					HelperController.appPushNotification(result[i].userId._id,message,true);
   				}
   			}	
   		}
   	}

   })

}


//This job running every min to check if schedular matched 
var dailySchedularJobId = crontab.scheduleJob("* * * * *", function(){ 

	//gotoschedular
	var newDateToday=new Date();

	
	newDateToday.setSeconds(0);
	newDateToday.setMilliseconds(0);

	newDateToday.setUTCMilliseconds(0);

	var gtDate=new Date();
	var ltDate=new Date();

	gtDate.setMilliseconds(0);
	ltDate.setUTCMilliseconds(0);

	/*ltDate.setMilliseconds(0);
	gtDate.setUTCMilliseconds(0);*/

	gtDate.setMinutes(newDateToday.getMinutes()-1);
	ltDate.setMinutes(newDateToday.getMinutes()+1);

	//console.log('newDateToday',newDateToday,gtDate,ltDate);
	//{'scheduledReminders.customDateTime':{$gt:gtDate,$lt:ltDate}}

	Reminders.find({scheduledReminders :{ $exists: true, $ne: [] }},{scheduledReminders:1,userId:1})
	.populate({path:'scheduledReminders.plantId',select: '_id commonName scientificName description pictures'})
	.exec(function(err,result){

		if(err){
			console.log("Error in schedule reminder : ",err);
		}


		var userIdsMatched=un_.pluck(result,'userId');


		var pullingReminders=[];
		var userPullReminder={};


		var message = {};


		for(var i in result){

			userPullReminder={
				userId:result[i].userId,
				remindersTobePull:[]
			};

			var reminders=result[i].scheduledReminders.toObject();
			for(var j in  reminders)
			{	

			//new Date(reminders[j].customDateTime)>gtDate &&
			if(new Date(reminders[j].customDateTime)>gtDate && new Date(reminders[j].customDateTime)<ltDate && reminders[j].plantId){

				message = {};
				message.text=reminders[j].name+' Reminder for plant:'+reminders[j].plantId.commonName;
				
				//comment as app crashed on android
				//reminders[j].plantId=reminders[j].plantId._id;				
				userPullReminder.remindersTobePull.push(reminders[j]._id);
				message.data = reminders[j];
				message.type='reminder';
				

				logger.info(JSON.stringify(message)+' UserId :'+result[i].userId);
				HelperController.appPushNotification(result[i].userId,message,true);

			}

		}

		pullingReminders.push(userPullReminder);
	}


	if(pullingReminders.length>0){
		for(var p in pullingReminders){


			/*	var remindersids=un_.pluck(pullingReminders[p].remindersTobePull,'_id');*/
			Reminders.update({userId:pullingReminders[p].userId},{$pull:{scheduledReminders:{_id:{ $in :pullingReminders[p].remindersTobePull}}}},{multi:true}).exec(function(updateError,updateSuccces){

				if(updateError){
					logger.info("updateError:"+updateError);

				}

			})

		}
	}

		/*Reminders.update({userId:{$in:userIdsMatched}},{$pullAll:{scheduledReminders:pullingReminders}},{multi:true}).exec(function(updateError,updateSuccces){

			if(updateError){
				console.log("updateError:",updateError);
				logger.info("updateError:"+updateError);

			}

			console.log('updateSuccces',updateSuccces);
		})*/

	})

})

//Daily mid night job for schedule reminder 
var dailyJobId = crontab.scheduleJob("0 0 * * *", function(){ 
	//logger.info("It's been 5 tab minutes!");
	logger.info("It's been 12:00 am daily tab minutes!", new Date());
	scheduleReminderUsingType('Daily',function(err,success){
		if(err){
			logger.info("It's been 12:00 am daily tab minutes!", new Date());
			return false;

		}

		logger.info("success am daily tab minutes!"+success);
	})
	
});



//Weekly: Saturday
var weeklyJobId = crontab.scheduleJob("0 0 * * 6", function(){ 
	//This will call this function every week on sunday
	logger.info("It's been every Weekly: Saturday");
	scheduleReminderUsingType('Weekly',function(err,success){
		if(err){
			logger.info("It's been 12:00 am weekly tab error!"+err);
			return false;
		}
		logger.info("success am weekly tab minutes!"+success);
	})
});


var snoozedJobId = crontab.scheduleJob("30 9 * * *", function(){ 
	logger.info("It's been snoozedJobId at 9:30 daily minutes!");

	var todayDate = new Date();
	var dd = todayDate.getDate();
	var mm = todayDate.getMonth();	 	
	var yyyy = todayDate.getFullYear();



		//todayDate.setHours(0,0,0,0)
		todayDate.setHours(0);
		todayDate.setMinutes(0);
		todayDate.setSeconds(0);

		//console.log('##############################today',typeof todayDate);

		var yesterdayIsoString=new Date(yyyy,mm,(dd-1),0,0,0)//.toISOString()
		var tomorrowIsoString=new Date(yyyy,mm,(dd+1),0,0,0)//.toISOString()

		yesterdayIsoString.setHours(0);
		yesterdayIsoString.setMinutes(0);
		yesterdayIsoString.setSeconds(0);

		//console.log('################################22',yesterdayIsoString,tomorrowIsoString);
		//console.log('################################22',typeof yesterdayIsoString, typeof tomorrowIsoString);



		Reminders.find({'userReminders.isSnoozed':true, 'userReminders.isOn':true,'userReminders.isDeleted':false, 'userReminders.snoozeDate':{$gt:new Date(yesterdayIsoString),$lt:new Date(tomorrowIsoString)}}/*,{userId:1,userReminders: {$elemMatch: {isOn:true, isDeleted:false}}}*/)
		/*.where('userReminders', { $elemMatch: {isOn:true, isDeleted:false}})*/
		.populate({path:'userReminders.plantId',select: '_id commonName scientificName description pictures'})
		.exec(function(error,result){
			if(error){
				console.log("error: in reminder cron",error)
			}

			var message = {};

			for(var i in result){
				var reminders=result[i].userReminders.toObject();

				for(var j in  reminders)
				{	
					var snoozeDate=new Date(reminders[j].snoozeDate);

					if(reminders[j].isOn && !reminders[j].isDeleted && snoozeDate>new Date(yesterdayIsoString) && snoozeDate<new Date(tomorrowIsoString) && reminders[j].plantId){


					//return false;
					message.text=reminders[j].name+' Reminder for plant:'+reminders[j].plantId.commonName;
					//reminders[j].plantId=reminders[j].plantId._id;				
					message.data = reminders[j];
					message.type='reminder';
					logger.info(message);
					HelperController.appPushNotification(result[i].userId._id,message,true);
				}

			}	

		}

	})
	});

//Twice weekly: Wednesday and Saturday
var twiceWeeklyJobId = crontab.scheduleJob("0 0 * * 3,6", function(){ 
	//This will call this function every week on sunday
	logger.info("It's been Twice weekly: Wednesday and Saturday"); //
	scheduleReminderUsingType('Twice weekly',function(err,success){
		if(err){
			logger.info("It's been 12:00 am twice weekly tab error!"+err);
			return false;
		}
		logger.info("success am twice weekly tab minutes!"+success);
	})
});

//Every two weeks: every other Saturday //30 9 8-14,22-28 * 6 or 30 9 * * 6#2,4
var everyTowWeeksJobId = crontab.scheduleJob("0 0 8-14,22-28 * 6", function(){ 
	//This will call this function every week on sunday 'Every two weeks'
	logger.info("It's been Every two weeks: every other Saturday ");
	scheduleReminderUsingType('Every two weeks',function(err,success){
		if(err){
			logger.info("It's been 12:00 am Every two weeks tab error!"+err);
			return false;
		}
		logger.info("success am Every two weeks tab minutes!"+success);
	})
});

// Monthly: first Saturday of the month OR first day of the month (whichever is easier)   //30 9 1-8 * 6
var monthlyJobId = crontab.scheduleJob("0 0 1-8 * 6", function(){ 
	//This will call this function every week on sunday Monthly
	logger.info("Monthly: first Saturday of the month OR first day of the month");
	scheduleReminderUsingType('Monthly',function(err,success){
		if(err){
			logger.info("It's been 12:00 am Monthly weeks tab error!"+err);
			return false;
		}
		logger.info("success am Monthly tab minutes!"+success);
	})
});

//Quarterly: Jan1, April 1, July 1, and Oct 1 //30 9 1 1,4,7,10 *
var quarterlyJobId = crontab.scheduleJob("0 0 1 1,4,7,10 *", function(){ 
	//This will call this function every week on sunday Quarterly
	logger.info("It's been Quarterly: Jan1, April 1, July 1, and Oct 1");
	scheduleReminderUsingType('Quarterly',function(err,success){
		if(err){
			logger.info("It's been 12:00 am Quarterly weeks tab error!"+err);
			return false;
		}
		logger.info("success am Quarterly tab minutes!"+success);
	})
});


//Every six months: April 1 and Oct 1 //30 9 1 4,10 *
var everySixMonthJobId = crontab.scheduleJob("0 0 1 4,10 *", function(){ 
	//This will call this function every week on sunday Every six months
	logger.info("It's been /Every six months: April 1 and Oct 1");
	scheduleReminderUsingType('Every six months',function(err,success){

		if(err){
			logger.info("It's been 12:00 am Every six months weeks tab error!"+err);
			return false;

		}

		logger.info("success am Every six months tab minutes!"+success);

	})
});

// Season: Spring: March 20 //30 9 20 3 *
var seasonSpringJobId = crontab.scheduleJob("0 0 20 3 *", function(){ 
	//This will call this function every week on sunday Season: Spring
	logger.info("It's been Season: Spring: March 20 tab!");
	scheduleReminderUsingType('Season: Spring',function(err,success){

		if(err){
			logger.info("It's been 12:00 am Season: Spring weeks tab error!"+err);
			return false;

		}

		logger.info("success am Season: Spring tab minutes!"+success);

	})
});

// Season: Fall: September 22 //30 9 22 9 *
var seasonFallJobId = crontab.scheduleJob("0 0 22 9 *", function(){ 
	//This will call this function every week on sunday Season: Fall
	logger.info("It's been  Season: Fall: September 22 tab!");

	scheduleReminderUsingType('Season: Fall',function(err,success){

		if(err){
			logger.info("It's been 12:00 am Season: Fall weeks tab error!"+err);
			return false;

		}

		logger.info("success am Season: Fall tab minutes!"+success);

	})
});

//Season: Winter: Dec 21 //30 9 21 12 *
var seasonWinterJobId = crontab.scheduleJob("0 0 21 12 *", function(){ 
	//This will call this function every week on sunday Winter
	logger.info("It's been Season: Winter: Dec 21 tab!");
	scheduleReminderUsingType('Season: Winter',function(err,success){

		if(err){
			logger.info("It's been 12:00 am Season: Winter weeks tab error!"+err);
			return false;
		}
		logger.info("success am Season: Winter tab minutes!"+success);

	})
});

// Season: Summer: June 20 //30 9 20 6 *
var seasonSummerJobId = crontab.scheduleJob("0 0 20 6 *", function(){ 
	//This will call this function every week on sunday Summer
	logger.info("It's been Season: Summer: June 20 tab!");
	scheduleReminderUsingType('Season: Summer',function(err,success){

		if(err){
			logger.info("It's been 12:00 am Season: Summer weeks tab error!"+err);
			return false;
		}
		logger.info("success am Season: Summer tab minutes!"+success);

	})
});


// Other : user defined date time reminder
var customDateTimeJobId = crontab.scheduleJob("* * * * *", function(){ 
	//This will call this function every min to Other : user defined date time reminder
	//logger.info("It's been every customDateTime tab!");

	var dateNow=new Date();
	dateNow.setSeconds(0);
	dateNow.setMilliseconds(0);

	console.log("####### every min to check user defined date time reminder",dateNow);


	var gtDate=new Date();
	var ltDate=new Date();

	gtDate.setSeconds(0);
	gtDate.setMilliseconds(0);

	ltDate.setSeconds(0);
	ltDate.setMilliseconds(0);

	gtDate.setMinutes(dateNow.getMinutes()-1);
	ltDate.setMinutes(dateNow.getMinutes()+1);



	Reminders.find({'userReminders.isOn':true,'userReminders.isDeleted':false, 'userReminders.customDateTime':{$gt:gtDate,$lt:ltDate}},{userId:1,userReminders: {$elemMatch: {isOn:true, isDeleted:false,customDateTime:{$gt:gtDate,$lt:ltDate}}}})
	.populate({path:'userReminders.plantId',select: '_id commonName scientificName description pictures'})
	.exec(function(error,result){
		
		if(error){
			console.log("error: in reminder cron",error)
		}

		var message ={};
		

		for(var i in result){
			var reminders=result[i].userReminders.toObject();

			for(var j in  reminders)
			{	

				if(reminders[j].isOn && !reminders[j].isDeleted && reminders[j].plantId){	

					//return false;
					message ={};

					message.text=reminders[j].name+' Reminder for plant:'+reminders[j].plantId.commonName;
					reminders[j].plantId=reminders[j].plantId._id;				
					message.data = reminders[j];
					message.type='reminder';
					logger.info("customDateTime : "+message);

					HelperController.appPushNotification(result[i].userId,message,true);
				}
			}		

		}

	})
});


exports.testUpdateReminder=function(req,res){


	/*//gotoupdate
	var userId=req.query.userId;
	var scheduledReminders = [{
		"description" : "This is a daily reminder",
		"plantId" : "590756aed66e57297d08f739",
		"customDateTime" : new Date("2017-05-03T06:25:00.000Z"),
		"type" : "Daily",
		"name" : "Daily",
		"reminderId" : "590756aed66e57297d08f73e"
	}]

	Reminders.update({userId:userId},{$set:{scheduledReminders:scheduledReminders}},{multi:true}).exec(function(updateError,updateSuccces){

		if(updateError){
			console.log("updateError:",updateError);
			logger.info("updateError:"+updateError);

		}

		console.log('updateSuccces',updateSuccces);

		res.send(updateSuccces);
	})*/

	var todayDate=new Date();
	var userId=req.query.userId;
	var dtString=req.query.dtString;

	//var dtString="2017-05-18T06:30:00.000Z";

	var reminderType=req.query.reminderType;


	Reminders.find({'userReminders.type':reminderType,'userReminders.isOn':true, 'userReminders.isDeleted':false , userId : userId },{userId:1,userReminders:1})
	.populate({path:'userReminders.plantId',select: '_id commonName scientificName description pictures'})
	.populate({path:'userId',select: '_id displayName timeZoneAndUtcOffset'})
	.exec(function(error,result){
		if(error){
			return res.josn(error);
		}

		var response=[];

		//res.send(result);
		

		for(var i in result){

			if(!result[i].userId){
				return false;
			}


			var reminders=result[i].userReminders.toObject();
	var timeZoneAndUtcOffset =(result[i].userId)?result[i].userId.timeZoneAndUtcOffset:'ACST_09:30';   //"SAMT_04:00:00";
	var utcOffset=(timeZoneAndUtcOffset)?timeZoneAndUtcOffset.split('_')[1]:'00:00';
	var reminderUserId=result[i].userId._id;
	var userTimeToSend=0;
  	var timeAtzero=570; //at 9:30 am into minute;
	var totalMIn=moment.duration(utcOffset).asMinutes();  //330

  		//var totalMIn=moment.duration().minutes();

  		//console.log("totalMIntotalMIn, utcOffset , timeZoneAndUtcOffset",totalMIn,utcOffset,timeZoneAndUtcOffset);

  		

  		if(timeAtzero>totalMIn || timeAtzero==totalMIn){
  			userTimeToSend=timeAtzero-totalMIn;  //570-330 = 240 
  		}else{
  			userTimeToSend=1440-(timeAtzero-totalMIn);
  		}


  		if(userTimeToSend>0){   		

  			var hrsAndMin = minutesToStr(userTimeToSend).split(':'); 

  			

  			var datat= todayDate.getDate();
  			var month=todayDate.getMonth();
  			var year=todayDate.getFullYear();
  			var hours=parseInt(hrsAndMin[0]);
  			var minutes=parseInt(hrsAndMin[1]);

  			var fullDate=new Date(year, month, datat,hours,minutes,0,0);
   			//fullDate.setUTCMilliseconds(0);

   			fullDate.setUTCHours(hours);
   			fullDate.setUTCMinutes(minutes);

   			//response.push(fullDate.toISOString());

   			


   			console.log("555555555555555555555555555555555555555");


   			//console.log("userTimeToSend hrsAndMinhrsAndMin",userTimeToSend,hrsAndMin);

   			/*var datat= todayDate.getDate();
   			var month=todayDate.getMonth();
   			var year=todayDate.getFullYear();
   			var hours=parseInt(hrsAndMin[0]);
   			var minutes=parseInt(hrsAndMin[1]);*/

   			var scheduledReminders=[];
   			var scheduledReminderObject={}

   			for(var j in  reminders)
   			{ 
   				scheduledReminderObject={};

   				if(reminders[j].isOn && !reminders[j].isDeleted && reminders[j].type===reminderType && reminders[j].plantId){ 

   					scheduledReminderObject.reminderId=reminders[j].reminderId;
   					scheduledReminderObject.name=reminders[j].name;
   					scheduledReminderObject.description=reminders[j].description;
   					scheduledReminderObject.type=reminders[j].type;
   					scheduledReminderObject.plantId=reminders[j].plantId._id;
   					scheduledReminderObject.customDateTime=dtString;

   					scheduledReminders.push(scheduledReminderObject);

   				}
   			} 


   			Reminders.update({userId:reminderUserId},{ $pushAll:{scheduledReminders:scheduledReminders}}).exec(function(err,success
   				){
   				if(err){
   					return callback(err,null);
   				}
   				res.send(success);//(null,success);
   			})

   			console.log("55555558888888888888888888888888888888888888");


   		}

   	}

   	

   });

}

exports.testReminderNotification=function(req,res){
	var todayDate = new Date();



	var dd = todayDate.getDate();
	var mm = todayDate.getMonth();	 	
	var yyyy = todayDate.getFullYear();
	var userId=req.query.userId;

	todayDate.setHours(0,0,0,0)

	console.log('##############################today',todayDate);

	var yesterdayIsoString=new Date(yyyy,mm,(dd-1)).toISOString()
	var tomorrowIsoString=new Date(yyyy,mm,(dd+1)).toISOString()

	console.log('################################',yesterdayIsoString,tomorrowIsoString);
	//'userReminders.isSnoozed':true,
	//, 'userReminders.snoozeDate':{$gt:new Date(yesterdayIsoString),$lt:new Date(tomorrowIsoString)}
	Reminders.find({'userReminders.isOn':true,'userReminders.isDeleted':false, userId :userId }/*,{userId:1,userReminders: {$elemMatch: {isOn:true, isDeleted:false}}}*/)
	.populate({path:'userReminders.plantId',select: '_id commonName scientificName description pictures'})
	.populate({path:'userReminders.userId',select: '_id displayName'})
	.exec(function(error,result){


		if(error){
			console.log("error: in reminder cron",error)
		}
		
		console.log(JSON.stringify(result));

		for(var i in result){
			var reminders=result[i].userReminders.toObject();

			for(var j in  reminders)
			{	
				if(reminders[j].isOn && !reminders[j].isDeleted && reminders[j].plantId){	
					
					var message = {
						text:reminders[j].name+' Reminder for plant:'+reminders[j].plantId.commonName,
						data : reminders[j],
						type:'reminder'
					};
					//logger.info(message);

					console.log("messagemessage",message)
					HelperController.appPushNotification(result[i].userId,message,true);
					//break;
				}	
			}
		}


		res.json({status:'success',message:'Reminder notification sent.'})

	});
}


//module.exports=exports;
