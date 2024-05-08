const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticateToken = require('../middleware/token');

router.post("/reviews", authenticateToken, async (req, res) => {
  const { itemId, content, rating } = req.body;
  const userId = req.user.userId;

  try {
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