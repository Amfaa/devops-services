//provides stronger error checking and more secure code
"use strict";

// web server framework for Node.js applications
const express = require("express");
// allows requests from web pages hosted on other domains
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const fileName = "app.js";

const { HttpException } = require("./HttpException.utils");

const app = express();
const port = 8083;

// Parses incoming JSON requests
app.use(express.json());
app.use(cors());

/** add reqId to api call */
app.use(function (req, res, next) {
  res.locals.reqId = uuidv4();
  next();
});

app.post("/add-sub", (req, res) => {
  const {a=0, b=0} = req.body;
  console.log(`A: ${a}, B: ${b}`);

  //////////////////////////////////////
  // Your logic to call S1 and S2 services to get the addition and subtraction
  //////////////////////////////////////
try {
    // Replace these URLs with the actual endpoints of your S1 and S2 services
    const s1Url = "http://localhost:8081/add"; // Example URL http://s1.ServerIP:PortNo/route
    const s2Url = "http://localhost:8082/sub"; // Example URL http://s2.ServerIP:PortNo/route

    // Make HTTP requests to S1 and S2 services
    const responseS1 = await axios.get(s1Url, {
      params: {
        a: a,
        b: b,
      },
    });

    const responseS2 = await axios.get(s2Url, {
      params: {
        a: a,
        b: b,
      },
    });

    // Calculate addition and subtraction based on the responses
    const additionResult = responseS1.data.result;
    const subtractionResult = responseS2.data.result;

    res.json({
      sum: additionResult,
      difference: subtractionResult,
});

/** 404 error */
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  return res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log("Start", fileName, `S3 App listening at http://localhost:${port}`);
});
