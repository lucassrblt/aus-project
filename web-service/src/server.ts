import express, { json } from "express";
import cors from "cors";
import { getFirstOffres, getOffreDashboard, getTopMetier } from "./database";

const port = 3000;
const app = express();
const router = require('./routes')

// const jwtCheck = auth({
//   audience: "api.rouge.aus.floless.fr",
//   issuerBaseURL: "https://rouge-aus.eu.auth0.com/",
//   tokenSigningAlg: "RS256",
// });

app.use(cors());
// enforce that all incoming requests are authenticated
// app.use(jwtCheck);
// parse body to json
app.use(json())
app.use('/', router)

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
