'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Reminders = mongoose.model('Reminder'),
 Plants = mongoose.model('Plant'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
 var toLocaleDateStringOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

  var _ = require('lodash');


/**
 * Add reminder
 */
 exports.createReminder = function (req, res) {



  if (!req.user) {
    return res.status(401).send({
      message: 'User is invalid'
    });
  }

  var newReminder={userReminders:[]};
  var lastModified=Date.now();

  req.body.updated=lastModified;
  newReminder.userReminders.push(req.body);
  newReminder.userId=req.user._id;
  newReminder.lastModified=lastModified;

  var newReminderObject=req.body;
  newReminderObject.updated=lastModified;



  Reminders.findOne({userId:req.user._id})
  .exec(function(errInFind,existReminder){
    if(errInFind){
      return res.status(422).send({
        message: errorHandler.getErrorMessage(errInFind)
      });
    }

    var response={status:'success', message : 'Reminder set successfully'}

    if(req.body.isOn && req.body.isOn=="false"){
      response.message='Reminder unset successfully';
    }


    if(newReminderObject.type==='Other'){

      Plants.findOne({_id:newReminderObject.plantId},{careReminders:{$elemMatch:{type:'Other', name:newReminderObject.name}}})
      .exec(function(errReminderOther, otherReminder){

        newReminder.customDateTime=otherReminder.careReminders[0].customDateTime;

        newReminderObject.customDateTime=otherReminder.careReminders[0].customDateTime;

        

        if(existReminder){

          var objectexistReminder=existReminder.toObject();

          var userReminders = objectexistReminder.userReminders;

          var isNew=false;

          for(var i=0; i<userReminders.length;i++){
           /* if(userReminders[i].name && userReminders[i].name ==req.body.name && userReminders[i].plantId.equals(req.body.plantId)){*/
            if(userReminders[i].reminderId && userReminders[i].reminderId.equals(req.body.reminderId) && userReminders[i].plantId.equals(req.body.plantId)){
              userReminders[i].isOn=req.body.isOn;
              userReminders[i].isDeleted=false;
              userReminders[i].updated=lastModified;
              userReminders[i].customDateTime=otherReminder.careReminders[0].customDateTime;

              isNew=false;
              break;

            }else{

              isNew=true;
            }
          }

          if(isNew){
            userReminders.push(newReminderObject);
          }

          existReminder.userReminders=userReminders;

          existReminder.lastModified=lastModified;
          existReminder.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
             res.json(response);
           }
         });

        }else{

          var reminder = new Reminders(newReminder);
       // Then save the reminder
       reminder.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(response);
        }
      });

     }


   })


    }else{

      if(existReminder){

        var objectexistReminder=existReminder.toObject();

        var userReminders = objectexistReminder.userReminders;

        var isNew=false;

        for(var i=0; i<userReminders.length;i++){
         /* if(userReminders[i].name && userReminders[i].name ==req.body.name && userReminders[i].plantId.equals(req.body.plantId)){*/
          if(userReminders[i].reminderId && userReminders[i].reminderId.equals(req.body.reminderId) && userReminders[i].plantId.equals(req.body.plantId)){
            userReminders[i].isOn=req.body.isOn;
            userReminders[i].isDeleted=false;
            userReminders[i].updated=lastModified;
            isNew=false;
            break;

          }else{

            isNew=true;
          }
        }

        if(isNew){
          userReminders.push(newReminderObject);
        }

        existReminder.userReminders=userReminders;

        existReminder.lastModified=lastModified;
        existReminder.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
           res.json(response);
         }
       });

      }else{

        var reminder = new Reminders(newReminder);
       // Then save the reminder
       reminder.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(response);
        }
      });

     }

   }



 })


};


/**
 * Delete reminder
 */
 exports.deleteReminder = function (req, res) {

  if (!req.user) {
    return res.status(401).send({
      message: 'User is invalid'
    });
  }


  var reminderToDelete=req.body;

  if(!reminderToDelete.reminderId){
   return res.status(422).send({
    message: 'Reminder id not found.'
  });

 }

 Reminders.findOne({userId:req.user._id,'userReminders.reminderId':reminderToDelete.reminderId})
  //,{userReminders: {$elemMatch: {reminderId: reminderToDelete.reminderId}}}
  .exec(function(errInFind,existReminder){
    if(errInFind){

      return res.status(422).send({
        message: errorHandler.getErrorMessage(errInFind)
      });
    }

    var response={status:'success', message : 'Reminder deleted successfully'}

    if(existReminder){

      var lastModified=Date.now();

      var objectexistReminder=existReminder.toObject();

      var userReminders = objectexistReminder.userReminders;


      for(var i=0; i<userReminders.length;i++){

       if(userReminders[i].reminderId && userReminders[i].reminderId.equals(req.body.reminderId) && userReminders[i].plantId.equals(req.body.plantId)){

        userReminders[i].isDeleted=true;
        userReminders[i].updated=lastModified;

        break;

      }
    }

    existReminder.userReminders=userReminders;
    existReminder.lastModified=lastModified;

    existReminder.save(function (err) {
      if (err) {

       return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
     } else {
       res.json(response);

     }
   });

  }else{
    res.json({status:'failure', message : 'Reminder not found'});

  }
})


};



