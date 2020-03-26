import Arena from './arena.js';
import Player from './player.js';

class Tetris {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private colors: string[];
    private lastTime: number;
    private scale: number;

    public arena: Arena;
    public player: Player;

    public isPaused: boolean;
    public isFirstTime: boolean;

    public isFalling: boolean;

    constructor(){
        this.canvas = document.getElementById('tetris') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.colors = [
            '#000',
            '#FF0D72',
            '#0DC2FF',
            '#0DFF72',
            '#F538FF',
            '#FF8E0D',
            '#FFE138',
            '#3877FF',
            '7f7f7f'
        ];
        this.scale = 1;

        this.fix_dpi();
        this.drawImageOnCanvas('../assets/inicio.jpg'); 

        this.arena = new Arena(12,20);
        this.player = new Player(this);

        this.lastTime = 0;

        this.isPaused = false;
        this.isFirstTime = true;

        this.isFalling = false;

    }

    private fix_dpi(){
        const dpi = devicePixelRatio;
        const style_height = getComputedStyle(this.canvas)
                                .getPropertyValue("height")
                                .slice(0, -2);
        const style_width = getComputedStyle(this.canvas)
                                .getPropertyValue("width")
                                .slice(0, -2);
        const height = dpi * parseInt(style_height);
        const width = dpi * parseInt(style_width);

        this.scale = height/20;

        this.canvas.setAttribute('height',height.toString());
        this.canvas.setAttribute('width', width.toString());

        this.context.scale(width/12, height/20);
    }

    private _update = (time = 0) => {
        if(this.isPaused === false){
            const deltaTime = time - this.lastTime;
            this.lastTime = time;

            if(this.isFalling === false){
                this.player.update(deltaTime);
            } else {
                this.player.drop();
            }
            
            this.draw();
        }
        
        requestAnimationFrame(this._update);
    }

    public drawImageOnCanvas(path: string): void{
        const img = new Image();
        img.src=path;
        img.onload = () => {
            this.context.drawImage(img, 0, 0, this.canvas.width/this.scale, this.canvas.height/this.scale);
        }
    }

    private draw(): void{
        this.context.fillStyle = this.colors[0];
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawMatrix(this.arena.matrix, {x:0, y: 0});
        this.drawMatrix(this.player.matrix, this.player.pos);
    }

    private drawMatrix(matrix:number[][], offset: Offset): void{
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if(value !== 0){
                    this.context.fillStyle = this.colors[value];
                    this.context.fillRect(x + offset.x, y + offset.y, 1, 1);

                    this.context.strokeStyle = this.colors[8];
                    this.context.lineWidth = 1/this.scale;
                    this.context.strokeRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    public run(): void{
        this._update();
    }

}

export default Tetris;