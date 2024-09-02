import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
// const express = require("express");
// const cors = require("cors");

// // https://www.npmjs.com/package/node-fetch
// const fetch = (...args) => import('node-fetch')
//   .then(({default: fetch}) => fetch(...args));
// const bodyParser = require("body-parser");

const CLIENT_ID = "Ov23ctVnUkimxLxTvxSy";
const CLIENT_SECRET = "fa65447f527bfd023d5ffc0c553734a682b02033";

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.get('/getAccessToken', async (req, res) => {

  const code = req.query.code;
  console.log('getAccessToken code: ', code);
  const params = `?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  console.log('params: ', params);
  await fetch(`https://github.com/login/oauth/access_token` + params, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      "Accept": "application/json",
    },
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log('getAccessToken data: ', data);
      res.json(data);
    })
    .catch(error => {
      console.error('getAccessToken error: ', error);
    });

});

app.get('/getUserData', async (req, res) => {
  const auth = req.get("Authorization");
  await fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      "Authorization": auth, // Bearer <token>
    },
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log('getUserData data: ', data);
      res.json(data);
    })
    .catch(error => {
      console.error('getUserData error: ', error);
    });

});

app.listen(4000, function () {
  console.log("CORS Server started on port 4000");
});

