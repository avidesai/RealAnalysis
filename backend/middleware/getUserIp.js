// middleware/getUserIp.js
const getUserIp = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  req.userIp = ip.split(',')[0].trim(); // In case of multiple IP addresses, take the first one
  next();
};

module.exports = getUserIp;