'use strict';

/**
 * Module dependencies
 */
 var path = require('path'),
 mongoose = require('mongoose'),
 User = mongoose.model('User'),
 Plants = mongoose.model('Plant'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

 var _ = require('lodash');


/**
 * Signup
 */
 exports.create = function (req, res) {
  // For security measurement we remove the roles from the req.body object
   // Init user and add missing fields
   var user = new User(req.body);
   user.provider = 'local';
   user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {


     var response={user:user,status:'success'}
     res.json(response);
     
   }
 });
};

/**
 * Show the current user
 */
 exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
 exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;
  user.email=req.body.email;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};



/**
 * Update a User Status
 */
 exports.changeUserStatus = function (req, res) {


  User.update({_id:req.params.userId},{isActive:req.body.status},{},function(error, success){

   if (error) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(error)
    });
  }

  res.json(success);

});

};

/**
 * Update a User Status
 */
 exports.changeUserDeleteStatus = function (req, res) {


  User.update({_id:req.params.userId},{isDeleted:req.body.isDeleted},{},function(error, success){

   if (error) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(error)
    });
  }

  res.json(success);

});

};

/**
 * Delete a user
 */
 exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
 exports.list = function (req, res) {

  var queryJson={};

  var isActive=req.query.isActive;
  var isAll=req.query.isAll;
  var isDeleted=req.query.isDeleted;
  var isInactive=req.query.isInactive;
  var isIncludeAppUser=req.query.isIncludeAppUser;

  if(isAll && isAll=="true"){
    queryJson={};
  }else if(isInactive=="true" && isActive=="true" && isDeleted=="true"){

    //queryJson.isDeleted = true;
    queryJson['$or']=[{isDeleted:true},{isActive:false},{isActive:true}];
  }else{

   /*queryJson['$or']=[{isDeleted:isDeleted},{isActive:isActive},{isActive:(isInactive=='true')?'false':'true'}];

   queryJson['$and']=[{isDeleted:isDeleted}];*/

   if(isActive=="true" && isInactive=="true"){
    queryJson.isDeleted=isDeleted;
  }else if(isInactive=="true" && isDeleted=="true"){

    queryJson['$or']=[{isDeleted:true},{isActive:false}];

  }else if(isActive=="true" && isDeleted=="true"){

    queryJson['$or']=[{isDeleted:true},{isActive:true}];
    
  }else if(isActive=="true"){
    queryJson.isActive=isActive;
    queryJson.isDeleted=isDeleted;
  }else if(isInactive=="true"){
    queryJson.isActive=false;
    queryJson.isDeleted=isDeleted;
  }else if(isDeleted=="true"){
    queryJson.isDeleted=true;

  }





  /*queryJson['$and']=[{isActive:isActive},{isActive:(isInactive=='true')?'false':'true'},{isDeleted:req.query.isDeleted}];*/
  /* queryJson.isDeleted=req.query.isDeleted;*/
}

if(isIncludeAppUser && isIncludeAppUser=='true'){
  queryJson.roles = 'user';
}else{
 queryJson.roles = { $ne : ['user']};
}

User.find(queryJson, '-salt -password -providerData').sort('-created').exec(function (err, users) {
  if (err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  }

  res.json(users);
});
};

/**
 * User middleware
 */
 exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};


/*
Add/Remove plant to user favourite
*/

