class BaseView {
	appRoot;
	_listeners = []; // Store listeners to be removed later

	constructor(appRoot) {
		if (!appRoot) {
			throw new Error('Root element is required for a view.');
		}
		this.appRoot = appRoot;
	}

	// A simple helper to add listeners and keep track of them
	_addListener(element, event, handler) {
		const boundHandler = handler.bind(this);
		element.addEventListener(event, boundHandler);
		this._listeners.push({ element, event, handler: boundHandler });
	}

	// Method to find a single element within the view's scope
	_findElement(selector) {
		const element = this.appRoot.querySelector(selector);
		if (!element) {
			console.warn(`Element with selector "${selector}" not found.`);
		}
		return element;
	}

	// Method to find multiple elements within the view's scope
	_findElements(selector) {
		const elements = this.appRoot.querySelectorAll(selector);
		if (elements.length === 0) {
			console.warn(`No elements with selector "${selector}" found.`);
		}
		return elements;
	}

	// Renders the view's template into the app root.
	// Subclasses will override this to provide their specific template.
	_renderTemplate(template) {
		this.appRoot.innerHTML = template;
	}

	// Cleanup method to remove all registered event listeners
	cleanup() {
		this._listeners.forEach(({ element, event, handler }) => {
			element.removeEventListener(event, handler);
		});
		this._listeners = []; // Clear the listeners array
		this.appRoot.innerHTML = ''; // Clear the view content
		console.log(`${this.constructor.name} cleaned up.`);
	}
}

export default BaseView;
