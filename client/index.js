document.addEventListener("DOMContentLoaded", (event) => {
  fetch("http://localhost:3000/getAllData")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
  console.log("DOM fully loaded and parsed");
});

document.querySelector("table tbody").addEventListener("click", (event) => {
  console.log(event.target, "i m target...");
  if (event.target.className === "delete-row-btn") {
    deleteRowById(event.target.dataset.id);
  }
  if (event.target.className === "edit-row-btn") {
    handleEditRow(event.target.dataset.id);
    console.log(event.target.dataset.id, "dataset..id");
  }
});

const updateBtn = document.querySelector("#update-row-btn");

const searchBtn = document.querySelector('#search-btn')
searchBtn.onclick = function () {
  const searchValue = document.querySelector("#search-input").value;
  fetch("http://localhost:3000/search/"+ searchValue)
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
}

function deleteRowById(id) {
  fetch("http://localhost:3000/delete/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

function handleEditRow(id) {
  const updateSection = document.querySelector("#update-row");
  updateSection.hidden = false;
  document.querySelector("#update-row-btn").dataset.id = id;
}

updateBtn.onclick = function () {
  const updateNameInput = document.querySelector("#update-name-input");
  console.log( updateNameInput.value, document.querySelector("#update-row-btn").dataset.id, "input value");
  fetch("http://localhost:3000/update", {
    headers: {
      "Content-type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      id: document.querySelector("#update-row-btn").dataset.id,
      name: updateNameInput.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
};
const addBtn = document.querySelector("#add-name-btn");
addBtn.onclick = function () {
  const nameInput = document.querySelector("#name-input");
  const name = nameInput.value;
  nameInput.value = "";
  fetch("http://localhost:3000/insert", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((data) => insertDataByRow(data["data"]))
    .catch((err) => console.log(err));
};

//dynamic insert data
function insertDataByRow(data) {
  console.log(data, "insertDataByRow()");
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let tableHtml = "<tr>";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "date_added") {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHtml += `<td>${data[key]}</td>`;
    }
  }
  tableHtml += `<td><button class='delete-row-btn' data-id=${data.id}>Delete</button></td>`;
  tableHtml += `<td><button class='edit-row-btn' data-id=${data.id}>Edit</button></td>`;
  tableHtml += "</tr>";
  if (isTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
}
function loadHTMLTable(data) {
  console.log(data);
  const table = document.querySelector("table tbody");
  if (data.length === 0) {
    table.innerHTML = `<tr><td class='no-data' colspan='5'>no data</td></tr>`;
    return;
  }
  let tableHtml = "";
  data.forEach(function ({ id, FirstName, date_added }) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${FirstName}</td>`;
    tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
    tableHtml += `<td><button class='delete-row-btn' data-id=${id}>Delete</button></td>`;
    tableHtml += `<td><button class='edit-row-btn' data-id=${id}>Edit</button></td>`;
    tableHtml += "</tr>";
  });
  table.innerHTML = tableHtml;
}
