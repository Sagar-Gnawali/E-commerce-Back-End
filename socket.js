const socket = require('socket.io');
const config = require('./configs');
let users = [];
module.exports = (app) => {
    const io = socket(app.listen(config.socket_port), {
        cors: {
            allow: '*'
        }
    });
    io.on('connection', (client) => {
        var id = client.id;
        // client.emit('Welcome',"Welcome to socket server from server side");//for connected clinet who requested ie 
        client.on('react', (msg) => {
            console.log('This is in server side message from clinet side is >>', msg);
        })
        client.broadcast.emit('Welcome', "Welcome to socket server from server side");//for every client connected to the sever except requesting client(Group communication)
        client.broadcast.to().emit();//for selected client (Private communication)
        client.on('new-user', (username) => {
            users.push({
                id,
                username
            })
            client.emit('users', users);
            client.broadcast.emit('users', users);
        })
        client.on('new-message', (data) => {
            console.log('New message contains the following data >>', data);
            client.emit('reply-message-own', data);//self 
            client.broadcast.to(data.receiverId).emit('reply-message-for', data);//for every client connected to server except afuleai 
        })
        client.on('disconnect', () => {
            users.forEach((user, index) => {
                if (id === user.id) {
                    users.splice(index, 1);
                }
            })
            // client.emit('users', users);
            client.broadcast.emit('users', users);
        })
    })
}