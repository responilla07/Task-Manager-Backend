import {
  addNewTask,
  getTask,
  getAllTask,
  deleteSelectedTask,
  updateSelectedTask,
} from "../controllers/taskControllers.js";

const routes = (app) => {
  app.route("/tasks").post(addNewTask);
  app.route("/tasks").get(getAllTask);
  app.route("/tasks/:id").get(getTask);
  app.route("/tasks/:id").delete(deleteSelectedTask);
  app.route("/tasks/:id").patch(updateSelectedTask);
};

export default routes;
