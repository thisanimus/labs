const zipForm = document.forms.zipForm;
const cityTitle = document.querySelector('.city .title');
const stateTitle = document.querySelector('.state .title');
const stateImage = document.querySelector('.img-wrapper img');
const latTitle = document.querySelector('#lat');
const lngTitle = document.querySelector('#lng');

async function locationFromZip(zip) {
	let url = 'https://api.zippopotam.us/us/' + zip;
	let response = await fetch(url);

	let location = await response.json();
	let details = location.places[0];
	console.log(details);
	cityTitle.textContent = details['place name'];
	stateTitle.textContent = details.state;
	stateImage.src = 'https://www.deepspacerobots.com/code-test-zip/states/' + details['state abbreviation'] + '.svg';
	stateImage.alt = 'Image of the state of ' + details.state;
	latTitle.textContent = details.latitude;
	lngTitle.textContent = details.longitude;
}

locationFromZip('90210');

zipForm.addEventListener('submit', (e) => {
	e.preventDefault();
	let zip = zipForm.elements.zip.value;
	locationFromZip(zip);
});
