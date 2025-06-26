import { translations } from '../i18n/translations.js';

import settingsTemplate from './templates/settings-template.html';

class SettingsView {
	constructor(appRoot, controller) {
		this.appRoot = appRoot;
		this.controller = controller;
		this.translation = translations;
		this.updatedTamplate;
	}

	render(settings) {
		this.appRoot.innerHTML = this.updatedTamplate
			? this.updatedTamplate
			: settingsTemplate;

		this.findElements();
		this.setEventListeners();

		this.updateSettingsView(settings);
	}

	updateSettingsView(settings) {
		this.changeLanguage(settings.language);
		// this.changeFirstPlayer(settings.firstPlayer);
		// this.changeSound(settings.soundEnabled);
		// this.changeTheme(settings.theme === 'dark');
	}

	changeLanguage(lang) {
		this.buttons.forEach((button) => {
			button.textContent =
				this.translation[lang]['settingsView'][button.id];
		});
		this.title.textContent =
			this.translation[lang]['settingsView']['title'];
		this.selectLanguageLabel.textContent =
			this.translation[lang]['settingsView']['language'];
		this.selectPlayerLabel.textContent =
			this.translation[lang]['settingsView']['firstPlayer'];

		this.languageSelect.value = lang;
		this.updatedTamplate = this.appRoot.innerHTML;
	}

	findElements() {
		this.title = this.appRoot.querySelector('.settings__title');
		this.selectLanguageLabel = this.appRoot.querySelector(
			'.settings__language-label',
		);
		this.selectPlayerLabel = this.appRoot.querySelector(
			'.settings__player-label',
		);

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
			button.addEventListener('click', this.handleButtonClick);
		});

		this.languageSelect.addEventListener(
			'change',
			this.handleChangeLanguage,
		);

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

	handleButtonClick = (event) => {
		const buttonId = event.currentTarget.id;
		this.controller.buttonAction(buttonId);
	};

	handleChangeLanguage = (event) => {
		const lang = event.target.value;
		this.languageSelect.value = lang;
		this.controller.changeLanguage(lang);
	};

	cleanup() {
		this.appRoot.innerHTML = '';
	}
}

export default SettingsView;
