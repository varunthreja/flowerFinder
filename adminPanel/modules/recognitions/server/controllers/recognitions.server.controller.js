'use strict';

/**
 * Module dependencies
 */
 var _ = require('lodash');
 var  mongoose = require('mongoose');
 var Recognitions = mongoose.model('Recognition');
 var Plants = mongoose.model('Plant');
 var Users = mongoose.model('User');
 var  fs=require('fs');
 var path = require('path');
 var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
 var HelperController = require(path.resolve('./modules/core/server/controllers/helper.server.controller'));

 var  async=require('async');
 var un_=require('underscore');
 var config=require(path.resolve('./config/env/default'));
 var vision = require('@google-cloud/vision');

 var visionClient = vision({
  projectId: config.google.projectId,
  keyFilename: path.resolve(config.google.visionApiKeyFilePath)
});

 var whitelistedFields = ['notes','status','plantId','hrUserId', 'userId'];

 var thumb = require('node-thumbnail').thumb;

 var defaultsThumbOption = {
  prefix: '',
  suffix: '_thumb',
  digest: false,
  hashingType: 'sha1', // 'sha1', 'md5', 'sha256', 'sha512' 
  width: 800,
  concurrency: 2,
  overwrite: false,
  basename: undefined // basename of the thumbnail. If unset, the name of the source file is used as basename. 
};


var toLocaleDateStringOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };



var forEach = require('async-foreach').forEach;

