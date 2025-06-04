import './styles.scss'; // Импортируем наши стили
// import logo from './assets/logo.png'; // Пример импорта изображения

console.log('Webpack работает!');
console.log('Это современный JavaScript!');

// Пример использования новой фичи JS (например, оператор нулевого слияния)
const someValue = null;
const defaultValue = someValue ?? 'Значение по умолчанию';
console.log(defaultValue);

// Пример использования компонента, если у тебя есть React/Vue
// import App from './App';
// ReactDOM.render(<App />, document.getElementById('root'));
