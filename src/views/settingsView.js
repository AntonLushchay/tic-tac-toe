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
		this.changeFirstPlayer(settings.firstPlayer);
		this.changeAiDifficulty(settings.aiDifficulty);
		this.changeSound(settings.soundEnabled);
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
		this.aiDifficultySelectLabel.textContent =
			this.translation[lang]['settingsView']['aiDifficulty'];

		this.aiDifficultySelect.querySelector('[value="easy"]').textContent =
			this.translation[lang]['settingsView']['aiDifficultyEasy'];
		this.aiDifficultySelect.querySelector('[value="medium"]').textContent =
			this.translation[lang]['settingsView']['aiDifficultyMedium'];
		this.aiDifficultySelect.querySelector('[value="hard"]').textContent =
			this.translation[lang]['settingsView']['aiDifficultyHard'];

		this.languageSelect.value = lang;
		this.updatedTamplate = this.appRoot.innerHTML;
	}

	changeFirstPlayer(sign) {
		this.firstPlayerSelect.value = sign;
	}

	changeAiDifficulty(difficulty) {
		this.aiDifficultySelect.value = difficulty;
	}

	changeSound(soundEnabled) {
		if (soundEnabled) {
			this.soundToggle.classList.remove(
				'settings__sound-button--deactived',
			);
		} else {
			this.soundToggle.classList.add('settings__sound-button--deactived');
		}
	}

	findElements() {
		this.title = this.appRoot.querySelector('.settings__title');
		this.selectLanguageLabel = this.appRoot.querySelector(
			'.settings__language-label',
		);

		this.buttons = this.appRoot.querySelectorAll(
			'[data-js-settings-button]',
		);
		this.languageSelect = this.appRoot.querySelector(
			'[data-js-settings-language-select]',
		);

		this.selectPlayerLabel = this.appRoot.querySelector(
			'.settings__player-label',
		);
		this.firstPlayerSelect = this.appRoot.querySelector(
			'[data-js-settings-first-player-select]',
		);

		this.aiDifficultySelectLabel = this.appRoot.querySelector(
			'.settings__ai-difficulty-label',
		);
		this.aiDifficultySelect = this.appRoot.querySelector(
			'[data-js-settings-ai-difficulty-select]',
		);

		this.soundToggle = this.appRoot.querySelector(
			'[data-js-settings-sound-toggle]',
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

		this.firstPlayerSelect.addEventListener(
			'change',
			this.handleChangeFirstPlayer,
		);

		this.aiDifficultySelect.addEventListener(
			'change',
			this.handleChangeAiDifficulty,
		);

		this.soundToggle.addEventListener('click', this.handleToggleSound);
	}

	handleButtonClick = (event) => {
		const buttonId = event.currentTarget.id;
		this.controller.buttonAction(buttonId);
	};

	handleChangeLanguage = (event) => {
		const lang = event.target.value;
		this.controller.changeLanguage(lang);
	};

	handleChangeFirstPlayer = (event) => {
		const sign = event.target.value;
		this.controller.changeFirstPlayer(sign);
	};

	handleChangeAiDifficulty = (event) => {
		const difficulty = event.target.value;
		this.controller.changeAiDifficulty(difficulty);
	};

	handleToggleSound = () => {
		this.controller.toggleSound();
	};

	cleanup() {
		this.appRoot.innerHTML = '';
	}
}

export default SettingsView;
