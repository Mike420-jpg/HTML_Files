document.addEventListener("DOMContentLoaded", () => {

    const sizeSelect = document.getElementById("spiceSize");
    const priceDisplay = document.getElementById("productPrice");

    let basePrice = 0;

    const productId = Number(
        new URLSearchParams(window.location.search).get("productId")
    );


    // ========================================
    // LOAD PRODUCTS
    // ========================================

    fetch("products_list.json")
        .then((response) => {

            if (!response.ok) {
                throw new Error(
                    `Unable to load products: ${response.status}`
                );
            }

            return response.json();
        })

        .then((products) => {

            // ========================================
            // FIND CURRENT PRODUCT
            // ========================================

            const product = products.find(
                item => item.product_id === productId
            );

            if (!product) {
                throw new Error(
                    `Product with ID ${productId} was not found`
                );
            }


            // ========================================
            // DISPLAY CURRENT PRODUCT
            // ========================================

            basePrice = product.product_price;

            document.getElementById("mainProductImg").src =
                product.product_image;

            document.getElementById("mainProductImg").alt =
                product.product_name;

            document.getElementById("productTitle").textContent =
                product.product_name;

            document.getElementById("productOrigin").textContent =
                `Origin: ${product.product_country}`;

            document.getElementById("productDesc").textContent =
                `Description: ${product.product_desc}`;

            updatePrice();


            // ========================================
            // SIMILAR SPICES
            // ========================================

            const recommendationsContainer =
                document.querySelector(
                    ".recommendations-similar .product-grid"
                );


            const similarProducts = products.filter(
                otherProduct => {

                    // Don't recommend current product
                    if (
                        otherProduct.product_id ===
                        product.product_id
                    ) {
                        return false;
                    }


                    // Same country
                    const sameCountry =
                        otherProduct.product_country ===
                        product.product_country;


                    // Share at least one category
                    const sameCategory =
                        otherProduct.product_category.some(
                            otherCategory =>
                                product.product_category.some(
                                    currentCategory =>
                                        currentCategory.category_id ===
                                        otherCategory.category_id
                                )
                        );


                    return sameCountry || sameCategory;
                }
            );


            // Shuffle
            const shuffledSimilarProducts =
                [...similarProducts].sort(
                    () => Math.random() - 0.5
                );


            // Maximum of 7
            const recommendedProducts =
                shuffledSimilarProducts.slice(0, 7);


            // Create cards
            recommendedProducts.forEach(
                recommendedProduct => {

                    const recommendationCard =
                        document.createElement("div");

                    recommendationCard.classList.add(
                        "recommendation-card"
                    );

                    recommendationCard.dataset.productId =
                        recommendedProduct.product_id;


                    recommendationCard.innerHTML = `
                        <div class="cardImg">
                            <img
                                src="${recommendedProduct.product_image}"
                                alt="${recommendedProduct.product_name}"
                            />
                        </div>

                        <div class="card-details">
                            <h4 class="card-title">
                                ${recommendedProduct.product_name}
                            </h4>

                            <p class="art-price">
                                ₱${recommendedProduct.product_price.toFixed(2)}
                            </p>
                        </div>
                    `;


                    // Click → product page
                    recommendationCard.addEventListener(
                        "click",
                        () => {

                            window.location.href =
                                `productpage.html?productId=${recommendedProduct.product_id}`;

                        }
                    );


                    recommendationsContainer.appendChild(
                        recommendationCard
                    );

                }
            );


            // ========================================
            // SPICES YOU MAY LIKE
            // ========================================

            const likedContainer =
                document.querySelector(
                    ".recommendations-like .product-grid"
                );


            // Get all products except current product
            const otherProducts =
                products.filter(
                    otherProduct =>
                        otherProduct.product_id !==
                        product.product_id
                );


            // Shuffle
            const shuffledRandomProducts =
                [...otherProducts].sort(
                    () => Math.random() - 0.5
                );


            // Maximum of 7
            const randomProducts =
                shuffledRandomProducts.slice(0, 7);


            // Create cards
            randomProducts.forEach(
                randomProduct => {

                    const recommendationCard =
                        document.createElement("div");

                    recommendationCard.classList.add(
                        "recommendation-card"
                    );

                    recommendationCard.dataset.productId =
                        randomProduct.product_id;


                    recommendationCard.innerHTML = `
                        <div class="cardImg">
                            <img
                                src="${randomProduct.product_image}"
                                alt="${randomProduct.product_name}"
                            />
                        </div>

                        <div class="card-details">
                            <h4 class="card-title">
                                ${randomProduct.product_name}
                            </h4>

                            <p class="art-price">
                                ₱${randomProduct.product_price.toFixed(2)}
                            </p>
                        </div>
                    `;


                    // Click → product page
                    recommendationCard.addEventListener(
                        "click",
                        () => {

                            window.location.href =
                                `productpage.html?productId=${randomProduct.product_id}`;

                        }
                    );


                    likedContainer.appendChild(
                        recommendationCard
                    );

                }
            );

        })


        // ========================================
        // ERROR HANDLING
        // ========================================

        .catch((error) => {

            console.error(
                "Error loading product:",
                error
            );

            document.querySelector(
                ".product-container"
            ).innerHTML =
                "<p>Unable to load this product.</p>";

        });


    // ========================================
    // PRICE
    // ========================================

    function updatePrice() {

        const multiplier =
            sizeSelect.value === "16oz"
                ? 1.8
                : 1.0;

        const calculatedPrice =
            (basePrice * multiplier).toFixed(2);

        priceDisplay.textContent =
            `Price: ₱${calculatedPrice}`;
    }


    if (sizeSelect && priceDisplay) {

        sizeSelect.addEventListener(
            "change",
            updatePrice
        );

    }


    // ========================================
    // LIKE BUTTON
    // ========================================

    const likeBtn =
        document.getElementById("likeBtn");

    const likeCount =
        document.getElementById("likeCount");


    if (likeBtn && likeCount) {

        likeBtn.addEventListener(
            "click",
            () => {

                let count =
                    parseInt(
                        likeCount.textContent,
                        10
                    );
                likeBtn.classList.toggle("liked");
                const heartIcon =
                    likeBtn.querySelector(".heart-icon");
                if (
                    likeBtn.classList.contains("liked")
                ) {
                    heartIcon.innerHTML =
                        "&#9829;";
                    likeCount.textContent =
                        count + 1;
                } else {
                    heartIcon.innerHTML =
                        "&#9825;";
                    likeCount.textContent =
                        count - 1;
                }
            }
        );
    }

    const addToCartBtn =
        document.getElementById("addToCartBtn");
    if (addToCartBtn) {

        addToCartBtn.addEventListener(
            "click",
            () => {
                addToCartBtn.style.transform =
                    "scale(1.2)";
                setTimeout(
                    () => {

                        addToCartBtn.style.transform =
                            "scale(1)";
                    },
                    200
                );
            }
        );
    }
});