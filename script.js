const video = document.getElementById('video');
const countdown = document.getElementById('countdown');
const viewResultBtn = document.getElementById('viewResult');

const canvas = document.createElement('canvas');
canvas.width = 300;
canvas.height = 150;

let photos = [];

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();
  setTimeout(() => startPhotoSequence(0), 1000);
});

function startPhotoSequence(photoIndex) {
  let count = 5;
  countdown.style.display = 'block';

  const countdownInterval = setInterval(() => {
    if (count > 0) {
      countdown.innerText = count;
      countdown.style.animation = 'none';
      void countdown.offsetWidth; // Restart animation
      countdown.style.animation = 'pop 0.4s ease';
      count--;
    } else {
      clearInterval(countdownInterval);
      countdown.innerText = '';
      flashScreen();
      takePhoto(photoIndex);
    }
  }, 1000);
}

function takePhoto(index) {
  const ctx = canvas.getContext('2d');
  ctx.filter = 'sepia(0.4) contrast(1.2) brightness(0.9)';
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataURL = canvas.toDataURL();
  photos.push(dataURL);

  if (photos.length < 3) {
    setTimeout(() => startPhotoSequence(photos.length), 1500);
  } else {
    localStorage.setItem('photos', JSON.stringify(photos));
    viewResultBtn.style.display = 'inline-block';
  }
}

function flashScreen() {
  const flash = document.createElement('div');
  flash.className = 'flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 300);
}
