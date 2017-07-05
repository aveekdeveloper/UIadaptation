var emotionurl = '/emotions'

$(function() {
  if (window.JpegCamera) {
    var camera; // Initialized at the end
    var captureInterval = 5000; //capture images every 5 secs
    //var apikey = 'fb704af19ac949a6884e416a0c0fc3e6';
    var apikey = "e3415149248145149e7cb635f6df3ed6";
    var apiurl = 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize';
    //var apiurl = "https://api.projectoxford.ai/emotion/v1.0/recognize";


    var options = {
      shutter_ogg_url: "../dist/shutter.ogg",
      shutter_mp3_url: "../dist/shutter.mp3",
      swf_url: "../dist/jpeg_camera.swf",
    }

    var take_snapshots = function() {
      var snapshot = camera.capture(/*options={shutter: false}*/);
      console.log(snapshot);
      var myReader = new FileReader();
      snapshot.get_blob(function(data){
        CallMicrosoftAPI(apiurl,apikey,data);
      }, mime_type = "application/octet-stream")
    };

    setInterval(take_snapshots, captureInterval);

    //create the camera div
    var $div = $('<div />').appendTo('body');
    $div.attr('id', 'camera');

    camera = new JpegCamera("#camera", options).ready(function(info) {
      $("#take_snapshots").show();
    });

  }
});

function CallMicrosoftAPI(apiUrl, apiKey, imgblob)
{
    $.ajax({
        processData: false,
        url: apiUrl,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
        },
        type: "POST",
        data: imgblob,
    })
        .done(function (response) {
            console.log("success")
            ProcessResult(response);
        })
        .fail(function (error) {
            console.log(error);
        });
}


//TODO: send to the UI server all the analysed image emotions
function ProcessResult(response)
{
  //decorate the response
  //response.state = AppState;
  //response.session = GetPresentSession();

  $.ajax({
    url: emotionurl,
    type: "POST",
    data: response[0]["scores"],
  })
  console.log(response[0]["scores"]);
}
/*
var AppStateEnum = {
  LIVE: 1,
  TEST: 2,
  properties: {
    1: {name: "live", value: 1, code: "L"},
    2: {name: "test", value: 2, code: "T"}
  }
};

var AppState = AppStateEnum.TEST;

//TODO: implement it
function GetPresentSession(){
  return 1;
}
*/