/**
 * Delete reminder
 */
 exports.snoozeReminder = function (req, res) {

  if (!req.user) {
    return res.status(401).send({
      message: 'User is invalid'
    });
  }

  var reminderToSnooze=req.body;

  var snoozeDays=reminderToSnooze.datetime.split(' ')[0];

  if(!reminderToSnooze.reminderId){
   return res.status(422).send({
    message: 'Reminder id not found.'
  });

 }

 Reminders.findOne({userId:req.user._id,'userReminders.reminderId':reminderToSnooze.reminderId})
  //,{userReminders: {$elemMatch: {reminderId: reminderToDelete.reminderId}}}
  .exec(function(errInFind,existReminder){
    if(errInFind){

      return res.status(422).send({
        message: errorHandler.getErrorMessage(errInFind)
      });
    }

    var response={status:'success'};

    if(existReminder){

      var lastModified=Date.now();

      var objectexistReminder=existReminder.toObject();

      var userReminders = objectexistReminder.userReminders;


      for(var i=0; i<userReminders.length;i++){

       if(userReminders[i].reminderId.equals(req.body.reminderId)){

        userReminders[i].isSnoozed=true;

        var todayDate=new Date();
        todayDate.setDate(todayDate.getDate() + parseInt(snoozeDays));

        userReminders[i].snoozeDate=todayDate;
        response.message='Reminder snoozed to '+todayDate.toLocaleDateString("en-US",toLocaleDateStringOptions);

        break;

      }
    }

    existReminder.userReminders=userReminders;
    existReminder.lastModified=lastModified;

    existReminder.save(function (err) {
      if (err) {

        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
       res.json(response);

     }
   });

  }else{
    res.json({status:'failure', message : 'Reminder not found'});

  }
})


};


/**
 * List of Users
 */
 exports.listUserReminders = function (req, res) {


  var lastModified =req.body.lastModified

  var queryJson = {userId:req.user._id};

  var selectCol = {lastModified:1,userReminders:1};

  // Given an ISO 8601 string, return a date object
  function parseISO(s) {
    s = s.split(/\D/);
    return new Date(Date.UTC(s[0],--s[1],s[2],s[3],s[4],s[5],s[6]));
  }


  //var newLastModified='';

  if(lastModified && lastModified!==''){
    lastModified = new Date(lastModified);

    //selectCol['userReminders']={$elemMatch: { $or :[{created: {$gt : lastModified }},{updated: {$gt : lastModified }}]}};

    selectCol['userReminders']={$elemMatch: { updated: {$gt:new Date(lastModified)}}};




    //queryJson['userReminders.updated']={$gt:lastModified};

    queryJson['userReminders']={$elemMatch: { updated: {$gt : lastModified }}};

    //{$elemMatch: { $or :[{created: {$gt : lastModified }},{updated: {$gt : lastModified }}]}};
  }else{

    selectCol['userReminders']={$elemMatch: { isDeleted:false,isOn:true}};
    queryJson['userReminders']={$elemMatch: { isDeleted:false,isOn:true}};

  }


  Reminders.find(queryJson).sort('-created')
  .populate({path:'userReminders.plantId', select: '_id commonName scientificName description pictures'})
  .exec(function (err, user) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    var response = { status : 'success', reminders : null}


    if(user && user.length>0 && user[0].userReminders.length>0){

      //var newReminderArray=[];

      var plainArray=user[0].userReminders.toObject();

      plainArray= _.filter(plainArray, function(o) { return o.plantId; });

      /*if(lastModified && lastModified!==''){

        var d2 = new Date(lastModified);
        var newDateTest= new Date();

        for(var i in plainArray){


          var d1 = new Date(plainArray[i].updated);

          console.log("typppppppppppp", typeof newDateTest, typeof d2)

          if (d1 < d2) {
            newReminderArray.push(plainArray[i]);

          }


        }
      }*/

      response = { status : 'success', reminders : plainArray, lastModified : user[0].lastModified }
    }

    res.json(response);
  });
};








