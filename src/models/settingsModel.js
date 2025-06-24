class SettingsModel {
	constructor() {
		this.language = 'en';
		this.soundEnabled = true;
		this.firstPlayer = 'X';
		this.theme = 'light';
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
			soundEnabled: this.soundEnabled,
			firstPlayer: this.firstPlayer,
			theme: this.theme,
		};
	}

	loadSettings() {
		const savedSettings = localStorage.getItem('settings');
		if (savedSettings) {
			const parsedSettings = JSON.parse(savedSettings);
			this.language = parsedSettings.language;
			this.soundEnabled = parsedSettings.soundEnabled;
			this.firstPlayer = parsedSettings.firstPlayer;
			this.theme = parsedSettings.theme;
		}
		// this.notifyUpdate();
	}

	saveSettings() {
		localStorage.setItem('settings', JSON.stringify(this.getState()));
	}

	setLanguage(lang) {
		this.language = lang;
		this.saveSettings();
		this.notifyUpdate();
	}

	toggleSound() {
		this.soundEnabled = !this.soundEnabled;
		this.saveSettings();
		this.notifyUpdate();
	}

	setFirstPlayer(player) {
		this.firstPlayer = player;
		this.saveSettings();
		this.notifyUpdate();
	}

	toggleTheme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		this.saveSettings();
		this.notifyUpdate();
	}
}

export default SettingsModel;
