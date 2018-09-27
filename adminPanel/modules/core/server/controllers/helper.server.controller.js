'use strict';

var path = require('path');
var apn = require('apn');
var gcm = require('node-gcm');


var _ = require('lodash');
var  mongoose = require('mongoose');
var Users = mongoose.model('User');
var config=require(path.resolve('./config/env/default'));

var thisCtrl=this;


exports.appPushNotification=function(userIds, notificationObject,isSingleUser){


	var iOSTokens=[];
	var androidTokens=[];

	var jsonQuery={_id:{$in:userIds}};

	if(isSingleUser){
		jsonQuery={_id:userIds};
	}
	
	Users.find(jsonQuery,{loginDevices:1})
	.exec(function(error,respose){

		if(error){
			console.log("error: in find user", error)
		}



		if(respose && respose.length>0){

			var deviceTokens=[];

			//Geting device token of each user 
			for(var j in respose){

				deviceTokens=respose[j].loginDevices;

				//Checking if multiple device token there
				for (var i = 0,l=deviceTokens.length;i < l; i++) {

					if(deviceTokens[i] && deviceTokens[i].deviceType==='android')
						androidTokens.push(deviceTokens[i].deviceToken);
					else if(deviceTokens[i] && deviceTokens[i].deviceType==='ios')
						iOSTokens.push(deviceTokens[i].deviceToken);

				}

			}

			if(androidTokens.length>0)
				thisCtrl.androidPushNotification(notificationObject,androidTokens);

			console.log("androidTokensandroidTokens",androidTokens)


			if(iOSTokens.length>0)
				thisCtrl.iosPushNotification(notificationObject,iOSTokens);

		}



	});

};


exports.iosPushNotification=function(notificationObject,deviceTokens){

/*	return false;
*/

var notification, options, connection;

	//var basePath=path.join(__dirname, '../../config/');

	//console.log("notificationObject",notificationObject)

	//looading iOS certificate file from config directory
	var isProductionEnv=true;

	var certificateFile=path.resolve(config.iosCertificate.certificateFilePath);
	var keyPemFile=path.resolve(config.iosCertificate.keyFilePath);

	if(isProductionEnv){
		certificateFile=path.resolve(config.iosCertificateProd.certificateFilePath);
		keyPemFile=path.resolve(config.iosCertificateProd.keyFilePath);
	}
	
	//configure option for push notification
	options = {
		/*passphrase : '',*/
		production:isProductionEnv,
		/*gateway : 'gateway.sandbox.push.apple.com', //gateway.push.apple.com*/
		/*port : 2195,*/
		key : keyPemFile,
		cert : certificateFile, 
		rejectUnauthorized : false,
	};

	//creating connection using config
	connection = new apn.Provider(options);

	notification = new apn.Notification();

	notification.expiry = Math.floor(Date.now() / 1000) + 3600*24*7;
     // Expires 7 days hour from now. 1d

     notification.alert = notificationObject.text;
     notification.sound = 'default';

     if(isProductionEnv){
     	notification.topic = "com.kudzuapp.kudzu";  //"com.ideavate.kudzu" //ideavate apple acc;
     }

     notification.payload = notificationObject;
     notification.badge = 0;


	//Sending message to device
	connection.send(notification, deviceTokens).then( (response) => {
		response.sent.forEach( (token) => {
			//notificationSent(user, token);
			//console.log("success",token, notificationObject)
		});
		response.failed.forEach( (failure) => {
			if (failure.error) {
   			    // A transport-level error occurred (e.g. network problem)
        		//notificationError(user, failure.device, failure.error);	
        		console.log(failure.device, failure.error , failure)

        	} else {	
		        // `failure.status` is the HTTP status code
		        // `failure.response` is the JSON payload
		        console.log(failure.device, failure.status, failure.response)
       		 //notificationFailed(user, failure.device, failure.status, failure.response);
       		}
       	});
	});
	//connection.sendNotification(notification);


};

exports.androidPushNotification=function(notificationObject,deviceTokens){

	var message = new gcm.Message();
	/*message.addNotification({
		title: 'Kudzu',
		body: notificationObject.pushNotificationText,
		icon: 'ic_launcher'
	});*/

	notificationObject.title='Kudzu';
	message.addData('data',notificationObject);
	/*message.addData('key1','message1');
	message.addData('key2','message2');*/

	var regTokens = deviceTokens;

	// Set up the sender with you API key 

	


	//var API_KEY="AAAAxcut2xY:APA91bEgBf2PAyjnGk_ppaXpyvUk51GBuvTqKUrrLyudSkOaCHc67FalBmuhtpSoI-JZv3W62wDYhcSoy2YDZwzYRiDibfh4WP_UtznTwHu-oUayCLJM7R7IM2OC982t5zzv2sDA6MDz"; //old key developemnt mode

	var API_KEY="AAAAYdfoXKE:APA91bE6hUblHZeJ14jD8CyuF2kmqTOa3bZwEeSZkIQBJvrRp9fudlRInDifs4GZ343NDwQJyYDbPA8CoH0m_8cAT49lxe9TC9GoOno__2k9yyMDONu_wKYA2Tyrcov38riBPrQVKHZg"; //new key release mode

	
	//var API_KEY=config.google.fcmServerKey;
	

	var sender = new gcm.Sender(API_KEY);


	// Now the sender can be used to send messages 	
	sender.send(message, { registrationTokens: regTokens }, function (err, response) {
		if(err) console.error("err android push notification",err);
		else 	console.log(response);
	});



    //other module 
	/*var FCM = require('fcm-node');
    var serverKey = 'AAAAxcut2xY:APA91bEgBf2PAyjnGk_ppaXpyvUk51GBuvTqKUrrLyudSkOaCHc67FalBmuhtpSoI-JZv3W62wDYhcSoy2YDZwzYRiDibfh4WP_UtznTwHu-oUayCLJM7R7IM2OC982t5zzv2sDA6MDz'; //put your server key here 
    var fcm = new FCM(serverKey);

    notificationObject.title='Kudzu';
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
    	to: deviceTokens[1], 
        //collapse_key: 'your_collapse_key',
        
        notification: {
        	title: 'Title of your push notification', 
        	body: { key1: 'testttttttttttttttttttt'},
        	click_action : 'MainActivity'
        },
        
        data: {  //you can send only notification or only data(or include both) 
        	data: notificationObject
        }
        	
    };


    fcm.send(message, function(err, response){
    	if (err) {
    		console.log("Something has gone wrong!");
    	} else {
    		console.log("Successfully sent with response: ", response);
    	}
    });*/
};