const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('messageLogged',function(){
    console.log('message logged .......');
});

emitter.emit('messageLogged');