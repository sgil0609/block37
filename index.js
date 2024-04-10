const express = require("express");
const app = express();
const port = 3000;

const itemsRoute = require("./routes/items");
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");

app.use(express.json());

app.use('/items', itemsRoute);
app.use('/reviews', reviewsRoute);
app.use('/users', usersRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
