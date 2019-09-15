import Game from './Game.vue';

window.addEventListener('load', ()=>{
    const main = document.createElement('main');
    document.body.appendChild(main);
    const game = new Game({el: main});
    Object.defineProperty(window, 'game', {value: game});
}, {once: true});
