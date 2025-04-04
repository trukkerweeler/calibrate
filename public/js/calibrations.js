import { loadHeaderFooter, myport, getUserValue } from "./utils.mjs";

loadHeaderFooter();
const port = myport();
const user = await getUserValue();


const calibrationUrl = `http://localhost:${port}/calibrate`;
let mainElement = document.getElementById("main-content");
// read the id from the URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

const createCalHeader = document.querySelector("#create-cal-header");
if (createCalHeader) {
  createCalHeader.innerHTML = "Create Calibration for Device: " + id;
} else {
    console.error("Header element with id 'create-cal-header' not found.");
}

// Make the page header div
function makePageHeaderDiv() {
  const divTitle = document.createElement("div");
  divTitle.classList.add("page-header-div");
  const pageTitle = document.createElement("h1");
  pageTitle.classList.add("page-header");
  pageTitle.innerHTML = "Calibrations List: " + id;
  divTitle.appendChild(pageTitle);
  // Add the button to the header div
  let AddCalBtn = document.createElement("button");
  AddCalBtn.type = "submit";
  AddCalBtn.classList.add("btn", "btn-plus");
  AddCalBtn.id = "btnAddCal";
AddCalBtn.textContent = "+ Add Cal";
// AddCalBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     const createCalibrationDialog = document.querySelector("[create-calibration-dialog]");
//     if (createCalibrationDialog) {
//         createCalibrationDialog.showModal();
//     } else {
//         console.error("Dialog element with id 'create-calibration-dialog' not found.");
//     }
// });
  AddCalBtn.setAttribute("title", "Click to add a new calibration");
  divTitle.appendChild(AddCalBtn);
  // append the header div to the main element
  mainElement.appendChild(divTitle);
}
makePageHeaderDiv();

function getRecords() {
    // Clear the main element
    Array.from(mainElement.children).forEach((child) => {
        if (!child.hasAttribute("create-calibration-dialog")) {
            mainElement.removeChild(child);
        }
    });
    // Create the header div again
    makePageHeaderDiv();
    
    fetch(`${calibrationUrl}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let myFields = [
          "CALIBRATION_ID",
          "DEVICE_ID",
          "CALIBRATED_BY",
          "EMPLOYEE_ID",
          "SUPPLIER_ID",
          "CALIBRATE_DATE",
          "RESULT",
        ];
        let table = document.createElement("table");
        table.className = "table table-striped table-bordered table-hover";

        // Create table header
        let thead = document.createElement("thead");
        let headerRow = document.createElement("tr");
        myFields.forEach((field) => {
          let th = document.createElement("th");
          th.textContent = field.replace(/_/g, " ");
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        let tbody = document.createElement("tbody");
        if (data.length === 0) {
            let row = document.createElement("tr");
            let td = document.createElement("td");
            td.colSpan = myFields.length;
            td.textContent = "No records found";
            td.style.textAlign = "center";
            row.appendChild(td);
            tbody.appendChild(row);
        }
        data.forEach((record) => {
          let row = document.createElement("tr");
          myFields.forEach((field) => {
            let td = document.createElement("td");
            if (record[field] === "I") {
              td.textContent = "Internal";
            } else if (record[field] === "P") {
                td.textContent = "Passed";
            } else if (field.toLowerCase().endsWith("date") && record[field]) {
              const date = new Date(record[field]);
              td.textContent = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            } else {
              td.textContent = record[field] || "";
            }
            row.appendChild(td);
          });
          tbody.appendChild(row);
        });
        table.appendChild(tbody);

        // Append the table to the main element
        mainElement.appendChild(table);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
      });
    }
getRecords();

// Add event listener to the button
const AddCalBtn = document.getElementById("btnAddCal");
AddCalBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const createCalibrationDialog = document.querySelector("[create-calibration-dialog]");
    if (createCalibrationDialog) {
        createCalibrationDialog.showModal();
    } else {
        console.error("Dialog element with id 'create-calibration-dialog' not found.");
    }
});

// Listen for the cancel-add-calibration event
const cancelAddCal = document.getElementById("cancel-add-calibration");
cancelAddCal.addEventListener("click", (e) => {
    e.preventDefault();
    const createCalibrationDialog = document.querySelector("[create-calibration-dialog]");
    if (createCalibrationDialog) {
        createCalibrationDialog.close();
    } else {
        console.error("Dialog element with id 'create-calibration-dialog' not found.");
    }
});

// Listen for the submit-add-calibration event
const submitAddCal = document.getElementById("submit-add-calibration");
submitAddCal.addEventListener("click", async (e) => {
    e.preventDefault();
    let nextId = await fetch(calibrationUrl + '/nextId', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        JSON.stringify(data);
        return data;
    });



    const createCalibrationDialog = document.querySelector("[create-calibration-dialog]");
    if (createCalibrationDialog) {
        const form = createCalibrationDialog.querySelector("form");
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data["CALIBRATION_ID"] = nextId;
        data["DEVICE_ID"] = id;
        data["CREATE_BY"] = user;
        const now = new Date();
        const mysqlDate = now.toISOString().slice(0, 19).replace('T', ' ');
        data["CREATE_DATE"] = mysqlDate;
        if (data["EMPLOYEE_ID"]) {
            data["EMPLOYEE_ID"] = data["EMPLOYEE_ID"].toUpperCase();
        }
        if (data["SUPPLIER_ID"]) {
            data["SUPPLIER_ID"] = data["SUPPLIER_ID"].toUpperCase();
        }
        // console.log(data);
        
        // Send the data to the server
        console.log("calibrationUrl", calibrationUrl);
        fetch(`${calibrationUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                getRecords();
                createCalibrationDialog.close();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
            // update the Device table NEXT_DATE with calibration date plus standard interval
            alert("Calibration created successfully!, need to update the Device table NEXT_DATE with calibration date plus standard interval");
            // todo: get the standard interval from the device table
    } else {
        console.error("Dialog element with id 'create-calibration-dialog' not found.");
    }
});
