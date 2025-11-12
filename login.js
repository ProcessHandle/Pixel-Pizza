let loginDropdown = document.getElementById("login-dropdown");
let loginContainer = document.getElementById("login-container");
let registerContainer = document.getElementById("register-container");
let registerToggle = document.getElementById("register-link");
let registerToggleMargin = getCurrentHeight(registerToggle);
let registerToggleHeight = registerToggle.scrollHeight + registerToggleMargin;
let closeButton = document.getElementById("login-close-btn");
let loginButton = document.getElementById("login-out-btn");
let animationLength = 400;
let currentHeight = 0;

if (loginDropdown.classList.contains("closed")) {
    loginDropdown.style.height = "0px";
    loginDropdown.style.width = "0";
    currentHeight = getCurrentHeight(loginDropdown);
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

    //possible add ease-in-ease-out math later
    let loginHeight = Number(loginContainer.scrollHeight);
    let registerHeight = Number(registerContainer.scrollHeight);
    let targetHeight = 0;
    if (loginContainer.classList.contains("hidden")) {
        targetHeight = registerHeight;
        console.log(`register height ${registerHeight}`)
    }
    else {
        targetHeight = loginHeight;
        console.log(`login height ${loginHeight}`);
    }


    let animComplete = false;
    let open = loginDropdown.classList.contains("open");
    console.log(timestamp);
    let deltaTime = timestamp - lastTimestamp;
    console.log(deltaTime)
    lastTimestamp = timestamp;
    let currentH = loginDropdown.style.height;
    if (!open) {
        targetHeight = 0;
    }
    if (open) {
        loginDropdown.style.width = "100%";
        targetHeight += getCurrentHeight(registerToggle) + getCurrentHeight(loginButton);
    }

    let heightChange = targetHeight - currentHeight;
    let incrementH = (deltaTime / animationLength) * heightChange;

    console.log(`incrementH = ${deltaTime}/${animationLength} = ${incrementH}`);

    let height = getCurrentHeight(loginDropdown);
    height += incrementH;

    loginDropdown.style.height = `${height}px`;

    console.log(height);

    if (targetHeight > currentHeight) {
        if (height >= targetHeight) {
            animComplete = true;
        }
    }
    else {
        if (height <= targetHeight) {
            animComplete = true;
            if (!open) {
                loginDropdown.style.width = "0";
            }
        }
    }

    if (!animComplete) {
        requestAnimationFrame(function (timestamp) { animateHeight(timestamp, lastTimestamp) });
    }
    else {
        currentHeight = getCurrentHeight(loginDropdown);
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