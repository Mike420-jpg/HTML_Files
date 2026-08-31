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

function SearchProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const productCards = document.querySelectorAll(".product-card");
    const noItemContainer = document.querySelector(".noitem-container");

    let foundProducts = false;

    productCards.forEach(card => {
        const productName = card.querySelector("#product-name").textContent.toLowerCase();
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

const form = document.getElementById("Searchbar");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page on submit
    SearchProducts();
});

const productCards = document.querySelectorAll(".product-card");

productCards.forEach(card => {
    card.addEventListener("click", () => {
        const productId = card.dataset.productId;

        window.location.href = `productpage.html?productId=${productId}`;
        console.log(`Redirecting to product page for product ID: ${productId}`);
    });
});

document.getElementById('')
