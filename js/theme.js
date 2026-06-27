(function () {
  "use strict";

  var STORAGE_KEY = "lunaire-theme";
  var root = document.documentElement;
  var toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  var thumb = toggle.querySelector(".toggle-thumb");
  var icon = toggle.querySelector(".toggle-icon");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");

    if (theme === "dark") {
      thumb.style.left = "calc(50% - 19px)";
      icon.style.left = "calc(50% + 4px)";
      icon.style.width = "12px";
      icon.style.height = "12px";
      icon.src = "assets/icons/moon.svg";
    } else {
      thumb.style.left = "calc(50% + 3px)";
      icon.style.left = "calc(50% - 17px)";
      icon.style.width = "14.67px";
      icon.style.height = "14.67px";
      icon.src = "assets/icons/sun-default.svg";
    }
  }

  var saved = localStorage.getItem(STORAGE_KEY);
  var initial = saved || root.getAttribute("data-default-theme") || "light";
  applyTheme(initial);

  toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
})();
