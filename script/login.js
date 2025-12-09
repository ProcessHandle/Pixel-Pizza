/* 
       .------..
     -          -
   /              \
 /                   \
/    .--._    .---.   |
|  /      -__-     \   |
| |                 |  |
 ||     ._   _.      ||
 ||      o   o       ||
 ||      _  |_      ||
 C|     (o\_/o)     |O     Uhhh, this computer
  \      _____      /       is like, busted or
    \ ( /#####\ ) /       something. So go away.
     \  `====='  /
      \  -___-  /
       |       |
       /-_____-\
     /           \
   /               \
  /__|  AC / DC  |__\
  | ||           |\ \
*/

let loginDropdown = document.getElementById("login-dropdown");
let loginContainer = document.getElementById("login-container");
let registerContainer = document.getElementById("register-container");
let registerToggle = document.getElementById("register-link");
let registerToggleMargin = getCurrentHeight(registerToggle);
let registerToggleHeight = registerToggle.scrollHeight + registerToggleMargin;
let closeButton = document.getElementById("login-close-btn");
let loginButton = document.getElementById("login-out-btn");
let emailInput = document.querySelector('input[name="email"]');
let passwordInput = document.querySelector('input[name="pass"]'); passwordInput.type = "password";
let nameInput = document.querySelector('input[name="name"]');
let regNameInput = document.querySelector('#register-container input[name="name"]');
let regEmailInput = document.querySelector('#register-container input[name="email"]');
let regPassInput = document.querySelector('#register-container input[name="pass"]'); regPassInput.type = "password";
let regConfirmPassInput = document.querySelector('#register-container input[name="conf-pass"]'); regConfirmPassInput.type = "password";
let loginMessage = document.getElementById("login-msg")
let editMenu = document.getElementById("nav-edit")
let saleData = document.getElementById("nav-sales")
let cartItems = document.getElementById("cart-items")
let checkoutItems = document.getElementById("checkout-items")
let cartTotal = document.getElementById("cart-total")
let currentTotal = 0
let orderHistory = document.getElementById("nav-history")
let animationLength = 250;
let startHeight = 0;
let doFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }); // This is super cool!
let accountStorage = () => JSON.parse(localStorage.getItem("Accounts") || "{}")
let saveStorage = o => localStorage.setItem("Accounts", JSON.stringify(o))
let currentUser
let guestCart = []
let clearStorage = () => { localStorage.clear(); console.log("Cleared localStorage successfully.") }

let viewingPermissions = {
    admin: [editMenu, saleData],
    user: [orderHistory]
}

function updateCurrentUser(data) {
    let accs = accountStorage()

    if (!currentUser || !currentUser.email) return;

    Object.assign(currentUser, data)

    accs[currentUser.email] = {
        ...accs[currentUser.email],
        ...currentUser
    };

    saveStorage(accs);
}

function updCartTotal() {
    // Reworked for guests
    let tot = 0;

    let cart = currentUser?.cart || guestCart;

    if (!cart || cart.length === 0) {
        cartTotal.innerText = "$0.00";
        currentTotal = 0;
        return;
    }

    cart.forEach(i => {
        tot += (i.price * i.qty);
    });

    currentTotal = tot;
    cartTotal.innerText = doFormat.format(tot);
}


function updCartItems(action, data = {}) {
    let loggedIn = !!currentUser;
    let cart = loggedIn ? (currentUser.cart || []) : guestCart;

    switch (action) {
        case "add":
            let dupe = cart.find(c => c.item === data.item);

            if (dupe) {
                dupe.qty += data.qty || 1
            } else {
                cart.push({
                    item: data.item,
                    price: data.price,
                    qty: data.qty || 1,
                    img: data.img,
                    added: Date.now()
                });
            }

            updCartTotal();
            break;

        case "remove":
            if (typeof data.index === "number") {
                cart.splice(data.index, 1);
                updCartTotal();
            }
            break;

        case "modify":
            if (typeof data.index === "number") {
                cart[data.index].qty = data.qty;
                updCartTotal();
            }
            break;

        case "clear":
            console.log("clear cart")
            cart = [];
            cartTotal.innerText = `$0.00`
            currentTotal = 0
            break;
    }
    if (loggedIn) {
        console.log("logged in");
        let accounts = accountStorage();
        accounts[currentUser.email].cart = cart;
        saveStorage(accounts);
    }

    renderCart();
}

function getCartItems() {
    let loggedIn = !!currentUser;
    let cart = loggedIn ? (currentUser.cart || []) : guestCart;
    return cart;
}

