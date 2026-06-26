(function () {
  "use strict";

  var CARD_COLORS = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return {
      accent: "var(--content-colours-solid-content-" + n + "-130)",
      bg: "var(--content-colours-solid-content-" + n + "-20)"
    };
  });

  var form = document.getElementById("signature-form");
  var nameInput = document.getElementById("signer-name");
  var messageInput = document.getElementById("signer-message");
  var submitBtn = form.querySelector("button[type=submit]");
  var errorEl = document.getElementById("form-error");
  var grid = document.getElementById("message-grid");
  var emptyState = document.getElementById("empty-state");
  var countEl = document.getElementById("message-count");

  function formatTimestamp(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function renderMessages(messages) {
    countEl.textContent = messages.length + (messages.length === 1 ? " signature" : " signatures");
    emptyState.hidden = messages.length > 0;
    grid.innerHTML = "";

    messages.slice().reverse().forEach(function (msg, i) {
      var colors = CARD_COLORS[i % CARD_COLORS.length];

      var card = document.createElement("article");
      card.className = "message-card";
      card.style.setProperty("--card-accent", colors.accent);
      card.style.setProperty("--card-bg", colors.bg);

      var name = document.createElement("p");
      name.className = "signer-name desktop-sub-body-bold";
      name.textContent = msg.name;

      var text = document.createElement("p");
      text.className = "signer-message desktop-body-regular";
      text.textContent = msg.message;

      var time = document.createElement("p");
      time.className = "signer-time desktop-footnote-regular";
      time.textContent = formatTimestamp(msg.createdAt);

      card.appendChild(name);
      card.appendChild(text);
      card.appendChild(time);
      grid.appendChild(card);
    });
  }

  function showError(text) {
    errorEl.textContent = text;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function loadMessages() {
    return fetch("/api/messages", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load messages");
        return res.json();
      })
      .then(renderMessages)
      .catch(function () {
        showError("Couldn't load messages right now. Try refreshing the page.");
      });
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
        return loadMessages();
      })
      .catch(function () {
        showError("Something went wrong signing the card. Please try again.");
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });

  loadMessages();
})();
