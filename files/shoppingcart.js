let selectedItem = null;
let cartData = [];
let productsData = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCartItems();
});

const delete_modal = document.querySelector(".delete-warning-modal");

function deleteWarn(button) {
    selectedItem = button.closest(".item-card");

    delete_modal.style.visibility = "visible";
    delete_modal.style.opacity = "1";
}

function warning_No() {
    delete_modal.style.visibility = "hidden";
    delete_modal.style.opacity = "0";

    selectedItem = null;
}

function warning_Yes() {
    if (selectedItem) {
        // Get the product ID from the data attribute
        const productId = selectedItem.dataset.productId;

        // Remove from DOM
        selectedItem.remove();

        // Remove from localStorage cart
        if (productId) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            // Remove the first occurrence of this product ID
            const index = cart.findIndex(item => item.cartprod_id === parseInt(productId));
            if (index > -1) {
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
            }
        }

        // Update price summary
        updatePriceSummary();
    }

    warning_No();
}

// Load cart items from localStorage and products_list.json
function loadCartItems() {
    // Load cart from localStorage
    cartData = JSON.parse(localStorage.getItem("cart")) || [];

    // Fetch products list
    fetch("products_list.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to load products: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            productsData = products;
            displayCartItems();
        })
        .catch((error) => {
            console.error("Error loading cart:", error);
            document.querySelector(".cart-items").innerHTML =
                "<p>Unable to load cart items.</p>";
        });
}

// Display cart items in the UI
function displayCartItems() {
    const cartItemsContainer = document.querySelector(".cart-items");

    // Clear existing items
    cartItemsContainer.innerHTML = "";

    // Check if cart is empty
    if (cartData.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; padding: 40px;">
                <img
                    src="Images/emptycart.png"
                    alt="empty cart image"
                    style="width: 150px; height: 150px;"
                >
            </div>

            <h4 style="text-align: center; padding: 0px;">
                Your cart is empty.
            </h4>
        `;
        updatePriceSummary();
        return;
    }

    // Create item cards for each product in cart
    cartData.forEach((cartItem, index) => {
        const product = productsData.find(
            p => p.product_id === cartItem.cartprod_id
        );

        if (product) {
            const itemCard = createItemCard(product, index);
            cartItemsContainer.appendChild(itemCard);
        }
    });

    // Update price summary
    updatePriceSummary();
}

// Create a single item card element
function createItemCard(product, index) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");
    itemCard.dataset.productId = product.product_id;
    itemCard.dataset.index = index;

    // Get first category
    const category = product.product_category.length > 0
        ? product.product_category[0].category_name
        : "Uncategorized";

    itemCard.innerHTML = `
        <div class="product-image">
            <img src="${product.product_image}" alt="${product.product_name}">
        </div>

        <div class="item-info">
            <h4 class="product_name">${product.product_name}</h4>
            <p class="product_size">Size: 8oz.</p>
            <p class="product_category">Category: ${category}</p>

            <div class="quantity-control">
                <span>Quantity:</span>
                <button class="quantity-btn" onclick="decreaseQuantity(${index})">−</button>
                <span class="product_quantity" data-index="${index}">1</span>
                <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>

                <button class="delete-btn" onclick="deleteWarn(this)">🗑 Delete</button>
            </div>
        </div>

        <div class="item-price">
            <p class="product_price">Price: ₱${product.product_price.toFixed(2)}</p>
        </div>
    `;

    return itemCard;
}

// Increase quantity for a cart item
function increaseQuantity(index) {
    const quantityElement = document.querySelector(
        `.product_quantity[data-index="${index}"]`
    );
    if (quantityElement) {
        let quantity = parseInt(quantityElement.textContent);
        quantityElement.textContent = quantity + 1;
        updatePriceSummary();
    }
}

// Decrease quantity for a cart item
function decreaseQuantity(index) {
    const quantityElement = document.querySelector(
        `.product_quantity[data-index="${index}"]`
    );
    if (quantityElement) {
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 1) {
            quantityElement.textContent = quantity - 1;
            updatePriceSummary();
        }
    }
}

// Update price summary
function updatePriceSummary() {
    let totalProductCost = 0;

    // Calculate total based on quantities
    document.querySelectorAll(".item-card").forEach((itemCard, index) => {
        const productId = parseInt(itemCard.dataset.productId);
        const product = productsData.find(p => p.product_id === productId);
        const quantityElement = itemCard.querySelector(".product_quantity");
        const quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;

        if (product) {
            totalProductCost += product.product_price * quantity;
        }
    });

    // Update price breakdown
    const shippingFee = 100.00;
    const discount = totalProductCost * 0.1; // 10% discount
    const totalCost = totalProductCost + shippingFee - discount;

    // Update the price breakdown display
    const priceBreakdown = document.querySelector(".price-breakdown");
    if (priceBreakdown) {
        const priceRows = priceBreakdown.querySelectorAll(".price-row");
        if (priceRows.length >= 3) {
            priceRows[0].innerHTML = `<span>Products Cost:</span><span>₱${totalProductCost.toFixed(2)}</span>`;
            priceRows[1].innerHTML = `<span>Shipping Fee:</span><span>₱${shippingFee.toFixed(2)}</span>`;
            priceRows[2].innerHTML = `<span>Discount:</span><span>₱${discount.toFixed(2)}</span>`;
        }

        const totalRow = priceBreakdown.querySelector(".total-row");
        if (totalRow) {
            totalRow.innerHTML = `<span>Total Cost:</span><span>₱${totalCost.toFixed(2)}</span>`;
        }
    }
}
