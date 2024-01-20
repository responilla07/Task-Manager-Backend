import mysql from "mysql";

const pool = () => {
  return mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "task_management",
  });
};

export default pool;
