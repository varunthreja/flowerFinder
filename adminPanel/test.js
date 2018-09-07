
var _=require('underscore');



var array=[{
 id:1, name:'same', test:'data'
},{
 id:2, name:'same2', test:'data2'
},{
 id:3, name:'same3', test:'data2'
}];

var array2=[{
 id:1, name:'same', test:'data'
},{
 id:3, name:'paul2', test:null
},{
 id:2, name:'paul3', test:'data2'
}];


/*var matchedOb= _.filter(array, function(obj){ return !_.findWhere(array2, obj); });*/

/*var matchedOb= _.filter(array, function(obj){ return !_.findWhere(array2, obj); });

console.log("matchedOb",matchedOb)*/


/*_.each(array, function(idx,item) {

  console.log("aaaaaaaaaaa",idx,item);

})*/


for(var i in array){

  for(var j in array2){

   /* var isMatch=_.isEqual(array[i], array2[j]);*/

   var isMatch=_.every(_.keys(array[i]), function(currentKey) {
    return _.has(array2[j], currentKey) &&
    _.isEqual(array[i][currentKey], array2[j][currentKey]);
  });

    //when index and id is same do nothing
    if(i==j && isMatch){

      array.splice(i,1);
      array2.splice(j,1);
      break;
    }else{

      if(array[i].id==array2[j].id && i!=j){

       var swapElem=array2[j];
       array2[j]=array2[i];
       array2[i]=swapElem;
       break;
     }


   }

 }

}

/*console.log("arrrrrrrrrrrr",array)
console.log("array2array2",array2)
*/

var todayDate=new Date();
/*var thisDay=todayDate.getDate();
var thisMoth=todayDate.getMonth();*/

todayDate.setUTCHours(0);
todayDate.setUTCMinutes(0);
todayDate.setUTCSeconds(0);
todayDate.setUTCMilliseconds(0);



//console.log(todayDate, todayDate.toISOString());

/*db.roomtemps.update(
 {date: todayDate},
 {
  $push: { temps: {val:89, dt: ISODate("2015-08-01T00:04:22.012Z") } }
},
{upsert:true}
);*/



class Vehical {



  constructor(){

   this.type='Car';

   console.log("this.basssssssssssssssssssss",this.type)

 }

 getMileage(fuel,km){

  return km/fuel;

}

}


class Bus extends Vehical {

  constructor(){
    super()
    this.type='Bus';
    this.model='B001';
  }

  getTYpe(){

     // super.type="TRcuck";

    //console.log("this.typethis.typess")
    return this.type;
  }
}


class  MyInterface {

  getName(){

  };

}

class MyAbstract {

  getLastName(){

  }

}

class TestCode extends MyInterface {

   getName(){

    return "lavkesh";

  };

}


var obj=new TestCode();
var yyy=obj.getName();
var zzz=obj.getName();
console.log("hhhhhhhhhhhhhhh",yyy,zzz);



