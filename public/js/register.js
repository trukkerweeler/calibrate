import { loadHeaderFooter, myport } from "./utils.mjs";

loadHeaderFooter();
const port = myport();


const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);
    const data = {
        USER_ID: formData.get("username"),
        PASSWORD: formData.get("password"),
    };

    try {
        const response = await fetch(`http://localhost:${port}/user/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            alert("Registration successful!");
            registerForm.reset();
            window.location.href = "index.html"; // Redirect to index.html
        } else if (response.status === 409) {
            alert("Username already exists. Please choose a different username.");
        }
        else if (response.status === 400) {
            alert("Invalid input. Please check your data and try again.");  
        }
        else if (response.status === 500) {
            alert("Server error. Please try again later.");
        } else {
            const error = await response.json();
            alert(`Registration failed: ${error.message}`);
        }
    } catch (err) {
        console.error("Error:", err);
        alert("An error occurred. Please try again.");
    }
});