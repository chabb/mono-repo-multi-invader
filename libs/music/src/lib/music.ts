
// ugly code to play music
let audioBuffer: AudioBuffer
const context: AudioContext = new AudioContext();
const getSound: XMLHttpRequest = new XMLHttpRequest();
getSound.responseType = 'arraybuffer';
getSound.onload = function() {
  context.decodeAudioData(getSound.response).then(buffer => {
    audioBuffer = buffer; // assign the buffer to a variable that can then be 'played'
    playSound();
  })
};
getSound.send();

function playSound() {
  const playSound = context.createBufferSource();
  playSound.buffer = audioBuffer;
  playSound.connect(context.destination);
  playSound.start(0)
}

export function loadMusic(file: string | URL) {
  if (file === '') {
    console.warn('No file passed');
    return;
  }
  getSound.open("GET", file, true);
}
