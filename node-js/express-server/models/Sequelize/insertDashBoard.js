var Model = require('./models');

module.exports.insertDashBoard=function(dashBoardData){
  Model.DashBoard.sync({force: false}).then(function () {
	Model.DashBoard.create(dashBoardData).then(function(){
	    console.log("dashboard record inserted")
	  }).catch(function(error) {
        console.log(error)
    })
  })
};


module.exports.getRecords=function(req,res){
   Model.DashBoard.sync({force: false}).then(function () {
   Model.DashBoard.findAll({
       where: {
           userId: req.body.userId,
        }
    }).then(function(result) {
    	let records=[];
         result.map(function (user){
              records.push(user.toJSON());
         }) 
         res.send(JSON.stringify({"records":records}));
   });
  })  
};

