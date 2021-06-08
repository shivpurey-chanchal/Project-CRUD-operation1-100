const mysql = require("mysql");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
connection.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(connection.state, "i m state of connection!!!");
  }
});
class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }
  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM people;";
        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      console.log(response, "i m getAllData()");
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  async insertNewName(name) {
    try {
      const date_added = new Date();
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO people (FirstName, date_added) VALUES (?, ?);";
        connection.query(query, [name, date_added], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      console.log(insertId, "i m insertNewName()");
      return {
        id: insertId,
        name: name,
        date_added: date_added,
      };
    } catch (error) {
      console.log(error.message);
    }
  }
  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM people WHERE id = ?";
        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      console.log(response, "i m deleteRowById()");
      return response === 1 ? true : false;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
  async updateNameById(id, name) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE people SET FirstName = ? WHERE id = ?";
        connection.query(query, [name, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });
      console.log(response, "i m updateNameByID()");
      return response === 1 ? true : false
    } catch (error) {
      console.log(error.message);
      return false
    }
  }
  async searchByName(name){
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM people WHERE FirstName = ?;";
        connection.query(query, [name], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });
      console.log(response, "i m searchByName()");
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
}
module.exports = DbService;
