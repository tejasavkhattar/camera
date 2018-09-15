// Set constraints for the video stream
// var saveAs = require("file-save/FileSaver");

// FileSaver saveAs(Blob/File data, optional DOMString filename, optional Boolean disableAutoBOM);

var constraints = { video: { facingMode: "left" }, audio: false };
var track = null;



// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/png");
    cameraOutput.classList.add("taken");

    // cameraOutput.toBlob(function(blob) {
    //   saveAs(blob, "test.png");
    // })

    var blobBin = atob(cameraSensor.toDataURL("image/png").split(',')[1]);

    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file=new Blob([new Uint8Array(array)], {type: 'image/png'});
    // FileSaver.saveAs(file)
    // saveAs(file, "test.png"

    var formdata = new FormData();
    formdata.append("img", file, "image/png");
    $.ajax({
       url: "../file",
       type: "POST",
       data: formdata,
       processData: false,
       contentType: false,
    }).done(function(respond){
      console.log(respond)
      alert(respond[0].name)
    });
    // track.stop();
};

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);
