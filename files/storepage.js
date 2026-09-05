function toggleCategoryMenu() {
    const sidebar = document.querySelector(".vertical-navbar");
    const overlay = document.getElementById("sidebarOverlay");
    const hamburger = document.getElementById("categoryMenuToggle");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    hamburger.classList.toggle("active");
}

function toggleSubcategories(element) {
    const subcategories = element.nextElementSibling;
    const arrow = element.querySelector(".toggle-icon");

    subcategories.classList.toggle("hidden");
    arrow.classList.toggle("rotate");
}

let products = [];
let selectedCategory = "";

function renderProducts() {
    const productsection = document.querySelector(".product-section");
    const noItemContainer = productsection.querySelector(".noitem-container");
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    const selectedCountry = document.getElementById("product_country").value;

    productsection.querySelectorAll(".product-card").forEach(card => card.remove());

    const filteredProducts = products
        .filter(product => {
            const matchesCategory = !selectedCategory || product.product_category.some(category =>
                category.category_name === selectedCategory
            );
            const matchesCountry = !selectedCountry || product.product_country === selectedCountry;
            const matchesSearch = product.product_name.toLowerCase().includes(searchTerm);

            return matchesCategory && matchesCountry && matchesSearch;
        })
        .sort((firstProduct, secondProduct) =>
            firstProduct.product_name.localeCompare(secondProduct.product_name)
        );

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.dataset.productId = product.product_id;

        productCard.innerHTML = `
            <img
                src="${product.product_image}"
                alt="${product.product_name}"
                class="product-image"
            >

            <div class="product-info">
                <h3 class="product-name">${product.product_name}</h3>
                <p class="product-price">₱${product.product_price.toFixed(2)}/oz.</p>
            </div>
        `;

        productCard.addEventListener("click", () => {
            window.location.href = `productpage.html?productId=${product.product_id}`;
        });

        productsection.appendChild(productCard);
    });

    noItemContainer.style.display = filteredProducts.length ? "none" : "block";
}

fetch("products_list.json")
    .then(response => response.json())
    .then(loadedProducts => {
        products = loadedProducts;
        const countrySelect = document.getElementById("product_country");
        const countries = [...new Set(products.map(product => product.product_country))].sort();

        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });

        renderProducts();
    })
    .catch(error => {
        console.error("Error loading products:", error);
    });

const form = document.getElementById("Searchbar");
const countrySelect = document.getElementById("product_country");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page on submit
    SearchProducts();
});

countrySelect.addEventListener("change", renderProducts);

document.querySelectorAll(".subcategory").forEach(subcategory => {
    subcategory.addEventListener("click", () => {

        const categoryName = subcategory.textContent.trim();

        if (categoryName === "All Products") {
            selectedCategory = "";
        }
        else {
            selectedCategory = categoryName;
        }

        // Highlight selected category
        document.querySelectorAll(".subcategory").forEach(item => {
            item.classList.toggle(
                "active",
                item === subcategory
            );
        });

        // Re-render products
        renderProducts();
    });
});

function SearchProducts() {
    renderProducts();
}

