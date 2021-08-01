class List {
	constructor(listWrapper, list, options) {
		this.list = list;
		this.listWrapper = listWrapper;
		this.listElement = listWrapper.querySelector('.list');
		this.filteredList = [];
		this.orderedList = [];
		this.params = options.params || [];
		this.filterParams = {};
		this.template = options.template || null;
		this.init();
	}
	init() {
		// create the proxies
		this.filteredList = this.list;
		this.orderedList = this.list;

		// populate the filters
		this.params.forEach((param) => {
			this.filterParams[param] = [];
		});

		// create the html elements
		this.renderList();

		// listen for keystrokes in the search input
		let search = this.listWrapper.querySelector('input[type="search"]');
		search.addEventListener('keyup', (e) => {
			this.search(search.value);
		});

		// listen for clicks on the sort buttons
		let sorts = this.listWrapper.querySelectorAll('[data-sort]');
		sorts.forEach((sort) => {
			sort.addEventListener('click', (e) => {
				let param = sort.dataset.sort;
				let order = sort.dataset.order ? sort.dataset.order : 'asc';
				this.sort(param, order, sort);
			});
		});

		// listen for changes on the filter inputs
		let filters = this.listWrapper.querySelectorAll('[data-filter]');
		filters.forEach((filter) => {
			let param = filter.dataset.filter;
			let filterParams = this.filterParams[param];
			filter.addEventListener('change', (e) => {
				if (filter.checked && !filterParams.includes(filter.value)) {
					filterParams.push(filter.value);
				} else {
					let index = filterParams.indexOf(filter.value);
					if (index > -1) {
						filterParams.splice(index, 1);
					}
				}
				this.filter(param);
			});
		});
	}
	search(s) {
		this.filteredList = this.orderedList.filter((item) => {
			let matches = false;
			this.params.forEach((p) => {
				const paramMatches = item[p].toLowerCase().includes(s.toLowerCase());
				if (!matches && paramMatches) {
					matches = true;
				}
			});
			return matches;
		});

		this.renderList();
	}
	sort(param, order, element) {
		this.orderedList = this.filteredList;
		if (order == 'asc') {
			element.dataset.order = 'desc';
			this.orderedList.sort((a, b) => {
				if (a[param] < b[param]) {
					return -1;
				}
				if (a[param] > b[param]) {
					return 1;
				}
				return 0;
			});
		} else {
			element.dataset.order = 'asc';
			this.orderedList.sort((a, b) => {
				if (b[param] < a[param]) {
					return -1;
				}
				if (b[param] > a[param]) {
					return 1;
				}
				return 0;
			});
		}
		this.filteredList = this.orderedList;
		this.renderList();
	}
	filter(param) {
		this.filteredList = this.orderedList.filter((item) => {
			let matches;
			if (this.filterParams[param].length) {
				matches = false;
				this.filterParams[param].forEach((p) => {
					const paramMatches = item[param] == p;
					if (!matches && paramMatches) {
						matches = true;
					}
				});
			} else {
				matches = true;
			}
			return matches;
		});

		this.renderList();
	}
	renderList() {
		this.listElement.innerHTML = '';
		this.filteredList.forEach((item) => {
			const itemHTML = this.template(item);
			this.listElement.insertAdjacentHTML('beforeEnd', itemHTML);
		});
		let items = this.listElement.querySelectorAll('li');
		items.forEach((item) => {
			let rotation = generateRandomNumber(-2, 2) + 'deg';
			let X = generateRandomNumber(-2, 2) + 'px';
			let Y = generateRandomNumber(-2, 2) + 'px';
			item.style.transform = `rotate(${rotation}) translate3D(${X}, ${Y}, 0px)`;
		});
	}
}

function generateRandomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

const baseUrl = 'https://labs.thisanimus.com/chili-list/assets/';

async function getChilies() {
	const response = await fetch(baseUrl + 'chilies.json');
	return await response.json();
}
const listWrapper = document.querySelector('#chili-list');
getChilies().then((chilies) => {
	const options = {
		params: ['name', 'heat', 'description'],
		template: (item) => {
			return `
			<li class="chili ${item.heat}">
				<div class="grit"></div>
				<header class="chili-header"> 
					<div class="chili-details">
						<h2 class="name">${item.name}</h2>
						<div class="heat">
							<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M330.67 263.12V173.4l-52.75-24.22C219.44 218.76 197.58 400 56 400a56 56 0 0 0 0 112c212.64 0 370.65-122.87 419.18-210.34l-37.05-38.54zm131.09-128.37C493.92 74.91 477.18 26.48 458.62 3a8 8 0 0 0-11.93-.59l-22.9 23a8.06 8.06 0 0 0-.89 10.23c6.86 10.36 17.05 35.1-1.4 72.32A142.85 142.85 0 0 0 364.34 96c-28 0-54 8.54-76.34 22.59l74.67 34.29v78.24h89.09L506.44 288c3.26-12.62 5.56-25.63 5.56-39.31a154 154 0 0 0-50.24-113.94z"></path></svg>	
							<div class="heat-description">
								<div class="heat-value">${item.scoville}</div>
									<div class="label">Scoville Units</div>
								</div>
							</div>
						</div>
					</div>
					<img src="${baseUrl}img/${item.image}" alt="${item.name}" loading="lazy" />
				</header>
				<hr>
				<p class="description">${item.description}</div>
			</li>`;
		},
	};

	const chiliList = new List(listWrapper, chilies, options);
});
