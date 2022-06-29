const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const Filter = require('bad-words');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const adminRoute = require('./routes/adminRoute')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://0.0.0.0:27017/socketio';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    console.log('DataBase is connected');
    server.listen(port, () => {
      console.log(`Server is up on port ${port}!`)
  })
  })
  .catch((err) => console.log(err));

// Socket connection
io.on('connection', (socket) => {
  console.log('New WebSocket connection')

  socket.on('join', (options, callback) => {
      const { error, user } = addUser({ id: socket.id, ...options })
      
      if (error) {
          return callback(error)
      }
      socket.join(user.room)

      socket.emit('message', generateMessage('Admin', 'Welcome!'))
      socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
      io.to(user.room).emit('roomData', {
          room: user.room,
          users: getUsersInRoom(user.room)
      })

      callback()
  })

  socket.on('sendMessage', (message, callback) => {
      const user = getUser(socket.id)
      const filter = new Filter()

      if (filter.isProfane(message)) {
          return callback('Profanity is not allowed!')
      }

      io.to(user.room).emit('message', generateMessage(user.username, message))
      callback()
  })

  socket.on('disconnect', () => {
      const user = removeUser(socket.id)

      if (user) {
          io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
          io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
          })
      }
  })
})

const adminChat = io.of("/admin/chat");

adminChat.on('connection', (socket) => {
  socket.on('adminchat',(message, callback)=>{
    console.log(message)
    socket.broadcast.emit('adminmessage', message)
  })
})
// routes
app.get('*', checkUser); 
app.get('/', (req, res) => res.render('index'));
app.get('/user/chat',requireAuth,(req, res)=>{
  res.render('chat')
})
app.get('/user/admin/chat',requireAuth,(req, res)=>{
  res.render('admin_chat')
})

app.use('/user/auth',authRoutes.router);
app.use('/user/auth',requireAuth,authRoutes.authentiactedRouter)

app.use('/admin/auth',adminRoute.router);
app.use('/admin/auth',requireAuth,adminRoute.authentiactedRouter)
app.get('/admin/chat',requireAuth,(req, res)=>{
    res.render('admin/chat')
  })