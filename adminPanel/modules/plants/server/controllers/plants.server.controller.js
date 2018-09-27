'use strict';

/**
 * Module dependencies
 */
 var _ = require('lodash');
 var  XLS = require('xlsx');
 var  mongoose = require('mongoose');
 var Plants = mongoose.model('Plant');
 var Users = mongoose.model('User');
 var Reminders = mongoose.model('Reminder');
 var Recognitions = mongoose.model('Recognition');
 var fs = require('fs');
 var _und=require('underscore');
 var path = require('path');
 var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

 var multer = require('multer'),
 config = require(path.resolve('./config/config'));

 var  GooglePlaces =require('node-googleplaces');

 //const places = new GooglePlaces('AIzaSyA2xv-8B0JsHFSEXHB4ejfm1ULMAcgMYqY'); //qa0.ideavate


//dev.kudzuapp@gmail.com
//const places = new GooglePlaces('AIzaSyCzVAzdc1eWtrv2AO3acMQ0gOnO9iwNMUc');


//acc=dev.kudzuapp@gmail.com, app-name=kudzu-88580 and this is a server key
//const places = new GooglePlaces(config.google.apiServerKey);//'AIzaSyBJPUjqwcWXcAh85N_gSizmAqNAwuNz1t0');


//acc=dev.kudzuapp@gmail.com, app-name=kudzu-88580 and this is a server key
const places = new GooglePlaces('AIzaSyAh4mN_kOKvGNY61tdkyMU3qIDhACU-w6s');//'AIzaSyBJPUjqwcWXcAh85N_gSizmAqNAwuNz1t0');





var thumb = require('node-thumbnail').thumb;

/* var logger = require(path.resolve('./config/lib/logger'));
*/

/**
 * Show the current plant
 */
 exports.read = function (req, res) {
   res.json(req.model);
 };


 exports.create =function(req,res){

  var plant=new Plants(req.body);

  plant.save(function(err){

    if(err){
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }


    res.json({status:'success',plant:plant});


  })
}

function getRecognitionImageById(id,callback){


  if(id){
    Recognitions.findById(id,'recognitionThumbImageURL recognitionImageURL status')
    .exec(function(err,recognition){
      if(err){
        return callback(err,null)
      }

      return callback(null,recognition)
    })

  }else{
    return callback(null,null)
  }  

}
 /**
 * Show the google places
 */
 exports.getPlaces = function (req, res) {

  var query= req.query.search;
  
  const params = {
    types:'(regions)',
    input:query
  };

  // Callback 
  places.autocomplete(params, (err, respose) => {
    res.send(respose.body);
  });

};





/**
 * Update a Plant
 */
 exports.update = function (req, res) {
 	var plant = req.model;

  var removedPic=_und.difference(plant.pictures,req.body.pictures); 
  // For security purposes only merge these parameters
  plant.commonName = req.body.commonName;
  plant.scientificName = req.body.scientificName;
  plant.description = req.body.description;
  plant.region = req.body.region;
  plant.moreOptions=req.body.moreOptions;
  plant.careReminders=req.body.careReminders;
  plant.pictures=req.body.pictures;
  plant.careTips=req.body.careTips;

  

  plant.save(function (err) {
  	if (err) {
  		return res.status(422).send({
  			message: errorHandler.getErrorMessage(err)
  		});
  	}

   //delete removed images
   for(var i in removedPic){
    fs.unlink(removedPic[i], function (unlinkError) {
      if (unlinkError) {
        console.log(unlinkError);
        res.status(400).send({
          message: 'Error occurred while deleting old profile picture'
        });
      } else {

      }
    });

  }

  res.json(plant);
});
};

/**
 * Delete a plant
 */
 exports.delete = function (req, res) {
 	var plant = req.model;

 	plant.remove(function (err) {
 		if (err) {
 			return res.status(422).send({
 				message: errorHandler.getErrorMessage(err)
 			});
 		}

 		res.json(plant);
 	});
 };

