class SettingsModel {
	constructor() {
		this.language = 'en';
		this.soundEnabled = true;
		this.firstPlayer = 'X';
	}

	setLanguage(lang) {
		this.language = lang;
	}

	toggleSound() {
		this.soundEnabled = !this.soundEnabled;
	}

	setFirstPlayer(player) {
		this.firstPlayer = player;
	}
}

export default SettingsModel;