function checkIfPlantPresentInDb(labels, callback2) {

  var isCountinue=true;

  /*forEach(labels, 
  function(item, index, arr) {*/

    var index=0;

    async.eachSeries(labels, function(item, callback) {

      //flora,flower,plant,petal,botany,flowering plant,land plant,herb,wild flower
      var skipLabels= ['flora','flower','plant','petal','botany','flowering plant','land plant','herb','wild flower','red','yellow','pink','green','white','voilet','orange','aqua','blue','brown'];
      //if(item.desc!=='flower' && item.desc!=='plant'){



        //Do not search with skipLables
        if(skipLabels.indexOf(item.desc)<0){
          var regexCName = new RegExp("^" + item.desc + "$","i");

          
          Plants.findOne({$or:[{commonName:regexCName},{scientificName:regexCName}]}
            ,function(err,exactPlantMatch){
              if(exactPlantMatch){
                return callback2(exactPlantMatch);
                callback(false);
                index++;
              }else{
                Plants.findOne({$or:[{commonName:{$regex : ".*"+item.desc+".*",'$options' : 'i'}},{scientificName:{$regex : ".*"+item.desc+".*",'$options' : 'i'}}]}
                  ,function(err,plant){

                    if(err){
                      return res.status(422).send({
                        message: errorHandler.getErrorMessage(err)
                      });
                    }

                    index++;


                    if(plant){


                     return callback2(plant);

                     callback(false);


                   }else{

                    if(index===labels.length){

                     return callback2(null);
                   }else{
                    callback();
                  }

                }
              });


              }

            });


        }else{

          index++;

          if(index===labels.length){

           return callback2(null);
           callback(false);

         }else{
           callback();
         }

       }



     });


  }


  function decodeBase64Image(dataString) {
    var response = new Buffer(dataString, 'base64');
    return response;
  }


  function saveRecognitionToDb(reqRecognition,callback) {

    Recognitions.findOne({}, {recognitionNo:1}, { sort: { 'created' : -1 } }
      , function(errLastRecog, lastRecognition) {

        if(errLastRecog){
         return callback(errorHandler.getErrorMessage(errLastRecog));
       }


       var todaydate=new Date();
       var month=parseInt(todaydate.getMonth())+1;
       month=(month>9)?month:"0"+month;
       var datetoday=(todaydate.getDate()>9)?todaydate.getDate():"0"+todaydate.getDate();
       var fullDateInNumber=todaydate.getFullYear()+month+''+datetoday;
       var newNumber=1;


       var completeRecognitionNo='K-'+fullDateInNumber+'-'+newNumber;

       if(lastRecognition && lastRecognition.recognitionNo){

        var dateAndNo=lastRecognition.recognitionNo.split('-');
        /* var fullDateInNumber=dateAndNo[0]*/

        completeRecognitionNo='K-'+fullDateInNumber+'-'+newNumber;

        
        //checking if fullDateInNumber is of today date
        if(fullDateInNumber==dateAndNo[1].toString()){
          newNumber=parseInt(dateAndNo[2])+1;
          completeRecognitionNo='K-'+fullDateInNumber+'-'+newNumber;
        }
      }


      var recognition = new Recognitions(reqRecognition);

      recognition.recognitionNo=completeRecognitionNo;

       // Then save the recognition
       recognition.save(function (err) {
        if (err) {

          return callback(errorHandler.getErrorMessage(err));

        } 
        else{
          return callback(false,recognition);
        }
      });


     })



  }

  exports.test=function(req,res){ 

   /* var text = [ { desc: 'yellow', mid: '/m/088fh', score: 96.16019999999999 },
    { desc: 'flower', mid: '/m/0c9ph5', score: 95.6967 },
    { desc: 'oxeye daisy', mid: '/m/05h0n', score: 94.343394 },
    { desc: 'flora', mid: '/m/03bmqb', score: 93.38063 },
    { desc: 'plant', mid: '/m/05s2s', score: 91.18420499999999 } ];*/


    var text= [ { desc: 'Custom created', mid: '/m/0c9ph5', score: 97.25735 },
    { desc: 'rose', mid: '/m/06m11', score: 94.470376 },
    { desc: 'pink', mid: '/m/01fklc', score: 93.83038 },
    { desc: 'plant', mid: '/m/05s2s', score: 92.52129 },
    { desc: 'floribunda', mid: '/m/0dlk0vw', score: 90.22051 } ];


    checkIfPlantPresentInDb(text,function(plant){

      if(plant){ 

        //console.log("plllllllllll",plant)

        res.send(plant);

      }else{
        console.log("elsssssssssss")
        res.send({});
      }

    })


  }

  exports.recognizeFlower=function(req,res){

  //var user = req.user;
  var file=req.body.file;
  file = file.replace(/ /g, '+');


  var imageBuffer = decodeBase64Image(file);
  //creating file 
  var uniqueName=Date.now();
  var fileName='./public/'+config.uploads.recognitionPicture.image.dest+uniqueName+'.png';

  var fileUrl=config.uploads.recognitionPicture.image.dest+uniqueName+'.png';

  fs.writeFile(path.resolve(fileName), imageBuffer, function(err) { 
    if(err){
      if((deviceType==='iphone') || (deviceType==='android')){
        res.status(400).json({status:'error',data:{message: 'error in file'}});
        return;
      }
    }

    var thumbFilename='';

    //Create thumb image
    thumb({
      source: path.resolve(path.resolve(fileName)),
      destination: path.resolve('./public/'+config.uploads.recognitionPicture.image.dest),
      concurrency: 2,
      width: 50,
      overwrite: true,
    }, function(err) {
      if(err){
        console.log(err)
      }

      thumbFilename=config.uploads.recognitionPicture.image.dest+uniqueName+'_thumb.png'
    });

    //Recognition using google 
    visionClient.detectLabels(path.resolve(fileName), { verbose: true },function(err, text) {

      if(err){
        console.log("error : ",err);
        return res.status(400).send({status:'failure',message:'Image not found'});
      }


      var reqRecognition={
        userId:(req.user)?req.user._id:null,
        recognitionImageURL:fileUrl,
        recognitionThumbImageURL:thumbFilename,
        notes:''       
      };

      console.log("google result labels of image",text);

      var checkIfPlantOrFlowerLablePressent=un_.pluck(text,'desc');

      if(checkIfPlantOrFlowerLablePressent.indexOf('flower')<0 || checkIfPlantOrFlowerLablePressent.indexOf('plant')<0 ){

        reqRecognition.status='Not Recognized';

        saveRecognitionToDb(reqRecognition,function(errsave,response){

          if(errsave){
           return res.status(200).send({status:'failure',message:errsave});
         }

         return res.json({status:'failure',message:'Looks like image is not present at our db, please choose further action, Thanks.',labels:text,recognition:response})

       });

      }else{


        checkIfPlantPresentInDb(text,function(plant){

          if(plant){


            reqRecognition.plantId=plant._id;
            reqRecognition.status='Automated Recognition';
            saveRecognitionToDb(reqRecognition,function(errsave,response){

              if(errsave){
               return res.status(200).send({status:'failure',message:errsave});
             }


             response=response.toObject();
           //converting mongo object to json object to add some params
           plant=plant.toObject();

           if(req.user){


            Users.findById(req.user._id,{favoritePlants:{$elemMatch: { isDeleted:false}}})
            .exec(function(userError, result){
              if(userError){
               return res.status(400).send({message:errorHandler.getErrorMessage(userError)});

             }

             plant.isFavourite=false;

             var plantsIds=result.favoritePlants.toObject();

             for(var i in plantsIds){
              if(plantsIds[i].plantId.equals(plant._id)){
                plant.isFavourite=true;
                break;
              }
            }


            response.plantId=plant;
            return res.json({status:'success',/*plant:plant,*/recognition:response});

          })

          }else{

            plant.isFavourite=false;
            response.plantId=plant;
            return res.json({status:'success',/*plant:plant,*/recognition:response});
          }

        });

          }else{  



            reqRecognition.plantId=null;

            reqRecognition.status='Not Recognized';

            saveRecognitionToDb(reqRecognition,function(errsave,response){

              if(errsave){
               return res.status(200).send({status:'failure',message:errsave});
             }

             return res.json({status:'failure',message:'Looks like image is not present at our db, please choose further action, Thanks.',labels:text,recognition:response})

           });


          }
        })

      }

    });
  });


}

