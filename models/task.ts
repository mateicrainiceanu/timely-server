import { db } from "../config/db"
import "mysqldate";

interface Task {
    id?: number;
    name: string;
    status: "NotStarted" | "InProgress" | "Finished"
    userId: number;
    startDate: Date;
    duration: string;
    showKey?: number;
}

class Task {
    constructor(taskData: Task) {
        this.name = taskData.name;
        this.status = taskData.status;
        this.userId = taskData.userId;
        this.startDate = taskData.startDate;
        this.duration = taskData.duration;
    }

    async save() {
        let sql = `
        INSERT INTO tasks (name, status, userId, startDate, duration)
        VALUES (
            '${this.name}',
            '${this.status}',
            ${this.userId},
            '${this.startDate}',
            '${this.duration}'
        )`

        return db.execute(sql);
    };

    static setOrderForTask(taskId: number) {
        let sql = `UPDATE tasks SET showKey = ${taskId}.00 WHERE id = ${taskId};`
        return db.execute(sql);
    }

    static update(task: Task) {

        const theDateInDateFormat = new Date(new Date(task.startDate as Date))

        var date = (theDateInDateFormat as any).toMysqlDate();

        let sql = `
        UPDATE tasks 
        SET name = '${task.name}', status = '${task.status}', startDate = '${date}', duration = '${task.duration}', showKey=${task.showKey}
        WHERE id = ${task.id};`

        return (db.execute(sql));
    }

    static getForUser(userId: number) {
        let sql = `
        SELECT * FROM tasks WHERE 
        userid = ${userId}
        ORDER BY showKey;
        ;`

        return db.execute(sql);
    };

    static deleteTaskWithId(id: number) {
        let sql = `
        DELETE FROM tasks
        WHERE id = ${id};`;
        return db.execute(sql);
    }

    static async getTaskForId(taskId: number) {
        let sql = `
        SELECT * FROM tasks WHERE id = ${taskId}
        ;`

        const results = (await db.execute(sql))[0];

        if (results.length > 0) {
            return results[0] as Task;
        } else {
            console.log("not task with this id was found");
            throw('');
        }
    }

};

export default Task;