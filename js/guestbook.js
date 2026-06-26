(function () {
  "use strict";

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

    messages.slice().reverse().forEach(function (msg) {
      var card = document.createElement("article");
      card.className = "message-card";

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

  function loadMessages() {
    return fetch("/api/messages", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load messages");
        return res.json();
      })
      .then(renderMessages);
  }

  window.Guestbook = { loadMessages: loadMessages };

  loadMessages().catch(function () {
    emptyState.hidden = false;
    emptyState.textContent = "Couldn't load messages right now. Try refreshing the page.";
  });
})();
