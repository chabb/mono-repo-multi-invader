export function loadMusic(file: string | URL) {
  if (file === '') {
    console.warn('No file passed');
    return;
  }

  const getSound: XMLHttpRequest = new XMLHttpRequest();
  getSound.responseType = 'arraybuffer';
  getSound.onload = function() {
    const context: AudioContext = new AudioContext();
    context.decodeAudioData(getSound.response).then(buffer => {
      const audioBuffer = buffer; // assign the buffer to a variable that can then be 'played'
      const playSound = context.createBufferSource();
      playSound.buffer = audioBuffer;
      playSound.connect(context.destination);
      playSound.start(0);
    })
  };
  getSound.open("GET", file, true);
  getSound.send();
}
