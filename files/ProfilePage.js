document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu-item");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Tab switching handler
  menuItems.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      menuItems.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      button.classList.add("active");
      const selectedPane = document.getElementById(targetTab);
      if (selectedPane) {
        selectedPane.classList.add("active");
      }
    });
  });
});