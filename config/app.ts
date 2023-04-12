import express, {Express, Request, Response} from "express";
import { AuthUserRequest } from "./interfaces";
import bodyParser from "body-parser";
import cors from "cors"
import * as dotenv from 'dotenv';
dotenv.config()

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

export default app;
export {port};