document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('productName');
  const productImage = urlParams.get('productImage');
  const productInfoContainer = document.getElementById('product-info');

  if (productName && productImage && productInfoContainer) {
    const productImgEl = productInfoContainer.querySelector('img');
    const productNameEl = productInfoContainer.querySelector('strong');

    if (productImgEl) {
      productImgEl.src = productImage;
      productImgEl.alt = productName;
    }
    if (productNameEl) {
      productNameEl.textContent = productName;
    }
  }

  const form = document.getElementById("inquiry-form");
  const message = document.getElementById("form-message");

  // Insert suggested question into textarea
  document.querySelectorAll(".question-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const textarea = document.getElementById("requirements");
      textarea.value += (textarea.value ? "\n" : "") + btn.textContent;
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "⏳ Sending your inquiry...";
    message.style.color = "#444";

    const productImg = document.querySelector("#product-info img");
    const imageUrl = productImg ? productImg.src : "";

    const data = {
      name: form.name.value,
      email: form.email.value,
      quantity: form.quantity.value,
      requirements: form.requirements.value,
      imageUrl
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbx--ckuN3_NfifFk2BbnATTP63tYeIhpMmJW45orIcOzcaRLC_0EF8ymanY8Gfai1hW/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "text/plain" }
      });

      const result = await response.json();
      message.textContent = result.message;
      message.style.color = result.status === "success" ? "green" : "red";

      if (result.status === "success") form.reset();
    } catch (err) {
      message.textContent = "❌ Network error. Please check your Apps Script URL.";
      message.style.color = "red";
      console.error(err);
    }
  });
});