function renderCart() {
    let list = getCartItems()
    cartItems.innerHTML = ""
    checkoutItems.innerHTML = ""

    if (list.length === 0) {
        return
    };

    list.forEach((e, i) => {
        let div = document.createElement("div")
        div.className = "cart-item"
        div.dataset.index = i
        div.dataset.price = e.price

        div.innerHTML = `
            <div class="thumb">
                <img src="${e.img || 'https://www.nicepng.com/png/full/340-3400354_pizza-pixel-pixels-pixeles-tumblr-food-pixel-pizza.png'}" alt="Item">
            </div>
            <div class="ci-main">
                <div class="ci-title-row">
                    <span class="ci-name">${e.item}</span>
                    <button class="ci-remove">✕</button>
                </div>
                <span class="ci-price-line">$${Number(e.price).toFixed(2)}</span>
                <div class="ci-bottom">
                    <div class="qty">
                        <button class="qbtn minus">−</button>
                        <input class="qval" type="number" min="1" value="${e.qty || 1}">
                        <button class="qbtn plus">+</button>
                    </div>
                </div>
            </div>
        `;

        cartItems.appendChild(div)

        //update checkout:
        checkoutElement = div.cloneNode(true);
        checkoutElement.className = "checkout-item";
        checkoutElement.innerHTML =
            `
            <div class="thumb">
                <img src="${e.img || 'https://www.nicepng.com/png/full/340-3400354_pizza-pixel-pixels-pixeles-tumblr-food-pixel-pizza.png'}" alt="Item">
            </div>
            <div class="co-main">
                <span class="ci-name">${e.item}</span>
                <span class="ci-price-line">$${Number(e.price).toFixed(2)}</span>
                <div class="qty">
                    <button class="qbtn minus">−</button>
                    <input class="qval" type="number" min="1" value="${e.qty || 1}">
                    <button class="qbtn plus">+</button>
                </div>
                <button class="ci-remove">✕</button>
            </div>`

        checkoutItems.appendChild(checkoutElement);

    });

    updCartTotal()
    startCartItemEvents()
}


function uiUpdate(isAdmin) {

    if (!isAdmin) {
        viewingPermissions.admin.forEach(item => { item.classList.add("hidden") });
        viewingPermissions.user.forEach(item => { item.classList.remove("hidden") });
    } else {
        viewingPermissions.admin.forEach(item => { item.classList.remove("hidden") });
        viewingPermissions.user.forEach(item => { item.classList.add("hidden") });
    }

    if (currentUser) {
        loginMessage.innerText = `Welcome ${currentUser.name}!`;
        loginButton.innerText = "Logout";
        if (loginDropdown.classList.contains("open")) {
            toggleDropdown();
        }
    } else {
        loginMessage.innerText = "Logged Out";
        loginButton.innerText = "Login";
        if (loginContainer.classList.contains("hidden")) {
            loginContainer.classList.remove("hidden");
            registerContainer.classList.add("hidden");
        }
    }

    if (currentUser) {
        renderCart();
        loadOrderHistory();
    } else if (cartItems) {
        cartItems.innerHTML = "";
    }

}

function statusMessage(msg, t = 3000) {
    let currentMessage = loginMessage.innerText;
    loginMessage.innerText = msg;

    setTimeout(() => {
        loginMessage.innerText = currentMessage;
    }, t);
}

console.log(accountStorage())
if (Object.keys(accountStorage()).length > 0) { console.log("Initiated Account Storage Successfully") }

if (loginDropdown.classList.contains("closed")) {
    loginDropdown.style.height = "0px";
    loginDropdown.style.width = "0";
    startHeight = getCurrentHeight(loginDropdown);
}

function tohex(b) {
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("")
}

function letshash(p) {
    try {
        const enc = new TextEncoder().encode(p)
        const buf = crypto.subtle.digest("SHA-256", enc)
        return tohex(buf)
    } catch {
        let x = 0
        for (const c of p) x = (x * 31 + c.charCodeAt(0)) >>> 0
        return ("00000000" + x.toString(16)).slice(-8)
    }
}

function loginUser(email, password) {
    let store = accountStorage();
    let admin = store.isAdmin || false
    email = email.toLowerCase();
    let history = [];
    if(store[email] !== undefined)
    {
        history = store[email].history;
    }
    console.log(`Email: ${email} , Pass: ${password}`)
    if (email === "test" && password === "test") {
        let acc = accountStorage();
        if (!acc["test"]) {
            acc["test"] = {
                password: letshash("test"),
                name: "Test Account",
                created: Date.now(),
                cart: []
            };
            saveStorage(acc);
        }

        return {
            status_ok: true,
            isAdmin: true,
            Name: "Test Account",
            cart: acc["test"].cart,
            msg: "Test account passed conditions"
        };
    }

    if (!store[email]) {
        return { status_ok: false, msg: "Account not found." };
    }

    let hashed = letshash(password);
    if (guestCart.length >= 1) {
        if (confirm("Logging will result in your cart being cleared or overwritten. Would you like to continue?")) {
            guestCart = []
            updCartTotal() 
        } else {
            return
        }
    }

    if (hashed !== store[email].password) {
        return { status_ok: false, msg: "Incorrect password." };
    }

    if (admin) { }
    let cart = store[email].cart || [];

    return { status_ok: true, isAdmin: admin, Name: store[email].name, cart: cart, history: history};
}

