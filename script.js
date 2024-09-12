const productContainer = document.querySelector(".product-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const logoText = document.getElementById("logo-text");
const cartIcon = document.getElementById("cart-icon");
const favoritesIcon = document.getElementById("favorites-icon");
let productsData = [];
let cart = [];
let favorites = [];
function fetchData() {
    fetch('https://dummyjson.com/products')
        .then(response => response.json())
        .then(data => {
            productsData = data.products;
            createCard(productsData);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function createCard(products) {
    empty();
    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Discounted Price:</strong> $${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} <span class="discount">(${product.discountPercentage}% off)</span></p>
            <p><strong>Rating:</strong> ${product.rating}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="addToFavorites(${product.id})">Add to Favorites</button>
        `;

        productContainer.appendChild(div);
    });
}
function searchFunction() {
    const search = searchInput.value ? searchInput.value.toLowerCase() : "";
    if (search === "") {
        createCard(productsData); 
    } else {
        const filteredProducts = productsData.filter(product =>
            product.title.toLowerCase().includes(search)
        );
        createCard(filteredProducts);
    }
    searchInput.value = "";
}


function empty() {
    productContainer.innerHTML = "";
}

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product && !cart.includes(product)) {
        cart.push(product);
        alert(`${product.title} added to cart`);
    }
}

function addToFavorites(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product && !favorites.includes(product)) {
        favorites.push(product);
        alert(`${product.title} added to favorites`);
    }
}
searchBtn.addEventListener("click", searchFunction);
logoText.addEventListener("click", (e) => {
    e.preventDefault(); 
    createCard(productsData);
});

fetchData();
