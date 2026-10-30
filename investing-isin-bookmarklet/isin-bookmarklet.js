// Bookmarklet: shows the ISIN of the instrument you're viewing on investing.com.
// The ready-to-paste one-line version is in bookmarklet.txt.
(function () {
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

  // First valid ISIN within a short distance after an "ISIN"/"isin" label. Covers
  // "ISIN: US0378331005", "<dt>ISIN</dt><dd>US0378331005</dd>" and \"isin\":\"US0378331005\".
  function afterLabel(s) {
    var label = /isin/gi, m, code;
    while ((m = label.exec(s))) {
      var near = s.substr(m.index + 4, 300), re = /(?:^|[^A-Z0-9])([A-Z]{2}[A-Z0-9]{9}[0-9])(?![A-Z0-9])/g;
      while ((code = re.exec(near))) if (valid(code[1])) return code[1];
    }
    return null;
  }

  function copy(text) {
    try { navigator.clipboard.writeText(text).catch(function () {}); } catch (e) {}
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    } catch (e) {}
  }

  function show(msg, isin) {
    var old = document.getElementById('isin-bm-box');
    if (old) old.remove();
    var box = document.createElement('div');
    box.id = 'isin-bm-box';
    box.style.cssText = 'position:fixed;top:20px;right:20px;z-index:2147483647;background:#fff;color:#000;' +
      'border:2px solid #1a73e8;border-radius:8px;padding:14px 18px;font:16px/1.4 Arial,sans-serif;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.3);cursor:pointer;user-select:text';
    box.title = 'Κλικ για κλείσιμο';
    box.innerHTML = '<div style="font-size:13px;color:#555"></div>' +
      (isin ? '<div style="font:bold 22px monospace;margin-top:4px"></div>' : '');
    box.firstChild.textContent = msg;
    if (isin) box.lastChild.textContent = isin;
    box.onclick = function () { if (isin) copy(isin); box.remove(); };
    document.body.appendChild(box);
  }

  var isin = null;
  try {
    isin = afterLabel(document.body.innerText) || afterLabel(document.documentElement.innerHTML);
  } catch (e) {}

  try {
    if (isin) {
      copy(isin);
      show('ISIN (αντιγράφηκε στο clipboard):', isin);
    } else {
      show('Δεν βρέθηκε ISIN σε αυτή τη σελίδα.');
    }
  } catch (e) {
    alert(isin ? 'ISIN: ' + isin : 'Δεν βρέθηκε ISIN σε αυτή τη σελίδα.');
  }
})();
