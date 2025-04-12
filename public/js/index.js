import { loadHeaderFooter, myport, getUserValue } from "./utils.mjs";


loadHeaderFooter();
const port = myport();
const user = await getUserValue();

const loginButton = document.getElementById("loginNav");
if (loginButton) {
    loginButton.hidden = !loginButton.hidden;
}

const mainContent = document.getElementById("main-content");
const callToAction = document.createElement("div");
callToAction.classList.add("call-to-action");

const image = document.createElement("img");
image.src = "./images/calibrate3.png";
image.alt = "Calibrate";
image.id = "calibrate-image";

const message = document.createElement("p");
message.id = "calibrate-message";
message.textContent = "Register now to get the best out of Calibrate!";

const registerButton = document.createElement("button");
registerButton.textContent = "Register Now";
registerButton.id = "subscribe-button";
registerButton.onclick = () => {
    window.location.href = `https://${port}/register`;
};
registerButton.onclick = () => {
    if (user) {
        window.location.href = `./register.html`;
    } else {
        window.location.href = `./register.html`;
    }
}

const loginDialog = document.getElementById("login-dialog");
const loginDialogButton = document.createElement("button");
loginDialogButton.textContent = "Login";
loginDialogButton.id = "login-dialog-button";
loginDialogButton.onclick = () => {
    if (loginDialog) {
        loginDialog.showModal();
    }
};

const registerLoginDiv = document.createElement("div");
registerLoginDiv.id = "register-login-div";
const loginText = document.createElement("p");
loginText.id = "login-text";
loginText.textContent = "Already have an account?";
loginText.style.marginRight = "10px";
loginText.style.fontSize = "14px";
loginText.style.color = "#333"; // Change to your desired color
const registerText = document.createElement("p");
registerText.id = "register-text";
registerText.textContent = "Need to register?";
registerText.style.marginRight = "10px";
registerText.style.fontSize = "14px";
registerText.style.color = "#333"; // Change to your desired color

registerLoginDiv.appendChild(registerText);
registerLoginDiv.appendChild(registerButton);
registerLoginDiv.appendChild(loginText);
registerLoginDiv.appendChild(loginDialogButton);



callToAction.appendChild(image);
callToAction.appendChild(message);
callToAction.appendChild(registerLoginDiv);

mainContent.appendChild(callToAction);

const cancelLoginButton = document.getElementById("cancelLogin");
if (cancelLoginButton && loginDialog) {
    cancelLoginButton.addEventListener("click", () => {
        loginDialog.close();
    });
}