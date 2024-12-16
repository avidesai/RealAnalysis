// /backend/middleware/getUserIp.js

const getUserIp = (req, res, next) => {
  const ip =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  req.userIp = ip.split(',')[0].trim(); // Get the first IP
  next();
};

module.exports = getUserIp;
