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
        // Use the cart entry index so identical products with different sizes are distinct.
        const cartIndex = parseInt(selectedItem.dataset.cartIndex, 10);

        // Remove from DOM
        selectedItem.remove();

        // Remove from localStorage cart
        if (!Number.isNaN(cartIndex)) {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cartIndex > -1 && cartIndex < cart.length) {
                cart.splice(cartIndex, 1);
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
            p => p.product_id === Number(cartItem.cartprod_id)
        );

        if (product) {
            const itemCard = createItemCard(product, cartItem, index);
            cartItemsContainer.appendChild(itemCard);
        }
    });

    // Update price summary
    updatePriceSummary();
}

// Create a single item card element
function createItemCard(product, cartItem, index) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");
    itemCard.dataset.productId = product.product_id;
    itemCard.dataset.cartIndex = index;
    itemCard.dataset.index = index;

    const size = cartItem.cartprod_size || "8oz";
    const sizeMultiplier = size === "16oz" ? 16 : 8;
    const quantity = cartItem.quantity || 1;
    const itemPrice = product.product_price * sizeMultiplier;

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
            <p class="product_size">Size: ${size.replace("oz", " oz")}</p>
            <p class="product_category">Category: ${category}</p>

            <div class="quantity-control">
                <span>Quantity:</span>
                <button class="quantity-btn" onclick="decreaseQuantity(${index})">−</button>
                <span class="product_quantity" data-index="${index}">${quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>

                <button class="delete-btn" onclick="deleteWarn(this)">🗑 Delete</button>
            </div>
        </div>

        <div class="item-price">
            <p class="product_price">Price: ₱${(itemPrice*quantity).toFixed(2)}</p>
        </div>
    `;

    return itemCard;
}

// Increase quantity for a cart item
function increaseQuantity(index) {
    const itemCard = document.querySelector(
        `.item-card[data-cart-index="${index}"]`
    );

    if (!itemCard) return;

    const quantityElement = itemCard.querySelector(".product_quantity");
    const priceElement = itemCard.querySelector(".product_price");

    let quantity = parseInt(quantityElement.textContent, 10);
    quantity++;

    quantityElement.textContent = quantity;

    const productId = Number(itemCard.dataset.productId);
    const product = productsData.find(
        p => p.product_id === productId
    );

    const cartItem = cartData[index];

    if (product) {
        const sizeMultiplier =
            cartItem.cartprod_size === "16oz" ? 16 : 8;

        const itemPrice =
            product.product_price * sizeMultiplier * quantity;

        priceElement.textContent =
            `Price: ₱${itemPrice.toFixed(2)}`;
    }

    updatePriceSummary();
}

// Decrease quantity for a cart item
function decreaseQuantity(index) {
    const itemCard = document.querySelector(
        `.item-card[data-cart-index="${index}"]`
    );

    if (!itemCard) return;

    const quantityElement = itemCard.querySelector(".product_quantity");
    const priceElement = itemCard.querySelector(".product_price");

    let quantity = parseInt(quantityElement.textContent, 10);

    if (quantity > 1) {
        quantity--;

        quantityElement.textContent = quantity;

        const productId = Number(itemCard.dataset.productId);
        const product = productsData.find(
            p => p.product_id === productId
        );

        const cartItem = cartData[index];

        if (product) {
            const sizeMultiplier =
                cartItem.cartprod_size === "16oz" ? 16 : 8;

            const itemPrice =
                product.product_price * sizeMultiplier * quantity;

            priceElement.textContent =
                `Price: ₱${itemPrice.toFixed(2)}`;
        }

        updatePriceSummary();
    }
}
// Update price summary
function updatePriceSummary() {
    let totalProductCost = 0;

    // Calculate total based on quantities
    document.querySelectorAll(".item-card").forEach((itemCard, index) => {
        const productId = parseInt(itemCard.dataset.productId, 10);
        const product = productsData.find(p => p.product_id === productId);
        const cartIndex = parseInt(itemCard.dataset.cartIndex, 10);
        const cartItem = cartData[cartIndex];
        const quantityElement = itemCard.querySelector(".product_quantity");
        const quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;

        if (product) {
            const sizeMultiplier = cartItem && cartItem.cartprod_size === "16oz" ? 16 : 8;
            totalProductCost += product.product_price * sizeMultiplier * quantity;
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
