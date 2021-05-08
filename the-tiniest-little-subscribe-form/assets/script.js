const form = document.forms.subscribe;
const messageButton = document.getElementById('message-button');

messageButton.addEventListener('click', (e) => {
	if (form.dataset.state == 'subscribe') {
		form.dataset.state = 'form';
		form.querySelector('[name="email"]').focus();
	}
	setTimeout(() => {
		messageButton.type = 'submit';
	}, 1);
});

form.addEventListener('submit', (e) => {
	e.preventDefault();

	// handle your form submission here

	if (form.dataset.state == 'form') {
		document.activeElement.blur();
		form.dataset.state = 'thank-you';
	}
});
