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

            const result = (await newTask.save())[0]

            const orderSetUp = (await Task.setOrderForTask(result.insertId))[0];

            console.log(orderSetUp.warnings);
            

            const warnings = result.warningStatus;

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

    router.route("/arragebyduration")
    .post(auth, async (req, res) => {
        const userid = ((req as AuthUserRequest).user as User).id;
        if (userid !== undefined) {
            const tasksByUser: Array<Task>= (await Task.getForUser(userid))[0];

            var prevDuration = "00:00"
            var prevStartDate = tasksByUser[0].startDate;
            var lastUpdate

            tasksByUser.forEach((task) => {
                var newStartDate = prevStartDate;
                const hours = newStartDate.getHours() + Number(prevDuration.slice(0, 2));
                const minutes = newStartDate.getMinutes() + Number(prevDuration.slice(3,5))

                newStartDate.setHours(hours);
                newStartDate.setMinutes(minutes);
                                
                prevStartDate = newStartDate;
                prevDuration = task.duration;

                task.startDate = newStartDate;

                lastUpdate = Task.update(task);
            });

            await lastUpdate;

            res.status(201).json({err: "ok"});
        } else {
            res.status(400).json({ err: "Could not idetntify user" })
        }
    });

export default router;