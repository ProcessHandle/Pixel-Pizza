let menuItems = [];
console.log("script loaded")

let container = document.getElementById("menu-content"); //update later

let topItemContainer = document.getElementById("top-product-container");
let promotedItemContainer = document.getElementById("product-marquee-container");

class MenuItem{
    constructor(title, imgUrl, price=0, description="")
    {
        this.title=title;
        this.imgUrl=imgUrl;
        this.price=price;
        this.description = description;

        this.element = document.createElement("div");
        this.element.classList.add("card");

        this.updateHTML();
        this.appendToDoc();
    }

    updateHTML(){
        console.log("updateHTML()");
        // this.element.style.backgroundImage=this.imgUrl; //possibly delete later

        this.element.innerHTML =
            `<h2>${this.title}</h2>
            <div class="card-info">
                <p class="card-price">${this.price}<p>
                <button class="add-cart-btn">Add To Cart</button>
            </div>`
    }

    appendToDoc(){
        container.appendChild(this.element);
    }


}

menuItems.push(new MenuItem("Example", "images/temp-pizza.png", "50", "This pizza is definitely appetizing and delicious"));