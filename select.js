document.addEventListener("DOMContentLoaded", function () {
    const onePlayerGameButton = document.getElementById("onePlayerGame");
    const twoPlayerGameButton = document.getElementById("twoPlayerGame");

    onePlayerGameButton.addEventListener("click", function () {
        window.location.href = "oneplayer.html"; // Change this to the actual one player game page URL
    });

    twoPlayerGameButton.addEventListener("click", function () {
        window.location.href = "twoplayer.html"; // Change this to the actual two player game page URL
    });
});
