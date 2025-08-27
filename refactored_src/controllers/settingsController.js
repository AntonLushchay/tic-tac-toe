import SettingsModel from '../models/settingsModel.js';
import SettingsView from '../views/settingsView.js';
import { i18nService } from '../services/i18nService.js';

class SettingsController {
	_model;
	_view;
	_observers = [];

	constructor(appRoot) {
		this._model = new SettingsModel();
		this._view = new SettingsView(appRoot, this);
		this._model.subscribe(this._handleModelUpdate);
	}

	show() {
		this._view.render(this._model.getSettings());
	}

	getSettings() {
		return this._model.getSettings();
	}

	updateSetting(key, value) {
		this._model.updateSetting(key, value);
		// Also update the i18n service if the language changed
		if (key === 'language') {
			i18nService.setLanguage(value);
		}
		// Notify AppController about the change
		this._notify();
	}

	back() {
		window.history.back();
	}

	subscribe(observer) {
		this._observers.push(observer);
	}

	_notify() {
		const settings = this.getSettings();
		this._observers.forEach(observer => observer(settings));
	}

	_handleModelUpdate = (state) => {
		this._view.render(state);
	}

	cleanup() {
		if (this._view) {
			this._view.cleanup();
		}
	}
}

export default SettingsController;
