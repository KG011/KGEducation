const db = require("../config/db/index"); // 导入数据库操作模块
// 获取好友列表
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

// 获取好友聊天记录
exports.getMessageListApi = (req, res) => {
    const user1_id = req.body.user1_id
    const user2_name = req.body.user2_name;
    const selectMessagesSql = `SELECT fm.*,
    CASE WHEN fm.dateTime IS NULL THEN (
        SELECT MAX(dateTime) FROM friend_message WHERE dateTime IS NOT NULL
    ) ELSE fm.dateTime END AS effectiveDateTime
FROM friend_message fm
WHERE (fm.user1_id =? OR fm.user2_id =?)
  AND fm.user2_name =?
ORDER BY effectiveDateTime ASC;`;
    db.query(selectMessagesSql, [user1_id, user1_id, user2_name], (err, messageResults) => {
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }

        // 2. 如果有消息结果，遍历结果并根据 user2_id 从 users 表查找对应信息
        if (messageResults.length > 0) {
            const userIdsToLookup = messageResults.map(result => result.user2_id);
            const uniqueUserIds = [...new Set(userIdsToLookup)];

            const selectUsersSql = "SELECT * FROM users WHERE id IN (?);";
            db.query(selectUsersSql, [uniqueUserIds], (userErr, userResults) => {
                if (userErr) {
                    return res.send({ status: 500, msg: userErr.message });
                }

                // 3. 集成消息和用户信息并返回
                const integratedResults = messageResults.map(message => {
                    const correspondingUser = userResults.find(user => user.id === message.user2_id);
                    return {
                        messageInfo: message,
                        userInfo: correspondingUser
                    };
                });

                res.send({
                    status: 200,
                    msg: "获取成功",
                    integratedResults: integratedResults
                });
            });
        } else {
            // 如果没有消息结果，直接返回空数组或适当的响应
            res.send({
                status: 200,
                msg: "没有相关消息",
                integratedResults: []
            });
        }
    });
};

//发送消息
exports.appendMessageApi = (req, res) => {
    const data = req.body
    console.log(data);

    const insertSql = `INSERT INTO friend_message (user1_id, user2_id, message,dateTime) VALUES (?,?,?,?)`;
    db.query(insertSql, [data.user1_id, data.user2_id, data.message, data.dateTime], (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "发送成功",
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

