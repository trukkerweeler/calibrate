import { loadHeaderFooter, myport, getUserValue } from "./utils.mjs";

loadHeaderFooter();
const port = myport();
const user = await getUserValue();


const mainContent = document.getElementById("main-content");

const placeholder = document.createElement("div");
placeholder.classList.add("placeholder");
placeholder.id = "placeholder";
placeholder.textContent = "Under construction...";
mainContent.appendChild(placeholder);