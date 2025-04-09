async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export function renderWithTemplate(
  template,
  parentElement,
  data,
  callback,
  position = "afterbegin"
) {
  if (parentElement) {
    parentElement.insertAdjacentHTML(position, template);
    if (callback) {
      callback(data);
    }
  } else {
    console.error("Parent element is null or undefined.");
  }
}

export function renderWithTemplate2(
  template,
  parentElement,
  data,
  callback,
  position = "afterbegin"
) {
  if (parentElement) {
    let output = template;
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, "g");
      output = output.replace(regex, data[key]);
    }
    parentElement.insertAdjacentHTML(position, output);
  } else {
    console.error("Parent element is null or undefined.");
  }
}

export async function loadReports(data) {
  const main = document.querySelector("main");
  const reportsTemplate = await loadTemplate("/partials/report.html");
  for (const report of data) {
    renderWithTemplate2(reportsTemplate, main, report);
  }
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = document.querySelector("#header");
  let footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = document.querySelector("#footer");
  const copyrightYear = new Date().getFullYear();
  footerTemplate = footerTemplate.replace("{{copyrightYear}}", copyrightYear);

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// get user value from config.json file
export async function getUserValue() {
  const res = await fetch("../json/config.json");
  const data = await res.json();
  return data.username;
}

// get computer name from Windows environment variable
export function getUserValue1() {
  return process.env.COMPUTERNAME;
}

// return datetime in format YYYY-MM-DD HH:MM:SS
export function getDateTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dayOfMonth = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${month}-${dayOfMonth} ${hours}:${minutes}:${seconds}`;
}

// return form fields for data entry
export function getFormFields(myform) {
  let data = [];
  switch (myform) {
    case "csr":
      data = ["CUSTOMER_ID", "UNIT", "VALUE"];
      for (entryfield in data) {
        console.log(entryfield);
      }
    case "output":
      return [
        "output_id",
        "output_name",
        "output_description",
        "output_date",
        "output_time",
      ];
    case "defect":
      return [
        "defect_id",
        "defect_name",
        "defect_description",
        "defect_date",
        "defect_time",
      ];
    case "user":
      return ["user_id", "user_name", "user_email", "user_password"];
    default:
      return [];
  }
  return data;
}

export async function createNotesSection(title, notes) {
  let notesSection = document.createElement("section");
  notesSection.classList.add("notesSection");
  let notesTitle = document.createElement("h3");
  let buttonid = "";
  let buttonText = "Edit";
  const note = document.createElement("p");
  let noteid = "note";
  notesTitle.classList.add("notesTitle");
  // switch case of title to display appropriate title
  switch (title) {
    case "INPUT_TEXT":
      notesTitle.textContent = "Action:";
      notesTitle.id = "actionTitle";
      buttonid = "editAction";
      buttonText = "Edit Action";
      noteid = "actionNote";
      break;
    case "FOLLOWUP_TEXT":
      notesTitle.textContent = "Follow Up:";
      notesTitle.id = "followUpTitle";
      buttonid = "editFollowUp";
      buttonText = "Follow Up";
      noteid = "followUpNote";
      break;
    case "RESPONSE_TEXT":
      notesTitle.textContent = "Response:";
      notesTitle.id = "responseTitle";
      buttonid = "editResponse";
      buttonText = "Respond";
      noteid = "responseNote";
      break;
    default:
      notesTitle.textContent = "Notes";
  }

  notesSection.appendChild(notesTitle);

  // append notes to notes section
  // if the length of notes replace new line characters with <br> tag
  if (notes) {
    notes = notes.replace(/\n/g, "<br>");
  }
  note.innerHTML = notes;
  note.id = noteid;
  notesSection.appendChild(note);

  // call createButton and append button to section
  createButton(notesSection, buttonText, buttonid, "editNoteButton");

  // // insert notes adjacent to #detailSection
  // const detailSection = document.querySelector("#detailSection");
  // detailSection.insertAdjacentElement("afterend", notesSection);

  // append notes section to main
  const main = document.querySelector("#main");
  main.appendChild(notesSection);
}

// append button to section
export function createButton(section, buttonName, buttonId, buttonClass) {
  let button = document.createElement("button");
  button.textContent = buttonName;
  button.id = buttonId;
  button.classList.add(buttonClass);
  button.type = "submit";
  section.appendChild(button);
}

export async function createSection(title, notes) {
  const sectionTemplate = await loadTemplate("/partials/section.html");
  const mainElement = document.querySelector("#main");
  const data = {
    title: title,
    notes: notes,
  };

  renderWithTemplate(sectionTemplate, mainElement, data);
}

export async function createReportTable() {
  const reportTableTemplate = await loadTemplate("/partials/reportTable.html");
  const mainElement = document.querySelector("#main");
  const data = {
    title: "Report Table",
  };

  renderWithTemplate(reportTableTemplate, mainElement, data);
}


export function myport() {
  return 3010;
}


// return the parameter date in a yyyy-mm-dd format
export function displayDate(date) {
  if (!date) {
    return "";
  }
}

export function getLastRunDate() {
  const query = "SELECT LASTSENT_DATE FROM LASTSENT WHERE MODULE = 'CALIBRATIONS' ORDER BY LASTSENT_DATE DESC LIMIT 1";
  // console.log("Query: ", query);
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: 3306,
    database: "calibration",
  });

  connection.connect(function (err) {
    if (err) {
      console.error("Error connecting: " + err.stack);
      return;
    }
  });
  console.log("Connected to DB");
  const [rows] = connection.query(query);
  let runMe = false;
  if (rows && rows.length > 0) {
    const lastSentDate = new Date(rows[0].LASTSENT_DATE);
    const today = new Date();
    if (
      lastSentDate.getFullYear() === today.getFullYear() &&
      lastSentDate.getMonth() === today.getMonth() &&
      lastSentDate.getDate() === today.getDate()
    ) {
      console.log("Already ran today, not running.");
      runMe = false;
    } else {
      console.log("Not ran today, running.");
      runMe = true;
    }
  } else {
    console.log("No records found, running.");
    runMe = true;
  }
  return runMe;
}
