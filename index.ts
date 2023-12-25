import express, {Express} from "express";
import app, {port} from "./config/app";
import auth from "./auths/auth";
import register from "./auths/register";
import login from "./auths/login";
import { AuthUserRequest } from "./config/interfaces";
import { User } from "./models/user";

import taskRoute from "./routes/tasksRoute"

//ROUTES & LOGIC

app.get("/", (req, res) => {
    res.send("Hello from express from typescript");
});

app.post('/register', register);

app.post('/login', login);

app.get("/user", auth, (req, res) => {
    res.status(201).json((req as AuthUserRequest).user); 
});

app.use(taskRoute);

app.listen(port, () => {
    console.log("App started on port " + port);
})