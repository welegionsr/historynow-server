var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mysql = require("mysql2/promise");

let pool;
(async function initializePool() {
  pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "historynow",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
})();

passport.use(
  new LocalStrategy(
    {
      uesrnameField: "username",
      passwordField: "password"
    },
    async function(username, password, done) {
      console.log("Searching DB for username: " + username);
      let user = {};
      try {
        [results, metadata] = await pool.execute(
          "SELECT * FROM users WHERE username=? AND userPassword=?",
          [username, password]
        );
        console.log(results[0]);
      } catch (error) {
        console.log(error);
      }

      user = results[0];

      //if user wasn't found
      if (!user) {
        return done("Wrong username or password!");
      }

      //if user exists and credentials are valid
      return done(null, user);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  const [user, metadata] = await pool.execute(
    "SELECT * FROM users WHERE id=?",
    [id]
  );

  //if user wasn't found
  if (!user) {
    return done(
      "User doesn't exist! This shouldn't really happen but oh well."
    );
  }

  //otherwise send user details back to client
  return done(null, user);
});

module.exports = passport;
