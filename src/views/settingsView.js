import settingsTemplate from './templates/settings-template.html';

class SettingsView {
	constructor(appRoot, controller) {
		this.appRoot = appRoot;
		this.controller = controller;
	}

	render() {
		this.appRoot.innerHTML = settingsTemplate;

		this.findElements();
		this.setEventListeners();
	}

	findElements() {
		this.buttons = this.appRoot.querySelectorAll(
			'[data-js-settings-button]',
		);
		this.languageSelect = this.appRoot.querySelector(
			'[data-js-settings-language-select]',
		);
		this.soundToggle = this.appRoot.querySelector(
			'[data-js-settings-sound-toggle]',
		);
		this.firstPlayerSelect = this.appRoot.querySelector(
			'[data-js-settings-first-player-select]',
		);
		this.darkModeToggle = this.appRoot.querySelector(
			'[data-js-settings-dark-mode-toggle]',
		);
	}

	setEventListeners() {
		this.buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.controller.buttonAction(button.id);
			});
		});
		this.languageSelect.addEventListener('change', (event) => {
			this.controller.changeLanguage(event.target.value);
		});
		this.soundToggle.addEventListener('click', () => {
			this.controller.toggleSound();
		});
		this.firstPlayerSelect.addEventListener('change', (event) => {
			this.controller.changeFirstPlayer(event.target.value);
		});
		this.darkModeToggle.addEventListener('change', (event) => {
			this.controller.toggleDarkMode(event.target.checked);
		});
	}

	cleanup() {
		this.appRoot.innerHTML = '';
	}
}

export default SettingsView;
