document.addEventListener("DOMContentLoaded", function () {
    const playNowButton = document.getElementById("playNow");
    const instructionsButton = document.getElementById("instructions");
    const instructionModal = document.getElementById("instructionModal");

    playNowButton.addEventListener("click", function () {
        window.location.href = "select.html"; // Change this to the actual game page URL
    });

    instructionsButton.addEventListener("click", function () {
        instructionModal.style.display = "block";
    });

    instructionModal.addEventListener("click", function () {
        instructionModal.style.display = "none";
    });
});
