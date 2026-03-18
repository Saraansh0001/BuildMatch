document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("addInvestmentForm");
    var clearBtn = document.getElementById("clearBtn");
    var logoutBtn = document.getElementById("logoutBtn");
    var sidebarToggle = document.getElementById("sidebarToggle");
    var successToast = document.getElementById("successToast");
    var investmentType = document.getElementById("investmentType");
    var investmentName = document.getElementById("investmentName");
    var investedAmount = document.getElementById("investedAmount");
    var purchasePrice = document.getElementById("purchasePrice");
    var quantity = document.getElementById("quantity");
    var purchaseDate = document.getElementById("purchaseDate");

    var previewType = document.getElementById("previewType");
    var previewName = document.getElementById("previewName");
    var previewAmount = document.getElementById("previewAmount");
    var previewPrice = document.getElementById("previewPrice");
    var previewUnits = document.getElementById("previewUnits");
    var previewDate = document.getElementById("previewDate");
    var previewCapital = document.getElementById("previewCapital");
    var previewAllocation = document.getElementById("previewAllocation");
    var previewTypeIcon = document.getElementById("previewTypeIcon");

    var iconMap = {
        stock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19h16"></path><path d="M7 15V9"></path><path d="M12 15V6"></path><path d="M17 15v-3"></path></svg>',
        "mutual-fund": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"></circle><path d="M12 12V4"></path><path d="M12 12l6 4"></path></svg>',
        etf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 16l5-5 4 3 7-8"></path><path d="M20 10V4h-6"></path></svg>',
        crypto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 4v10l-7 4-7-4V7z"></path><path d="M9 9h6M9 12h6M9 15h6"></path></svg>',
        bonds: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M9 8h6M9 12h6M9 16h4"></path></svg>'
    };

    function toLabel(value) {
        if (!value) {
            return "Stock";
        }

        return value
            .split("-")
            .map(function (part) {
                return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join(" ");
    }

    function formatINR(value) {
        var numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            return "Rs 0.00";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        })
            .format(numeric)
            .replace(/\u20B9/g, "Rs ");
    }

    function setFieldState(input) {
        var wrapper = input.closest(".field");
        if (!wrapper) {
            return;
        }

        if (String(input.value || "").trim() !== "") {
            wrapper.classList.add("is-filled");
        } else {
            wrapper.classList.remove("is-filled");
        }
    }

    function setError(input, message) {
        var wrapper = input.closest(".field");
        if (!wrapper) {
            return;
        }

        var messageEl = wrapper.querySelector(".error-message");
        wrapper.classList.add("has-error");
        if (messageEl) {
            messageEl.textContent = message;
        }
    }

    function clearError(input) {
        var wrapper = input.closest(".field");
        if (!wrapper) {
            return;
        }

        var messageEl = wrapper.querySelector(".error-message");
        wrapper.classList.remove("has-error");
        if (messageEl) {
            messageEl.textContent = "";
        }
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "Not Selected";
        }

        var parsed = new Date(dateString);
        if (Number.isNaN(parsed.getTime())) {
            return "Not Selected";
        }

        return parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function updatePreview() {
        var typeValue = investmentType ? investmentType.value : "stock";
        var typeLabel = toLabel(typeValue);

        if (previewType) {
            previewType.textContent = typeLabel;
        }

        if (previewAllocation) {
            previewAllocation.textContent = typeLabel;
        }

        if (previewTypeIcon && iconMap[typeValue]) {
            previewTypeIcon.innerHTML = iconMap[typeValue];
        }

        if (previewName) {
            var nameValue = investmentName && investmentName.value.trim() ? investmentName.value.trim() : "Your Investment Name";
            previewName.textContent = nameValue;
        }

        if (previewAmount) {
            previewAmount.textContent = formatINR(investedAmount ? investedAmount.value : "0");
        }

        if (previewCapital) {
            previewCapital.textContent = formatINR(investedAmount ? investedAmount.value : "0");
        }

        if (previewPrice) {
            previewPrice.textContent = formatINR(purchasePrice ? purchasePrice.value : "0");
        }

        if (previewUnits) {
            var units = quantity && quantity.value ? Number(quantity.value) : 0;
            previewUnits.textContent = Number.isFinite(units) ? units.toLocaleString("en-IN") : "0";
        }

        if (previewDate) {
            previewDate.textContent = formatDate(purchaseDate ? purchaseDate.value : "");
        }
    }

    function validateForm() {
        var valid = true;
        var requiredFields = [investmentType, investmentName, investedAmount, purchasePrice, quantity, purchaseDate];

        requiredFields.forEach(function (field) {
            if (!field) {
                return;
            }

            clearError(field);
            if (String(field.value || "").trim() === "") {
                setError(field, "This field is required.");
                valid = false;
            }
        });

        [investedAmount, purchasePrice, quantity].forEach(function (numberField) {
            if (!numberField || String(numberField.value || "").trim() === "") {
                return;
            }

            if (Number(numberField.value) <= 0) {
                setError(numberField, "Enter a value greater than zero.");
                valid = false;
            }
        });

        return valid;
    }

    function showToast() {
        if (!successToast) {
            return;
        }

        successToast.classList.add("is-visible");
        window.setTimeout(function () {
            successToast.classList.remove("is-visible");
        }, 2200);
    }

    function resetForm() {
        if (!form) {
            return;
        }

        form.reset();
        var inputs = form.querySelectorAll(".field-control");
        inputs.forEach(function (input) {
            clearError(input);
            setFieldState(input);
        });
        updatePreview();
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            if (window.innerWidth <= 980) {
                document.body.classList.toggle("sidebar-open");
            } else {
                document.body.classList.toggle("sidebar-collapsed");
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", resetForm);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    if (form) {
        var controls = form.querySelectorAll(".field-control");
        controls.forEach(function (control) {
            setFieldState(control);
            control.addEventListener("input", function () {
                setFieldState(control);
                clearError(control);
                updatePreview();
            });

            control.addEventListener("change", function () {
                setFieldState(control);
                clearError(control);
                updatePreview();
            });
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!validateForm()) {
                return;
            }

            showToast();
            resetForm();
        });

        updatePreview();
    }
});
