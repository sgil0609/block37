const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.get("/items", async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/items", async (req, res) => {
  const { search } = req.query;

  try {
    const items = await prisma.item.findMany({
      where: {
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }),
      },
      include: {
        reviews: true,
      },
    });

    const itemsWithAvgRating = items.map((item) => {
      const avgRating =
        item.reviews.reduce((acc, review) => acc + review.rating, 0) /
        item.reviews.length;
      return {
        ...item,
        avgRating: item.reviews.length > 0 ? avgRating : "No reviews yet",
        reviews: item.reviews,
      };
    });

    res.json(itemsWithAvgRating);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});
app.get("/items/:itemId", async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: parseInt(itemId),
      },
      include: {
        reviews: true,
      },
    });

    if (item) {
      const avgRating =
        item.reviews.reduce((acc, review) => acc + review.rating, 0) /
          item.reviews.length || 0;

      res.json({
        ...item,
        avgRating: avgRating || "No reviews yet",
      });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch item details" });
  }
});

module.exports = router;