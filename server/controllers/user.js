/**
 * 供 /router/user.js 模块进行使用
 */
// 导入 bcryptjs
const bcrypt = require("bcryptjs");
// 导入数据库操作模块
const db = require("../config/db/index");
const jwt = require("jsonwebtoken"); // 导入生成 Token 的包
const { secretKey, expiresIn } = require("../config/config"); // 导入配置-密钥

// 获取用户信息
exports.userInfo = (req, res) => {
    // 接收客户端传递的表单数据
    let token = req.headers.authorization?.split('Bearer ')[1];
    const tokenDate = jwt.decode(token)
    const sql = "SELECT * FROM user WHERE username = ?";
    db.query(sql, tokenDate.username, (err, results) =>{
        res.send({
            status: 200,
            userId: results[0].userId,
            username: results[0].username,
            avater: results[0].avater
        });
    })
};
// 获取用户信息
exports.searchFriend = (req, res) => {
    const sql = "SELECT * FROM user WHERE username LIKE CONCAT('%', ?, '%')";
    db.query(sql, req.body.username, (err, results) =>{
        if (results.length==0) {
            return res.send({ status: 400, msg: "用户名不存在，请确认用户名是否正确！" });
        }
        res.send({
            status: 200,
            searchList:results
        });
    })
};

// 注册用户的处理函数
exports.register = (req, res) => {
    // 获取客户端请求的用户信息
    const userInfo = req.body;
    // 定义 SQL 语句，查询用户名是否被占用
    const sql = "SELECT * FROM user WHERE username = ?";
    db.query(sql, userInfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.send({ status: 500, msg: err.message });
        // 判断用户名是否被占用
        if (results.length > 0) {
            return res.send({ status: 400, msg: "用户名被占用，请更换其他用户名！" });
        }
        // 调用 bcrypt.hashSync() 对密码进行加密
        // userInfo.password = bcrypt.hashSync(userInfo.password, 10);
        // 定义插入新用户的 SQL 语句
        const sql = "INSERT INTO user SET ?";
        db.query(sql, userInfo, (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.send({ status: 500, msg: err.message });
            // 判断影响行数是否为 1
            if (results.affectedRows !== 1)
                return res.send({ status: 500, msg: "注册用户失败，请联系管理员！" });
            res.send({ status: 200, msg: "用户注册成功！" });
        });
    });
};

// 登录的处理函数
exports.login = (req, res) => {
    // 接收客户端传递的表单数据
    const userInfo = req.body;
    // 定义 SQL 查询语句
    const sql = "SELECT * FROM users WHERE username = ? AND role = ?";
    db.query(sql, [userInfo.username,userInfo.role], (err, results) => {
        // 执行 SQL 语句失败
        if (err) res.send({ status: 500, msg: err.message });
        // 执行 SQL 语句成功，但查询条数不等于1
        if (results.length !== 1)
            return res.send({ status: 403, msg: "登陆失败，请检查用户名和密码！" });
        // 判断密码是否正确
        if (userInfo.password != results[0].password) return res.send({ status: 401, msg: "登录失败，密码错误！" });
        // 对用户信息进行加密，生成Token字符串
        const token = jwt.sign({ username: req.body.username }, secretKey, {
            expiresIn: expiresIn,
        });
        console.log(results[0]);
        
        res.send({
            status: 200,
            msg: "登陆成功！",
            token: "Bearer " + token,
            username: results[0].username,
            role: results[0].role,
            userId:results[0].id,
            real_name:results[0].real_name,
            avatar:results[0].avatar,
        });

    });
};

//获取个人中心信息
exports.getPersonlApi=(req, res)=>{
    const sql = "SELECT id,real_name,role,avatar FROM users WHERE id=?";
    db.query(sql, req.body.user_id, (err, results) =>{
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            personalInfo:results
        });
    })
}





