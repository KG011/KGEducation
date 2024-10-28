// 导入定义验证规则的包
const joi = require("joi");
/**
 * string()：是否为字符串
 * alphanum()：是否是字母
 * min()：最小长度
 * max()：最大长度
 * required()：是否是必须项
 * pattern()：绑定正则表达式的模式
 */
// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required();

// 验证规则对象 - 注册和登录
exports.reg_login_schema = {
  body: {
    username,
    password,
  },
};

  
