// 导入 express 模块
const express = require("express");
const bodyParser = require('body-parser');
const joi = require("joi");
// 创建 express 服务器实例
const app = express();
const db = require("./config/db/index"); // 导入数据库操作模块
const multer = require('multer');
const path = require('path');
// 导入 cors 中间件，解决跨域问题
const cors = require("cors");
// 将 cors 注册为全局中间件
app.use(cors());

// 处理JSON格式:Content-Type: application/json;
// app.use(express.json());
app.use(bodyParser.json());
// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  // 保存在 destination 中的文件名
  filename: function (req, file, cb) {
      let type = file.originalname.replace(/.+\./, ".");
      cb(null, Date.now() + random(1, 100) + type);
  }
});
const upload = multer({ storage: storage });
// 假设添加一个路由用于处理文件上传，例如 /upload 路由
app.post('/upload', upload.single('avata'), (req, res) => {
  // req.file是multer解析上传文件后提供的对象，包含了文件的相关信息，比如文件名等
  const fileName = req.file.filename;
  const userId = req.body.user_id; // 这里假设前端上传图片时会在请求体中携带用户ID信息，根据实际情况调整获取方式
  // 调用函数将图片文件名和用户ID信息插入到数据库中
  const updataImgSql = 'UPDATE users SET avatar =? WHERE id =?'
  db.query(updataImgSql, [fileName, userId], (err, results) => {
      // 执行 selectSql 语句失败
      if (err) {
          return res.send({ status: 500, msg: err.message });
      }
      res.send({
          status: 200,
          msg: "图片上传成功，已保存到数据库",
      });
  });
});


// 导入 express-jwt 并解构
const expressJWT = require('express-jwt')
// // 密钥
const { secretKey } = require("./config/config");
// 使用 express-jwt 这个中间件，排除注册和登录
app.use(
  expressJWT.expressjwt({ secret: secretKey, algorithms: ['HS256'] }).unless({
    path: ['/login','/upload'], // 排除不需要验证 token 的路由
  })
);



// 导入路由模块
const userRouter = require("./router/user");
// 注册路由模块
app.use("/user", userRouter);



// 导入路由模块
const friendRouter = require("./router/friend");
// 注册路由模块
app.use("/friend", friendRouter);

// 导入路由模块
const courseRouter = require("./router/course");
// 注册路由模块
app.use("/course", courseRouter);

// 导入路由模块
const contentRouter = require("./router/content");
// 注册路由模块
app.use("/content", contentRouter);

const { Server } = require('socket.io')
const { socketServer } = require('./controllers/socket.js')
// 开启cors跨域
const io = new Server(3001, {
  cors: {
    origin: ['http://localhost:5173']
  }
})

// socketServer(io)
//socket服务
const chattingCT = require('./controllers/chatting');
const { login } = require("./controllers/user.js");

const userList = [];
const chatRooms = {};
io.on('connection', (socket) => {
  const username = socket.handshake.query.username
  const userId = socket.handshake.query.userId
  const userInfo = userList.find(user => user.username === username)
  if (userInfo) {
    userInfo.id = socket.id
  } else {
    userList.push({
      id: socket.id,
      username,
      userId
    })
  }
  io.emit('online', {
    userList
  })

  // 创建新群聊
  socket.on('createRoom', (data) => {
    socket.join(data.groupId);
    chatRooms[data.groupId] = { name: data.groupName, members: data.member };
    data.member.forEach(item => {
      const user = userList.find(user => user.username == item.friendName)
      if (user) {
        // io.to(data.roomId).emit('createChatGroup', user)
        io.to(user.id).emit('createChatGroup', { user, groupId: data.groupId })
      }
    });
    socket.emit('roomCreated', data);
    // if (data.username) {
    //   io.to(data.roomId).emit('chatGrSystemNotice', {
    //     roomId: data.roomId,
    //     msg: data.username + '加入了群聊!',
    //     system: true
    //   });//为房间中的所有的socket发送消息, 包括自己
    // }

  });

  socket.on('joinChatGroup', (data) => {
    socket.join(data.info.groupId);
    io.to(data.info.groupId).emit('chatGrSystemNotice', {
      groupId: data.info.groupId,
      msg: data.userName + '加入了群聊!',
      system: true
    });//为房间中的所有的socket发送消息, 包括自己
  });
  // 私聊发送消息
  socket.on('send', ({ fromUsername, targetId, msg }) => {
    console.log(21);

    const targetSocket = io.sockets.sockets.get(targetId)
    const toUser = userList.find(user => user.id == targetId)
    targetSocket.emit('receive', {
      user1_id: toUser.id,
      user2_id: targetId,
      message: msg,
      dateTime: new Date()
    })
    // targetSocket.emit('receive', {
    //   fromUsername,
    //   toUsername: toUser.username,
    //   msg,
    //   time: new Date()
    // })
  })
  // 群聊发送消息
  socket.on('chatMessage', ({ username, groupId, msg }) => {
    io.to(groupId).emit('receiveMsgGroup', { username, msg });
  })
})

// 定义错误级别中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError)
    return res.send({
      status: 400,
      msg: "请求参数不合法" + err.message,
    });
  // 身份认证失败错误
  if (err.name === "UnauthorziedError")
    return res.send({ status: 401, msg: "无效的token！" });
  // 其它错误
  res.send({
    status: 401,
    msg: err.message,
  });
});

// 调用 app.listen 方法，指定端口号启动 web 服务器
app.listen(3000, () => {
  console.log("api server running at http://127.0.0.1:3000");
});