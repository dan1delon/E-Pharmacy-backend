const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 

const app = express();

connectDB();

app.use(cors());
app.use(express.json()); 


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));


app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

module.exports = app;
