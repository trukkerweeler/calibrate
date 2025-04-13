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
message.id = "calibrate-message";
message.textContent = "Register now to get the best out of Calibrate!";

const registerButton = document.createElement("button");
registerButton.textContent = "Register Now";
registerButton.id = "subscribe-button";
registerButton.onclick = () => {
  window.location.href = `http://${port}/register`;
};
registerButton.onclick = () => {
  if (user) {
    window.location.href = `./register.html`;
  } else {
    window.location.href = `./register.html`;
  }
};

const loginDialog = document.getElementById("loginDialog");
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


// listen for the submitLogin button click event
const submitLoginButton = document.getElementById("submitLogin");
if (submitLoginButton && loginDialog) {
  submitLoginButton.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`http://localhost:${port}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      window.location.href = `http://localhost:${port}/devices.html`;
    } else {
      alert("Invalid username or password");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("logoutButton").style.display = "block";
        document.getElementById(
          "welcomeMessage"
        ).textContent = `Welcome, ${data.user.username}`;
      } else {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("logoutButton").style.display = "none";
        document.getElementById("welcomeMessage").textContent = "";
      }
    });
    
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            fetch("/auth/logout", {
                method: "POST",
            }).then(() => {
                // redirect to index.html
                window.location.href = "./index.html";
            });
        });
    }
    
    const mainNav = document.getElementById("main-nav");
    if (mainNav) {
      const navList = mainNav.querySelector("ul");
      if (navList) {
        const loginNavItem = document.createElement("li");
        const loginButton = document.createElement("button");
        loginButton.textContent = "Login";
        loginButton.id = "nav-login-button";
        loginButton.onclick = () => {
          if (loginDialog) {
            loginDialog.showModal();
          }
        };
        loginNavItem.appendChild(loginButton);
        navList.appendChild(loginNavItem);
      } else {
        console.error("No <ul> found in #main-nav.");
      }
    } else {
      console.error("#main-nav not found in the DOM.");
    }
}); // end of DOMContentLoaded event listener
