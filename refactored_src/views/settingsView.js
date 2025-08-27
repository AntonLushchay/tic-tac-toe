import BaseView from './baseView.js';
import { i18nService } from '../services/i18nService.js';
import settingsTemplate from './templates/settings-template.html';

class SettingsView extends BaseView {
	_template = settingsTemplate;
	_controller;

	constructor(appRoot, controller) {
		super(appRoot);
		this._controller = controller;
	}

	render(state) {
		if (!this.appRoot.innerHTML) {
			this._renderTemplate(this._template);
			this._bindElements();
			this._bindListeners();
		}
		this._update(state);
	}

	_bindElements() {
		this.titleElem = this._findElement('.settings__title');
		this.languageLabel = this._findElement('.settings__language-label');
		this.firstPlayerLabel = this._findElement('.settings__player-label');
		this.aiDifficultyLabel = this._findElement('.settings__ai-difficulty-label');

		this.languageSelect = this._findElement('[data-js-settings-language-select]');
		this.firstPlayerSelect = this._findElement('[data-js-settings-first-player-select]');
		this.aiDifficultySelect = this._findElement('[data-js-settings-ai-difficulty-select]');
		this.soundButton = this._findElement('[data-js-settings-sound-toggle]');
		this.backButton = this._findElement('#backButton');
	}

	_bindListeners() {
		this._addListener(this.backButton, 'click', this._handleBackButtonClick);
		this._addListener(this.languageSelect, 'change', this._handleLanguageChange);
		this._addListener(this.firstPlayerSelect, 'change', this._handleFirstPlayerChange);
		this._addListener(this.aiDifficultySelect, 'change', this._handleAiDifficultyChange);
		this._addListener(this.soundButton, 'click', this._handleSoundToggle);
	}

	_handleBackButtonClick = () => {
		this._controller.back();
	}

	_handleLanguageChange = (event) => {
		this._controller.updateSetting('language', event.target.value);
	}

	_handleFirstPlayerChange = (event) => {
		this._controller.updateSetting('firstPlayer', event.target.value);
	}

	_handleAiDifficultyChange = (event) => {
		this._controller.updateSetting('aiDifficulty', event.target.value);
	}

	_handleSoundToggle = () => {
		// The view knows the current state from the last _update call
		this._controller.updateSetting('soundEnabled', !this.soundEnabled);
	}

	_update(state) {
		this.soundEnabled = state.soundEnabled; // Cache for the toggle handler

		// Update labels with i18n
		this.titleElem.textContent = i18nService.getString('title', 'settingsView');
		this.languageLabel.textContent = i18nService.getString('language', 'settingsView');
		this.firstPlayerLabel.textContent = i18nService.getString('firstPlayer', 'settingsView');
		this.aiDifficultyLabel.textContent = i18nService.getString('aiDifficulty', 'settingsView');
		this.backButton.textContent = i18nService.getString('backButton', 'settingsView');

		// Update control values from state
		this.languageSelect.value = state.language;
		this.firstPlayerSelect.value = state.firstPlayer;
		this.aiDifficultySelect.value = state.aiDifficulty;

		// Update sound button visual state
		this.soundButton.classList.toggle('settings__sound-button--disabled', !state.soundEnabled);
	}
}

export default SettingsView;
