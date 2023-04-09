import express, {Express, Request, Response} from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello from express from typesxript");
})

app.get("/hi", (req, res) => {
    res.send("HI")
})

app.listen(port, () => {
    console.log("App started on port " + port);
})