const products = [
    { 
        name: "Coffee Beans", 
        displayPrice: "$15.00", 
        price: 15.00, 
        category: "beans", 
        desc: "Premium organic roast with rich, full-bodied flavor and hints of chocolate and caramel.", 
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
        details: {
            origin: "Single-origin Colombian beans",
            roastLevel: "Medium roast",
            weight: "12 oz (340g)",
            features: ["Organic certified", "Fair trade", "Freshly roasted", "Whole bean"]
        }
    },
    { 
        name: "French Press", 
        displayPrice: "$25.00", 
        price: 25.00, 
        category: "equipment", 
        desc: "Classic glass and steel French press coffee maker for rich, full-bodied brewing.", 
        image: "https://images.unsplash.com/photo-1545665225-b23b99e4d45e?w=500",
        details: {
            capacity: "34 oz (1 liter)",
            material: "Borosilicate glass with stainless steel",
            brewTime: "4 minutes",
            features: ["Heat-resistant glass", "Durable steel frame", "Easy to clean", "Perfect for 4-8 cups"]
        }
    },
    { 
        name: "Ceramic Mug", 
        displayPrice: "$12.00", 
        price: 12.00, 
        category: "accessories", 
        desc: "Hand-crafted ceramic mug with ergonomic design and beautiful glazed finish.", 
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500",
        details: {
            capacity: "12 oz (350ml)",
            material: "High-quality ceramic with food-safe glaze",
            dimensions: "4.5" H x 3.5" W",
            features: ["Microwave safe", "Dishwasher safe", "Comfortable grip", "Chip resistant"]
        }
    },
    { 
        name: "Burr Grinder", 
        displayPrice: "$45.00", 
        price: 45.00, 
        category: "equipment", 
        desc: "Professional-grade burr grinder with adjustable settings for consistent, uniform grinding.", 
        image: "https://images.unsplash.com/photo-1495774856032-8b90bbb32b32?w=500",
        details: {
            grindSettings: "15 adjustable settings",
            capacity: "8 oz bean hopper",
            power: "110W motor",
            features: ["Conical burr design", "Anti-static", "Easy cleanup", "Consistent particle size"]
        }
    }
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
    const featuresHtml = p.details.features.map(feature => `<li>${feature}</li>`).join('');
    const detailsKeys = Object.keys(p.details).filter(key => key !== 'features');
    const specificationsHtml = detailsKeys.map(key => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
        return `<p><strong>${label}:</strong> ${p.details[key]}</p>`;
    }).join('');
    
    modalBody.innerHTML = `
        <h2>${p.name}</h2>
        <img src="${p.image}" alt="${p.name}" style="width: 100%; max-width: 300px; margin: 10px 0; border-radius: 8px;">
        <p class="price" style="font-size: 1.5em; margin: 15px 0;">${p.displayPrice}</p>
        <p style="margin-bottom: 20px;">${p.desc}</p>
        
        <div style="margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px; color: #2c3e50;">Specifications:</h3>
            ${specificationsHtml}
        </div>
        
        <div>
            <h3 style="margin-bottom: 10px; color: #2c3e50;">Features:</h3>
            <ul style="margin-left: 20px;">
                ${featuresHtml}
            </ul>
        </div>
        
        <button onclick="addToCart('${p.name}'); modal.style.display = 'none';" 
                style="background-color: #27ae60; color: white; border: none; padding: 12px 24px; 
                       border-radius: 5px; cursor: pointer; margin-top: 20px; width: 100%;">
            Add to Cart
        </button>
    `;
    modal.style.display = "block";
}

document.querySelector('.close-btn').onclick = () => modal.style.display = "none";
searchBar.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
priceSort.addEventListener('change', filterProducts);
resetBtn.onclick = () => { searchBar.value = ""; categoryFilter.value = "all"; priceSort.value = "default"; filterProducts(); };

displayProducts(products);
