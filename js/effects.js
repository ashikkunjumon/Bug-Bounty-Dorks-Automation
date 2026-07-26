/* Builds the rising-particle layer and staggers the result animation.
 * Purely decorative: nothing here touches dork generation or the DOM the
 * app relies on, so removing this file only removes the motion.
 */

(function () {
  var DOT_COUNT = 26;

  function buildParticles() {
    if (document.querySelector('.fx-particles')) return;

    var layer = document.createElement('div');
    layer.className = 'fx-particles';
    layer.setAttribute('aria-hidden', 'true');

    // Deterministic spread rather than random, so the effect looks the same
    // on every load instead of occasionally clumping.
    for (var i = 0; i < DOT_COUNT; i++) {
      var dot = document.createElement('div');
      dot.className = 'fx-dot';
      dot.style.left = ((i * 37) % 100) + '%';
      dot.style.animationDuration = (9 + (i % 7) * 1.6) + 's';
      dot.style.animationDelay = (-(i * 0.9)) + 's';
      if (i % 4 === 0) { dot.style.width = '4px'; dot.style.height = '4px'; }
      layer.appendChild(dot);
    }

    document.body.appendChild(layer);
  }

  /* Results are re-rendered on every search, engine change and tab switch,
     so watch the container rather than stamping delays once. */
  function staggerResults() {
    var results = document.getElementById('results');
    if (!results) return;

    var stamp = function () {
      var cards = results.querySelectorAll('.category');
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.animationDelay = Math.min(i * 20, 520) + 'ms';
      }
    };

    new MutationObserver(stamp).observe(results, { childList: true, subtree: true });
    stamp();
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildParticles();
    staggerResults();
  });
})();
