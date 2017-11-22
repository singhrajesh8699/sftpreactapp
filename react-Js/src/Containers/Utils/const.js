
let URL;

//URL = 'https://sftp-back.zylotech.com'
//URL = 'http://172.16.17.10:8080';
URL = 'http://localhost:8080';


const properties={
	'loginUrl': URL + '/login',
    'updatePass':URL+'/resetpass',
    'getUserList':URL+'/getuserlist',
	 renderSignUpUrl: URL + '/rendersignup',
	 signupUrl: URL + '/signup',
     validateCName: URL+'/validatecname',
	 validateUsername: URL + '/validateusername',
	 validateEmail: URL + '/validateemail',
     dashBoadRecordUrl: URL + '/dashBoadRecord',
    'sObjectUrl': URL + '/sobjectlist',
    'downloadFileUrl': URL + '/downloadfile',
    'browseruploadUrl':URL+'/browsers3upload',
    'SalesForce': URL + '/salesforcelogin',
    'Eloqua': URL + '/eloqualogin',
    'GoogleDrive': URL + '/googledrivelogin',
    'DropBox': URL + '/dropboxlogin',
    'OneDrive': URL + '/onedrivelogin',
    'FlatFile':URL+'/flatfile',
}

export default properties;
