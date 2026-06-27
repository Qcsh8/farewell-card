(function () {
  "use strict";

  var layers = document.querySelectorAll(".parallax-layer");
  if (!layers.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var targetX = 0;
  var targetY = 0;
  var curX = 0;
  var curY = 0;

  function setTarget(nx, ny) {
    targetX = nx;
    targetY = ny;
  }

  window.addEventListener("mousemove", function (e) {
    setTarget(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
  });

  window.addEventListener("deviceorientation", function (e) {
    if (e.gamma === null || e.beta === null) return;
    setTarget(
      Math.max(-0.5, Math.min(0.5, e.gamma / 45)),
      Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 45))
    );
  });

  function tick() {
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;

    layers.forEach(function (layer) {
      var depth = parseFloat(layer.getAttribute("data-depth")) || 0;
      layer.style.transform = "translate(" + (curX * depth).toFixed(2) + "px, " + (curY * depth).toFixed(2) + "px)";
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
