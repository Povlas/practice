# Investing.com ISIN bookmarklet

1. Copy the full contents of `bookmarklet.txt`.
2. Chrome: open the bookmark manager (`Ctrl+Shift+O`) → ⋮ (top right) → **Add new bookmark**, paste it as the URL.
   Firefox: right-click the bookmarks bar → **Add Bookmark**, paste it as the URL.
3. Open a stock page on investing.com and click the bookmark: a box with the ISIN appears top-right and the ISIN is copied to the clipboard.

Don't paste the code into Chrome's address bar: Chrome strips the `javascript:` prefix there.

The source is `isin-bookmarklet.js`; run `./build.sh` to regenerate `bookmarklet.txt` after editing it.
