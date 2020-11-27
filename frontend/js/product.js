function manageBasketDisplay() {
  //Vérifier si le panier possède au moins une caméra :
  if (localStorage.getItem("basket") === null || localStorage.getItem("basket") === "[]") {
    document.querySelector("#basketPage").parentNode.hidden = true;
  } else {
    document.querySelector("#basketPage").parentNode.hidden = false;
  }
}

function showCamera(data) {
  // Création des éléments
  let name = document.querySelector("#name"),
    price = document.querySelector("#price"),
    description = document.querySelector("#description"),
    image = document.querySelector("#image"),
    selectLenses = document.querySelector("select");

  // Remplissage des éléments
  name.appendChild(document.createTextNode(data.name));
  image.src = data.imageUrl;
  price.appendChild(document.createTextNode((data.price / 100).toLocaleString("en") + " $"));
  description.appendChild(document.createTextNode(data.description));
  for (i = 0; i < data.lenses.length; i++) {
    let option = document.createElement("option");
    option.textContent = data.lenses[i];
    selectLenses.appendChild(option);
  }
}

function getCamera(id) {
  fetch("http://localhost:3000/api/cameras/" + id)
    .then(response => response.json())
    .then(data => {
      showCamera(data);
      // Ecouter les clics sur le bouton addToBasket
      let addItemToBasket = document.querySelector("#addToBasket");
      addItemToBasket.addEventListener("click", function () {addToBasket(data)}, false);
  })
}

function addToBasket(data) {
  //Création du panier dans le localStorage s'il n'existe pas déjà
  if (typeof localStorage.getItem("basket") !== "string") {
    let basket = [];
    localStorage.setItem("basket", JSON.stringify(basket));
  }
  //Récupérer les informations de la caméra
  data.selectedLense = document.querySelector("option:checked").innerText;
  data.selectedQuantity = document.querySelector("input").value;
  delete data.lenses;
  //création d'une variable pour manipuler le panier
  let basket = JSON.parse(localStorage.getItem("basket"));
  //Vérification que l'item n'existe pas déjà dans le panier
  let isThisItemExist = false;
  let existingItem;
  for (let i = 0; i < basket.length; i++) {
    if (data._id === basket[i]._id && data.price === basket[i].price && data.selectedLense === basket[i].selectedLense) {
      isThisItemExist = true;
      existingItem = basket[i];
    }
  }
  //Ajouter la caméra au panier
  if (isThisItemExist === false) {
    basket.push(data);
    localStorage.setItem("basket", JSON.stringify(basket));
  } else {
    existingItem.selectedQuantity = parseInt(existingItem.selectedQuantity, 10) + parseInt(data.selectedQuantity, 10);
    localStorage.setItem("basket", JSON.stringify(basket));
  }
  manageBasketDisplay();
}

let params = (new URL(document.location)).searchParams;
let id = params.get("id");
manageBasketDisplay();
getCamera(id);