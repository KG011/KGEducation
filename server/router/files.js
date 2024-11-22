const multer = require('multer')
// 导入express
const express = require("express");
// 引入路由模块
const router = express.Router();
const path = require('path')
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
router.post('/upload', upload.single('avata'), (req, res) => {
    console.log(req);
    
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
module.exports = router;