function createAccount(name, email, pass) {
    const store = accountStorage();
    email = email.toLowerCase()

    if (store[email]) {
        return { status_ok: false, msg: "Email already in use." };
    }

    const hashed = letshash(pass);

    store[email] = {
        password: hashed,
        name: name,
        created: Date.now(),
        isAdmin: false,
        cart: [], 
        history: []
    };

    saveStorage(store);
    return { status_ok: true, msg: `Account created successfully.`, email: email, name: name };
}

function handleLogInOut() {
    if (currentUser) {
        if (currentUser.isAdmin) navigate(navLinks.home)
        currentUser = null;
        uiUpdate(false);
        updCartTotal();
        statusMessage("Logged out successfully", 2000);
        navigate(navLinks.home);
    } else {
        login();
    }
}

function login() {
    let email = emailInput.value
    let pass = passwordInput.value

    if (loginDropdown.classList.contains("closed")) {
        toggleDropdown()
    }
    else if (!loginContainer.classList.contains("hidden")) {
        let res = loginUser(email, pass)

        if (res.status_ok) {
            currentUser = {
                email: email,
                name: res.Name,
                isAdmin: res.isAdmin,
                cart: res.cart,
                history: res.history
            };
            uiUpdate(currentUser.isAdmin);
            loadOrderHistory()
        } else {
            statusMessage(res.msg, 3000)
        }
        console.log(res)
    }
    else if (!registerContainer.classList.contains("hidden")) {

        let regName = regNameInput.value.trim();
        let regEmail = regEmailInput.value.trim().toLowerCase();
        let regPass = regPassInput.value.trim();
        let regPassConfirmation = regConfirmPassInput.value.trim();

        if (!regName || !regEmail || !regPass || !regPassConfirmation) {
            statusMessage("Please fill all fields.", 2000);
            return;
        }

        if (regPass !== regPassConfirmation) {
            statusMessage("Passwords do not match.", 2000);
            return;
        }

        let res = createAccount(regName, regEmail, regPass);

        if (res.status_ok) {
            statusMessage("Account created. Logging you in...", 1500);

            setTimeout(async () => {
                let loginRes = loginUser(regEmail, regPass);
                if (loginRes.status_ok) {
                    currentUser = {
                        email: regEmail,
                        name: loginRes.Name,
                        isAdmin: loginRes.isAdmin,
                        cart: [],
                        history: []
                    };
                    uiUpdate(currentUser.isAdmin);
                    statusMessage(`Welcome ${loginRes.Name}!`, 2000);

                    regNameInput.value = "";
                    regEmailInput.value = "";
                    regPassInput.value = "";
                    regConfirmPassInput.value = "";
                }
            }, 1500);
        } else {
            statusMessage(res.msg, 3000);
        }
    }
}

function toggleDropdown() {
    if (currentUser && loginDropdown.classList.contains("open")) {
        loginDropdown.classList.replace("open", "closed");
        closeButton.classList.add("hidden")
        requestAnimationFrame(function (timestamp) { animateHeight(timestamp, timestamp) });
        return;
    }
    if (currentUser) return;

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
    if (currentUser) return;

    console.log("toggleRegister()")
    if (loginContainer.classList.contains("hidden")) {
        console.log("show login, hide register");
        loginContainer.classList.remove("hidden");
        registerContainer.classList.add("hidden");
        document.getElementById("register-link").innerHTML = `<a onclick="toggleRegister()">New Player? <span>Create Account.</span></a>`
        document.getElementById("login-out-btn").innerText = "Login"
    }
    else {
        console.log("hide login, show register")
        loginContainer.classList.add("hidden");
        registerContainer.classList.remove("hidden");
        document.getElementById("register-link").innerHTML = `<a onclick="toggleRegister()">Returning Player? <span>Log In.</span></a>`
        document.getElementById("login-out-btn").innerText = "Register"
    }
    animateHeight();
}

function animateHeight(timestamp, lastTimestamp) {
    /*
    CSS animation doesnt work unless height is defined in CSS
    So dropdown is animated here to be dynamic based on content height.
    */

    //possible add ease-in-ease-out math later

    let targetHeight = 0;

    let childElements = loginDropdown.children;

    if (loginDropdown.classList.contains("open")) {
        loginDropdown.style.width = "100%";
        for (let i = 0; i < childElements.length; i++) {
            if (!childElements[i].classList.contains("hidden")) {
                targetHeight += getCurrentHeight(childElements[i]);
            }
        }
        targetHeight += getCurrentHeight(loginButton);
    }

    let deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    let incrementHeight = deltaTime / animationLength * (targetHeight - startHeight)
    let newHeight = getCurrentHeight(loginDropdown) + incrementHeight;
    loginDropdown.style.height = `${newHeight}px`;


    if (Math.abs(targetHeight - newHeight) < Math.abs(incrementHeight)) {
        loginDropdown.style.height = `${targetHeight}px`;

        if (loginDropdown.classList.contains("closed")) {
            loginDropdown.style.width = "0";
        }

        startHeight = targetHeight;
    }
    else {
        requestAnimationFrame(function (timestamp) { animateHeight(timestamp, lastTimestamp) });
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