// Bookmarklet: shows the ISIN of the instrument you're viewing on investing.com.
// The ready-to-paste one-line version is in bookmarklet.txt.
(function () {
  var RE = /\b([A-Z]{2}[A-Z0-9]{9}[0-9])\b/;

  // ISIN checksum (Luhn on the letters-to-digits expansion), filters false positives.
  function valid(isin) {
    var digits = isin.replace(/[A-Z]/g, function (c) { return c.charCodeAt(0) - 55; });
    var sum = 0;
    for (var i = digits.length - 1, dbl = false; i >= 0; i--, dbl = !dbl) {
      var d = +digits[i];
      if (dbl) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
    }
    return sum % 10 === 0;
  }

  function fromNextData() {
    var el = document.getElementById('__NEXT_DATA__');
    if (!el) return null;
    var found = null;
    (function walk(o) {
      if (found || !o || typeof o !== 'object') return;
      for (var k in o) {
        var v = o[k];
        if (/^isin$/i.test(k) && typeof v === 'string' && RE.test(v) && valid(v.match(RE)[1])) {
          found = v.match(RE)[1];
          return;
        }
        walk(v);
      }
    })(JSON.parse(el.textContent));
    return found;
  }

  function fromText() {
    var m = document.body.innerText.match(/ISIN\s*:?\s*([A-Z]{2}[A-Z0-9]{9}[0-9])/);
    return m && valid(m[1]) ? m[1] : null;
  }

  function fromHtml() {
    var re = /isin["'\s:=]+([A-Z]{2}[A-Z0-9]{9}[0-9])/gi, m;
    var html = document.documentElement.innerHTML;
    while ((m = re.exec(html))) if (valid(m[1].toUpperCase())) return m[1].toUpperCase();
    return null;
  }

  var isin = null;
  try { isin = fromNextData(); } catch (e) {}
  isin = isin || fromText() || fromHtml();

  if (!isin) {
    alert('Δεν βρέθηκε ISIN σε αυτή τη σελίδα.');
    return;
  }
  if (navigator.clipboard) navigator.clipboard.writeText(isin).catch(function () {});
  prompt('ISIN (αντιγράφηκε στο clipboard):', isin);
})();
