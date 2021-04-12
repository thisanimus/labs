const images = document.querySelectorAll('.separation-wrapper img');
const colorInputs = document.querySelectorAll('input[type="checkbox"]');

colorInputs.forEach((input) => {
	input.addEventListener('input', (e) => {
		let plate = document.getElementById(input.value);
		plate.style.display = input.checked ? 'block' : 'none';
	});
});
window.addEventListener('mousemove', (e) => {
	let i = 1;
	let centerX = window.innerWidth / 2;
	let centerY = window.innerHeight / 2;
	images.forEach((image) => {
		let x = ((centerX + Math.trunc(-e.clientX)) / 40) * i;
		let y = ((centerY + Math.trunc(-e.clientY)) / 40) * i;
		let z = i * 10;
		let position = `translate3d(${x}px, ${y}px, ${z}px)`;
		console.log(position);
		image.style.transform = position;
		i++;
	});
});