/**
 * List of Plants
 */
 exports.list = function (req, res) {

  var perPageCount =req.query.perPageCount;
  var pageNumber =req.query.pageNumber;
  var searchText=req.query.searchText.trim();

  var skipItem=(pageNumber-1)*perPageCount;
  var limitItems=parseInt(perPageCount);//perPageCount*pageNumber-1;

  var jsonQuery={};

/*  logger.error("tesssssssssssssssssssssssssssssssssss");
*/
if(searchText && searchText!==''){
  jsonQuery={$or:[{commonName:{$regex : ".*"+searchText+".*", $options: 'i'}},{scientificName:{$regex : ".*"+searchText+".*", $options: 'i'}}]}
}


Plants.count(jsonQuery).exec(function(errcount, totalPlant){


  var response={data:[],total:0};
  if(totalPlant){


   Plants.find(jsonQuery)
   .sort('-created')
   .skip(skipItem)
   .limit(limitItems)
   .exec(function (err, plants) {
     if (err) {
       // return res.status(422).send({
       //   message: errorHandler.getErrorMessage(err)
       // });
        response={
       data:plants,
       total:totalPlant,
       error:err
     }
     }

     response={
       data:plants,
       total:totalPlant
       
     }

     res.json(response);

   });

 }else{
   res.json(response);

 }


});
};


/**
 * List of Plants
 */
 exports.searchListApi = function (req, res) {

  var perPageCount =req.body.perPageCount;
  var pageNumber =req.body.pageNumber;
  var searchText=req.body.searchText.trim();


  var skipItem=(pageNumber-1)*perPageCount;
  var limitItems=perPageCount*pageNumber;

  var jsonQuery={};

  if(searchText && searchText!==''){
    jsonQuery={$or:[{commonName:{$regex : ".*"+searchText+".*", $options: 'i'}},{scientificName:{$regex : ".*"+searchText+".*", $options: 'i'}}]}
  }else{

    var response={
      plants:[],
      total:0,
      isMoreData:false
    }

    return res.json(response);

  }


  Plants.count(jsonQuery).exec(function(errcount, totalPlant){


   /* if(searchText && searchText!==''){
      skipItem=0;
      limitItems=totalPlant;
    }*/


    Plants.find(jsonQuery)
    .sort('-created')
    .skip(skipItem)
    .limit(limitItems)
    .exec(function (err, plants) {
     if (err) {
       return res.status(422).send({
         message: errorHandler.getErrorMessage(err)
       });
     }

     var response={
       plants:plants,
       total:totalPlant,
       isMoreData:false
     }

     if(limitItems<totalPlant){
      response.isMoreData=true;
    }

    res.json(response);

  })
  });
};



/**
 * Plant By Id Api 
 */
 exports.plantByIdApi = function (req, res) {

  var id=req.params.plantID;

  var recognitionId=req.body.recognitionId;

  Plants.findById(id).exec(function (err, plant) {
    if (err) {
      //return next(err);
      return res.status(400).send({message:errorHandler.getErrorMessage(err)});
    } else if (!plant) {
      //return next(new Error('Failed to load plant ' + id));
      return res.status(400).send({message:'In-valid plant id'});
    }

    getRecognitionImageById(recognitionId,function(recognitionImageErr,recognition){


      if(recognitionImageErr){
        return res.status(400).send({message:errorHandler.getErrorMessage(recognitionImageErr)});

      }

    //converting mongo object to json object to add some params
    plant=plant.toObject();

    if(recognition){
      plant.recognitionImageURL=recognition.recognitionImageURL;
      plant.recognitionThumbImageURL=recognition.recognitionThumbImageURL;
      plant.status=recognition.status;
    }else{
     plant.recognitionImageURL='';
     plant.recognitionThumbImageURL='';
   }



   //{$elemMatch: { isDeleted:false}}
   if(req.user){
    Users.findById(req.user._id,{favoritePlants:1})
    .exec(function(userError, result){
      if(userError){
       return res.status(400).send({message:errorHandler.getErrorMessage(userError)});

     }

     if(result.favoritePlants.length>0){

      plant.isFavourite=false;

      var plantsIds=result.favoritePlants.toObject();//_und.pluck(result.favoritePlants,'plantId');

      for(var i in plantsIds){
        if(plantsIds[i].plantId.equals(plant._id) && !plantsIds[i].isDeleted){
          plant.isFavourite=true;
          break;
        }
      }
      
    }else{
      plant.isFavourite=false;
    }



    if(plant.careReminders.length>0){

      var careReminders=plant.careReminders;

      Reminders.findOne({userId:req.user._id})
      .exec(function(reminderErr,reminder){
        if(reminderErr){
         return res.status(400).send({message:errorHandler.getErrorMessage(reminderErr)});
       }

       if(reminder && reminder.userReminders.length>0){

        var userReminders=reminder.userReminders;

        for(var i in userReminders){

          for(var j in careReminders){
              //checking if user enable reminder for this plant
              if(careReminders[j]._id.equals(userReminders[i].reminderId)){
                if(userReminders[i].isDeleted){
                  careReminders[j].isOn=false;
                }else{
                  careReminders[j].isOn=userReminders[i].isOn;
                }
                
                break;
              }
            }

          }

        }

        plant.careReminders=careReminders;


        res.json({status:'success',plant:plant});

      })
    }else{

     res.json({status:'success',plant:plant});
   }

 })

  }else{

    plant.isFavourite=false;
    res.json({status:'success',plant:plant});


  }
});

  });
};

