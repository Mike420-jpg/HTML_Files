document.addEventListener("DOMContentLoaded", () => {
  // Sizing Price Dynamics
  const basePrice = 999;
  const sizeSelect = document.getElementById("spiceSize");
  const priceDisplay = document.getElementById("productPrice");

  if (sizeSelect && priceDisplay) {
    sizeSelect.addEventListener("change", (e) => {
      let multiplier = e.target.value === "16oz" ? 1.8 : 1.0;
      const calculatedPrice = Math.round(basePrice * multiplier);
      priceDisplay.textContent = `Price: $${calculatedPrice}`;
    });
  }

  // Like Toggle Functionality
  const likeBtn = document.getElementById("likeBtn");
  const likeCount = document.getElementById("likeCount");

  if (likeBtn && likeCount) {
    likeBtn.addEventListener("click", () => {
      let count = parseInt(likeCount.textContent, 10);
      likeBtn.classList.toggle("liked");

      const heartIcon = likeBtn.querySelector(".heart-icon");
      if (likeBtn.classList.contains("liked")) {
        heartIcon.innerHTML = "&#9829;"; // Solid Heart
        likeCount.textContent = count + 1;
      } else {
        heartIcon.innerHTML = "&#9825;"; // Empty Heart
        likeCount.textContent = count - 1;
      }
    });
  }

  // Cart Button Click Animation
  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      addToCartBtn.style.transform = "scale(1.2)";
      setTimeout(() => {
        addToCartBtn.style.transform = "scale(1)";
      }, 200);
    });
  }
});