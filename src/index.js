import './styles.scss';

// import bannerJpg from './assets/img/banner.jpg';
import bannerWebp from './assets/img/banner.jpg?as=webp';
import bannerAvif from './assets/img/banner.jpg?as=avif';
import meWebp from './assets/img/me.png?as=webp';
import meAvif from './assets/img/me.png?as=avif';

// Используй переменные в шаблоне:
const picturElement = document.querySelector('.banner-picture-first');

picturElement.children[0].srcset = bannerWebp;
picturElement.children[1].srcset = bannerAvif;

const meElement = document.querySelector('.banner-picture-second');
meElement.children[0].srcset = meWebp;
meElement.children[1].srcset = meAvif;

console.log('Application started successfully!');
