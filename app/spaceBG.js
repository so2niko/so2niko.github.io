export default class SpaceBG{
    //static link to initial statement
    static entity = 0;
    static canvasSelector = '.canvas-bg';
    static starCount = 150;
    static starColor = '255,255,255';
    static starOpacity = '0.6';
    static distanceDivider = 5;
    static maxRadius = 3;
    static outScreenGap = 150;
    static speedMultiplier = .3;

    //primary entry point for background initialization
    static start = _ => {
        SpaceBG.entity = new SpaceBG();
        SpaceBG.entity.initial();
    }

    initial = _ => {
        this.canvas = document.querySelector(SpaceBG.canvasSelector);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        
        this.stars = (new Array(SpaceBG.starCount)).fill(0).map(_=>this.generateStar());
        //We use a combination of fill and map methods, as map skips empty array elements (holes)
        this.mouseStar = this.generateStar(false);
        this.stars.push(this.mouseStar);
        //generate star for mouse

        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseleave', this.handleMouseOut);

        window.addEventListener('resize', this.resizeCanvas);
        window.requestAnimationFrame(this.render);
    }

    render = _ => {
        this.ctx.clearRect(0, 0, this.cWidth, this.cHeight);

        this.fillStars();

        this.renderStars();

        this.renderLines();

        this.updateStars();

        window.requestAnimationFrame(this.render);
    }

    generateStar = (isStar = true) => {
        if(isStar){
            return {
                coordX : this.random(this.cWidth),
                coordY : this.random(this.cHeight),
                radius : this.random(SpaceBG.maxRadius),
                speedX : this.random(),
                speedY : this.random(),
                isStar : true
            };
        }

        return {
            coordX : 0,
            coordY : 0,
            speedX : 0,
            speedY : 0,
            isStar : false
        };        
    }

    //return random value, using parameter length
    random = (length = 0) => {
        const r = Math.random();

        if(length > 0){
            return Math.ceil(r * length);
        }

        //evaluate stars speed
        return (r > .5 ? r : -r) * SpaceBG.speedMultiplier;
    }

    resizeCanvas = _ => {
        this.cHeight = window.innerHeight;
        this.cWidth = window.innerWidth;

        this.canvas.height = this.cHeight;
        this.canvas.width = this.cWidth;

        this.screenXMax = this.cWidth + SpaceBG.outScreenGap;
        this.screenYMax = this.cHeight + SpaceBG.outScreenGap;

        this.distanceLimit = this.cHeight / SpaceBG.distanceDivider;
    }

    //regenerate stars, if some of then locate out of visible part of display
    fillStars = _ => {
        let countDiff = SpaceBG.starCount - this.stars.length;
        if(countDiff > 0){
            while(countDiff--){
                this.stars.push(this.generateStar());
            }
        }
    }

    renderStars = _ => {
        this.stars.forEach(star => {
            if(star.isStar){
                this.ctx.fillStyle = `rgba(${SpaceBG.starColor},${SpaceBG.starOpacity})`;
                this.ctx.beginPath();
                this.ctx.arc(star.coordX, star.coordY, star.radius, 0, Math.PI * 2, true);
                this.ctx.closePath();
                this.ctx.fill();
            }            
        });
    }

    renderLines = _ => {
        const starsArrLen = this.stars.length;
        //in fact, we have +1 star in the sky. This specific star is a mouse

        this.stars.forEach((star, i, stars) => {
            for(let j = i + 1; j < starsArrLen; j++){
                const dist = this.getDistance(star, stars[j]) / this.distanceLimit;
                if(dist < 1){
                    const divider = 1 - dist;
                    this.ctx.strokeStyle = `rgba(${SpaceBG.starColor},${divider})`;
                    this.ctx.lineWidth = divider;
                    this.ctx.beginPath();
                    this.ctx.moveTo(star.coordX, star.coordY);
                    this.ctx.lineTo(stars[j].coordX, stars[j].coordY);
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

    updateStars = _ => {
        this.stars = this.stars.filter(star => {
            star.coordX += star.speedX;
            star.coordY += star.speedY;

            return (
                !star.isStar ||
                star.coordX > -SpaceBG.outScreenGap &&
                star.coordY > -SpaceBG.outScreenGap &&
                star.coordX < this.screenXMax &&
                star.coordY < this.screenYMax
                );
        });
    }

    handleMouseMove = ev => {
        this.mouseStar.coordX = ev.pageX;
        this.mouseStar.coordY = ev.pageY;
    }

    handleMouseOut = _ => {
        this.mouseStar.coordX = 0;
        this.mouseStar.coordY = 0;
    }
}