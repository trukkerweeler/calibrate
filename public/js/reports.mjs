import { loadHeaderFooter, myport } from './utils.mjs';

loadHeaderFooter()
const port = myport();
// Removed unused variable

const deviceUrl = `http://localhost:${port}/device`;


async function fetchDevices() {
    try {
        const response = await fetch(deviceUrl);
        const devices = await response.json();
        renderTable(devices);
        setupFilters(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
    }
}

function renderTable(devices) {
    const tableContainer = document.getElementById('deviceTable');
    if (!tableContainer) {
        console.error('Table container not found. Ensure the element with id "deviceTable" exists in the DOM.');
        return;
    }
    tableContainer.innerHTML = `
        <table class="table table-striped table-bordered table-hover" id="deviceTable">
            <thead>
                <tr>
                    <th>Device Id</th>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Next Date</th>
                    <th>Status</th>
                    <th>Major Location</th>
                    <th>Minor Location</th>
                    <th>Assigned Employee ID</th>
                </tr>
            </thead>
            <tbody>
                ${devices.map(device => {
                    const formattedDate = device.NEXT_DATE 
                        ? new Date(device.NEXT_DATE).toISOString().split('T')[0] 
                        : '';
                    return `
                        <tr>
                            <td>${device.DEVICE_ID || ''}</td>
                            <td>${device.NAME || ''}</td>
                            <td>${device.MODEL || ''}</td>
                            <td>${formattedDate}</td>
                            <td>${device.STATUS || ''}</td>
                            <td>${device.MAJOR_LOCATION || ''}</td>
                            <td>${device.MINOR_LOCATION || ''}</td>
                            <td>${device.ASSI_EMPLOYEE_ID || ''}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function setupFilters(devices) {
    const lastDateFilter = document.getElementById('lastDateFilter');
    const statusFilter = document.getElementById('statusFilter');

    lastDateFilter.addEventListener('change', () => applyFilters(devices));
    statusFilter.addEventListener('change', () => applyFilters(devices));
}

function applyFilters(devices) {
    const lastDateFilter = document.getElementById('lastDateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredDevices = devices.filter(device => {
        const lastDateMatch = lastDateFilter === 'All' || 
            (lastDateFilter === 'Overdue' && new Date(device.NEXT_DATE) < new Date()) ||
            (lastDateFilter === 'Warning' && new Date(device.NEXT_DATE) >= new Date());
        const statusMatch = statusFilter === 'All' || device.STATUS === statusFilter;

        return lastDateMatch && statusMatch;
    });

    renderTable(filteredDevices);
}



fetchDevices();

// Refactor to append to main with id of main-content
const mainContent = document.getElementById('main-content');
mainContent.innerHTML = `
    <div class="filters-div">
        <label for="lastDateFilter">Filter by Next Date:</label>
        <select id="lastDateFilter">
            <option value="All">All</option>
            <option value="Overdue">Overdue</option>
            <option value="Warning">Warning</option>
        </select>
        <label for="statusFilter">Filter by Status:</label>
        <select id="statusFilter">
            <option value="All">All</option>
            <option value="A">Active</option>
            <option value="I">Inactive</option>
        </select>
    </div>
    <div id="deviceTable"></div>
`;