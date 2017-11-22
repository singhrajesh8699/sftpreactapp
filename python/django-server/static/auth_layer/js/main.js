
var GLOBAL_URI = 'http://localhost:8000/';

function addInputFile() {
  var form = $("#form-upload");
  var inputsLen = form.find($("input")).length;
  var inputHtml = '<input type="file" name="upload" id="upload_'+inputsLen+'">';
  form.append(inputHtml);
}

function uploadFiles() {
  var form = $("#form-upload");
  var inputsArr = form.find($("input"));

  var arr=[];
  var form = new FormData();
  for (var i=0; i<inputsArr.length; i++) {
    arr.push(inputsArr[i].files[0]);
    form.append("file", inputsArr[i].files[0]);
  }
  var uri =  GLOBAL_URI + 'auth/upload/';
  $.ajax({
      async: true,
      type: "POST",
      url: uri,
      contentType: 'multipart/form-data',
      data: form,
      success: function(data) {
        console.log('Yaya');
      },
      error: function(data) {
        console.log("error:", data);
      }
    });
}


function injectPlainHTML(data, headerTxt) {
  var utc_timestamp = new Date().getTime();
  utc_timestamp = Math.ceil(utc_timestamp / 1000);
  $("#div_iframe")[0].innerHTML = '<div id="header"></div><div id="json"></div>';
  $("#header")[0].innerHTML = '<p>Timestamp: '+ utc_timestamp +'</p><h3>' + headerTxt + ':</h3>';
  var div_json = $("#json")[0];
  var data = data.replace("\n", "<br>");
  div_json.innerHTML = "<p>" + data + "</p>";
}