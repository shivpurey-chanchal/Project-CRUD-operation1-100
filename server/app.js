const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./dbService");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/insert", (request, response) => {
  const { name } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.insertNewName(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

//read
app.get("/getAllData", (request, response) => {
  //get object
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData();
  //funtion return the promise
  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});
//update
app.patch("/update", (request, response) => {
  console.log(request.body);
  const { id, name } = request.body;
  console.log(id, name, "update body");
  const db = dbService.getDbServiceInstance();
  const result = db.updateNameById(id, name);
  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

//delete
app.delete("/delete/:id", (request, response) => {
  console.log(request.params, "i m id");
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRowById(id);
  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

//search
app.get("/search/:name", (request, response) => {
  console.log(request.params, "i m name");
  const { name } = request.params;
  const db = dbService.getDbServiceInstance();
  const result = db.searchByName(name)
  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.listen(process.env.PORT, () => {
  console.log("port is ...", process.env.PORT);
});
