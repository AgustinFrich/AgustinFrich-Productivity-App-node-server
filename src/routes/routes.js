const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = (app) => {
  app.post("/api/register", async (req, res) => {
    try {
      const newPassword = await bcrypt.hash(req.body.password, 10);
      await User.create({
        username: req.body.username,
        password: newPassword,
      });

      res.json({ status: "ok" });
    } catch (err) {
      res.json({ status: "error", error: "Duplicate email" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.json({ status: "error", error: "Invalid login", user: false });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      const token = jwt.sign(
        {
          username: user.username,
        },
        process.env.SECRET
      );
      console.log("OK");
      return res.json({ status: "ok", user: token });
    } else {
      return res.json({ status: "error", user: false });
    }
  });

  app.get("/api/userdata", async (req, res) => {
    const token = req.headers["x-access-token"];

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const username = decoded.username;
      const user = await User.findOne({ username: username });
      const study = user.study === undefined ? 0 : user.study;
      const work = user.work === undefined ? 0 : user.work;
      const hobbies = user.hobbies === undefined ? 0 : user.hobbies;
      return res.json({
        status: "ok",
        study: study,
        work: work,
        hobbies: hobbies,
      });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: "invalid token" });
    }
  });

  app.post("/api/userdata", async (req, res) => {
    const token = req.headers["x-access-token"];
    console.log(req.body);
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const username = decoded.username;
      await User.updateOne(
        { username: username },
        {
          $set: {
            study: req.body.study,
            work: req.body.work,
            hobbies: req.body.hobbies,
          },
        }
      );

      return res.json({ status: "ok" });
    } catch (error) {
      console.log(error);
      res.json({ status: "error", error: "invalid token" });
    }
  });
};
