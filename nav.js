content = {
    home:document.getElementById("menu-content"),
    menu:document.getElementById("menu-content") ,
    about:document.getElementById("about-content")
}

navLinks = {
    home:document.getElementById("nav-home"),
    menu:document.getElementById("nav-menu"),
    about:document.getElementById("nav-about"),
}

for(i = 0; i<document.getElementsByClassName("nav-link").length; i++)
{
    let item = document.getElementsByClassName("nav-link")[i];
    item.onclick = navigate(item);
}

function navigate(item)
{
    let thisKey = "";

    Object.keys(navLinks).forEach(key => {
        if(navLinks[key] === item)
        {
            thisKey = key;
        }
    })

    Object.keys(content).forEach(key => {
        if(key === thisKey)
        {
            content[key].classList.add("hidden");
        }
        else
        {
            content[key].classList.remove("hidden");
        }
    })
    
}