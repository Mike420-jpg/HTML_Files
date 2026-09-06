document.addEventListener("DOMContentLoaded", () => {

});

let selectedItem = null;

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
        selectedItem.remove();
    }

    warning_No();
}
