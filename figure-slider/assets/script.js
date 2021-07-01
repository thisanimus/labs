const sliders = document.querySelectorAll('.slider');
const gliders = [];
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
	gliders.push(glider);
	setTimeout(function () {
		glider.refresh();
	}, 0);
});

// Firefox garbage
const isFirefox = /firefox/i.test(navigator.userAgent);
document.addEventListener('glider-loaded', hideFFScrollBars);
document.addEventListener('glider-refresh', hideFFScrollBars);
function hideFFScrollBars(e) {
	var scrollbarHeight = 17; // Currently 17, may change with updates
	if (isFirefox) {
		// We only need to appy to desktop. Firefox for mobile uses
		// a different rendering engine (WebKit)
		if (window.innerWidth > 575) {
			e.target.parentNode.style.height = e.target.offsetHeight - scrollbarHeight + 'px';
		}
	}
}
