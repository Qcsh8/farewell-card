(function () {
  "use strict";

  var form = document.getElementById("signature-form");
  var nameInput = document.getElementById("signer-name");
  var messageInput = document.getElementById("signer-message");
  var submitBtn = form.querySelector("button[type=submit]");
  var errorEl = document.getElementById("form-error");

  function showError(text) {
    errorEl.textContent = text;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    var name = nameInput.value.trim();
    var message = messageInput.value.trim();

    if (!name || !message) {
      showError("Please fill in both your name and a message.");
      return;
    }

    submitBtn.disabled = true;

    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, message: message })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to sign");
        form.reset();
        nameInput.focus();
        return window.Guestbook.loadMessages();
      })
      .catch(function () {
        showError("Something went wrong signing the card. Please try again.");
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
})();
