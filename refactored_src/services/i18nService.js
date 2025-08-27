import { translations } from '../i18n/translations.js';

class I18nService {
	_translations;
	_language = 'en'; // Default language

	constructor(translations) {
		this._translations = translations;
	}

	setLanguage(language) {
		if (this._translations[language]) {
			this._language = language;
		} else {
			console.warn(`Language '${language}' not found. Falling back to '${this._language}'.`);
		}
	}

	getLanguage() {
		return this._language;
	}

	getString(key, view) {
		const lang = this._language;
		if (
			this._translations[lang] &&
			this._translations[lang][view] &&
			this._translations[lang][view][key]
		) {
			return this._translations[lang][view][key];
		}

		console.warn(`Translation key '${key}' for view '${view}' not found in language '${lang}'.`);
		// Fallback to English if the key is not found in the current language
		if (lang !== 'en') {
			if (
				this._translations.en &&
				this._translations.en[view] &&
				this._translations.en[view][key]
			) {
				return this._translations.en[view][key];
			}
		}

		return key; // Return the key itself as a last resort
	}
}

// Export a singleton instance, passing in the translation data
export const i18nService = new I18nService(translations);
