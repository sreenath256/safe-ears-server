require("dotenv").config();
const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Add it back when communicating with react
const logger = require("morgan");
const mongoose = require("mongoose");

const app = express()

// Mounting necessary middlewares.
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Setting up cors
const allowedOrigins = [process.env.CLIENT_URL];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(logger("dev"));

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");


app.use("/api/admin",adminRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/user", userRoutes);



mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on Port: ${process.env.PORT} - DB Connected`);
        });
    })
    .catch((error) => {
        console.log(error);
    });