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
