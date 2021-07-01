const sliders = document.querySelectorAll('.slider');
sliders.forEach((slider) => {
	let prev = slider.querySelector('.slider-prev');
	let next = slider.querySelector('.slider-next');
	let dots = slider.querySelector('.slider-dots');
	let slides = slider.querySelector('.slides');

	let glider = new Glider(slides, {
		slidesToShow: 1,
		dots: dots,
		draggable: true,
		scrollLock: true,
		duration: 0.7,
		arrows: {
			prev: prev,
			next: next,
		},
	});
	setTimeout(function () {
		glider.refresh();
	}, 0);
});

document.addEventListener('glider-loaded', hideFFScrollBars);
document.addEventListener('glider-refresh', hideFFScrollBars);
function hideFFScrollBars(e) {
	console.log('loaded');
	var scrollbarHeight = 17; // Currently 17, may change with updates
	if (/firefox/i.test(navigator.userAgent)) {
		// We only need to appy to desktop. Firefox for mobile uses
		// a different rendering engine (WebKit)
		if (window.innerWidth > 575) {
			e.target.parentNode.style.height = e.target.offsetHeight - scrollbarHeight + 'px';
		}
	}
}
