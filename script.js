const products = [
    { name: "Soccer Jersey", displayPrice: "$15.00", price: 15.00, category: "t-shirt", rating: 5, desc: "Premium organic roast.", image: "https://image2url.com/r2/default/images/1773427906786-83745768-1374-4571-bcb7-61557308e548.jpeg?w=500" },
    { name: "T-Shirt", displayPrice: "$25.00", price: 25.00, category: "hoody", rating: 5, desc: "Glass and steel brewer.", image: "https://image2url.com/r2/default/images/1773427997465-fa48ef40-44fa-4c59-95e7-670ab3f057dc.jpeg?w=500", reviews: [] },
    { name: "Hoody", displayPrice: "$12.00", price: 12.00, category: "soccer-jersey", onSale: true, rating: 5, desc: "Hand-crafted mug.", image: "https://image2url.com/r2/default/images/1773428096240-e914b556-a799-46d5-bb3f-66e86c29bd9b.jpeg?w=500", reviews: [] },
    { name: "T-Shirt", displayPrice: "$45.00", price: 45.00, category: "hoody",rating: 5, desc: "Adjustable burr settings.", image: "https://image2url.com/r2/default/images/1773428188404-bc3ccc00-a6f0-4f4f-8d58-334c95bdc2c6.jpeg?w=500", reviews: [] }
    
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
    const reviewsHTML = p.reviews.map(rev => `<p class="review-item">💬 ${rev}</p>`).join('');

    modalBody.innerHTML = `
        <img src="${p.image}" style="width:150px">
        <h2>${p.name}</h2>
        <p>${p.desc}</p>
        
        <button id="share-btn" onclick="shareProduct('${p.name}')">🔗 Share Product</button>
        
        <hr>
        <h3>Customer Reviews</h3>
        <div id="reviews-list">${p.reviews.length > 0 ? reviewsHTML : '<p>No reviews yet.</p>'}</div>
        <div class="add-review">
            <input type="text" id="new-review" placeholder="Write a review...">
            <button onclick="submitReview('${p.name}')">Post</button>
        </div>
    `;
    modal.style.display = "block";
}

function shareProduct(name) {
    const shareBtn = document.getElementById('share-btn');
    
    // 1. Create the URL (This uses the current page URL + a tag for the item)
    // Example: https://your-site.com/?item=Coffee-Beans
    const productLink = `${window.location.origin}${window.location.pathname}?item=${encodeURIComponent(name)}`;

    // 2. Copy to Clipboard
    navigator.clipboard.writeText(productLink).then(() => {
        // 3. Visual Feedback
        const originalText = shareBtn.innerText;
        shareBtn.innerText = "✅ Link Copied!";
        shareBtn.style.backgroundColor = "#2ecc71";

        setTimeout(() => {
            shareBtn.innerText = originalText;
            shareBtn.style.backgroundColor = ""; // Goes back to CSS default
        }, 2000);
    });
}

function submitReview(productName) {
    const input = document.getElementById('new-review');
    const reviewText = input.value.trim();

    if (reviewText) {
        // Find the product and push the new review
        const p = products.find(prod => prod.name === productName);
        p.reviews.push(reviewText);
        
        // Refresh the modal to show the new review
        openModal(productName);
    }
}

const newsletterModal = document.getElementById('newsletter-modal');
const newsletterForm = document.getElementById('newsletter-form');
const closeNewsletter = document.querySelector('.close-newsletter');

// 1. Check if the user has already seen/closed the popup
const hasSubscribed = localStorage.getItem('newsletterShown');

if (!hasSubscribed) {
    // 2. Set a timer for 10 seconds (10,000ms)
    setTimeout(() => {
        newsletterModal.style.display = "block";
    }, 10000);
}

// 3. Close Logic
closeNewsletter.onclick = () => {
    newsletterModal.style.display = "none";
    localStorage.setItem('newsletterShown', 'true'); // Don't show again
};

newsletterForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    console.log("Newsletter Sign-up:", email);
    
    alert("Thanks for signing up! Check your inbox for your 10% discount.");
    newsletterModal.style.display = "none";
    localStorage.setItem('newsletterShown', 'true');
};

function getStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += "★"; // Filled star
        } else {
            stars += "☆"; // Empty star
        }
    }
    return stars;
}