/**
 * Show the current recognitions
 */
 exports.read = function (req, res) {
 	res.json(req.model);
 };

/**
 * Update a Recognitions
 */
 exports.update = function (req, res) {

 	if(!req.user){
    return res.status(401).send({
      message: 'User is not signed in',
    });
  }
  var recognition= req.model;
  var lastUpdated=req.model.updated;
  


  var oldPlantId=recognition.plantId;
  var newPlantid=req.body.plantId;
  if(req.body.plantId && typeof req.body.plantId==='object'){
    newPlantid=req.body.plantId._id;
  }

  //When only status changes without plant
  var oldRecognitionStatus=recognition.status;
  var newRecognitionStatus=req.body.status;
  var isFromAdmin=req.body.isFromAdmin;



  recognition = _.extend(recognition, _.pick(req.body, whitelistedFields));

  /* recognition.userId=req.user._id;*/
  recognition.status=req.body.status;
  if(newPlantid && (!oldPlantId || !oldPlantId.equals(newPlantid))){
    recognition.hrUserId=req.user._id;
  }else if(oldRecognitionStatus!==newRecognitionStatus && isFromAdmin){
    recognition.hrUserId=req.user._id;
  }else{
    recognition.userId=req.user._id;
  }

  recognition.updated = Date.now();

  recognition.save(function (err) {
   if (err) {
    return res.status(422).send({
     message: errorHandler.getErrorMessage(err)
   });
  }

    //notify user when plant updated to recognition request
    if((newPlantid && (!oldPlantId || !oldPlantId.equals(newPlantid))) || (oldRecognitionStatus!==newRecognitionStatus && isFromAdmin)){
      //userid array and message object
      var userIds=[];
      userIds.push(recognition.userId);
      var notification='Flower recognition request made on '+lastUpdated.toLocaleDateString("en-US",toLocaleDateStringOptions)+' has been updated.';

      //push notification message
      var message = {
        text:notification,
        plantId:(recognition.plantId)?recognition.plantId:'',
        recognitionId:recognition._id,
        status:recognition.status,
        type:'recognition'
      };

      console.log("messsssssssss",message);
      HelperController.appPushNotification(recognition.userId,message,true);
    }

    res.json({status : 'success', recognition: recognition,message:'Request sent successfully'});
  });
};

/**
 * Delete a recognitions
 */
 exports.delete = function (req, res) {
 	var recognition = req.model;

   recognition.updated = Date.now();
   recognition.isDeleted = true;

   recognition.save(function (err) {
     if (err) {

       return res.status(422).send({
         message: errorHandler.getErrorMessage(err)
       });
     }

     res.json({status:'success',message:'Request deleted successfully'});
   });

  /*recognition.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json({status:'success',message:'Request deleted successfully'});
  });*/
};

