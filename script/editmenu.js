document.addEventListener("MenuItemsLoaded", (event) => {updateEditMenu()})

function updateEditMenu()
{
    console.log("updateEditMenu()");
    menuItems.forEach((item => {UpdateEditHTML(item)}));
    createAddItemCard();
}

function UpdateEditHTML(item)
{
    let thisElement = document.createElement("div");
    thisElement.classList.add('edit-card');

    thisElement.innerHTML =
      `
      <div class="edit-img-container">
        <img src="${'https://www.nicepng.com/png/full/340-3400354_pizza-pixel-pixels-pixeles-tumblr-food-pixel-pizza.png'}" alt="pizza">
    </div>
    <div class="card-info">
        <textarea oninput="resizeTextarea(this)">${item.title}</textarea>
        <input type="text" value="$${item.price}"></input>
        <button class="remove-item-btn" type="button">Remove</button>
        <button
          class="save-btn"
          data-title="${item.title}"
          data-price="${item.price}"
        >Save</button>
      </div>`;

      console.log(thisElement);

      document.getElementById("edit-grid").appendChild(thisElement);
}

function createAddItemCard()
{
  let thisElement = document.createElement("div");
  thisElement.classList.add('card', 'new-item-card');
  thisElement.onclick = function() {addNewItem(thisElement)}
  thisElement.innerHTML = 
  `
  <img src="images/new-item-btn.png" alt="new item">
  <div class="card-info">
    <h2>Add New Item</h2>
  </div>
  `
  document.getElementById("edit-grid").appendChild(thisElement);
}

function addNewItem(item)
{
  console.log('addNewItem()');
  item.classList.remove('card', 'new-item-card');
  item.classList.add('edit-card');
  item.onclick = null;
  item.innerHTML = 
  `
      <div class="edit-img-container">
        <img src="${'https://www.nicepng.com/png/full/340-3400354_pizza-pixel-pixels-pixeles-tumblr-food-pixel-pizza.png'}" alt="pizza">
    </div>
    <div class="card-info">
        <textarea oninput="resizeTextarea(this)">Name</textarea>
        <input type="text" value="$0.00"></input>
        <button class="remove-item-btn" type="button" onclick="cancelNewItem(this)">Cancel</button>
        <button class="save-btn" onclick="saveNewItem(this)">Save</button>
      </div>`;
}

function cancelNewItem(itemButton)
{
  itemButton.parentElement.parentElement.remove();
  createAddItemCard();
}

function saveNewItem(itemButton)
{
  console.log("saveNewItem")
  let item = itemButton.parentElement.parentElement;
  let itemName = item.getElementsByTagName("textarea")[0].value;
  let itemPrice = item.getElementsByTagName("input")[0].value.replace("$", "");
  menuItems.push(new MenuItem(itemName, "", itemPrice));
  saveMenu();
}

function resizeTextarea(element)
{
  element.style.height = "auto";
  element.style.height = element.scrollHeight + "px";
}