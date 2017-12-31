var videoDevices = [];
var video = document.querySelector('video');
var toggleCameraButton = document.querySelector('#toggle-camera-button');
var captureSnapshotButton = document.querySelector('#capture-snapshot-button');
var canvas = window.canvas = document.querySelector('canvas');
var img = document.querySelector('img');
var videoIndex = 0;
var mediaStreamTrack;
var imageCapture;

canvas.width = 480;
canvas.height = 360;

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;

  mediaStreamTrack = stream.getVideoTracks()[0];
  imageCapture = new ImageCapture(mediaStreamTrack);
  console.log(imageCapture);
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

captureSnapshotButton.onclick = function () {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').
    drawImage(video, 0, 0, canvas.width, canvas.height);

  window.open(canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'), 'image');

  if (imageCapture) {
    imageCapture.takePhoto()
      .then(function (blob) {
        img.src = URL.createObjectURL(blob);
        img.onload = function () {
          URL.revokeObjectURL(this.src);
        };
      })
      .catch(function (error) {
        console.error('takePhoto() error:', error)
      });
  }
};
