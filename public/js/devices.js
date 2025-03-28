import { loadHeaderFooter, myport } from './utils.mjs';

loadHeaderFooter()
const port = myport();
let copyrightYear = new Date().getFullYear();

const deviceUrl = `http://localhost:${port}/device`;

function getRecords() {
    fetch(deviceUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            let myFields = ["DEVICE_ID", "NAME", "DEVICE_TYPE", "STATUS", "MAJOR_LOCATION", "MINOR_LOCATION", "NEXT_DATE"];
            let mainElement = document.getElementById("main-content");
            let deviceTableTemplate = `<table class="table table-striped table-bordered table-hover" id="deviceTable">`;
            deviceTableTemplate += `<thead><tr>`;
            for (const field of myFields) {
                deviceTableTemplate += `<th>${field}</th>`;
            }
            deviceTableTemplate += `</tr></thead>`;
            deviceTableTemplate += `<tbody>`;
            for (const device of data) {
                deviceTableTemplate += `<tr>`;
                for (const field of myFields) {
                    if (field === "DEVICE_ID") {
                        deviceTableTemplate += `<td><a href="device.html?id=${device[field]}">${device[field]}</a></td>`;
                    } else if (field.endsWith("DATE")) {
                        const dateValue = device[field];
                        if (dateValue) {
                            const date = new Date(dateValue);
                            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                            const formattedDate = date.toLocaleDateString('en-US', options);
                            deviceTableTemplate += `<td>${formattedDate}</td>`;
                        } else {
                            deviceTableTemplate += `<td></td>`;
                        }
                    } else {
                        deviceTableTemplate += `<td>${device[field] ?? ''}</td>`;
                    }
                }
                deviceTableTemplate += `</tr>`;
            }
            deviceTableTemplate += `</tbody>`;
            deviceTableTemplate += `</table>`;
            mainElement.innerHTML += deviceTableTemplate;
            // Initialize DataTable after setting innerHTML
            

        })
        .catch((error) => {
            console.error("Error fetching devices:", error);
        });
}

getRecords();


