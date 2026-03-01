function dark() {
    document.body.classList.toggle("dark-mode");

    const estaDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema_armagedon", estaDark ? "dark" : "light");
}

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tema_armagedon") === "dark") {
        document.body.classList.add("dark-mode");
    }
});