const express = require("express");
const app = express();
const port = 3000;

const itemsRoute = require("./routes/items");
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");
const usersRoute = require("./routes/update_review");

app.use(express.json());

app.use('/items', itemsRoute);
app.use('/reviews', reviewsRoute);
app.use('/users', usersRoute);
app.use('/update_review', usersRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
