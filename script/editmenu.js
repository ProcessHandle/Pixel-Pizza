document.addEventListener("MenuItemsLoaded", (event) => { updateEditMenu() })

function updateEditMenu() {
  console.log("updateEditMenu()");
  menuItems.forEach((item => { UpdateEditHTML(item) }));
  createAddItemCard();
}

function UpdateEditHTML(item) {
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
        <div class="label-row">
          <label class="slider-switch">
            <input class="promoted-toggle" type="checkbox">
            <span class="slider"></span>
          </label>
          <label class="slider-label">Promoted</label>
        </div>
        <button class="remove-item-btn" type="button" onclick="deleteItem(this)">Remove</button>
        <button class="save-btn" onclick="saveEdit(this)">Save</button>
      </div>`;

  if (item.promoted) {
    thisElement.getElementsByClassName("promoted-toggle")[0].checked = true;
  }

  console.log(thisElement);

  document.getElementById("edit-grid").appendChild(thisElement);
}

function createAddItemCard() {
  let thisElement = document.createElement("div");
  thisElement.classList.add('card', 'new-item-card');
  thisElement.onclick = function () { addNewItem(thisElement) }
  thisElement.innerHTML =
    `
  <img src="images/new-item-btn.png" alt="new item">
  <div class="card-info">
    <h2>Add New Item</h2>
  </div>
  `
  document.getElementById("edit-grid").appendChild(thisElement);
}

function addNewItem(item) {
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
        <div class="label-row">
          <label class="slider-switch">
            <input class="promoted-toggle" type="checkbox">
            <span class="slider"></span>
          </label>
          <label class="slider-label">Promoted</label>
        </div>
        <button class="remove-item-btn" type="button" onclick="cancelNewItem(this)">Cancel</button>
        <button class="save-btn" onclick="saveNewItem(this)">Save</button>
      </div>`;
}

function cancelNewItem(itemButton) {
  itemButton.parentElement.parentElement.remove();
  createAddItemCard();
}

function saveNewItem(itemButton) {
  console.log("saveNewItem");
  let item = itemButton.parentElement.parentElement;
  let itemName = item.getElementsByTagName("textarea")[0].value;
  let itemPrice = item.getElementsByTagName("input")[0].value.replace("$", "");
  let promoted = false;
  if (item.getElementsByClassName("promoted-toggle")[0].checked) {
    promoted = true;
  }
  menuItems.push(new MenuItem(itemName, "", itemPrice, "", false, promoted));
  storeMenu();
  reloadMenu();
}

function saveEdit(itemButton) {
  let grid = document.getElementById("edit-grid");
  let item = itemButton.parentElement.parentElement;
  let itemName = item.getElementsByTagName("textarea")[0].value;
  let itemPrice = item.getElementsByTagName("input")[0].value.replace("$", "");
  let itemIndex = Array.from(grid.children).indexOf(item);
  let promoted = false;
  if (item.getElementsByClassName("promoted-toggle")[0].checked) {
    promoted = true;
  }

  menuItems[itemIndex].title = itemName;
  menuItems[itemIndex].price = itemPrice;
  menuItems[itemIndex].promoted = promoted;

  storeMenu();
  reloadMenu();

}

function deleteItem(itemButton) {
  let grid = document.getElementById("edit-grid");
  let item = itemButton.parentElement.parentElement;
  let itemName = item.getElementsByTagName("textarea")[0].value;
  let itemPrice = item.getElementsByTagName("input")[0].value.replace("$", "");
  let itemIndex = Array.from(grid.children).indexOf(item);

  menuItems.splice(itemIndex, 1);

  storeMenu();
  reloadMenu();

  /*
  ///////////////////////////////////////////////////
  should update later so that if the top product is
  deleted, it picks a new on based on sales data.
  ///////////////////////////////////////////////////
  */
}

function resizeTextarea(element) {
  element.style.height = "auto";
  element.style.height = element.scrollHeight + "px";
}