
let databaseInfo;
let accessKeyId;
let secretAccessKey;
let bucketName;
let sfcallbackUrl;
let gdcallbackUrl;
let dbcallbackUrl;
let odcallbackUrl;
let sfclientid;
let sfsecretkey;
let elcallbackUrl;
let elclientid;
let elsecretKey;

var DEPLOYMENT_TYPE = process.env.DEPLOYMENT_TYPE;
console.log('DEPLOYMENT_TYPE', DEPLOYMENT_TYPE);

if (DEPLOYMENT_TYPE == "prod") {
    databaseInfo = 'postgres://postgres:zylotech@localhost:5432/zylotech';

    accessKeyId='AKIAJOQR32K6VQ6DR7KA';
    secretAccessKey='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';
    bucketName='internalapp';

    gdcallbackUrl='https://sftp-back.zylotech.com/googledrive';
    dbcallbackUrl='https://sftp-back.zylotech.com/dropboxauth';
    odcallbackUrl='https://sftp-back.zylotech.com/onedriveauth';
    

    sfcallbackUrl='https://sftp-back.zylotech.com/salesforceauth';
    sfclientid='3MVG9d8..z.hDcPJZTeC3ZMSU6S80KnrJTqXOq1wev_IzwOMpnSEwZZI3tPFu2fcPiBCNxfH9Sp3ub1fQhtWN';
    sfsecretkey='8156536948963593088';

    elcallbackUrl='https://sftp-back.zylotech.com/eloquacallback';
    elclientid='4284e7e1-3c95-4ad7-996f-bd4a22a0d988';
    elsecretKey='13zjStrO7i0ukGTuiDvIpsoBzi-Vqm-vyFHjyR-y0WGXFD6BoV6AE4DBjpDnZDfxtqTtTuFMp89qH4SbLsO9VkWPgNxarVkqhk1i';



} else {
    databaseInfo = 'postgres://rajesh:rajesh@localhost:5432/rajesh';
    

    accessKeyId='AKIAJOQR32K6VQ6DR7KA';
    secretAccessKey='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';
    bucketName='internalapp';

    gdcallbackUrl='http://localhost:8080/googledrive';
    dbcallbackUrl='http://localhost:8080/dropboxauth';
    odcallbackUrl='http://localhost:8080/onedriveauth';

    sfcallbackUrl='http://localhost:8080/salesforceauth';
    sfclientid='3MVG9d8..z.hDcPJZTeC3ZMSU6cQPEGiiKIDThVps27T0EMzF1daJKVoFsi1bAk0hs70ZVoBkoMFZrPiu59Db';
    sfsecretkey='4040975969475467807';

    elcallbackUrl='http://localhost:8080/eloquacallback';
    elclientid='7f1547ba-1fa5-46fb-b30d-752bfcacbf68';
    elsecretKey='1xZ~NGvDz1kmYKvCY2bvc2b-e2c7l-FWLG6R-IJ9unDiFdGLvc5qCuHA4GjnxXPNtxhlggoQ5WeVnyBBLkzwpkW3Ac6pmEC65eXV';

}

module.exports ={
    secretKey: "r2a9j1e1s1h9s9i3ngh",
    databaseInfo: databaseInfo,
    bucketName:bucketName,
    accessKeyId:accessKeyId,
    secretAccessKey:secretAccessKey,
    saleforcelogin:'https://login.salesforce.com',

    sfcallbackUrl:sfcallbackUrl,
    sfclientid:sfclientid,
    sfsecretkey:sfsecretkey,

    gdcallbackurl:gdcallbackUrl,
    gdclientid:'686319590527-8ae8gre5uinnkeuk98562ohfmvpe323q.apps.googleusercontent.com',
    gdsecretKey:'fq2mbWOvdi22tt1uE-DfCmQp',

    dbcallbackurl:dbcallbackUrl,
    dbclientid:'jmawfifbdf3y79v',
    dbsecretKey:'ckfj2tv5rao3hjh',

    odcallbackurl:odcallbackUrl,
    odclientid:'e42f7594-5162-403a-9ca1-56d879cc7cc1',
    odsecretKey:'a28AD6iFZEvKty2h9bjijMe',

    elcallbackUrl:elcallbackUrl,
    elclientid:elclientid,
    elsecretKey:elsecretKey,
}
