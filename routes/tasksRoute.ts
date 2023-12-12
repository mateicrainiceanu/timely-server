import express, { Router } from "express";
import { AuthUserRequest } from "../config/interfaces";
import auth from "../auths/auth";
import Task from "../models/task";
import { User } from "../models/user";

const router: Router = express.Router();

router.route("/tasks")
    .get(auth, async (req, res) => {
        const id = ((req as AuthUserRequest).user as User).id;

        if (id !== undefined) {
            const tasksByUser = await Task.getForUser(id);
            res.status(201).json({ tasks: tasksByUser });
        } else {
            res.status(400).json({ err: "Could not idetntify user" })
        }

    })
    .post(auth, async (req, res) => {

        const id = ((req as AuthUserRequest).user as User).id;

        if (id !== undefined) {
            let newTask = new Task({
                ...req.body,
                userId: id,
                status: "NotStarted"
            });

            const warnings = (await newTask.save())[0].warningStatus;

            if (!warnings) {
                res.status(201).send("ok")
            } else {
                res.status(500).json({ err: "Could not save your task!" })
            }
        } else {
            res.status(400).json({ err: "Could not verify user!" })
        }
    })
    .patch(auth, async(req, res) => {
        //MAYBE ADD: verification of user ownership of that task
        const currentTask = await Task.getTaskForId(req.body.taskId);
        
        const newTask = {...currentTask, ...req.body};

        const result = (await Task.update(newTask))[0]; 

        if (result.warningStatus===0) {
            res.status(201).send();
        } else {
            res.status(500).json({err: "failed to update"})
        }        
    })
    .delete(auth, async (req, res) => {
        //MAYBE ADD: verification of user ownership of that task
        const warnings = (await Task.deleteTaskWithId(req.body.taskId))[0].warningStatus;

        if (!warnings) {
            res.status(201).send("ok")
        } else {
            res.status(500).json({err: "There was an error deleting the file."})
        }
    });

export default router;