exports.addRemoveToFavoritePlant=function(req,res){

  if(!req.user){
    return res.status(401).send({message:'User is not signed in'})
  }

  var addToFavorite=req.body.addToFavourite;
  var plantId=req.body.plantId;
  var responseMessage='';


  var lastModified=Date.now();

  if(!plantId){
    return res.status(400).send({message:'PlantId  is not found.'})
  }

  User.findOne({_id:req.user._id},{favoritePlants:1})
  .exec(function(err,user){
    if(err){
      return res.status(400).send({message:errorHandler.getErrorMessage(err)})
    }

    if(addToFavorite && addToFavorite=='True'){
     // if(user.favoritePlants.indexOf(plantId)<0){
      var plantObject={plantId:plantId,updated:lastModified};
      user.favoritePlants.push(plantObject);
      
      //}
      responseMessage="Added to favorites list successfully";
    }else{
      if(user.favoritePlants.length>0){
        var existingPlants=user.favoritePlants.toObject();
        for(var i in existingPlants){
          if(existingPlants[i].plantId.equals(plantId)){
            existingPlants[i].isDeleted=true;
            existingPlants[i].updated=lastModified;
          }
        }
        //user.favoritePlants.splice(user.favoritePlants.indexOf(plantId),1);
        user.favoritePlants=existingPlants;
        responseMessage="Removed from favorites list successfully";
      }else{
        responseMessage="Not in favorites list";
      }
    }

    user.favoriteLastModified=lastModified

    user.save(function(error){
      if(error){
        return res.status(400).send({message:errorHandler.getErrorMessage(error)});
      }

      res.json({status:'success',message:responseMessage,lastModified:lastModified});
    });

  });

}




exports.favoritePlantList=function(req,res){

  if(!req.user){
    return res.status(401).send({message:'User is not signed in'})
  }

  var lastModified =req.body.lastModified
  var queryJson = {_id:req.user._id};
  var selectCol = {favoritePlants:1,favoriteLastModified:1};


  if(lastModified && lastModified!==''){
    lastModified=new Date(lastModified);
    /*selectCol['favoritePlants']={$elemMatch: { updated: {$gt:new Date(lastModified)}}};*/
    queryJson['favoritePlants.updated']={$gt : lastModified };
  }

  User.findOne(queryJson,selectCol)
  .populate({path:'favoritePlants.plantId'})
  .exec(function(err,user){
    if(err){
      return res.status(400).send({message:errorHandler.getErrorMessage(err)})
    }

    /*Plants.find({_id:{$in:user.favoritePlants}})
    .exec(function(error, resultPlants){*/
      var allPlants=null;
      var favoriteLastModified=undefined;
      if(user && user.favoritePlants.length>0){
        //allPlants=user.favoritePlants;
        allPlants= _.filter(user.favoritePlants, function(o) { return o.plantId; });
        favoriteLastModified=user.favoriteLastModified;
        
      }



      res.json({status:'success',plants :allPlants,lastModified:favoriteLastModified});
      /* });*/

    });

}

exports.getAllTypesUserCounts=function(req,res){



  if(!req.user){
    return res.status(401).send({message:'User is not signed in'})
  }


  User.count({roles:['user']})
  .exec(function(appUserCountErr,appUserCount){
    if(appUserCountErr){
      return res.status(400).send({message:errorHandler.getErrorMessage(appUserCountErr)})
    }

    User.count({roles:['user','hr']})
    .exec(function(hrUserCountErr,hrUserCount){
      if(hrUserCountErr){
        return res.status(400).send({message:errorHandler.getErrorMessage(hrUserCountErr)})
      }

      User.count({roles:['user','hr','qa']})
      .exec(function(qaUserCountErr,qaUserCount){
        if(qaUserCountErr){
          return res.status(400).send({message:errorHandler.getErrorMessage(qaUserCountErr)})
        }

        User.count({roles:['user','hr','qa','admin']})
        .exec(function(adminUserCountErr,adminUserCount){
          if(adminUserCountErr){
            return res.status(400).send({message:errorHandler.getErrorMessage(adminUserCountErr)})
          }

          var totalUserCount = {
            appUserCount : appUserCount,
            adminUserCount : adminUserCount,
            hrUserCount:hrUserCount,
            qaUserCount:qaUserCount,
            total: appUserCount + adminUserCount+hrUserCount+qaUserCount
          }

          res.json({status:'success',data :totalUserCount});


        });
      });

    });

  });





}