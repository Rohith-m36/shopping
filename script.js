const productContainer = document.querySelector(".product-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const logoText = document.getElementById("logo-text");
const cartIcon = document.getElementById("cart-icon");
const favoritesIcon = document.getElementById("favorites-icon");

let productsData = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

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

        // Update button text dynamically based on cart/favorites status
        const inCart = cart.some(p => p.id === product.id);
        const inFavorites = favorites.some(p => p.id === product.id);

        div.innerHTML = `
            <img src="${product.images[0]}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Discounted Price:</strong> $${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} <span class="discount">(${product.discountPercentage}% off)</span></p>
            <p><strong>Rating:</strong> ${product.rating}</p>
            <button class="cart-btn" onclick="toggleCart(${product.id})">${inCart ? "Remove from Cart" : "Add to Cart"}</button>
            <button class="favorites-btn" onclick="toggleFavorites(${product.id})">${inFavorites ? "Remove from Favorites" : "Add to Favorites"}</button>
        `;

        productContainer.appendChild(div);
    });
}

function toggleCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        if (cart.some(p => p.id === productId)) {
            // Remove from cart
            cart = cart.filter(p => p.id !== productId);
            alert(`${product.title} removed from cart`);
        } else {
            // Add to cart
            cart.push(product);
            alert(`${product.title} added to cart`);
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Store cart in local storage
        updateCartIcon(); // Update cart icon with new count
        createCard(productsData); // Re-render products
    }
}

function toggleFavorites(productId) {
    const product = productsData.find(p => p.id === productId);
    if (product) {
        if (favorites.some(p => p.id === productId)) {
            // Remove from favorites
            favorites = favorites.filter(p => p.id !== productId);
            alert(`${product.title} removed from favorites`);
        } else {
            // Add to favorites
            favorites.push(product);
            alert(`${product.title} added to favorites`);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Store favorites in local storage
        updateFavoritesIcon(); // Update favorites icon with new count
        createCard(productsData); // Re-render products
    }
}

function updateCartIcon() {
    cartIcon.textContent = `Cart (${cart.length})`; // Update cart icon with item count
}

function updateFavoritesIcon() {
    favoritesIcon.textContent = `Favorites (${favorites.length})`; // Update favorites icon with item count
}

function searchFunction() {
    const search = searchInput.value.trim().toLowerCase();
    if (search === "") {
        createCard(productsData); // Reset to all products if search is empty
    } else {
        const filteredProducts = productsData.filter(product =>
            product.title.toLowerCase().includes(search)
        );
        createCard(filteredProducts);
    }
}

function empty() {
    productContainer.innerHTML = ""; // Clear the product container before rendering new products
}

searchBtn.addEventListener("click", searchFunction);
logoText.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = ""; // Clear search input
    createCard(productsData); // Reset the product list when logo is clicked
});

// Update cart and favorites icon on initial load
updateCartIcon();
updateFavoritesIcon();

// Initial data fetch
fetchData();
