let loginDropdown = document.getElementById("login-dropdown");
let loginHeight = Number(document.getElementById("login-container").scrollHeight);
let closeButton = document.getElementById("login-close-btn");
let animationLength = 400;

if(loginDropdown.classList.contains("closed"))
{
    loginDropdown.style.height = "0px";
    loginDropdown.style.width = "0"
}

function login()
{
    if(loginDropdown.classList.contains("closed"))
    {
        toggleDropdown()
    }
    else
    {
        //login logic goes here
    }
}

function toggleDropdown()
{
    if(loginDropdown.classList.contains("closed"))
    {
        loginDropdown.classList.replace("closed", "open");
        closeButton.classList.remove("hidden");
        requestAnimationFrame(function(timestamp) {animateHeight(timestamp, timestamp)});
    }
    else
    {
        loginDropdown.classList.replace("open", "closed");
        closeButton.classList.add("hidden")
        requestAnimationFrame(function(timestamp) {animateHeight(timestamp, timestamp)});
    }
}

function animateHeight(timestamp, lastTimestamp) {

    //possible add ease-in-ease-out math later

    let animComplete = false;
    let open = loginDropdown.classList.contains("open");
    console.log(timestamp);
    let deltaTime = timestamp - lastTimestamp;
    console.log(deltaTime)
    lastTimestamp = timestamp;
    let currentH = loginDropdown.style.height;
    let incrementH = (deltaTime/animationLength) * loginHeight;
    if(open)
    {
        loginDropdown.style.width = "100%";
    }

    if(!open)
    {
        incrementH *= -1;
    }

    console.log(`incrementH = ${deltaTime}/${animationLength} = ${incrementH}`);

    let height = Number(loginDropdown.style.height.replace("px",""));
    height += incrementH;

    loginDropdown.style.height = `${height}px`;

    console.log(height);

    console.log(loginHeight);

    if(open)
    {
        if(height >= loginHeight)
        {
            animComplete = true;
        }
    }
    else
    {
        if(height <= 0)
        {
            animComplete = true;
            loginDropdown.style.width = "0";
        }
    }

    if(!animComplete)
    {
        requestAnimationFrame(function(timestamp) {animateHeight(timestamp, lastTimestamp)});
    }
}