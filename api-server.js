const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");
const authConfig = require("./src/auth_config.json");
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();

const port = process.env.API_PORT || 4000;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

const jwtCheck = auth({
  audience: 'https://auth-api/api/v2/',
  issuerBaseURL: 'https://dev-7xaenvaikvxldmqm.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

// if (
//   !authConfig.domain ||
//   !authConfig.audience ||
//   authConfig.audience === "YOUR_API_IDENTIFIER"
// ) {
//   console.log(
//     "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
//   );

//   process.exit();
// }

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));


// const checkJwt = auth({
//   audience: authConfig.audience,
//   issuerBaseURL: `https://${authConfig.domain}/`,
//   algorithms: ["RS256"],
// });

// app.get("/api/external", checkJwt, (req, res) => {
//   res.send({
//     msg: "Your access token was successfully validated!",
//   });
// });

app.get("/", (req, res) => {
  res.send({
    msg: "Hello from index",
  });
});

app.get("/protected", async (req, res) => {
 try {
  const accessToken = req.headers.authorization.split(' ')[1];
  const response =  await axios.get('https://dev-7xaenvaikvxldmqm.us.auth0.com/userinfo',{
    headers:{
      authorization : `Bearer ${accessToken}`
    }
  })
  const userinfo = response.data;
  res.send(userinfo);
 } catch (error) {
  
 }
});


app.listen(port, () => console.log(`API Server listening on port ${port}`));
