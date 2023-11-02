import { io } from 'socket.io-client'
import {setup} from "@chabb/main";


const socket = io("http://localhost:3000");
socket.on('connect', () => {
    console.log('socket connected', socket.id);
    socket.emit('config', { id: socket.id }, (conf: any) => {
        console.log('config', conf)
        setup(conf, socket)
    });
});

