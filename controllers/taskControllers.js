import mongoose from "mongoose";

import { TaskSchema, TaskModel } from "../models/taskModel.js";
import pool from "../config/sql.js";

const Task = mongoose.model("Task", TaskSchema);
var config = pool();

export const addNewTask = (req, res) => {
  let newTask = new Task(req.body);

  let validate = newTask.validateSync();

  if (validate) {
    res.status(400).send({ message: "Invalid data" });
  } else {
    config.getConnection((err, connection) => {
      if (err) return res.status(500).send({ message: err });
      connection.query("INSERT INTO tasks SET ?", req.body, (err, rows) => {
        connection.release();
        if (err) return res.status(406).send({ message: err });
        req.body = newTask.toJSON();
        req.body.id = rows.insertId;
        var task = TaskModel(req.body);
        return res.send({
          message: "Task successfully created!",
          data: task,
        });
      });
    });
  }
};

export const getTask = (req, res) => {
  req.body.id = req.params["id"];
  let keys = Object.keys(TaskModel({}));

  if (!req.body.id) {
    res.status(400).send({ message: "Invalid data" });
  } else {
    config.getConnection((err, connection) => {
      if (err) return res.status(500).send(err);
      connection.query(
        `Select ${String(
          keys
        )} FROM tasks WHERE archived = false  AND id = ${String(req.body.id)}`,
        (err, rows) => {
          connection.release();
          if (err) return res.status(406).send(err);
          if (rows.length < 1) {
            return res.status(404).send({ message: "Not Found!" });
          }
          return res.send(rows[0]);
        }
      );
    });
  }
};

export const getAllTask = (req, res) => {
  let keys = Object.keys(TaskModel({}));

  config.getConnection((err, connection) => {
    if (err) return res.status(500).send({ message: err });
    connection.query(
      `Select ${String(keys)} FROM tasks WHERE archived = false ORDER BY date_created DESC`,
      (err, rows) => {
        connection.release();
        if (err) return res.status(406).send({ message: err });
        return res.send(rows);
      }
    );
  });
};

export const deleteSelectedTask = (req, res) => {
  req.body.id = req.params["id"];
  if (!req.body.id) {
    res.status(400).send({ message: "Invalid data" });
  } else {
    config.getConnection((err, connection) => {
      if (err) return res.status(500).send({ message: err });
      connection.query(
        `UPDATE tasks SET archived=1 WHERE tasks.id=${String(req.body.id)}`,
        (err, rows) => {
          connection.release();
          if (err) return res.status(406).send({ message: err });
          return res.send({ message: "Task successfully deleted!" });
        }
      );
    });
  }
};

export const updateSelectedTask = (req, res) => {
  req.body.id = parseInt(req.params["id"]);
  var data = TaskModel(req.body);
  var params = "";

  for (const [key, value] of Object.entries(data)) {
    if (value && value.length !== 0) {
      params += key;
      params += `='${value}',`;
    }
  }
  params = params.slice(0, -1);

  if (!req.body.id) {
    res.status(400).send({ message: "Invalid data" });
  } else {
    config.getConnection((err, connection) => {
      if (err) return res.status(500).send({ message: err });
      connection.query(
        `UPDATE tasks SET ${String(
          params
        )} WHERE archived = false AND tasks.id=${String(req.body.id)}`,
        (err, rows) => {
          connection.release();
          if (err) return res.status(406).send({ message: err });
          if (rows.affectedRows < 1) {
            return res.status(400).send({ message: "Not Found!" });
          }
          console.log(rows);
          return res.send({
            message: "Task successfully updated!",
            data: data,
          });
        }
      );
    });
  }
};
