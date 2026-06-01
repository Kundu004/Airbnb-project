// Booking widget dynamic price calculation
(function () {
  const checkInInput = document.getElementById("booking-checkin");
  const checkOutInput = document.getElementById("booking-checkout");
  const guestsSelect = document.getElementById("booking-guests");
  const pricePerNight = parseFloat(
    document.getElementById("listing-price-value")?.dataset?.price || "0"
  );
  const nightsDisplay = document.getElementById("price-nights");
  const basePriceDisplay = document.getElementById("price-base");
  const cleaningDisplay = document.getElementById("price-cleaning");
  const serviceDisplay = document.getElementById("price-service");
  const totalDisplay = document.getElementById("price-total");
  const reserveBtn = document.getElementById("btn-reserve");
  const priceSummary = document.getElementById("booking-price-summary");

  if (!checkInInput || !checkOutInput) return;

  // Set min dates
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  checkInInput.min = todayStr;
  checkOutInput.min = todayStr;

  function updatePriceCalculation() {
    const checkIn = new Date(checkInInput.value);
    const checkOut = new Date(checkOutInput.value);

    if (!checkInInput.value || !checkOutInput.value) {
      if (priceSummary) priceSummary.style.display = "none";
      if (reserveBtn) reserveBtn.disabled = true;
      return;
    }

    if (checkOut <= checkIn) {
      if (priceSummary) priceSummary.style.display = "none";
      if (reserveBtn) reserveBtn.disabled = true;
      return;
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const basePrice = pricePerNight * nights;
    const cleaningFee = Math.round(pricePerNight * 0.1);
    const serviceFee = Math.round(basePrice * 0.05);
    const total = basePrice + cleaningFee + serviceFee;

    if (nightsDisplay)
      nightsDisplay.textContent = `₹${pricePerNight.toLocaleString(
        "en-IN"
      )} × ${nights} night${nights > 1 ? "s" : ""}`;
    if (basePriceDisplay)
      basePriceDisplay.textContent = `₹${basePrice.toLocaleString("en-IN")}`;
    if (cleaningDisplay)
      cleaningDisplay.textContent = `₹${cleaningFee.toLocaleString("en-IN")}`;
    if (serviceDisplay)
      serviceDisplay.textContent = `₹${serviceFee.toLocaleString("en-IN")}`;
    if (totalDisplay)
      totalDisplay.textContent = `₹${total.toLocaleString("en-IN")}`;

    if (priceSummary) {
      priceSummary.style.display = "block";
      priceSummary.style.animation = "fadeIn 0.3s ease";
    }
    if (reserveBtn) reserveBtn.disabled = false;
  }

  // When check-in changes, set check-out min to day after check-in
  checkInInput.addEventListener("change", function () {
    if (checkInInput.value) {
      const nextDay = new Date(checkInInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutInput.min = nextDay.toISOString().split("T")[0];

      // Auto-set checkout to next day if not set or invalid
      if (
        !checkOutInput.value ||
        new Date(checkOutInput.value) <= new Date(checkInInput.value)
      ) {
        checkOutInput.value = nextDay.toISOString().split("T")[0];
      }
    }
    updatePriceCalculation();
  });

  checkOutInput.addEventListener("change", updatePriceCalculation);
  if (guestsSelect) {
    guestsSelect.addEventListener("change", updatePriceCalculation);
  }

  // Initial calculation
  updatePriceCalculation();
})();

// Fade-in animation
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
