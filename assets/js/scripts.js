// Off canvas menu 
let container = document.querySelector('.js-container')
let toggleButton = document.querySelector('.js-menu-toggle')

toggleButton.addEventListener('click', (e) => {
	e.preventDefault();
	container.classList.toggle('is-menu');
	document.body.classList.toggle("no-scroll");
	toggleButton.classList.toggle('is-active');

	if (toggleButton.getAttribute("aria-expanded") == "false") {
		toggleButton.setAttribute("aria-expanded", "true");
	} else {
		toggleButton.setAttribute("aria-expanded", "false");
	}
});


// Share buttons pop-up
(function () {
	// share popup
	let shareButton = document.querySelector('.js-post__share-button');
	let sharePopup = document.querySelector('.js-post__share-popup');

	if (shareButton) {
		 sharePopup.addEventListener('click', function (e) {
			  e.stopPropagation();
		 });

		 shareButton.addEventListener('click', function (e) {
			  e.preventDefault();
			  e.stopPropagation();
			  sharePopup.classList.toggle('is-visible');
		 });

		 document.body.addEventListener('click', function () {
			  sharePopup.classList.remove('is-visible');
		 });
	}

	// link selector and pop-up window size
	var Config = {
		 Link: ".js-share",
		 Width: 500,
		 Height: 500
	};
	// add handler links
	var slink = document.querySelectorAll(Config.Link);
	for (var a = 0; a < slink.length; a++) {
		 slink[a].onclick = PopupHandler;
	}
	// create popup
	function PopupHandler(e) {
		 e = (e ? e : window.event);
		 var t = (e.target ? e.target : e.srcElement);
		 // hide share popup
		 if (sharePopup) {
			  sharePopup.classList.remove('is-visible');
		 }
		 // popup position
		 var px = Math.floor(((screen.availWidth || 1024) - Config.Width) / 2),
			  py = Math.floor(((screen.availHeight || 700) - Config.Height) / 2);
		 // open popup
		 var link_href = t.href ? t.href : t.parentNode.href;
		 var popup = window.open(link_href, "social",
			  "width=" + Config.Width + ",height=" + Config.Height +
			  ",left=" + px + ",top=" + py +
			  ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
		 if (popup) {
			  popup.focus();
			  if (e.preventDefault) e.preventDefault();
			  e.returnValue = false;
		 }

		 return !!popup;
	}
})();

// iOS Safari viewport fix for vh-based CSS variables (URL bar / visual viewport issues)
(function () {
	function toPx(value, viewportHeightPx) {
		if (!value) return null;
		let v = String(value).trim();
		if (!v) return null;

		// Support simple `<number><unit>` values (e.g. "20vh", "120px")
		let m = v.match(/^(-?\d*\.?\d+)\s*(vh|dvh|svh|lvh|px)$/i);
		if (!m) return null;

		let num = parseFloat(m[1]);
		let unit = m[2].toLowerCase();
		if (!Number.isFinite(num)) return null;

		if (unit === 'px') return num;
		// Treat all vh-like units as a percentage of the current viewport height.
		return (viewportHeightPx * num) / 100;
	}

	function updateVhVars() {
		// Use visualViewport when available (iOS Safari), fallback to innerHeight.
		let vhPx = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;
		if (!vhPx) return;

		let root = document.documentElement;
		let cs = getComputedStyle(root);

		let mobileLeft = cs.getPropertyValue('--mobile-main-left-height');
		let hero = cs.getPropertyValue('--hero-height');

		let mobileLeftPx = toPx(mobileLeft, vhPx);
		if (mobileLeftPx != null) {
			root.style.setProperty('--mobile-main-left-height-px', mobileLeftPx + 'px');
		}
		// Optional: if you later want to use a px-stabilized hero height as well.
		let heroPx = toPx(hero, vhPx);
		if (heroPx != null) {
			root.style.setProperty('--hero-height-px', heroPx + 'px');
		}
	}

	updateVhVars();
	window.addEventListener('resize', updateVhVars, { passive: true });
	if (window.visualViewport) {
		window.visualViewport.addEventListener('resize', updateVhVars, { passive: true });
		window.visualViewport.addEventListener('scroll', updateVhVars, { passive: true });
	}
})();