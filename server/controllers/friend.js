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
                    friendName: result.user2_name,
                    friend_id: result.user2_id
                };
            } else if (req.body.userId === result.user2_id) {
                return {
                    ...result,
                    friendName: result.user1_name,
                    friend_id: result.user1_id
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
// 获取群聊列表
exports.getGroupListApi = (req, res) => {
    const selectSql = "select * FROM grouplist WHERE user_id=?";
    db.query(selectSql, [req.body.userId], (err, results) => {
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


// 获取好友聊天记录
exports.getMessageListApi = (req, res) => {
    const user1_id = req.body.user1_id
    const user2_id = req.body.user2_id
    const user2_name = req.body.user2_name;
    const selectMessagesSql = `SELECT fm.*,
    CASE WHEN fm.dateTime IS NULL THEN (
        SELECT MAX(dateTime) FROM friend_message WHERE dateTime IS NOT NULL
    ) ELSE fm.dateTime END AS effectiveDateTime
FROM friend_message fm
WHERE (fm.user1_id =? AND fm.user2_id =?)
  or (fm.user1_id =? AND fm.user2_id =?)
ORDER BY effectiveDateTime ASC;`;
    db.query(selectMessagesSql, [user1_id, user2_id, user2_id, user1_id,], (err, messageResults) => {
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }

        // 2. 如果有消息结果，遍历结果并根据 user2_id 从 users 表查找对应信息
        if (messageResults.length > 0) {
            const userIdsToLookup = messageResults.map(result => result.user1_id);
            const uniqueUserIds = [...new Set(userIdsToLookup)];

            const selectUsersSql = "SELECT * FROM users WHERE id IN (?);";
            db.query(selectUsersSql, [uniqueUserIds], (userErr, userResults) => {
                if (userErr) {
                    return res.send({ status: 500, msg: userErr.message });
                }

                // 3. 集成消息和用户信息并返回
                const integratedResults = messageResults.map(message => {
                    const correspondingUser = userResults.find(user => user.id === message.user1_id);
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
// 获取群聊聊天记录
exports.getGroupMessageApi = (req, res) => {
    const group_id = req.body.group_id
    const selectMessagesSql = `SELECT fm.*,
    CASE WHEN fm.dateTime IS NULL THEN (
        SELECT MAX(dateTime) FROM group_message WHERE dateTime IS NOT NULL
    ) ELSE fm.dateTime END AS effectiveDateTime
FROM group_message fm
WHERE fm.group_id =?
ORDER BY effectiveDateTime ASC;`;
    db.query(selectMessagesSql, [group_id], (err, messageResults) => {
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }

        // 2. 如果有消息结果，遍历结果并根据 user1_id 从 users 表查找对应信息
        if (messageResults.length > 0) {
            const userIdsToLookup = messageResults.map(result => result.user1_id);
            const uniqueUserIds = [...new Set(userIdsToLookup)];

            const selectUsersSql = "SELECT * FROM users WHERE id IN (?);";
            db.query(selectUsersSql, [uniqueUserIds], (userErr, userResults) => {
                if (userErr) {
                    return res.send({ status: 500, msg: userErr.message });
                }

                // 3. 集成消息和用户信息并返回
                const integratedResults = messageResults.map(message => {
                    const correspondingUser = userResults.find(user => user.id === message.user1_id);
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
    const avatar = data.avatar || null;
    const insertSql = `INSERT INTO friend_message (user1_id, user2_id, message,dateTime,user2_name) VALUES (?,?,?,?,?)`;
    db.query(insertSql, [data.user1_id, data.user2_id, data.message, data.dateTime, data.user2_name], (err, results) => {
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
//发送消息
exports.appendGroupMessageApi = (req, res) => {
    const data = req.body
    const insertSql = `INSERT INTO group_message (user1_id, group_id, message,dateTime) VALUES (?,?,?,?)`;
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

//获取用户列表
exports.getAllUserApi = (req, res) => {
    const selectSql = `SELECT id, role, real_name FROM users`
    db.query(selectSql, (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "成功",
            userList: results
        });
    });
};

//发送好友请求
exports.sendRequsetApi = (req, res) => {
    // 先查询表中是否已存在对应的数据
    const checkSql = "SELECT * FROM request_friend WHERE user1_id =? AND user2_id =?";
    db.query(checkSql, [req.body.user1_id, req.body.user2_id], (checkErr, checkResults) => {
        if (checkErr) {
            return res.send({ status: 500, msg: checkErr.message });
        }

        if (checkResults.length > 0) {
            // 如果存在对应数据，执行更新操作
            const updateSql = "UPDATE request_friend SET user1_name =?, tag =? WHERE user1_id =? AND user2_id =?";
            db.query(updateSql, [req.body.user1_name, req.body.tag, req.body.user1_id, req.body.user2_id], (updateErr, updateResults) => {
                if (updateErr) {
                    return res.send({ status: 500, msg: updateErr.message });
                }
                // 判断tag是否为'agree'，若是则往friendlist表添加数据
                if (req.body.tag === 'agree') {
                    const insertFriendlistSql = "INSERT INTO friendlist (user1_id,user1_name,user2_id,user2_name) VALUES (?,?,?,?)";
                    const friendlistData = [req.body.user1_id,req.body.user1_name, req.body.user2_id,req.body.user2_name];
                    db.query(insertFriendlistSql, friendlistData, (insertFriendlistErr, insertFriendlistResults) => {
                        if (insertFriendlistErr) {
                            return res.send({ status: 500, msg: insertFriendlistErr.message });
                        }
                        res.send({
                            status: 200,
                            msg: "数据更新成功，好友关系添加成功",
                        });
                    });
                } else {
                    res.send({
                        status: 200,
                        msg: "数据更新成功",
                    });
                }
            });
        } else {
            // 如果不存在对应数据，执行插入操作
            const insertSql = "INSERT INTO request_friend (user1_id, user2_id, user1_name, tag) VALUES (?,?,?,?)";
            db.query(insertSql, [req.body.user1_id, req.body.user2_id, req.body.user1_name, req.body.tag], (insertErr, insertResults) => {
                if (insertErr) {
                    return res.send({ status: 500, msg: insertErr.message });
                }
                res.send({
                    status: 200,
                    msg: "数据插入成功",
                });
            });
        }
    });
};

//获取好友请求
exports.getRequestApi = (req, res) => {
    const selectSql = `SELECT * FROM request_friend WHERE user2_id=?`
    db.query(selectSql, [req.body.user_id], (err, results) => {
        // 执行 selectSql 语句失败
        if (err) {
            return res.send({ status: 500, msg: err.message });
        }
        res.send({
            status: 200,
            msg: "成功",
            requestList: results
        });
    });
};

//获取群聊用户列表
exports.getGroupUserListApi = (req, res) => {
    const { group_id, type } = req.body;
    if (type === 'group') {
        // 先从grouplist表中根据group_id获取user_id集合
        const selectUserIdsSql = `SELECT user_id FROM grouplist WHERE group_id =?`;
        db.query(selectUserIdsSql, [group_id], (err, userIdsResults) => {
            if (err) {
                return res.send({ status: 500, msg: err.message });
            }
            // 存储最终结果的数组
            let finalResults = [];
            // 如果找到了user_id集合
            if (userIdsResults.length > 0) {
                // 提取user_id数组
                let userIds = userIdsResults.map(result => result.user_id);
                // 根据每个user_id去users表中查找信息
                const selectUserInfoSql = `SELECT real_name, id FROM users WHERE id IN (?)`;
                db.query(selectUserInfoSql, [userIds], (err, userInfoResults) => {
                    if (err) {
                        return res.send({ status: 500, msg: err.message });
                    }
                    finalResults = userInfoResults;
                    res.send({
                        status: 200,
                        msg: "成功",
                        userList: finalResults
                    });
                });
            } else {
                res.send({
                    status: 200,
                    msg: "群中无用户",
                    userList: finalResults
                });
            }
        });
    } else {
        // 根据group_id直接去users表找对应信息
        const selectUserInfoSql = `SELECT real_name, id FROM users WHERE id =?`;
        db.query(selectUserInfoSql, [group_id], (err, userInfoResults) => {
            if (err) {
                return res.send({ status: 500, msg: err.message });
            }
            res.send({
                status: 200,
                msg: "成功",
                userList: userInfoResults
            });
        });
    }
};



// app.post('/upload', upload.single('file'), (req, res) => {
//     // req.file是multer解析上传文件后提供的对象，包含了文件的相关信息，比如文件名等
//     const fileName = req.file.filename;
//     const userId = req.body.userId; // 这里假设前端上传图片时会在请求体中携带用户ID信息，根据实际情况调整获取方式
//     // 调用函数将图片文件名和用户ID信息插入到数据库中
//     insertImageInfo(fileName, userId, (err, results) => {
//       if (err) {
//         res.status(500).send('图片上传失败，保存到数据库出错');
//         return;
//       }
//       res.status(200).send('图片上传成功，已保存到数据库');
//     });
//     //  const sql = 'INSERT INTO images (file_name, user_id) VALUES (?,?)';
//     //   connection.query(sql, [fileName, userId], (err, results) => {
//     //       if (err) {
//     //           console.error('插入图片信息到数据库失败：', err);
//     //           callback(err);
//     //           return;
//     //       }
//     //       callback(null, results);
//     //   });
//     // req.file 就是上传后的文件信息，这里简单返回文件名表示上传成功
//     res.send({ status: 200, msg: '文件上传成功', fileName: req.file.filename });
//   });
exports.upload = (req, res) => {
    
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

