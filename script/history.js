let historyContent = document.getElementById("history-content")

function expandOrderHistory(item)
{
    let orderDetails = item.parentElement.parentElement.getElementsByClassName('order-details')[0]

    if(orderDetails.classList.contains('collapsed'))
    {
        orderDetails.classList.remove('collapsed')
        item.innerText = "Hide Details"
    }
    else
    {
        orderDetails.classList.add('collapsed')
        item.innerText = "Show Details"
    }
}

function orderAgain(i) {
    if (!currentUser || !currentUser.history) return;

    let order = currentUser.history[i];
    if (!order) return;

    let items = order.slice(1);

    items.forEach(i => {
        let name = i[0];

        updCartItems("add", {
            item: name,
            price: getPrice(name),
            img: getImage(name),
            qty: i[1]
        });
    });

    renderCart();
    updCartTotal();

}

function getImage(name) {
    let item = menuItems.find(m => m.title === name);
    return item ? item.imgUrl : "images/default.png";
}

function saveOrderHistory(items) {
    let date = Date.now();

    let entry = [date];

    items.forEach(i => {
        entry.push([i.item, i.qty || 1]);
    });

    if (!Array.isArray(currentUser.history)) {
        currentUser.history = [];
    }

    currentUser.history.push(entry);

    let accs = accountStorage();
    accs[currentUser.email] = {
        ...accs[currentUser.email],
        history: currentUser.history
    };
    saveStorage(accs);
    loadOrderHistory()
}

function loadOrderHistory() {
    if (!currentUser) return

    let history = currentUser.history || [];
    let container = document.getElementById("history-list");

    container.innerHTML = "";

    history.forEach(order => {
        let date = order[0];
        let items = order.slice(1); 

        let totalQty = 0;
        let totalCost = 0;

        items.forEach(i => {
            let name = i[0];
            let qty = i[1];
            let price = getPrice(name);
            totalQty += qty;
            totalCost += qty * price;
        });

         date = new Date(date).toLocaleDateString();

        let orderDiv = document.createElement("div");
        orderDiv.className = "order";
        
        let firstItemName = items[0][0];
        let firstItemImg = getImage(firstItemName);

        let img = document.createElement("img");
        img.src = firstItemImg;
        img.alt = firstItemName;
        orderDiv.appendChild(img);

        let infoDiv = document.createElement("div");
        infoDiv.className = "order-info";

        infoDiv.innerHTML = `
            <div class="order-info-grid">
                <p>Date: <span>${date}</span></p>
                <p>Total: <span>$${totalCost.toFixed(2)}</span></p>
                <p>Quantity: <span>${totalQty}</span></p>
                <button onclick="orderAgain(${history.indexOf(order)})">Order Again</button>
            </div>
        `;
        orderDiv.appendChild(infoDiv);

        let detailsDiv = document.createElement("div");
        detailsDiv.className = "order-details collapsed";

        items.forEach(i => {
            let name = i[0];
            let qty = i[1];
            let price = getPrice(name);
            let imgSrc = getImage(name);
            let itemTotal = price * qty;

            let itemDiv = document.createElement("div");
            itemDiv.className = "order-item";

            itemDiv.innerHTML = `
                <img src="${imgSrc}" alt="${name}">
                <p>Item: <span>${name}</span></p>
                <p>Quantity: <span>${qty}</span></p>
                <p>Price: <span>$${price}</span></p>
                <p>Total Price: <span>$${itemTotal.toFixed(2)}</span></p>
            `;

            detailsDiv.appendChild(itemDiv);
        });

        orderDiv.appendChild(detailsDiv);

        let toggleDiv = document.createElement("div");
        toggleDiv.className = "show-details";
        toggleDiv.innerHTML = `<a onclick="expandOrderHistory(this)">Show Details</a>`;
        orderDiv.appendChild(toggleDiv);

        container.appendChild(orderDiv);
    });
}
