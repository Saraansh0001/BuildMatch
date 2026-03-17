tailwind = {
    config: {
        theme: {
            extend: {
                colors: {
                    primary: "#2563EB",
                    secondary: "#1E293B",
                    page: "#F8FAFC",
                    card: "#FFFFFF",
                    accent: "#22C55E",
                    borderline: "#E2E8F0"
                },
                fontFamily: {
                    sans: ["Manrope", "Segoe UI", "sans-serif"]
                },
                boxShadow: {
                    soft: "0 8px 24px rgba(15, 23, 42, 0.06)"
                }
            }
        }
    }
};

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("addInvestmentForm");
    var cancelBtn = document.getElementById("cancelBtn");
    var logoutBtn = document.getElementById("logoutBtn");
    var formMessage = document.getElementById("formMessage");

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!formMessage) {
                return;
            }

            formMessage.textContent = "Investment saved successfully.";
            formMessage.classList.remove("hidden");

            window.setTimeout(function () {
                formMessage.classList.add("hidden");
            }, 2400);
        });
    }
});
