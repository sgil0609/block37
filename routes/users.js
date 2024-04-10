const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require('../prisma');
const JWT_SECRET = "your_jwt_secret";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Email or password is incorrect");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: "This is protected data" });
  });

  module.exports = router;