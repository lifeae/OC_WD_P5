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

function basket() {
    for (let i = 0; i < basketItems.length; i++) {
        productsID.push(basketItems[i]._id);
        // Création des éléments
        let basket = document.querySelector("#basket"),
            basketItem = document.createElement("div"),
            basketItemBody = document.createElement("div"),
            nameAndQuantity = document.createElement("h3"),
            price = document.createElement("h4"),
            image = document.createElement("img"),
            selectedLense = document.createElement("h4");

        // Remplissage des éléments
        nameAndQuantity.appendChild(document.createTextNode("[" + basketItems[i].name + "]" + " x" + basketItems[i].selectedQuantity));
        image.src = basketItems[i].imageUrl;
        selectedLense.appendChild(document.createTextNode(basketItems[i].selectedLense));
        price.appendChild(document.createTextNode((basketItems[i].price * basketItems[i].selectedQuantity / 100).toLocaleString("en") + " $"));

        //Stylisation des éléments
        basketItem.classList.add("card", "border-light", "text-center", "m-4", "w-25");
        basketItem.setAttribute("data-id", basketItems[i]._id);
        basketItem.setAttribute("data-lense", basketItems[i].selectedLense);
        image.classList.add("card-img-top");
        basketItemBody.classList.add("card-body");
        nameAndQuantity.classList.add("card-title");

        // Placement des éléments de la camera dans son li
        basketItemBody.appendChild(price);
        basketItem.appendChild(nameAndQuantity);
        basketItem.appendChild(selectedLense);
        basketItem.appendChild(image);
        basketItem.appendChild(basketItemBody);

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

manageBasketDisplay();
basket();
let orderId = localStorage.getItem("orderId");
document.querySelector("strong").appendChild(document.createTextNode(orderId));
localStorage.removeItem("basket");
manageBasketDisplay()
localStorage.removeItem("orderId");