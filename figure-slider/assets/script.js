new Glider(document.querySelector('.glider'), {
	slidesToShow: 1,
	dots: '.slider-dots',
	draggable: true,
	scrollLock: true,
	duration: 0.7,
	arrows: {
		prev: '.slider-prev',
		next: '.slider-next',
	},
});

document.addEventListener('glider-loaded', hideFFScrollBars);
document.addEventListener('glider-refresh', hideFFScrollBars);
function hideFFScrollBars(e) {
	var scrollbarHeight = 17; // Currently 17, may change with updates
	if (/firefox/i.test(navigator.userAgent)) {
		// We only need to appy to desktop. Firefox for mobile uses
		// a different rendering engine (WebKit)
		if (window.innerWidth > 575) {
			e.target.parentNode.style.height = e.target.offsetHeight - scrollbarHeight + 'px';
		}
	}
}
