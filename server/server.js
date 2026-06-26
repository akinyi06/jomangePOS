const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({origin:"http://localhost:3000"}));
app.use(express.json());

// Routes
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/products");
const salesRouter = require("./routes/sales");
const reportsRouter = require("./routes/reports");
const inventoryRouter=require("./routes/inventory");
const usersRouter= require("./routes/users");
const auditRouter=require("./routes/audit");



app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/sales", salesRouter);
app.use("/reports", reportsRouter);
app.use("/users", usersRouter);
app.use("/audit", auditRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
