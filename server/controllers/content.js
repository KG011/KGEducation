
const db = require("../config/db/index"); // 导入数据库操作模块
exports.insertContent = (req, res) => {
    const data = req.body
    const values = [data.username, data.friendname, data.content, data.dataTime]
    const insertSql = `INSERT INTO friend_message (username, friendname, content) VALUES (?,?,?)`;
    db.query(insertSql, values, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            content: results,
        });
    });
};
exports.getContent = (req, res) => {
    const selectSql = `select * from friend_message;`;
    db.query(selectSql, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            content: results,
        });
    });
};

exports.getGroupContent = (req, res) => {
    const selectSql = `select * from group_message where groupId=?;`;
    db.query(selectSql, req.body.groupId,(err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            content: results,
        });
    });
};
exports.insertGroupContent = (req, res) => {
    const data = req.body
    const values = [data.username, data.content, data.groupId,data.time]
    const insertSql = `INSERT INTO group_message (username,content,groupId) VALUES (?,?,?)`;
    db.query(insertSql, values, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            content: results,
        });
    });
};