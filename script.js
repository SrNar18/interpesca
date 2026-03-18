/* ===== REDES HEADER ===== */
document.querySelector(".twitter").addEventListener("click", () => {
    window.open("https://x.com/interpescaf?s=11", "_blank");
});

document.querySelector(".instagram").addEventListener("click", () => {
    window.open("https://www.instagram.com/interpesca?utm_medium=copy_link", "_blank");
});

document.querySelector(".facebook").addEventListener("click", () => {
    window.open("https://www.facebook.com/InterpescaCongelats/", "_blank");
});

/* ===== REDES FOOTER ===== */
document.querySelectorAll(".footer .circle img")[0].addEventListener("click", () => {
    window.open("https://x.com/interpescaf?s=11", "_blank");
});

document.querySelectorAll(".footer .circle img")[1].addEventListener("click", () => {
    window.open("https://www.instagram.com/interpesca?utm_medium=copy_link", "_blank");
});

document.querySelectorAll(".footer .circle img")[2].addEventListener("click", () => {
    window.open("https://www.facebook.com/InterpescaCongelats/", "_blank");
});

/* ===== LOGO HEADER (ir a index) ===== */
document.querySelector(".logo").addEventListener("click", () => {
    window.location.href = "index.html";
});

/* ===== NAV HEADER ===== */
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        let text = this.textContent.trim().toLowerCase();

        let rutas = {
            "inici": "index.html",
            "interpesca": "interpesca.html",
            "productes": "productes.html",
            "novetats": "novetats.html",
            "ofertes": "ofertes.html",
            "receptes": "receptes.html",
            "marques": "marques.html",
            "blog": "blog.html",
            "contactes": "contactes.html"
        };

        if (rutas[text]) {
            window.location.href = rutas[text];
        }
    });
});

/* ===== FOOTER LINKS ===== */
document.querySelectorAll(".footer-column a").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        let text = this.textContent.trim().toLowerCase();

        if (text.includes("sobre interpesca")) {
            window.location.href = "interpesca.html";
        }

        if (text.includes("faq")) {
            window.location.href = "faq.html";
        }

        if (text.includes("prot")) {
            window.location.href = "protecciodedades.html";
        }

        if (text.includes("condicions")) {
            window.location.href = "condicions.html";
        }
    });
});

document.querySelectorAll(".nav a.active").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
    });
});