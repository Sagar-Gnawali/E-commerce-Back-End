const event = require('events');
const myEvent = new event.EventEmitter();

// listeners
myEvent.on('myevent',(data)=>{
    setTimeout(()=>{
        console.log('This is my event and it contains the >>',data);
    },2000)
})

myEvent.emit('myevent','event run successfully');