/**
 * List of Recognitionss
 */
 exports.list = function (req, res) {

  var recognitionsViewtype = req.query.recognitionsViewtype;

  var perPageCount =req.query.perPageCount;
  var pageNumber =req.query.pageNumber;
  var searchText=req.query.searchText;
  var hrUserId=req.query.hrUserId;

  var skipItem=(pageNumber-1)*perPageCount;
  var limitItems=parseInt(perPageCount);//perPageCount*pageNumber-1;

  var jsonQuery={isDeleted:false};

/*  logger.error("tesssssssssssssssssssssssssssssssssss");
*/
if(searchText && searchText!==''){
  jsonQuery={$or:[{commonName:{$regex : ".*"+searchText+".*", $options: 'i'}},{scientificName:{$regex : ".*"+searchText+".*", $options: 'i'}}]}
}
if(hrUserId && hrUserId!=='' && recognitionsViewtype==='Human Recognition'){
  jsonQuery.hrUserId=hrUserId;
}


if(recognitionsViewtype && recognitionsViewtype!=='All'){
  jsonQuery.status = recognitionsViewtype;
}

Recognitions.count(jsonQuery).exec(function(errcount, totalRecognitions){

  var response={data:[],total:0};

  if(totalRecognitions){
    Recognitions.find(jsonQuery)
    .sort('created')
    .populate('userId','_id displayName')
    .populate('plantId','_id commonName scientificName')
    .populate('hrUserId','_id displayName')
    .skip(skipItem)
    .limit(limitItems)
    .exec(function (err, recognitionss) {
     if (err) {
      return res.status(422).send({
       message: errorHandler.getErrorMessage(err)
     });
    }

    response={
     data:recognitionss,
     total:totalRecognitions
   }

   res.json(response);
 });

  }else{
   res.json(response);
 }
});
};


/**
 * List of User Recognitions
 */
 exports.userRecognitionList= function (req, res) {



  if(!(req.user)){
    return res.status(401).send({
     message: 'User is not signin'
   });
  }

  var lastModified=req.body.lastModified;
  var queryJson = {userId:req.user._id};

  if(lastModified && lastModified!==''){
    queryJson['updated']={$gt:lastModified};
  }


  Recognitions.find(queryJson)
  .sort('-updated')
  .populate('plantId','_id commonName scientificName description careTips moreOptions pictures')
  .exec(function (err, allRecognitions) {
   if (err) {
    return res.status(422).send({
     message: errorHandler.getErrorMessage(err)
   });
  }

  if(allRecognitions && allRecognitions.length>0){
    lastModified=allRecognitions[0].updated;
  }else{
    allRecognitions=null;
    lastModified=undefined;
  }

  res.json({status:'success',lastModified:lastModified,recognitions:allRecognitions});
});
};

/**
 * Recognitions middleware
 */
 exports.recognitionByID = function (req, res, next, id) {
 	if (!mongoose.Types.ObjectId.isValid(id)) {
 		return res.status(400).send({
 			message: 'Recognitions is invalid'
 		});
 	}

 	Recognitions.findById(id)
  .populate('userId','_id displayName')
  .populate('plantId','_id commonName scientificName')
  .exec(function (err, recognitions) {
   if (err) {
    return next(err);
  } else if (!recognitions) {
    return next(new Error('Failed to load recognitions ' + id));
  }

  req.model = recognitions;
  next();
});
};

/**
 * Recognitions middleware
 */
 exports.recognitionStatusChart = function (req, res) {


  Recognitions.count({status:'Human Recognition'})
  .exec(function(errHR,HRcount){
    if(errHR){
      return res.status(422).send({message:errHR})
    }

    Recognitions.count({status:'Pending Review'})
    .exec(function(errPR,PRcount){
      if(errHR){
        return res.status(422).send({message:errHR})
      }

      Recognitions.count({status:'Not Recognized'})
      .exec(function(errNR,NRcount){
        if(errHR){
          return res.status(422).send({message:errHR})
        }

        Recognitions.count({status:'Automated Recognition'})
        .exec(function(errAR,ARcount){
          if(errHR){
            return res.status(422).send({message:errHR})
          }

       /*   var data ={'Human_Recognition':HRcount,
          'Not_Recognized':NRcount,
          'Automated_Recognition' : ARcount,
          'Pending Review': PRcount,
        }*/

        var data = [{
          name: 'Human Recognition',
          y: HRcount,
          color : '#008000'//'#90ed7d'
          
        }, {
          name: 'Automated Recognition',
          y: ARcount,
          color: '#FFA500',//'#EFF338CC',
          /* sliced: true,*/
          selected: true
        }, {
          name: 'Pending Review',
          y: PRcount,
          color: '#FF0000'//'#E92424'
        }, {
          name: 'Not Recognized',
          y: NRcount,
          color: '#808080'//'#B933E3CC'
        }];

        res.json({status:'success',data :data })

      })
      })
    })
  })

};

/**
 * Extend recognitions's controller
 */

