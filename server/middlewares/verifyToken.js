exports.verifyToken = (req, res) => {
    let token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: '请传入token' });
    }
    try {
      req.user = jwt.verify(token, 'secret_key');
    } catch (e) {
      res.status(401).json({ error: '无效的token' });
    }
};