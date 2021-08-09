const config = {
  mongo_uri: process.env.DB_CNX_URI,
  server_session_secret: process.env.SERVER_SESSION_SECRET
};

module.exports = config;
