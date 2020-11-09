let basketItems = JSON.parse(localStorage.getItem("basket"));
let productsID = [];

function manageBasketDisplay() {
    //Vérifier si le panier possède au moins une caméra :
    if (localStorage.getItem("basket") === null || localStorage.getItem("basket") === "[]") {
        document.querySelector("#basketPage").parentNode.hidden = true;
    } else {
        document.querySelector("#basketPage").parentNode.hidden = false;
    }
}

function returnToHomePageIfUserEmptyTheBasket() {
    if (localStorage.getItem("basket") === null || localStorage.getItem("basket") === "[]") {
        window.location.href = "index.html";
    }
}

function basket() {
    for (let i = 0; i < basketItems.length; i++) {
        productsID.push(basketItems[i]._id);
        // Création des éléments
        let basket = document.querySelector("#basket"),
            basketItem = document.createElement("div"),
            basketItemBody = document.createElement("div"),
            name = document.createElement("h3"),
            price = document.createElement("h4"),
            image = document.createElement("img"),
            productPageLink = document.createElement("a"),
            urlPage = "product.html?id=" + basketItems[i]._id,
            selectedLense = document.createElement("h4"),
            quantity = document.createElement("div"),
            selectedQuantity = document.createElement("input"),
            modifyQuantityButton = document.createElement("button"),
            deleteItemButton = document.createElement("button");

        // Remplissage des éléments
        name.appendChild(document.createTextNode(basketItems[i].name));
        image.src = basketItems[i].imageUrl;
        productPageLink.appendChild(document.createTextNode("Voir la page du produit"));
        productPageLink.setAttribute('href', urlPage);
        selectedLense.appendChild(document.createTextNode(basketItems[i].selectedLense));
        modifyQuantityButton.appendChild(document.createTextNode("Modifier la quantité"));
        deleteItemButton.appendChild(document.createTextNode("Supprimer"));
        price.appendChild(document.createTextNode((basketItems[i].price * basketItems[i].selectedQuantity / 100).toLocaleString("en") + " $"));


        //Stylisation des éléments
        productPageLink.classList.add("btn", "btn-secondary");
        productPageLink.setAttribute("role", "button");
        basketItem.classList.add("card", "border-light", "text-center", "m-4", "w-25");
        basketItem.setAttribute("data-id", basketItems[i]._id);
        basketItem.setAttribute("data-lense", basketItems[i].selectedLense);
        image.classList.add("card-img-top");
        basketItemBody.classList.add("card-body");
        name.classList.add("card-title");
        productPageLink.classList.add("card-footer");
        quantity.classList.add("d-flex", "flex-row");
        selectedQuantity.classList.add("form-control", "w-25");
        selectedQuantity.setAttribute("value", basketItems[i].selectedQuantity);
        modifyQuantityButton.classList.add("modifyQuantity", "btn", "btn-light", "w-75");
        modifyQuantityButton.addEventListener("click", modifyQuantity, false);
        deleteItemButton.classList.add("deleteItem", "btn", "btn-danger", "m-3");
        deleteItemButton.addEventListener("click", deleteItem, false);

        // Placement des éléments de la camera dans son li
        basketItemBody.appendChild(price);
        basketItemBody.appendChild(quantity);
        quantity.appendChild(selectedQuantity);
        quantity.appendChild(modifyQuantityButton);
        basketItem.appendChild(name);
        basketItem.appendChild(selectedLense);
        basketItem.appendChild(image);
        basketItem.appendChild(basketItemBody);
        basketItem.appendChild(deleteItemButton);
        basketItem.appendChild(productPageLink);

        // Placement de la camera dans le ul
        basket.appendChild(basketItem);
    }
    totalPrice()
}

function totalPrice() {
    let total = 0;
    for (let j = 0; j < basketItems.length; j++) {
        total = total + (basketItems[j].price * basketItems[j].selectedQuantity);
    }
    document.querySelector("#total").appendChild(document.createTextNode("Total : " + (total / 100).toLocaleString("en") + " $"));
}

function modifyQuantity() {
    //Sélectionner le bouton puis la carte à laquelle il appartient
    let itemCard = event.target.parentNode.parentNode.parentNode;
    //Identifier l'item associé dans le local storage
    let itemId = itemCard.getAttribute("data-id");
    let itemLense = itemCard.getAttribute("data-lense");
    let basketItemIndex;
    for (let i = 0; i < basketItems.length; i++) {
        if (itemId === basketItems[i]._id && itemLense === basketItems[i].selectedLense) {
            basketItemIndex = i;
        }
    }
    //Modifier la quantité dans le local storage
    basketItems[basketItemIndex].selectedQuantity = event.target.previousSibling.value;
    localStorage.setItem("basket", (JSON.stringify(basketItems)));
    window.location.reload(true);
    alert("Quantité modifiée !");
}

function deleteItem() {
    //Sélectionner le bouton puis la carte à laquelle il appartient
    let itemCard = event.target.parentNode;
    //Identifier l'item associé dans le local storage
    let itemId = itemCard.getAttribute("data-id");
    let itemLense = itemCard.getAttribute("data-lense");
    let basketItemIndex;
    for (let i = 0; i < basketItems.length; i++) {
        if (itemId === basketItems[i]._id && itemLense === basketItems[i].selectedLense) {
            basketItemIndex = i;
        }
    }
    //Supprimer l'item dans le local storage
    basketItems.splice(basketItemIndex, 1);
    localStorage.setItem("basket", (JSON.stringify(basketItems)));
    window.location.reload(true);
    alert("Item supprimé !");
    returnToHomePageIfUserEmptyTheBasket()
}

function checkFieldValidity(input, regExp) {
    if (input.match(regExp) === null) {
        return "";
    }
    return input;
}

function submitPayment() {
    //Récupérer les informations du formulaire
    var firstName = document.querySelector("#firstName").value,
        lastName = document.querySelector("#lastName").value,
        address = document.querySelector("#address").value,
        city = document.querySelector("#city").value,
        email = document.querySelector("#email").value;

    //Définition des expressions régulières pour la vérification de la validité des champs
    let stringRegExp = "([A-Za-z0-9 _\-\u00C0-\u024F]+)",
        emailRegExp = /^([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i;
    //Vérification de la validité des champs
    firstName = checkFieldValidity(firstName, stringRegExp);
    lastName = checkFieldValidity(lastName, stringRegExp);
    address = checkFieldValidity(address, stringRegExp);
    city = checkFieldValidity(city, stringRegExp);
    email = checkFieldValidity(email, emailRegExp);

    //Les entrer dans un objet
    let contact = {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
    },
        products = productsID;
    //Récupérer l'orderId
    let orderId;
    fetch('http://localhost:3000/api/cameras/order', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contact: contact,
            products: products
        })
    })
        .then(response => response.json())
        .then(order => {
            localStorage.setItem("orderId", order.orderId);
            window.location.href = "order.html";
        });
}

manageBasketDisplay();
basket();
document.querySelector("#submitPayment").addEventListener("click", submitPayment, false);