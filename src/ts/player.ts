import Tetris from './tetris';
import Arena from './arena';

import Music from './music.js';

class Player {

    private DROP_SLOW: number[];
    private tetris: Tetris;
    private arena: Arena;
    private dropCounter: number;
    private dropInterval: number;

    public pos: Offset;
    public matrix: number[][];
    public score: number;

    private currentLevel: number;
    public isGameOver: boolean;

    constructor(tetris: Tetris){

        this.DROP_SLOW = [1000, 800, 600, 400, 200, 100];
        this.tetris = tetris;
        this.arena = tetris.arena;

        this.currentLevel = 0;

        this.dropCounter = 0;
        this.dropInterval = this.DROP_SLOW[this.currentLevel];

        this.pos = {x: 0, y:0};

        this.matrix = [];
        
        this.score = 0;

        this.reset();

        this.updateScore(this.score);
        this.isGameOver = false;
    }

    private createPiece(type: string) : number[][]{
        switch(type){
            case 'T':
                return [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ];
            case 'O':
                return [
                    [2,2],
                    [2,2]
                ];
            case 'L':
                return [
                    [0, 3, 0],
                    [0, 3, 0],
                    [0, 3, 3]
                ];
            case 'J':
                return [
                    [0, 4, 0],
                    [0, 4, 0],
                    [4, 4, 0]
                ];
            case 'I':
                return [
                    [0, 5, 0, 0],
                    [0, 5, 0, 0],
                    [0, 5, 0, 0],
                    [0, 5, 0, 0],
                ];
            case 'S':
                return [
                    [0, 6, 6],
                    [6, 6, 0],
                    [0, 0, 0]
                ];
            case 'Z':
                return [
                    [7, 7, 0],
                    [0, 7, 7],
                    [0, 0, 0]
                ];
            default:
                return [];
        }
    }

    public drop(): void{
        this.pos.y++;
        this.dropCounter = 0;
        if(this.arena.collide(this)){
            this.pos.y--;
            this.arena.merge(this);
            this.reset();
            this.score += this.arena.sweep();
            this.updateScore(this.score);
            if(this.tetris.isFalling){
                this.tetris.isFalling = false;
            }
        }
    }

    public move(dir: number): void{
        this.pos.x += dir;
        if(this.arena.collide(this)){
            this.pos.x -= dir;
        }
    }

    private reset(): void{
       const pieces = "ILJOTSZ";
       this.matrix = this.createPiece(pieces[Math.floor(Math.random()*pieces.length)]);
       this.pos.y = 0;

       let aux = 0;
       if(this.matrix) aux = Math.floor(this.matrix[0].length/2);
       this.pos.x = Math.floor(this.arena.matrix[0].length/2) - aux;

       if(this.arena.collide(this)){
           this.arena.clear();
           //this.score = 0;
           const music = new Music();
           music.gameover();
           this.tetris.drawImageOnCanvas('../assets/fin.jpg');
           this.tetris.isPaused = true;
           this.isGameOver = true;
       }
    }

    public rotate(dir: number): void{
        const pos = this.pos.x;
        let offset = 1;
        this._rotateMatrix(this.matrix, dir);
        while(this.arena.collide(this)){
            this.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if(offset > this.matrix[0].length){
                this._rotateMatrix(this.matrix, -dir);
                this.pos.x = pos;
            }
        }
    }

    private _rotateMatrix(matrix: number[][], dir: number): void{
        for(let y = 0; y < matrix.length; ++y){
            for(let x = 0; x < y; ++x){
                [
                    matrix[x][y],
                    matrix[y][x]
                ] = [
                    matrix[y][x],
                    matrix[x][y]
                ];
            }
        }

        if(dir > 0){
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    public update(deltaTime: number): void{
        this.dropCounter += deltaTime;
        if(this.dropCounter > this.dropInterval){
            this.drop();
        }
    }

    public updateScore(score: number): void{
        const scoreEl = document.getElementById("score");
        if(scoreEl) scoreEl.innerText = "Puntuación: " + score.toString();
    }

    public setLevel(){
        this.currentLevel += 1;
        if(this.currentLevel > 5){
            this.currentLevel = 0;
        }
        this.dropInterval = this.DROP_SLOW[this.currentLevel];
    }

}

export default Player;