import { loadHeaderFooter, myport } from './utils.mjs';

loadHeaderFooter()
const port = myport();

// read the url parameter
const urlParams = new URLSearchParams(window.location.search);
const deviceId = urlParams.get('id');

const deviceUrl = `http://localhost:${port}/device/${deviceId}`;

function getRecords() {
    fetch(deviceUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            let mainElement = document.getElementById("main-content");
            const divTitle = document.createElement("div");
            divTitle.classList.add("page-header-div");

            let pagetitlewithId = `Device Detail - ${data["DEVICE_ID"]}`;
            let pageTitle = document.createElement("h1");
            pageTitle.classList.add("page-header");
            pageTitle.innerHTML = pagetitlewithId;
            divTitle.appendChild(pageTitle);
            let calibrationsBtn = document.createElement("button");
            calibrationsBtn.classList.add("btn", "btn-primary", "calibrations-button");
            calibrationsBtn.innerHTML = "View Calibrations";
            calibrationsBtn.addEventListener("click", () => {
                window.location.href = `./calibrations.html?id=${data["DEVICE_ID"]}`;
            });
            divTitle.appendChild(calibrationsBtn);
            mainElement.appendChild(divTitle);
            
            
            let deviceFields = ["ASSI_EMPLOYEE_ID", "DAYS_REMAINING", "DEVICE_ID", "NAME", "DEVICE_TYPE", "MANUFACTURER_NAME", "MODEL", "PURCHASE_DATE", "PURCHASE_PRICE", "SERIAL_NUMBER", "STATUS", "MAJOR_LOCATION", "MINOR_LOCATION", "NEXT_DATE", "SPECIAL_INTERVAL", "STANDARD_INTERVAL", "WARNING_INTERVAL"];
            let sectionsDiv = document.createElement("div");
            sectionsDiv.classList.add("sections-div");

            let deviceSection = document.createElement("section");
            let deviceDiv = document.createElement("div");
            deviceDiv.classList.add("section-header-edit");
            deviceDiv.innerHTML = `<h2>Device Info</h2>`;
            
            let editDeviceButton = document.createElement("button");
            editDeviceButton.classList.add("btn", "btn-primary", "edit-button");
            editDeviceButton.id = "btnEditDevice";
            editDeviceButton.textContent = "Edit";
            editDeviceButton.addEventListener("click", (e) => {
                // alert("Edit Device button clicked!");
                e.preventDefault();
                // set the values of the input fields in the edit device dialog
                document.getElementById("edit-device-id").value = data["DEVICE_ID"];
                document.getElementById("edit-device-name").value = data["NAME"];
                document.getElementById("edit-device-type").value = data["DEVICE_TYPE"];
                document.getElementById("edit-manufacturer-name").value = data["MANUFACTURER_NAME"];
                document.getElementById("edit-model").value = data["MODEL"];
                document.getElementById("edit-serial-number").value = data["SERIAL_NUMBER"];
                document.getElementById("edit-major-location").value = data["MAJOR_LOCATION"];
                document.getElementById("edit-minor-location").value = data["MINOR_LOCATION"];
                document.getElementById("edit-purchase-date").value = data["PURCHASE_DATE"];
                document.getElementById("edit-purchase-price").value = data["PURCHASE_PRICE"];
                document.getElementById("edit-status").value = data["STATUS"];
        
                document.getElementById("edit-device-dialog").showModal();


                });
            
            deviceDiv.appendChild(editDeviceButton);
            deviceSection.appendChild(deviceDiv);

            let fieldsToDisplay = ["DEVICE_ID", "NAME", "DEVICE_TYPE", "MANUFACTURER_NAME", "MODEL", "SERIAL_NUMBER", "MAJOR_LOCATION", "MINOR_LOCATION", "PURCHASE_DATE", "PURCHASE_PRICE"];

            fieldsToDisplay.forEach(field => {
                let deviceDiv = document.createElement("div");
                deviceDiv.classList.add("device-info-field");
                if (field.endsWith("DATE") && data[field]) {
                    let date = new Date(data[field]);
                    deviceDiv.innerHTML = `<strong>${field.replace(/_/g, " ")}:</strong> ${date.toLocaleDateString()}`;
                } else {
                    deviceDiv.innerHTML = `<strong>${field.replace(/_/g, " ")}:</strong> ${data[field] || ""}`;
                }
                deviceSection.appendChild(deviceDiv);
            });

            sectionsDiv.appendChild(deviceSection);

            // =====================================================
            // Calibration section
            let calibrationSection = document.createElement("section");
            let calibDiv = document.createElement("div");
            calibDiv.classList.add("section-header-edit");

            calibDiv.innerHTML = `<h2>Calibration Info</h2>`;
            
            let editCalibrationButton = document.createElement("button");
            editCalibrationButton.textContent = "Edit";
            editCalibrationButton.addEventListener("click", () => {
                // Add your edit functionality here
                alert("Edit Calibration button clicked!");
            });
            
            calibDiv.appendChild(editCalibrationButton);
            calibrationSection.appendChild(calibDiv);

            let calibrationFields = deviceFields.filter(field => !fieldsToDisplay.includes(field));

            calibrationFields.forEach(field => {
                let calibrationDiv = document.createElement("div");
                calibrationDiv.classList.add("device-info-field");
                if (field.endsWith("DATE") && data[field]) {
                    let date = new Date(data[field]);
                    calibrationDiv.innerHTML = `<strong>${field.replace(/_/g, " ")}:</strong> ${date.toLocaleDateString()}`;
                } else {
                    calibrationDiv.innerHTML = `<strong>${field.replace(/_/g, " ")}:</strong> ${data[field] || ""}`;
                }
                calibrationSection.appendChild(calibrationDiv);
            });

            sectionsDiv.appendChild(calibrationSection);

        mainElement.appendChild(sectionsDiv);
        })


}

getRecords();


