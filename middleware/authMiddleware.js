const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Read token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If token is missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach logged in user's id to req.user
    req.user = { id: decoded.id };

    next();
  } catch (error) {
    // If token is invalid
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

module.exports = protect;
