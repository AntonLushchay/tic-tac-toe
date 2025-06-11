import homeTemplate from './templates/home-template.html';

class HomeView {
	template;
	appRoot;
	buttons;

	constructor(appRoot) {
		this.template = homeTemplate;
		this.appRoot = appRoot;
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
		switch (buttonId) {
			case 'playButton':
				this.handlePlayButtonClick();
				break;
			case 'settingsButton':
				this.handleSettingsButtonClick();
				break;
			default:
				console.warn(`Unknown button clicked: ${buttonId}`);
		}
	};

	handlePlayButtonClick() {
		window.location.hash = 'game';
		console.log('Play button clicked, navigating to game view.');
	}

	handleSettingsButtonClick() {
		window.location.hash = 'settings';
		console.log('Settings button clicked, navigating to settings view.');
	}

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
