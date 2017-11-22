let zyloSourceAuthQuery =require('../models/Sequelize/zyloSourceAuthQuery');

module.exports.flatfileData=function(req,res){
	var userId=req.body.userId;

	var config=[{'filename':req.body.filename,
		        'main_map':req.body.main_map,
				'reverse_map':req.body.reverse_map,
				'datatype_map':req.body.dataType_map,
				}];
    var flatFileData={
        source_type:'flatfile',
        config:config,
        status:1,
        client_id:userId
      }

	zyloSourceAuthQuery.findRecords(flatFileData,res);			
}