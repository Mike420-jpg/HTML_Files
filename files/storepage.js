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

fetch("products_list.json")
    .then(response => response.json())
    .then(products => {
        const productsection = document.getElementsByClassName("product-section")[0];

        products.forEach(product => {
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

            productsection.appendChild(productCard);
        });
    })
    .catch(error => {
        console.error("Error loading products:", error);
    });

const form = document.getElementById("Searchbar");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page on submit
    SearchProducts();
});

function SearchProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const productCards = document.querySelectorAll(".product-card");
    const noItemContainer = document.querySelector(".noitem-container");

    let foundProducts = false;

    productCards.forEach(card => {
        const productName = card.querySelector(".product-name").textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            card.style.display = "block";
            foundProducts = true;
        } else {
            card.style.display = "none";
        }
    });

    if (!foundProducts) {
        noItemContainer.style.display = "block";
    } else {
        noItemContainer.style.display = "none";
    }
}



// const productCards = document.querySelectorAll(".product-card");

// productCards.forEach(card => {
//     card.addEventListener("click", () => {
//         const productId = card.dataset.productId;

//         window.location.href = `productpage.html?productId=${productId}`;
//         console.log(`Redirecting to product page for product ID: ${productId}`);
//     });
// });