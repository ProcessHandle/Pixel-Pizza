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
  constructor(title, imgUrl, price = 0, description = "", topProduct, promotedProduct) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.description = description;
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
      `<h2>${this.title}</h2>
      <img src="${'https://www.nicepng.com/png/full/340-3400354_pizza-pixel-pixels-pixeles-tumblr-food-pixel-pizza.png'}" alt="pizza">
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
        menuItems.push(new MenuItem(item.title, item.image, item.price, item.description, item.topProduct, item.promoted));
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

loadMenu();