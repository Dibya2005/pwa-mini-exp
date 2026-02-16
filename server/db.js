import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "db17012005",
  database: "expense_db",
});

export default pool;
