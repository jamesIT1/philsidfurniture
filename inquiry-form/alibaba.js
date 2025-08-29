document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productName = urlParams.get('productName');
  const productImage = urlParams.get('productImage');
  const productInfoContainer = document.getElementById('product-info');

  if (productName && productImage && productInfoContainer) {
    const productImgEl = productInfoContainer.querySelector('img');
    const productNameEl = productInfoContainer.querySelector('strong');

    if (productImgEl) {
      productImgEl.src = fixGithubImage(productImage); // ✅ auto-fix link
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
    let imageUrl = productImg ? productImg.src : "";

    // ✅ Always fix GitHub links
    imageUrl = fixGithubImage(imageUrl);

    const data = {
      name: form.name.value,
      email: form.email.value,
      quantity: form.quantity.value,
      requirements: form.requirements.value,
      imageUrl
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbzLrvFnNkguXsPK6hbgB8c_ZAjr8qR9Lm2jdf2j4KKLSkkRnfbVW-ny0G0SYnd1dG9R/exec", {
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

// 🔹 Helper function to fix GitHub blob → raw link
function fixGithubImage(url) {
  // Case 1: Already a GitHub blob URL → convert to raw
  if (url.includes("github.com") && url.includes("/blob/")) {
    return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }

  // Case 2: Localhost or 127.0.0.1 (during dev) → map to your repo
  if (url.includes("127.0.0.1") || url.includes("localhost")) {
    // Extract just the filename
    const fileName = url.split("/").pop();
    return `https://raw.githubusercontent.com/jamesIT1/philsidfurniture/main/${fileName}`;
  }

  // Otherwise, return as is
  return url;
}
