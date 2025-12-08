let storageMenuName = "pixel-menuJSON"

let menuItems = [];
console.log("script loaded")

let container = document.getElementById("menu-grid");

let topItemContainer = document.getElementById("top-product-container");
let promotedItemContainer = document.getElementById("marquee-track");

const MenuItemsLoaded = new CustomEvent("MenuItemsLoaded", {
  detail: {
    message: "Menu itmes have been loaded",
    timestamp: new Date().toISOString()
  },
  bubbles: true,
  cancelable: true
});

class MenuItem {
  constructor(title, imgUrl, price = 0, description = "", topProduct, promotedProduct, sales = 0) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.description = description;
    this.sales = sales;

    if (topProduct !== undefined) {
      this.topProduct = topProduct;
    }

    if (promotedProduct !== undefined) {
      this.promoted = promotedProduct;
    }

    this.element = document.createElement("div");
    this.element.classList.add("card");

    this.updateHTML();
    this.appendToDoc();
  }

  updateHTML() {
    console.log("updateHTML()");
    // this.element.style.backgroundImage=this.imgUrl; //possibly delete later

    this.element.innerHTML =
      `<span class="tooltiptext">${this.description}</span>
      <h2>${this.title}</h2>
      <img src="${this.imgUrl}" alt="pizza">
      <div class="card-info">
        <p class="card-price">$${this.price}</p>
        <div class="qty">
          <button class="qbtn minus" type="button">−</button>
          <input class="qval" type="number" min="1" value="1" />
          <button class="qbtn plus" type="button">+</button>
        </div>
        <button
          class="add-cart-btn"
          data-title="${this.title}"
          data-price="${this.price}"
        >Add To Cart</button>
      </div>
`
  }

  appendToDoc() {
    container.appendChild(this.element);
    if (this.topProduct) {
      this.topProductElement = this.element.cloneNode(true);
      this.topProductElement.classList.add("card-large");
      topItemContainer.appendChild(this.topProductElement);
    }
    if (this.promoted) {
      this.promotedElement = this.element.cloneNode(true);
      this.promotedElement.classList.add("marquee-card");
      promotedItemContainer.appendChild(this.promotedElement);
    }
  }


}

function loadMenu() {
  fetch('data/menu-template.json').then(res => res.json()).then(data => {
    let storedMenu = localStorage.getItem(storageMenuName);
    if (storedMenu) {
      JSON.parse(storedMenu).forEach(item => {
        menuItems.push(new MenuItem(item.title, item.image, item.price, item.description, item.topProduct, item.promoted));
        console.log(item);
      })
    }
    else {
      data.menuItems.forEach(item => {
        menuItems.push(new MenuItem(item.title, item.image, item.price, item.description, item.topProduct, item.promoted, item.sales));
      })
    }
    document.dispatchEvent(MenuItemsLoaded);
  })
}

function storeMenu() {
  let newMenu = JSON.stringify(menuItems);
  localStorage.setItem(storageMenuName, newMenu);
}

function reloadMenu() {
  menuItems = [];
  let menuElements = Array.from(container.children);
  menuElements = menuElements.concat(Array.from(document.getElementById("marquee-track").children));
  menuElements = menuElements.concat(Array.from(document.getElementById("edit-grid").children));
  menuElements = menuElements.concat(Array.from(topItemContainer.children));
  menuElements.forEach(element => { element.remove() });
  loadMenu();
}
document.addEventListener("MarqueeItemsLoaded", () => {
  loadAtcButtons();
  startMenuItemEvents();
});

function doQtyControls(minusBtn, plusBtn, qtyInput, changes = null) {
  minusBtn.onclick = () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1)
    if (changes) changes(Number(qtyInput.value))
  };

  plusBtn.onclick = () => {
    qtyInput.value = Number(qtyInput.value) + 1
    if (changes) changes(Number(qtyInput.value))
  };

  qtyInput.changes = () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value))
    if (changes) changes(Number(qtyInput.value))
  };
}

function loadAtcButtons() {
  let buttons = document.querySelectorAll(".add-cart-btn");

  buttons.forEach(btn => {
    btn.onclick = () => {
      let title = btn.dataset.title;
      let price = Number(btn.dataset.price);

      let parent = btn.closest(".card, .card-large, .marquee-card");
      let qtyInput = parent.querySelector(".qval");
      let qty = qtyInput ? Number(qtyInput.value) : 1;

      let imgElem = parent.querySelector("img");
      let imgSrc = imgElem ? imgElem.src : null;

      updCartItems("add", {
        item: title,
        price: price,
        qty: qty,
        img: imgSrc
      });
    };
  });
}

function startCartItemEvents() {
  let items = document.querySelectorAll(".cart-item, .checkout-item")
  console.log(items);

  items.forEach((item) => {
    let index = Number(item.dataset.index)
    let removeBtn = item.querySelector(".ci-remove")
    let minusBtn = item.querySelector(".minus")
    let plusBtn = item.querySelector(".plus")
    let qtyInput = item.querySelector(".qval")

    removeBtn.onclick = () => {
      updCartItems("remove", { index })
    };

    doQtyControls(minusBtn, plusBtn, qtyInput, (newQty) => {
      updCartItems("modify", { index, qty: newQty })
    });
  });
}

function startMenuItemEvents() {
  document.querySelectorAll(".card .qty").forEach(q => {
    let minusBtn = q.querySelector(".minus");
    let plusBtn = q.querySelector(".plus");
    let qtyInput = q.querySelector(".qval");

    doQtyControls(minusBtn, plusBtn, qtyInput);
  });
}

function getPrice(name) {
    const item = menuItems.find(m => m.title === name);
    return item ? Number(item.price) : 0;
}


loadMenu();