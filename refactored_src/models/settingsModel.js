class SettingsModel {
	constructor() {
		this.language = 'en';
		this.firstPlayer = 'X';
		this.soundEnabled = true;
		this.aiDifficulty = 'easy';
		this.observers = [];

		this.loadSettings();
	}

	subscribe(observer) {
		this.observers.push(observer);
	}

	notifyUpdate() {
		const state = this.getState();
		this.observers.forEach((observer) => observer(state));
	}

	getState() {
		return {
			language: this.language,
			firstPlayer: this.firstPlayer,
			aiDifficulty: this.aiDifficulty,
			soundEnabled: this.soundEnabled,
		};
	}

	loadSettings() {
		const savedSettings = localStorage.getItem('settings');
		if (savedSettings) {
			const parsedSettings = JSON.parse(savedSettings);
			this.language = parsedSettings.language;
			this.firstPlayer = parsedSettings.firstPlayer;
			this.aiDifficulty = parsedSettings.aiDifficulty;
			this.soundEnabled = parsedSettings.soundEnabled;
		}
	}

	saveSettings() {
		localStorage.setItem('settings', JSON.stringify(this.getState()));
	}

	setLanguage(lang) {
		this.language = lang;
		this.saveSettings();
		this.notifyUpdate();
	}

	setFirstPlayer(sign) {
		this.firstPlayer = sign;
		this.saveSettings();
		this.notifyUpdate();
	}

	setAiDifficulty(difficulty) {
		this.aiDifficulty = difficulty;
		this.saveSettings();
		this.notifyUpdate();
	}

	toggleSound() {
		this.soundEnabled = !this.soundEnabled;
		this.saveSettings();
		this.notifyUpdate();
	}

	updateSetting(key, value) {
		const validKeys = Object.keys(this.getState());
		if (validKeys.includes(key)) {
			this[key] = value;
			this.saveSettings();
			this.notifyUpdate();
		} else {
			console.warn(`SettingsModel: Unknown setting key "${key}"`);
		}
	}
}

export default SettingsModel;
