let loginDropdown = document.getElementById("login-dropdown");
let loginContainer = document.getElementById("login-container");
let registerContainer = document.getElementById("register-container");
let registerToggle = document.getElementById("register-link");
let registerToggleMargin = getCurrentHeight(registerToggle);
let registerToggleHeight = registerToggle.scrollHeight + registerToggleMargin;
let closeButton = document.getElementById("login-close-btn");
let loginButton = document.getElementById("login-out-btn");
let animationLength = 400;
let startHeight = 0;

if (loginDropdown.classList.contains("closed")) {
    loginDropdown.style.height = "0px";
    loginDropdown.style.width = "0";
    startHeight = getCurrentHeight(loginDropdown);
}

function login() {
    if (loginDropdown.classList.contains("closed")) {
        toggleDropdown()
    }
    else if (!loginContainer.classList.contains("hidden")) {
        //login logic goes here
    }
    else if (!registerContainer.classList.contains("hidden")) {
        //register logic goes here
    }
}

function toggleDropdown() {
    if (loginDropdown.classList.contains("closed")) {
        loginDropdown.classList.replace("closed", "open");
        closeButton.classList.remove("hidden");
        requestAnimationFrame(function (timestamp) { animateHeight(timestamp, timestamp) });
    }
    else {
        loginDropdown.classList.replace("open", "closed");
        closeButton.classList.add("hidden")
        requestAnimationFrame(function (timestamp) { animateHeight(timestamp, timestamp) });
    }
}

function toggleRegister() {
    console.log("toggleRegister()")
    if (loginContainer.classList.contains("hidden")) {
        console.log("show login, hide register");
        loginContainer.classList.remove("hidden");
        registerContainer.classList.add("hidden");
    }
    else {
        console.log("hide login, show register")
        loginContainer.classList.add("hidden");
        registerContainer.classList.remove("hidden");
    }
    animateHeight();
}

function animateHeight(timestamp, lastTimestamp) {
    /*
    CSS animation doesnt work unless height is defined in CSS
    So dropdown is animated here to be dynamic based on content height.
    */

    //possible add ease-in-ease-out math later

    let targetHeight = 0

    let childElements = loginDropdown.children;

    if(loginDropdown.classList.contains("open"))
    {
        loginDropdown.style.width = "100%";
        for(let i=0; i < childElements.length; i++)
        {
            if(!childElements[i].classList.contains("hidden"))
            {
                targetHeight += getCurrentHeight(childElements[i]);
            }
        }
        targetHeight += getCurrentHeight(loginButton);
    }

    let deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    let incrementHeight = deltaTime/animationLength * (targetHeight - startHeight)
    let newHeight = getCurrentHeight(loginDropdown) + incrementHeight;
    loginDropdown.style.height = `${newHeight}px`;

    if(Math.abs(targetHeight - newHeight) < Math.abs(incrementHeight))
    {
        //animation complete
        loginDropdown.style.height = `${targetHeight}px`;

        if(loginDropdown.classList.contains("closed"))
        {
            loginDropdown.style.width = "0";
        }

        startHeight = targetHeight;
    }
    else
    {
        requestAnimationFrame(function(timestamp) {animateHeight(timestamp, lastTimestamp)});
    }
}

function getCurrentHeight(element) {
    let topMargin = 0;
    if (element.style.topMargin !== undefined) {
        topMargin = Number(element.style.topMargin.replace("px", ""));
    }

    let bottomMargin = 0;
    if (element.style.bottomMargin !== undefined) {
        bottomMargin = Number(element.style.bottomMargin.replace("px", ""));
    }

    return Number(element.getBoundingClientRect().height) + topMargin + bottomMargin;
}