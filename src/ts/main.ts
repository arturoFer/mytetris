import Tetris from './tetris.js';
import Music from './music.js';

const tetris = new Tetris();

const modal = document.getElementById("myModal");
const btn = document.getElementById("open-help");
const span = document.getElementById("close-help");

const keylistener = (event: KeyboardEvent) => {
    const player = tetris.player;
    const music = new Music();

    if(event.keyCode === 13){
        if(tetris.isFirstTime === true){
            tetris.isFirstTime = false;
            music.start();
            tetris.run();
        } else {
            tetris.isPaused = !tetris.isPaused;
            if(player.isGameOver === true){
                player.score = 0;
                player.updateScore(player.score);
                player.isGameOver = false;
            }
        }
    }else if(event.keyCode === 37){
        if(tetris.isPaused === true) return;
        music.move();
        player.move(-1);
    } else if(event.keyCode === 39){
        if(tetris.isPaused === true) return;
        music.move();
        player.move(1);
    } else if(event.keyCode === 40){
        if(tetris.isPaused === true) return;
        player.drop();
    } else if(event.keyCode === 81){
        if(tetris.isPaused === true) return;
        music.rotate();
        player.rotate(-1);
    } else if(event.keyCode === 87){
        if(tetris.isPaused === true) return;
        music.rotate();
        player.rotate(1);
    } else if(event.keyCode === 38){
        if(tetris.isPaused === true) return; 
        player.setLevel();
    } else if(event.keyCode === 32){
        if(tetris.isPaused === true) return;
        music.fall();
        tetris.isFalling = true;
    }
};

document.addEventListener('keydown', keylistener);

if(btn !== null){
    btn.addEventListener('click', () => {
        if(modal !== null){
           modal.classList.remove("hidden")
           modal.classList.add("visible");
        }
    });
}

if(span !== null){
    span.addEventListener('click', () => {
        if(modal !== null){
            modal.classList.remove("visible");
            modal.classList.add('hidden');
        }
    });
}

document.addEventListener('click', (e) => {
    if((modal !== null) && (e.target === modal)){
         modal.classList.remove("visible");
         modal.classList.add('hidden');
    }
});