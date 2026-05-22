import mysql from "mysql2/promise";

const pool = mysql.createPool({

    host: "localhost",

    user: "root",

    password: "root123",

    database: "investor_portal",

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0
});

export default pool;