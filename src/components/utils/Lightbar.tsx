import { useEffect, useRef } from "react";
import "./Lightbar.css";

interface LightbarOptions {
  imgSrc?: string;
  horizontalMotion?: boolean;
  sizeRange?: [number, number];
}

class Particle {
  x = 0;

  y = 0;

  radius = 0;

  direction = 0;

  speed = 0;

  lifetime = 0;

  ran = 0;

  image: null | HTMLImageElement = null;

  size = 10;

  options: LightbarOptions;

  constructor(
    canvas: HTMLCanvasElement,
    options: LightbarOptions = {
      horizontalMotion: false,
      sizeRange: [10, 10],
    },
  ) {
    if (options.imgSrc) {
      this.image = new Image();
      this.image.src = options.imgSrc;
    }

    this.options = options;

    this.reset(canvas);
    this.initialize(canvas);
  }

  reset(canvas: HTMLCanvasElement) {
    this.x = Math.round((Math.random() * canvas.width) / 2 + canvas.width / 4);
    this.y = Math.random() * 100 + 5;

    this.radius = 1 + Math.floor(Math.random() * 0.5);
    this.direction = (Math.random() * Math.PI) / 2 + Math.PI / 4;
    this.speed = 0.02 + Math.random() * 0.085;

    const second = 60;
    this.lifetime = second * 3 + Math.random() * (second * 30);

    this.size = this.options.sizeRange
      ? Math.random() *
          (this.options.sizeRange[1] - this.options.sizeRange[0]) +
        this.options.sizeRange[0]
      : 10;

    if (this.options.horizontalMotion) {
      this.direction = Math.random() <= 0.5 ? 0 : Math.PI;
      this.lifetime = 30 * second;
    }

    this.ran = 0;
  }

  initialize(canvas: HTMLCanvasElement) {
    this.ran = Math.random() * this.lifetime;
    const baseSpeed = this.speed;
    this.speed = Math.random() * this.lifetime * baseSpeed;
    this.update(canvas);
    this.speed = baseSpeed;
  }

  update(canvas: HTMLCanvasElement) {
    this.ran += 1;

    const addX = this.speed * Math.cos(this.direction);
    const addY = this.speed * Math.sin(this.direction);
    this.x += addX;
    this.y += addY;

    if (this.ran > this.lifetime) {
      this.reset(canvas);
    }
  }

  render(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.beginPath();

    const x = this.ran / this.lifetime;
    const o = (x - x * x) * 4;
    ctx.globalAlpha = Math.max(0, o * 0.8);

    if (this.image) {
      ctx.translate(this.x, this.y);
      const w = this.size;
      const h = (this.image.naturalWidth / this.image.naturalHeight) * w;
      if (this.image.src.includes("shark")) {
        const flip = this.direction === Math.PI ? 1 : -1;
        ctx.scale(flip, 1);
        ctx.drawImage(this.image, (-w / 2) * flip, -h / 2, w, h);
      } else {
        ctx.rotate(this.direction - Math.PI);
        ctx.drawImage(this.image, -w / 2, h, h, w);
      }
    } else {
      ctx.ellipse(
        this.x,
        this.y,
        this.radius,
        this.radius * 1.5,
        this.direction,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "white";
      ctx.fill();
    }
    ctx.restore();
  }
}

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const particles: Particle[] = [];

    canvas.width = canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;

    // Basic particle config
    const particleCount = 260;
    let imageParticleCount = particleCount;

    // Holiday overrides
    let imageOverride: { image: string; sizeRange?: [number, number] }[] = [];
    const date = new Date();
    const month = date.getMonth();
    const day = date.getDate();
    if (
      (month === 11 && day >= 24 && day <= 26) ||
      Math.floor(Math.random() * 38) > 40
    ) {
      imageOverride = [
        {
          image: "/lightbar-images/snowflake.svg",
          sizeRange: [12, 20] as [number, number],
        },
        {
          image: "/lightbar-images/santa.png",
          sizeRange: [25, 35] as [number, number],
        },
      ];
      imageParticleCount = particleCount * 0.1;
    }

    // Halloween overrides
    const month2 = date.getMonth();
    const day2 = date.getDate();
    if (
      (month2 === 9 && day2 >= 29 && day2 <= 31) ||
      Math.floor(Math.random() * 50) > 48
    ) {
      imageOverride = [
        {
          image: "/lightbar-images/ghost.png",
          sizeRange: [28, 31] as [number, number],
        },
        {
          image: "/lightbar-images/pumpkin.png",
          sizeRange: [28, 31] as [number, number],
        },
      ];
      imageParticleCount = particleCount * 0.09;
    }

    // Fish easter egg
    const shouldShowFishie = Math.floor(Math.random() * 75) > 69;
    if (shouldShowFishie) {
      imageOverride = [
        {
          image: "/lightbar-images/fishie.png",
          sizeRange: [10, 13] as [number, number],
        },
        {
          image: "/lightbar-images/shark.png",
          sizeRange: [48, 56] as [number, number],
        },
      ];
      imageParticleCount = particleCount * 0.085;
    }

    // Weed easter egg
    const month3 = date.getMonth() + 1;
    const day3 = date.getDate();
    const shouldShowZa =
      (month3 === 4 && day3 === 20) || Math.floor(Math.random() * 433) > 420;
    if (shouldShowZa) {
      imageOverride = [
        {
          image: "/lightbar-images/weed.png",
          sizeRange: [29, 33] as [number, number],
        },
      ];
      imageParticleCount = particleCount / 6.34;
    }

    // Kitty easter egg
    const shouldShowCat = Math.floor(Math.random() * 75) < 18;
    if (shouldShowCat) {
      imageOverride = [
        {
          image: "/lightbar-images/cat.png",
          sizeRange: [30, 36] as [number, number],
        },
      ];
      imageParticleCount = particleCount / 6.7;
    }

    // HOIST THE SAIL (of particles)!
    for (let i = 0; i < particleCount; i += 1) {
      const isImageParticle = imageOverride && i <= imageParticleCount;
      const randomImageIndex = Math.floor(Math.random() * imageOverride.length);
      const sizeRange = imageOverride[randomImageIndex]?.sizeRange;
      const src = imageOverride[randomImageIndex]?.image;
      const particle = new Particle(canvas, {
        imgSrc: isImageParticle ? src : undefined,
        horizontalMotion: src?.includes("fishie") || src?.includes("shark"),
        sizeRange,
      });
      particles.push(particle);
    }

    let shouldTick = true;
    let handle: ReturnType<typeof requestAnimationFrame> | null = null;
    function particlesLoop() {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (shouldTick) {
        for (const particle of particles) {
          particle.update(canvas);
        }
        shouldTick = false;
      }

      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;
      for (const particle of particles) {
        particle.render(canvas);
      }

      handle = requestAnimationFrame(particlesLoop);
    }
    const interval = setInterval(() => {
      shouldTick = true;
    }, 1e3 / 120); // tick 120 times a sec

    particlesLoop();

    return () => {
      if (handle) cancelAnimationFrame(handle);
      clearInterval(interval);
    };
  }, []);

  return <canvas className="particles" ref={canvasRef} />;
}

export function Lightbar(props: { className?: string }) {
  return (
    <div className="absolute inset-0 w-full h-[680px] overflow-hidden pointer-events-none -mt-64">
      <div className="max-w-screen w-full h-[680px] relative pt-64">
        <div className={props.className}>
          <div className="lightbar">
            <ParticlesCanvas />
            <div className="lightbar-visual" />
          </div>
        </div>
      </div>
    </div>
  );
}