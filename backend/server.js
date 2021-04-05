const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const dbConfig = require("./app/config/db.config");
const socketIo = require("socket.io");

const app = express();

const db = require("./app/models");
const Role = db.role;
const PartDetails = db.partdetail;
const User = db.user;

const users = [];

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const tmp = async () => {
  return new Promise((res, rej) => {
    console.log("--------------");
    res("444444444444");
  });
};

app.get("/update", async (req, res) => {
  // console.log("update");
  // return PartDetails.updateOne(
  //   { user: "6066b67559af7424d3053c5f" },
  //   { $set: { partName: "12345678" } }
  // );
  // tmp().then((e) => console.log(e));
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("New client connected");
  // socket.join(socket.id);

  socket.on("newUser", (user) => {
    users.push(user);
    socket.join(user);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  socket.on("profile", (data) => {
    console.log("Get Profile: " + data);
  });
  socket.on("PartName", async (data) => {
    console.log(data);
    const { text, user } = data;
    console.log("user: " + user);
    const id = await User.findOne({ username: user }).select("_id");
    console.log("userId: " + id);
    socket.emit("user", user);
    // io.emit("user", user);
    // io.to(users[0]).emit("user", user);
    // console.log(users);
    // new PartDetails({ user: _id, partName: text }).save();
    await PartDetails.updateOne(
      { user: id },
      {
        $set: {
          partName: text,
          checkingAidEngineeringChangeLevelDated: new Date("12/12/12"),
        },
      },
      { upsert: true }
    );
    // new PartDetails({ user: _id, partName: text }).save();
  });
  socket.on("check", async (data) => {
    const { check, user } = data;
    const id = await User.findOne({ username: user }).select("_id");
    socket.emit("result", { user });
    return PartDetails.updateOne(
      { user: id },
      { $set: { safetyAndGovermentChanges: check } },
      { upsert: true }
    );
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
