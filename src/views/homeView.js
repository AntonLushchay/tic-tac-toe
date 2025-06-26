import { translations } from '../i18n/translations';

import homeTemplate from './templates/home-template.html';

class HomeView {
	translation = translations;

	constructor(appRoot, controller) {
		this.template = document.createElement('div');
		this.template.classList.add('home');
		this.template.innerHTML = homeTemplate;

		this.appRoot = appRoot;
		this.controller = controller;

		// this.bindEvents();
	}

	render(settings) {
		this.appRoot.appendChild(this.template);
		this.bindEvents();
		this.setSettings(settings);
	}

	bindEvents() {
		this.buttons = this.template.querySelectorAll('[data-js-home-button]');
		this.buttons.forEach((button) => {
			button.addEventListener('click', this.handleButtonClick);
		});
		this.titleElem = this.template.querySelector('.home__title');
	}

	setSettings(settings) {
		this.changeLanguage(settings.language);
		// this.changeTheme(settings.theme);
	}

	changeLanguage(language) {
		this.titleElem.textContent =
			this.translation[language]['homePage']['title'];
		this.buttons.forEach((button) => {
			const buttonId = button.id;
			button.textContent =
				this.translation[language]['homePage'][buttonId];
		});
	}

	// changeTheme(theme) {}

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
