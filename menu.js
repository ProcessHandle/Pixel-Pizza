let menuItems = [];
console.log("script loaded")

let container = document.getElementById("menu-grid");

let topItemContainer = document.getElementById("top-product-container");
let promotedItemContainer = document.getElementById("marquee-track");

class MenuItem {
  constructor(title, imgUrl, price = 0, description = "", topProduct, promotedProduct) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.price = price;
    this.description = description;
    if(topProduct !== undefined)
    {
      this.topProduct = topProduct;
    }

    if(promotedProduct !== undefined)
    {
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
    if(this.topProduct)
    {
      this.topProductElement = this.element.cloneNode(true);
      this.topProductElement.classList.add("card-large");
      topItemContainer.appendChild(this.topProductElement);
    }
    if(this.promoted)
    {
      this.promotedElement = this.element.cloneNode(true);
      this.promotedElement.classList.add("marquee-card");
      let duplicateNode = this.element.cloneNode(true);
      duplicateNode.classList.add("marquee-card");
      let length = promotedItemContainer.children.length;
      console.log(length);
      console.log(`length: ${length/2}`);
      if(length > 0)
      {
        promotedItemContainer.insertBefore(this.promotedElement, promotedItemContainer.children[length/2]);
      }
      else
      {
        promotedItemContainer.appendChild(this.promotedElement);
      }
      promotedItemContainer.appendChild(duplicateNode);
    }
  }


}

// Load our template menu for now. Will need to wrap this inside a condition to check if the menu is in our storage then save it.
fetch('menu-template.json').then(res => res.json()).then(data => {
  data.menuItems.forEach(item => {
    menuItems.push(new MenuItem(item.title, item.image, item.price, item.description, item.topProduct, item.promoted));
  })
})

