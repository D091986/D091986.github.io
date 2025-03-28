
const productsContainer = document.getElementById("products");
const cartContainer = document.getElementById("cart");
const totalContainer = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const clearCartButton = document.getElementById("clear-cart");

let cart = JSON.parse (localStorage.getItem("cart"))||[];


fetch("products.json").then(response => response.json())  //convertit la réponse en json
 .then(products => 
    {products.forEach(product =>{
        const productCard = document.createElement("div");
        productCard.classList.add("col-md-6");
        productCard.innerHTML = `<div  class="card mb-4">
        <img src="${product.img}" class="card-img-top" alt="${product.nom}">
         <div class="card-body">
    <h5 class="card-title text-center">${product.nom}</h5>
    <p class="card-text card-description text-center">${product.description}</p>
     <p class="card-text card-prix text-center">${product.prix} $</p>
    <div class="d-flex flex-column justify-content-center align-items-center">
    <button 
     data-id="${product.id}"
        data-nom="${product.nom}"
          data-prix="${product.prix}"
          data-img="${product.img}"
        data-description="${product.description}"  class="btn btn-primary voir-details w-75 mb-2 btn-card">Voir détails</button>

        <button 
     data-id="${product.id}"
        data-nom="${product.nom}"
          data-prix="${product.prix}"        
          data-img="${product.img}"
        data-description="${product.description}"  class="btn btn-primary add-to-cart w-75 btn-card">Ajouter au panier</button>
        </div>
  </div>
        </div>` ;
        productsContainer.appendChild(productCard);
         
    }); 
   updateCart();

 document.querySelectorAll(".voir-details").forEach(button => {
    button.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const nom = e.target.getAttribute("data-nom");
        const prix = e.target.getAttribute("data-prix");
        const description = e.target.getAttribute("data-description");
        const  img= e.target.getAttribute("data-img");

        showProductModal(id, nom, prix, img, description);
         });


            })
 document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const nom = e.target.getAttribute("data-nom");
      const prix = e.target.getAttribute("data-prix");
      const description = e.target.getAttribute("data-description");
      const  img= e.target.getAttribute("data-img");

      addToCart(id, nom, prix, img);
           });


  })
    

   function showProductModal(id, nom, prix, img, description){
    const modalTitle = document.getElementById("modal-title");

    modalTitle.textContent = nom;
    const modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = `<img src="${img}" class="img-fluid mb-3" alt="${nom}">
    <p class="text-center">Prix : ${prix}</p>;
    <p class="text-center">Description : ${description}</p> `;
const btn = document.getElementById('add');
btn.setAttribute("data-id",id);
btn.setAttribute("data-nom",nom);
btn.setAttribute("data-prix",prix);

    const myModal = new bootstrap.Modal(document.getElementById("productModal")); 
myModal.show();
  
  }  


  function addToCart(id, nom, prix, img) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++; // Augmenter la quantité
    } else {
        cart.push({ id, nom, prix, img, quantity: 1 });
    }

    updateCart(); // Mettre à jour l'affichage
    saveCart();   // Sauvegarder dans le localStorage
}

function updateCart() {
  cartContainer.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach(item => {
      total += item.prix * item.quantity; // Calcul du total
      itemCount += item.quantity; // Nombre total d'articles

      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
      listItem.innerHTML = `
          ${item.nom} X ${item.quantity} - ${(item.prix * item.quantity).toFixed(2)} $
          <button class="btn btn-danger remove-item" data-id="${item.id}"> X </button>
      `;

      cartContainer.appendChild(listItem);
  });

  totalContainer.textContent = total.toFixed(2); // Affichage du total
  cartCount.textContent = itemCount; // Affichage du nombre total d'articles

  // Ajouter un événement sur les boutons "X"
  document.querySelectorAll(".remove-item").forEach(button => {
      button.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          removeFromCart(id); // Appel à la fonction pour supprimer un produit du panier
          
      });
      
  });
  displayClearCartButton();
   // Afficher ou masquer le bouton "Vider le panier"
};
   function updateCart(){
    cartContainer.innerHTML = "";
    let total = 0;
    let itemCount = 0;
    cart.forEach(item => {
      total += item.prix * item.quantity;
      itemCount += item.quantity;
console.log(itemCount)
      const listItem = document.createElement ("li");
      listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center"); //ne pa faire sur le projet
      listItem.innerHTML = `
      ${item.nom} X ${item.quantity} - ${item.prix *item.quantity} $
      <button class="btn btn-danger remove-item"
      data-id="${item.id}"> X </button>`
  
   cartContainer.appendChild(listItem);
    });
    totalContainer.textContent = total.toFixed(2);
    cartCount.textContent = itemCount;
    //Ajouter écouteur sur les boutons X
    document.querySelectorAll(".remove-item").forEach(button => {
   button.addEventListener("click", (e) => {
    const id = e.target.getAttribute("data-id")
    
    removeFromCart(id);
   });

    });
  displayClearCartButton();
  }; 

  function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  if(index !== -1){
  if(cart[index].quantity > 1) 
    {
    cart[index].quantity--;

  }
  else{
    cart.splice(index,1);
  }
 }
   updateCart();
  saveCart();
  }

  function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart));

  }

  function clearCart(){
    cart = [];
    saveCart();
    updateCart();
    
  }

  function displayClearCartButton()
  {
    if(cart.length > 0) {
      clearCartButton.style.display = "block";
    }
    else{
      clearCartButton.style.display = "none";
    }
  }

  clearCartButton.addEventListener("click", () => {
    if(confirm("voulez-vous vraiment vider votre panier ?")){
      clearCart();
    }
  });

  });



 
  // bouton retour en haut
  const boutonRetour = document.querySelector(".arrow");

  window.addEventListener('scroll', () =>{
  
  if(window.innerWidth > 800 && window.scrollY > 800) {
  
      boutonRetour.classList.add('display');
  }
  else {
  
      boutonRetour.classList.remove('display');
  

  }
  
  })
  
  boutonRetour.addEventListener('click', () =>{
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      })
  })


// bouton contact
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            alert('Formulaire de contact soumis avec succès !');
            form.reset(); 
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            modal.hide();
        }
    });

    function validateForm() {
        function showError(input, message) {
            const feedback = input.nextElementSibling;
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = message;
        }

        function showSuccess(input) {
            const feedback = input.nextElementSibling;
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            feedback.textContent = "";
        }

        let isValid = true;

        const contactName = document.getElementById('contactName');
        if (contactName.value.trim().length < 3 ) {
            showError(contactName, "Veuillez entrer votre nom.");
            isValid = false;
        } else {
            showSuccess(contactName);
        }

        const contactEmail = document.getElementById('contactEmail');
        const emailPattern = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,3}$/;
        if (!emailPattern.test(contactEmail.value)) {
            showError(contactEmail, "Veuillez entrer une adresse email valide.");
            isValid = false;
        } else {
            showSuccess(contactEmail);
        }

        const contactMessage = document.getElementById('contactMessage');
        if (contactMessage.value.trim().length < 10) {
            showError(contactMessage, "Veuillez entrer votre message.");                
            isValid = false;
        } else {
            showSuccess(contactMessage);
        }

        return isValid;
    }
});
