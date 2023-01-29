const express = require("express");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv").config();

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

//helmet middleware
app.use(helmet());
//logging middleware
app.use(morgan("tiny"));
//json middleware
app.use(express.json());

// local db - enable this for local development. disable when pushing to prod

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "lofasz",
    database: "smart-brain",
  },
});

// enable this for production. disable when local dev

// const db  = knex({
//   client: 'pg',
//   connection: {
//     host : DB_HOST,
//     port: '5432',
//     user : DB_USER,
//     password : DB_PASSWORD,
//     database : DB_NAME,
//     ssl: true
//   },
//   pool: {
//     min: 2,
//     max: 10
//   }
// });

// connect to the database
try {
  db.select("*")
    .from("users")
    .then((data) => {
      console.log("db connected");
    });
} catch (error) {
  console.log("Database is not connected. Error: ", error);
}

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "125",
      name: "f",
      email: "f",
      password: "f",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// MIDDLEWARE.
//production cors
// app.use(cors({origin: 'https://balint-ztm-smartbrain.netlify.app'}));

//development cors
app.use(
  cors({
    origin: [
      /http:\/\/localhost:\d+/,
      "https://balint-ztm-smartbrain.netlify.app",
    ],
  })
);

// / --> GET = this is working
app.get("/", (req, res) => {
  res.send("it is working!");
});

// /signin --> POST = success/fail
app.post("/signin", (req, res) => signin.handleSignIn(req, res, db, bcrypt));

// /register --> POST = user
// dependency injection, we inject the database and the bcrypt library into the register.js file so we don't have to import it there
app.post("/register", (req, res) =>
  register.handleRegsiter(req, res, db, bcrypt)
);

// /profile/:userId --> GET = user
app.get("/profile/:userId", (req, res) =>
  profile.handleProfileGet(req, res, db)
);

// /profile/:userId --> POST = user updating user profile
app.post("/profile/:userId", (req, res) => {
  profile.handleProfileUpdate(req, res, db);
});

// /image --> PUT (updating the number of pics a user submitted so that we know the ranking) --> user
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

// PORT.

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