// Update the displayProducts function to include the stars
function displayProducts(filteredList) {
    grid.innerHTML = "";
    filteredList.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" onclick="openModal('${product.name}')">
            <h3>${product.name}</h3>
            <div class="stars">${getStars(product.rating)}</div>
            <p class="price">${product.displayPrice}</p>
            <button onclick="addToCart('${product.name}')">Buy Now</button>
        `;
        grid.appendChild(card);
    });
}

function displayProducts(filteredList) {
    grid.innerHTML = "";
    filteredList.forEach((product, index) => {
        // Create the sale badge HTML only if product.onSale is true
        const saleBadge = product.onSale ? `<span class="sale-badge">SALE</span>` : "";

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-image-container">
                ${saleBadge}
                <img src="${product.image}" onclick="openModal('${product.name}')">
            </div>
            <h3>${product.name}</h3>
            <div class="stars">${getStars(product.rating)}</div>
            <p class="price">${product.displayPrice}</p>
            <button onclick="addToCart('${product.name}')">Buy Now</button>
        `;
        grid.appendChild(card);
    });
}

// 1. Conversion rates (Relative to 1 USD)
const exchangeRates = {
    USD: { symbol: "$", rate: 1 },
    EUR: { symbol: "€", rate: 0.92 },
    GBP: { symbol: "£", rate: 0.79 }
};

const currencyPicker = document.getElementById('currency-picker');

function displayProducts(filteredList) {
    grid.innerHTML = "";
    
    // Get current currency settings
    const selectedCurrency = currencyPicker.value;
    const currencyInfo = exchangeRates[selectedCurrency];

    filteredList.forEach((product, index) => {
        // 2. Calculate the converted price
        const convertedPrice = (product.price * currencyInfo.rate).toFixed(2);
        const finalDisplayPrice = `${currencyInfo.symbol}${convertedPrice}`;

        const saleBadge = product.onSale ? `<span class="sale-badge">SALE</span>` : "";

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-image-container">
                ${saleBadge}
                <img src="${product.image}" onclick="openModal('${product.name}')">
            </div>
            <h3>${product.name}</h3>
            <div class="stars">${getStars(product.rating)}</div>
            <p class="price">${finalDisplayPrice}</p>
            <button onclick="addToCart('${product.name}')">Buy Now</button>
        `;
        grid.appendChild(card);
    });

    const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Set initial theme on load
document.documentElement.setAttribute('data-theme', currentTheme);
updateToggleText(currentTheme);

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleText(newTheme);
});

function updateToggleText(theme) {
    themeToggle.innerText = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
}
}
function updateBusinessStatus() {
    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-dot');
    
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();

    // Define hours: Open Mon-Fri (1-5), 9 AM (9) to 5 PM (17)
    const isOpenDay = day >= 1 && day <= 5;
    const isOpenHour = hour >= 9 && hour < 17;

    if (isOpenDay && isOpenHour) {
        statusText.innerText = "We are currently OPEN (9AM - 5PM)";
        statusDot.className = "open-dot";
    } else {
        statusText.innerText = "We are currently CLOSED (Opens Mon-Fri at 9AM)";
        statusDot.className = "closed-dot";
    }
}

// Run the check immediately
updateBusinessStatus();
// Optional: Update every minute so it changes exactly when you close
setInterval(updateBusinessStatus, 60000);

// 3. Re-run display whenever the currency changes
currencyPicker.addEventListener('change', filterProducts);

document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
searchBar.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
priceSort.addEventListener('change', filterProducts);
resetBtn.onclick = () => { searchBar.value = ""; categoryFilter.value = "all"; priceSort.value = "default"; filterProducts(); };

displayProducts(products);

// --- AUTO-OPEN LOGIC ---
function checkUrlForProduct() {
    // 1. Get the parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productToOpen = urlParams.get('item');

    if (productToOpen) {
        // 2. Find the product (we decode it because the URL encoded the spaces)
        const decodedName = decodeURIComponent(productToOpen);
        const exists = products.find(p => p.name === decodedName);

        if (exists) {
            // 3. Open the modal after a tiny delay to ensure the page is ready
            setTimeout(() => {
                openModal(decodedName);
            }, 500);
        }
    }
}

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page reload
    
    const data = new FormData(event.target);
    
    fetch("https://formspree.io/f/YOUR_UNIQUE_ID", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            contactForm.classList.add('hidden');
            formFeedback.classList.remove('hidden');
            contactForm.reset();
        } else {
            alert("Oops! There was a problem submitting your form");
        }
    });
});



// Run the check on every page load
window.addEventListener('load', checkUrlForProduct);