/**
 * Plant middleware
 */
 exports.plantByID = function (req, res, next, id) {
 	if (!mongoose.Types.ObjectId.isValid(id)) {
 		return res.status(400).send({
 			message: 'Plant is invalid'
 		});
 	}

 	Plants.findById(id).exec(function (err, plant) {
 		if (err) {
 			return next(err);
 		} else if (!plant) {
 			return next(new Error('Failed to load plant ' + id));
 		}


    req.model = plant;
    next();


  });
 };





/**
 * Update profile picture
 */
 exports.uploadPicture = function (req, res) {
  var plantId = req.params.plantId;
  //var existingImageUrl;


  var plant=req.model;

 // Filtering to upload only images
 var multerConfig = config.uploads.plantPicture.image;
 multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
 multerConfig.storage = multer.diskStorage({
   destination: function (req, file, cb) {
    cb(null, 'public/'+config.uploads.plantPicture.image.dest)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
     //Appending extension
   }
 })


 var upload = multer(multerConfig).array('files');

 var oldImageArray=[];

 if (plant) {
    // existingImageUrl = user.profileImageURL;
    uploadImage()
    .then(updatePlant)
    .then(deleteOldImage)    
    .then(function () {
      res.json(plant);
    })
    .catch(function (err) {
      res.status(422).send(err);
    });
  } else {
    res.status(401).send({
      message: 'Plant is not signed in'
    });
  }

  function uploadImage () {
    return new Promise(function (resolve, reject) {
      upload(req, res, function (uploadError) {
        if (uploadError) {

          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          resolve();
        }
      });
    });
  }

  function updatePlant () {
    return new Promise(function (resolve, reject) {
      //plant.pictures = config.uploads.plantPicture.image.dest + req.file.originalname;
      oldImageArray = plant.pictures;
      oldImageArray=oldImageArray.toObject();
      for(var f in req.files){
        plant.pictures =[]
        plant.pictures.push(config.uploads.plantPicture.image.dest+req.files[f].filename)

        
        thumb({
          source: path.resolve('./public/'+config.uploads.plantPicture.image.dest+req.files[f].filename),
          destination: path.resolve('./public/'+config.uploads.plantPicture.image.dest),
          concurrency: 2,
          width: 50,
          overwrite: true,
        }, function(err) {
          if(err){
            console.log(err)
          }

          /*thumbFilename='uploads/recognitions/thumb/'+uniqueName+'_thumb.png'*/

          console.log('All done!');
        });
      }




      //console.log(req.file.originalname);
      plant.save(function (err, theuser) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function deleteOldImage () {
    return new Promise(function (resolve, reject) {
      if (oldImageArray && oldImageArray.length>0) {


        for(var f in oldImageArray){

          var deleteUrl=oldImageArray[f];

          if(deleteUrl.indexOf('modules')<0){
            deleteUrl='./public/'+oldImageArray[f];
          }

          fs.unlink(deleteUrl, function (unlinkError) {
            if (unlinkError) {
              console.log(unlinkError);
              reject({
                message: 'Error occurred while deleting old profile picture'
              });
            } else {
              resolve();
            }
          });

        }

      } else {
        resolve();
      }
    });
  }


};




/**
 * Extend plant's controller
 */

 exports.importPlants=function(req,res){

 	var filePath ='./modules/plants/server/controllers/Flowerdata.xlsx';

 	if (filePath) {

 		var workbook = XLS.readFile(filePath/*,{sheetRows:1}*/),
 		firstSheet = workbook.SheetNames[0],
 		result = {};
 		result=XLS.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    if(result.length>0){
      Plants.create(result, function (err, jellybean, snickers) {
      });
      res.send({status:'success'});
    }else{
      res.send({status:'failure'});
    }


  }

}