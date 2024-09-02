import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
let secrets = [];
for (let i = 0; i < 10; i++) {
  const s = process.env['SECRET' + i];
  if (s) {
    const sps = s.split('/');
    sps.forEach(sp => {
      // console.log('sp: ', sp);
      if (sp.includes(':')) {
        let [key, val] = sp.split(':');
        key = key.trim();
        val = val.trim();
        // console.log('val: ', val);
        // console.log('key: ', key);
        if(key && val) {
          const prev = secrets.find(s => s.key === key)
          if(!prev)
            secrets.push({key, val});
          else
            prev.val = val;
        }
      }
    });
  }
}
// secrets.forEach(el => {
//   console.log('secrets.el: ', el);
// });

const configJson = [
  {
    user: '001pv',
    secret: "",
    getAccessUrl: 'https://github.com/login/oauth/access_token',
    getUserUrl: 'https://api.github.com/user',
  }
];
configJson.forEach(el => {
  el.secret = secrets.find(s => s.key === el.user).val;
})
// console.log('configJson: ', configJson);


// // process.env.USER_ID
// console.log('process.env: ', process.env);
// console.log('process.env.USER_ID: ', process.env.USER_ID);

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

app.get('/getAccess', async (req, res) => {
  console.log('getAccess ------------');

  const user = req.query.user;
  const usr = configJson.find(u => u.user === user);
  if (!usr) {
    res.json({error: 'user not found'});
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
    res.json({error: 'user not found'});
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

