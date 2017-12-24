var videoDevices = [];
var video = document.querySelector('video');
var toggleCameraButton = document.querySelector('button');
var videoIndex = 0;

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function startStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  var constraints = {
    audio: false,
    video: {
      deviceId: {
        exact: videoDevices[videoIndex].deviceId
      }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
}

navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
  videoDevices = deviceInfos.filter(function (deviceInfo) {
    return deviceInfo.kind === 'videoinput';
  });

  startStream();
});

toggleCameraButton.onclick = function () {
  videoIndex = (videoIndex + 1) % videoDevices.length;
  startStream();
};
