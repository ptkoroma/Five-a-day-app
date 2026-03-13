const products = [
    { name: "Coffee Beans", displayPrice: "$15.00", price: 15.00, category: "beans", desc: "Premium organic roast.", image: "https://via.placeholder.com/150" },
    { name: "French Press", displayPrice: "$25.00", price: 25.00, category: "equipment", desc: "Glass and steel brewer.", image: "https://via.placeholder.com/150" },
    { name: "Ceramic Mug", displayPrice: "$12.00", price: 12.00, category: "accessories", desc: "Hand-crafted mug.", image: "https://via.placeholder.com/150" },
    { name: "Burr Grinder", displayPrice: "$45.00", price: 45.00, category: "equipment", desc: "Adjustable burr settings.", image: "https://via.placeholder.com/150" }
];

let cartCount = parseInt(localStorage.getItem('myBusinessCartCount')) || 0;
document.getElementById('cart-count').innerText = cartCount;

const grid = document.getElementById('product-grid');
const searchBar = document.getElementById('search-bar');
const categoryFilter = document.getElementById('category-filter');
const priceSort = document.getElementById('price-sort');
const resetBtn = document.getElementById('reset-btn');
const modal = document.getElementById('product-modal');
const modalBody = document.getElementById('modal-body');

function displayProducts(filteredList) {
    grid.innerHTML = "";
    filteredList.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" onclick="openModal('${product.name}')">
            <h3>${product.name}</h3>
            <p class="price">${product.displayPrice}</p>
            <button onclick="addToCart('${product.name}')">Buy Now</button>
        `;
        grid.appendChild(card);
    });
}

function filterProducts() {
    const searchText = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOrder = priceSort.value;

    let filtered = products.filter(p => {
        return p.name.toLowerCase().includes(searchText) && (selectedCategory === "all" || p.category === selectedCategory);
    });

    if (sortOrder === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sortOrder === "high-low") filtered.sort((a, b) => b.price - a.price);

    displayProducts(filtered);
}

function addToCart(name) {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
    localStorage.setItem('myBusinessCartCount', cartCount);
}

function openModal(name) {
    const p = products.find(prod => prod.name === name);
    modalBody.innerHTML = `<h2>${p.name}</h2><p>${p.desc}</p><p class="price">${p.displayPrice}</p>`;
    modal.style.display = "block";
}

document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
searchBar.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
priceSort.addEventListener('change', filterProducts);
resetBtn.onclick = () => { searchBar.value = ""; categoryFilter.value = "all"; priceSort.value = "default"; filterProducts(); };

displayProducts(products);
