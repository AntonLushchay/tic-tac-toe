import homeTemplate from './templates/home-template.html';

class HomeView {
	template;
	appRoot;
	buttons;
	controller;

	constructor(appRoot, controller) {
		this.template = homeTemplate;
		this.appRoot = appRoot;
		this.controller = controller;
	}

	render() {
		this.appRoot.innerHTML = this.template;
		this.bindEvents();
	}

	bindEvents() {
		this.buttons = this.appRoot.querySelectorAll('[data-js-home-button]');
		this.buttons.forEach((button) => {
			button.addEventListener('click', this.handleButtonClick);
		});
	}

	handleButtonClick = (event) => {
		const buttonId = event.currentTarget.id;
		this.controller.navigateTo(buttonId);
	};

	cleanup() {
		if (this.buttons && this.buttons.length > 0) {
			this.buttons.forEach((button) => {
				button.removeEventListener('click', this.handleButtonClick);
			});
		}
		this.buttons = null;
		console.log('HomeView event listeners cleaned up.');
	}
}

export default HomeView;
