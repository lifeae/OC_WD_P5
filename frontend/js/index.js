function manageBasketDisplay() {
  //Vérifier si le panier possède au moins une caméra :
  if (localStorage.getItem("basket") === undefined || localStorage.getItem("basket") === []) {
      document.querySelector("#basketPage").parentNode.hidden = true;
  } else {
      document.querySelector("#basketPage").parentNode.hidden = false;
  }
}

function getCamerasIndex() {
  fetch("http://localhost:3000/api/cameras/") //appel api, callback, ... return une promesse
    .then(
      response => { //fonction anonyme prend pour parametre response et return response.json
        return response.json();
      })
    .then(
      function (data) {
        for (let i = 0; i < data.length; i++) {
          // Création des éléments
          let cameras = document.querySelector(".cameras"),
            cameraItem = document.createElement("div"),
            cameraItemBody = document.createElement("div"),
            name = document.createElement("h4"),
            price = document.createElement("h5"),
            description = document.createElement("p"),
            image = document.createElement("img"),
            productPageLink = document.createElement("a"),
            urlPage = "product.html?id=" + data[i]._id;

          // Remplissage des éléments
          name.appendChild(document.createTextNode(data[i].name));
          image.src = data[i].imageUrl;
          price.appendChild(document.createTextNode((data[i].price / 100).toLocaleString("en") + " $"));
          description.appendChild(document.createTextNode(data[i].description));
          productPageLink.appendChild(document.createTextNode("Voir la page du produit"));
          productPageLink.setAttribute('href', urlPage);

          //Stylisation des éléments
          productPageLink.classList.add("btn", "btn-secondary");
          productPageLink.setAttribute("role", "button");
          cameraItem.classList.add("card", "border-light", "text-center", "w-25", "m-4");
          image.classList.add("card-img-top");
          cameraItemBody.classList.add("card-body");
          name.classList.add("card-title");
          productPageLink.classList.add("card-footer");

          // Placement des éléments de la camera dans son li
          cameraItemBody.appendChild(price);
          cameraItemBody.appendChild(description);
          cameraItem.appendChild(name);
          cameraItem.appendChild(image);
          cameraItem.appendChild(cameraItemBody);
          cameraItem.appendChild(productPageLink);

          // Placement de la camera dans le ul
          cameras.appendChild(cameraItem);
        }
      }
    )
}

manageBasketDisplay();
getCamerasIndex();