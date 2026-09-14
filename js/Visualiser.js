export class Wave {
    constructor() {
        this.time = 0;
        this.ripples = [];
        this.currentColour = { r: 44, g: 26, b: 18 };
        this.targetColour = { r: 44, g: 26, b: 18 };
    }

    setWaveColour(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            this.targetColour = {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        }
    }

    addRipple(x, force) {
        this.ripples.push({
            x: x,
            time: 0,
            force: force
        });
    }

    update(dt) {
        this.time += dt * 0.2;

        this.currentColour.r += (this.targetColour.r - this.currentColour.r) * dt * 2;
        this.currentColour.g += (this.targetColour.g - this.currentColour.g) * dt * 2;
        this.currentColour.b += (this.targetColour.b - this.currentColour.b) * dt * 2;

        for (let i = this.ripples.length - 1; i >= 0; i--) {
            this.ripples[i].time += dt;
            if (this.ripples[i].time > 2) {
                this.ripples.splice(i, 1);
            }
        }
    }

    draw(ctx, width, height) {
        const baseY = height * 0.85;

        const layers = [
            { opacity: 0.1, speed: 0.5, scale: 0.003, height: 4, offset: 0 },
            { opacity: 0.15, speed: 0.3, scale: 0.005, height: 2, offset: 100 }
        ];

        layers.forEach(layer => {
            ctx.beginPath();
            ctx.moveTo(0, height);
            ctx.lineTo(0, baseY);

            for (let x = 0; x <= width; x += 10) {
                let y = Math.sin(x * layer.scale + this.time * layer.speed + layer.offset) * layer.height;

                this.ripples.forEach(ripple => {
                    const dist = Math.abs(x - ripple.x);
                    const t = ripple.time;
                    const life = Math.max(0, 1 - t * 0.8);
                    const spread = 120 + (t * 30);
                    const envelope = Math.exp(-(dist * dist) / (spread * spread));
                    const swell = envelope * life * (ripple.force * 0.4);

                    y += swell;
                });

                ctx.lineTo(x, baseY + y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fillStyle = `rgba(${Math.round(this.currentColour.r)}, ${Math.round(this.currentColour.g)}, ${Math.round(this.currentColour.b)}, ${layer.opacity})`;
            ctx.fill();
        });
    }
}

export class Mark {
    constructor(angle, maxAngle) {
        this.angle = angle;
        this.accuracy = 1 - (Math.abs(angle) / maxAngle);

        if (this.accuracy > 0.90) {
            this.colour = '#a33222';
        } else if (this.accuracy > 0.40) {
            this.colour = '#12969B';
        } else {
            this.colour = '#050505';
        }
    }

    draw(ctx, pivotX, pivotY, len) {
        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.moveTo(-1, -len + 20);
        ctx.quadraticCurveTo(3, -len, -1, -len - 20);
        ctx.quadraticCurveTo(-4, -len, -1, -len + 20);

        ctx.fillStyle = this.colour;

        ctx.fill();
        ctx.restore();
    }
}
