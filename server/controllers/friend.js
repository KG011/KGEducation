const db = require("../config/db/index"); // 导入数据库操作模块
// 获取所有数据
exports.getFriendList = (req, res) => {
    const selectSql = "select * from friendlist where user1_id =? OR user2_id =?;";
    db.query(selectSql, [req.body.userId, req.body.userId], (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        const filteredResults = results.map(result => {
            if (req.body.userId === result.user1_id) {
                return {
                    ...result,
                    friendName: result.user2_name 
                };
            } else if (req.body.userId === result.user2_id) {
                return {
                    ...result,
                    friendName: result.user1_name
                };
            } 
        });
        res.send({
            status: 200,
            msg: "获取成功",
            friendList: filteredResults,
        });
    });
};
exports.getGroupList = (req, res) => {
    const selectSql = "select * from user_group where userId=?;";
    db.query(selectSql, req.body.userId, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            groupList: results,
        });
    });
};
exports.insertGroup = (req, res) => {
    const values = [req.body.userId, req.body.roomId, req.body.groupname]
    const insertSql = `INSERT INTO user_group (userId, groupId, groupname) VALUES (?,?,?)`;
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
exports.addFriend = (req, res) => {
    const insertSql = `INSERT INTO friend_request (username, userId, friendname) VALUES (?,?,?)`;
    db.query(insertSql, [req.body.username, req.body.userId, req.body.friendname], (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "成功",
        });
    });
};
exports.getSearchRequest = (req, res) => {
    const selectSql = "select * from friend_request where friendname=?;";
    db.query(selectSql, req.body.username, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "获取成功",
            friendRequestList: results,
        });
    });
};
exports.agreeFriend = (req, res) => {
    const insertSql = `INSERT INTO user_friend (userId, friendId, friendName) VALUES (?,?,?)`;
    db.query(insertSql, [req.body.userId, req.body.friendId, req.body.friendName], (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "成功",
        });
    });
};
exports.deleteRequest = (req, res) => {
    const values = [req.body.username, req.body.friendname];
    const deleteSql = 'DELETE FROM friend_request WHERE username = ? AND friendname = ?'
    db.query(deleteSql, values, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "成功",
        });
    });
};

