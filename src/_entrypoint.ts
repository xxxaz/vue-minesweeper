import Game from './Game.vue';

window.addEventListener('load', ()=>{
    const main = document.createElement('main');
    document.body.appendChild(main);
    new Game({el: main});
}, {once: true});
