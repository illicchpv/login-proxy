import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const CLIENT_SECRET = "fa65447f527bfd023d5ffc0c553734a682b02033";

const configJson = [
  {
    user: '001pv',
    secret: "fa65447f527bfd023d5ffc0c553734a682b02033",
    getAccessUrl: 'https://github.com/login/oauth/access_token',
    getUserUrl: 'https://api.github.com/user',
  }
]

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.get('/getAccess', async (req, res) => {
  console.log('getAccess ------------');

  const user = req.query.user;
  const usr = configJson.find(u => u.user === user);
  if (!usr) {
    res.json({ error: 'user not found' });
    return;
  }
  const url = usr.getAccessUrl;
  // console.log('url: ', url);
  const secret = usr.secret;
  // console.log('secret: ', secret);

  const code = req.query.code;
  const client_id = req.query.client_id;
  // console.log('getAccess code: ', code, 'client_id: ', client_id);

  const params = `?code=${code}&client_id=${client_id}&client_secret=${secret}`;
  // console.log('params: ', params);
  await fetch(url + params, {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      "Accept": "application/json",
    },
  })
    .then(res => {
      // console.log('res: ', res);
      return res.json();
    })
    .then(data => {
      // console.log('getAccess data: ', data);
      res.json(data);
    })
    .catch(error => {
      console.error('getAccess error: ', error);
    });

});

app.get('/getUser', async (req, res) => {
  console.log('getUser ------------ ');

  const user = req.query.user;
  const usr = configJson.find(u => u.user === user);
  if (!usr) {
    res.json({ error: 'user not found' });
    return;
  }
  const url = usr.getUserUrl;
  // console.log('url: ', url);

  const auth = req.get("Authorization");
  await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": auth, // Bearer <token>
    },
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      // console.log('getUser data: ', data);
      res.json(data);
    })
    .catch(error => {
      console.error('getUser error: ', error);
    });

});

/*
app.get('/getAccessToken', async (req, res) => {

  const code = req.query.code;
  const client_id = req.query.client_id;
  console.log('getAccessToken code: ', code, 'client_id: ', client_id);

  const params = `?code=${code}&client_id=${client_id}&client_secret=${CLIENT_SECRET}`;
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
*/

app.listen(4000, function () {
  console.log("CORS Server started on port 4000");
});

