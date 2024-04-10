const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const authenticateToken = require('../middleware/token');

app.post("/reviews", authenticateToken, async (req, res) => {
  const { itemId, content, rating } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the user has already reviewed the item
    const existingReview = await prisma.review.findFirst({
      where: {
        itemId: itemId,
        userId: userId,
      },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this item" });
    }

    // Create a new review
    const review = await prisma.review.create({
      data: {
        itemId,
        userId,
        content,
        rating,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

module.exports = router;