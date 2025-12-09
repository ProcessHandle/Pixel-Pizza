let checkoutElements = {
    firstName: document.getElementById("first-name"),
    lastName: document.getElementById("last-name"),
    phone: document.getElementById("phone-number"),


    address: {
        street: document.getElementById("address"),
        city: document.getElementById("city"),
        state: document.getElementById("state"),
        zip: document.getElementById("zipcode")
    },

    card: {
        container: document.getElementById("card-area"),
        name: document.getElementById("cardholder-name"),
        number: document.getElementById("card-number"),
        expiration: document.getElementById("expire-date"),
        cvc: document.getElementById("card-cvc")
    },

    paypal: {
        container: document.getElementById("paypal-area"),
        email: document.getElementById("paypal-email"),
        password: document.getElementById("paypal-password")
    },

    paymentType: {
        visa: document.getElementById("visa-logo"),
        mastercard: document.getElementById("mastercard-logo"),
        paypal: document.getElementById("paypal-logo"),
        cash: document.getElementById("cash-logo")
    },

    fieldError: document.getElementById("payment-error"),
    pmtTypeError: document.getElementById("payment-type-error")
}

function changePmtType(item) {
    Object.keys(checkoutElements.paymentType).forEach(key => {
        checkoutElements.paymentType[key].classList.add("grayout")
    });
    item.classList.remove("grayout");

    if(item === checkoutElements.paymentType.mastercard || item === checkoutElements.paymentType.visa)
    {
        checkoutElements.paypal.container.classList.add("hidden");
        checkoutElements.card.container.classList.remove("hidden");
    }
    else if(item === checkoutElements.paymentType.paypal)
    {
        checkoutElements.card.container.classList.add("hidden");
        checkoutElements.paypal.container.classList.remove("hidden");
    }
    else
    {
        checkoutElements.card.container.classList.add("hidden");
        checkoutElements.paypal.container.classList.add("hidden");
    }
}

function submitOrder() {
    let checkoutFields = [
        checkoutElements.firstName,
        checkoutElements.lastName,
        checkoutElements.phone,
        checkoutElements.address.street,
        checkoutElements.address.city,
        checkoutElements.address.state,
        checkoutElements.address.zip
    ]

    if(!checkoutElements.card.container.classList.contains("hidden"))
    {
        checkoutFields.push(checkoutElements.card.name);
        checkoutFields.push(checkoutElements.card.number);
        checkoutFields.push(checkoutElements.card.expiration);
        checkoutFields.push(checkoutElements.card.cvc);
    }

    if(!checkoutElements.paypal.container.classList.contains("hidden"))
    {
        checkoutFields.push(checkoutElements.paypal.email);
        checkoutFields.push(checkoutElements.paypal.password);
    }

    let pmtTypeSelected = false

    Object.keys(checkoutElements.paymentType).forEach(key => {
        if(!checkoutElements.paymentType[key].classList.contains("grayout"))
        {
            pmtTypeSelected = true
        }
    })

    if(!pmtTypeSelected)
    {
        checkoutElements.pmtTypeError.classList.remove("hidden")
        return
    }
    else{
        checkoutElements.pmtTypeError.classList.add("hidden")
    }

    let fieldsComplete = true

    checkoutFields.forEach(item => {
        if(item.value === "")
        {
            fieldsComplete = false;
        }
    })

    if(!fieldsComplete)
    {
        checkoutElements.fieldError.classList.remove("hidden");
        return;
    }
    else
    {
        checkoutElements.fieldError.classList.add("hidden");
    }

    console.log(getCartItems());

    let order = {
        date: new Date().toLocaleDateString(),
        items: getCartItems()
    }

    if(currentUser)
    {
        if(currentUser.history !== undefined)
        {
            currentUser.history.unshift(order);
        }
        else
        {
            currentUser.history = [order];
        }

        let accounts = accountStorage();

        updateSalesHistory(currentUser.cart);

        currentUser.cart = [];
        currentTotal = 0;
        accounts[currentUser.email].cart = currentUser.cart;
        accounts[currentUser.email].history = currentUser.history;
        saveStorage(accounts);

        loadOrderHistory();

    }
    else
    {
        updateSalesHistory(guestCart);
        guestCart = [];
        currentTotal = 0;
    }

    checkoutFields.forEach(item => {
        item.value = "";
    })

    renderCart();

    updCartTotal();

    checkoutItems.innerHTML = `<h2 style="text-align: center;">Order has been submitted</h2>`

}

function updateSalesHistory(cart)
{
    cart.forEach(item => {
        menuItems.forEach(menuItem => {
            if(menuItem.title === item.item)
            {
                menuItem.sales += item.qty;
            }
        })
    }
    )
    storeMenu();
    reloadMenu();
}