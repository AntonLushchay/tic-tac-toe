import settingsTemplate from './templates/settings-template.html';

class SettingsView {
	constructor(appRoot) {
		this.appRoot = appRoot;
		this.settingsElement = null;
	}

	render() {
		this.settingsElement = document.createElement('div');
		this.settingsElement.innerHTML = settingsTemplate;
		this.appRoot.appendChild(this.settingsElement);
	}

	cleanup() {
		if (this.settingsElement) {
			this.appRoot.removeChild(this.settingsElement);
			this.settingsElement = null;
		}
	}
}

export default SettingsView;
