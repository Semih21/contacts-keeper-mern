const express = require("express");
const app = express();
const connectDB = require("./config/db");

//CONNECT Database
connectDB();

app.get("/", (req, res) => {
  res.json({ mesg: "Welcome to Contact Keeper API..." });
});

//Middelware

app.use(express.json({ extended: false }));

//DEFINE ROUTES

app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
