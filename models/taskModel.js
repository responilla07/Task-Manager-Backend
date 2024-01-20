import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "incomplete",
  },
  due_date: {
    type: Date,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export const TaskModel = (json) => {
  return {
    id: json["id"],

    title: json["title"],
    description: json["description"],
    status: json["status"],

    due_date: json["due_date"],
    archived: json["archived"],
    date_created: json["date_created"],
  };
};
