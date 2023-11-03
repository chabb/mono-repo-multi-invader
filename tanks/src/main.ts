import { io } from 'socket.io-client'
import {setup} from "@chabb/main";
import {loadMusic} from "@chabb/music";

// the sound API was more lenient, but now you cannot create an audio context immediately
setTimeout(() => loadMusic('src/assets/music.mp3'), 0);

const socket = io("http://localhost:3000");
socket.on('connect', () => {
    console.log('socket connected', socket.id);
    socket.emit('config', { id: socket.id }, (conf: any) => {
        console.log('config', conf)
        setup(conf, socket)
    });
});

