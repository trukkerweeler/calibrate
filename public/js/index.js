import { loadHeaderFooter, myport, getUserValue } from "./utils.mjs";

loadHeaderFooter();
const port = myport();
const user = await getUserValue();


const mainContent = document.getElementById("main-content");

const callToAction = document.createElement("div");
callToAction.classList.add("call-to-action");

const image = document.createElement("img");
image.src = "./images/calibrate3.png";
image.alt = "Calibrate";
image.id = "calibrate-image";

const message = document.createElement("p");
message.textContent = "Subscribe now to get the best out of Calibrate!";

const subscribeButton = document.createElement("button");
subscribeButton.textContent = "Subscribe";
subscribeButton.classList.add("subscribe-button");

callToAction.appendChild(image);
callToAction.appendChild(message);
callToAction.appendChild(subscribeButton);

mainContent.appendChild(callToAction);