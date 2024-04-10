const express = require('express');
const router = express.Router();
const prisma = require('../prisma');
const authenticateToken = require('../middleware/token');


router.put('/:reviewId', authenticateToken, async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user.userId; 

  try {
    const review = await prisma.review.findUnique({
      where: {
        id: parseInt(reviewId),
      },
    });

    if (!review || review.userId !== userId) {
      return res.status(403).json({ message: "You can only edit your own reviews." });
    }
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: { content, rating },
    });

    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update review" });
  }
});

module.exports = router;
