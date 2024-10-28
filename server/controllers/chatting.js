const db = require("../config/db/index"); // 导入数据库操作模块
// 获取所有数据
exports.getFriendList = (req, res) => {
    const selectSql = "select * from user_friend where userId=?";
     db.query(selectSql, req,  (err, results) => {
        return results
    });
};