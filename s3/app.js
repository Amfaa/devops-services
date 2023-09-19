"use strict";

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fileName = "app.js";
const axios = require("axios"); // Import the axios library
const { HttpException } = require("./HttpException.utils");

const app = express();
const port = 8083;

app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.locals.reqId = uuidv4();
  next();
});

app.post("/add-sub", async (req, res) => {
  const { a = 0, b = 0 } = req.body;
  console.log(`A: ${a}, B: ${b}`);

  
               // My Logic
  try {
    // Replace these URLs with the actual endpoints of your S1 and S2 services
    const s1Url = process.env.S1_URL // Example URL
    const s2Url = process.env.S2_URL // Example URL
    console.log(s1Url, s2Url)

    // Make HTTP requests to S1 and S2 services
    const responseS1 = await axios.post(s1Url, {
      a: a,
      b: b,
    });
    console.log(responseS1)

    const responseS2 = await axios.post(s2Url, {
        a: a,
        b: b,
    });
    console.log(responseS2)

    // Calculate addition and subtraction based on the responses
    const additionResult = responseS1.data;
    const subtractionResult = responseS2.data;

    res.json({
      sum: additionResult,
      difference: subtractionResult,
    });
  } catch (error) {
    // Handle errors here
    console.error("Error calling services:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  return res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log("Start", fileName, `S3 App listening at http://localhost:${port}`);
});
