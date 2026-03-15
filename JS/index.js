const menuItems = document.querySelectorAll(".menu-item");
const logoutBtn = document.getElementById("logoutBtn");

menuItems.forEach((item) => {
	item.addEventListener("click", () => {
		menuItems.forEach((btn) => btn.classList.remove("active"));
		item.classList.add("active");
	});
});

function formatIndianNumber(num) {
	return num.toLocaleString("en-IN");
}

function animateCounters() {
	const statValues = document.querySelectorAll(".stat-value[data-target]");

	statValues.forEach((element) => {
		const target = Number(element.dataset.target);
		const isCurrency = element.dataset.currency === "true";
		const duration = 900;
		const start = performance.now();

		function update(now) {
			const progress = Math.min((now - start) / duration, 1);
			const value = Math.floor(target * progress);

			if (isCurrency) {
				element.textContent = "\u20B9" + formatIndianNumber(value);
			} else {
				element.textContent = String(value);
			}

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	});
}

if (logoutBtn) {
	logoutBtn.addEventListener("click", () => {
		window.alert("Logged out from demo dashboard.");
	});
}

window.addEventListener("DOMContentLoaded", animateCounters);
