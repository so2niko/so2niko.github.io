export default class SpaceBG{
    //static link to initial statement
    static entity = 0;
    static canvasSelector = '.canvas-bg';
    static ballsCount = 100;
    static ballColor = '255,255,255';
    static ballOpacity = '0.6';
    static distanceDivider = 3;
    static maxRadius = 3;

    //primary entry point for background initialization
    static start = _ => {
        SpaceBG.entity = new SpaceBG();
        SpaceBG.entity.initial();
        console.log(SpaceBG.entity);
    }

    initial = _ => {
        this.canvas = document.querySelector(SpaceBG.canvasSelector);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        
        this.balls = (new Array(SpaceBG.ballsCount)).fill(0).map(_=>this.generateBall());
        //We use a combination of fill and map methods, as map skips empty array elements (holes)


        window.addEventListener('resize', this.resizeCanvas);
        window.requestAnimationFrame(this.render);
    }

    render = _ => {
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);

        this.fillBalls();

        this.renderBalls();

        this.renderLines();

        //updateBalls

        window.requestAnimationFrame(this.render);
    }

    generateBall = _ => {
        return {
            coordX : this.random(this.cWidth),
            coordY : this.random(this.cHeight),
            radius : this.random(SpaceBG.maxRadius),
            speedX : this.random(),
            speedY : this.random(),
            isBall : true
        };
    }

    //return random value, using parameter length
    random = (length = 0) => {
        const r = Math.random();

        if(length > 0){
            return Math.ceil(r * length);
        }

        return r > .5 ? r : -r;
    }

    resizeCanvas = _ => {
        this.cHeight = window.innerHeight;
        this.cWidth = window.innerWidth;

        this.canvas.height = this.cHeight;
        this.canvas.width = this.cWidth;

        this.distanceLimit = this.cHeight / SpaceBG.distanceDivider;
    }

    //regenerate balls, if some of then locate out of visible part of display
    fillBalls = _ => {
        let countDiff = this.balls.length - this.ballsCount;
        if(countDiff > 0){
            while(countDiff--){
                this.balls.push(this.generateBall());
            }
        }
    }

    renderBalls = _ => {
        this.balls.forEach(ball => {
            if(ball.isBall){
                this.ctx.fillStyle = `rgba(${SpaceBG.ballColor},${SpaceBG.ballOpacity})`;
                this.ctx.beginPath();
                this.ctx.arc(ball.coordX, ball.coordY, ball.radius, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
    }

    renderLines = _ => {
        this.balls.forEach((ball, i, balls) => {
            for(let j = i + 1; j < SpaceBG.ballsCount; j++){
                const dist = this.getDistance(ball, balls[j]) / this.distanceLimit;
                if(dist < 1){
                    const divider = 1 - dist;
                    this.ctx.strokeStyle = `rgba(${SpaceBG.ballColor},${divider})`;
                    this.ctx.lineWidth = divider;
                    this.ctx.beginPath();
                    this.ctx.moveTo(ball.coordX, ball.coordY);
                    this.ctx.lineTo(balls[j].coordX, balls[j].coordY);
                    this.ctx.stroke();
                    this.ctx.closePath();

                }
            }
        });
    }

    getDistance = (a, b) => {
        const x = (a.coordX - b.coordX) ** 2;
        const y = (a.coordY - b.coordY) ** 2;

        return Math.sqrt(x + y);
    }





}