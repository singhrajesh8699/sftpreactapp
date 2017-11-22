var Model = require('./models');

//module.exports.
let insertRecords=function(zyloData,res){
    Model.zyloSourceAuthTable.sync({force: false}).then(function () {
      Model.zyloSourceAuthTable.create(zyloData).then(function(){
		    console.log("zyloSourceAuth record  inserted")
		 if(zyloData.source_type!='flatfile'){ 
		    res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('Documents are shared successfully to zylotech');
			res.end();
		   }else{
		   	res.send("saved successfully")
		   }
	    }).catch(function(error) {
	      if(zyloData.source_type!='flatfile'){	
	    	res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('Something Broken!');
			res.end()
	        }else{
		  	res.send("error while saving data.")
		  }	
	 })
  }) 
};



let updateRecords=function(zyloData,res){
    Model.zyloSourceAuthTable.update(zyloData, {where: 
 	   { client_id:zyloData.client_id,source_type:zyloData.source_type} })  
      .then(updatedMax => {
	    console.log('zyloSourceAuth record updated')
	  if(zyloData.source_type!='flatfile'){
	  	res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('Documents are shared successfully to zylotech');
		res.end();
	   }else{
	   	res.send("saved successfully")
	   }
	  })
	  .catch(err=>{
	  	if(zyloData.source_type!='flatfile'){
		  	res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('Something Broken!');
			res.end()
		  	console.log(err)
		  }else{
		  	res.send("error while saving data.")
		  }	
	  });
}

let updateFlatFile=function(zylo,zyloData,res){
   	var zylodb=JSON.parse(JSON.stringify(zylo));
   	var zyloupdate=zylodb; 
   	var flag=0;
    zylodb.config.map(function(zylodb,key){
    	if(zylodb.filename==zyloData.config[0].filename){
    		flag=1;
    		zyloupdate.config[key]=zyloData.config[0];
    	}
    })

    if(flag==0){
  	 zyloupdate.config.push(zyloData.config[0]);
    }
    updateRecords(zyloupdate,res);
}

module.exports.findRecords=function(zyloData,res){
 return Model.zyloSourceAuthTable.sync({force: false}).then(function () {
   return Model.zyloSourceAuthTable.findOne({
   	where:{client_id: zyloData.client_id,source_type:zyloData.source_type}
	})
	.then(zylo => {
	   if(zylo==null){
	   	insertRecords(zyloData,res);
	   }else{
		   	if(zyloData.source_type=='flatfile'){
	          updateFlatFile(zylo,zyloData,res)
		   	}else{
		   	  updateRecords(zyloData,res);
		   	}
	   }
	})
 });
}