window.onload = () => {
  const intro = document.getElementById("intro");
  const canvas = document.getElementById("scratch");
  const ctx = canvas.getContext("2d");
  const hint = document.querySelector(".hint");
  setTimeout(initScratch, 100);
  
  const scratchSound = new Audio("https://www.soundjay.com/human_c2026/sounds/baby-laughing-06.mp3");
  scratchSound.volume = 0.19;

  let scratchCount = 0;
  let revealed = false;
  let isDrawing = false;
  let lastSound = 0;

  // 👉 Setup AFTER intro disappears
  intro.addEventListener("click", () => {
    intro.classList.add("hidden");
  });

  function initScratch() {
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw gold (normal mode)
    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "#e6c76e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // glitter
    for (let i = 0; i < 100000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.9;

      ctx.fillStyle = `rgb(${820 + Math.random()*50}, ${190 + Math.random()*30}, ${90 + Math.random()*20})`;
      ctx.fillRect(x, y, size, size);
    }

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "rgba(255,255,255,0.25)");
    gradient.addColorStop(1, "rgba(0,0,0,0.25)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 👉 Enable scratching
    ctx.globalCompositeOperation = "destination-out";
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    };
  }

  function playScratchSound() {
    const now = Date.now();
    if (now - lastSound > 120) {
      scratchSound.currentTime = 0;
      scratchSound.play();
      lastSound = now;
    }
  }

  function launchConfetti() {
    const symbols = ["💛","🌸","✨","🎉","🎈","🎊"];

    for (let i = 0; i < 100; i++) {
      const el = document.createElement("div");

       el.innerText = symbols[Math.floor(Math.random() * symbols.length)];

    el.style.position = "fixed";
    el.style.left = Math.random() * window.innerWidth + "px";

    // ✅ RANDOM HEIGHT START
    el.style.top = (window.innerHeight * 0.6 + Math.random() * 200) + "px";

    el.style.fontSize = (12 + Math.random() * 8) + "px";
    el.style.pointerEvents = "none";
    el.style.opacity = 0.9;

    document.body.appendChild(el);

    const driftX = (Math.random() - 0.5) * 120;
    const driftY = Math.random() * 300 + 200;

    el.animate([
      { transform: "translate(0,0)", opacity: 0 },
      { transform: `translate(${driftX}px, -${driftY}px)`, opacity: 1 }
    ], {
      duration: 2500 + Math.random() * 1500,
      easing: "ease-out"
    });

    setTimeout(() => el.remove(), 4000);
  }
}
  function scratch(e) {
   
    
    if (!isDrawing) return;

    const pos = getPos(e);
    
    const shimmer = document.querySelector(".shimmer");
    if (shimmer) shimmer.style.opacity = "0";

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
    ctx.fill();

    scratchCount++;
    //playScratchSound();

    // 👉 hide hint immediately
    if (hint) hint.style.opacity = "0";

    if (!revealed && scratchCount > 60) {
      revealed = true;

      canvas.style.transition = "all 0.6s ease";
      canvas.style.opacity = "0";
      canvas.style.transform = "scale(1.03)";

      // 🎉 trigger visuals first
      launchConfetti();

      // 🔊 play sound AFTER slight delay
      setTimeout(() => {
        scratchSound.currentTime = 0;
        scratchSound.play();
      }, 500);
      
       // 📳 HAPTIC FEEDBACK
        if (navigator.vibrate) {
          navigator.vibrate([20,30,100]); 
          // pattern: vibrate → pause → vibrate
        }

      // 💌 signature
      setTimeout(() => {
        const sig = document.getElementById("signature");
        if (sig) {
          sig.style.opacity = "1";
          sig.style.transform = "translateY(0)";
        }
      }, 400);
    }
  }

  // EVENTS
  canvas.addEventListener("mousedown", () => isDrawing = true);
  canvas.addEventListener("mouseup", () => isDrawing = false);
  canvas.addEventListener("mouseleave", () => isDrawing = false);
  canvas.addEventListener("mousemove", scratch);

  canvas.addEventListener("touchstart", () => isDrawing = true);
  canvas.addEventListener("touchend", () => isDrawing = false);
  canvas.addEventListener("touchmove", scratch);
};

window.addEventListener("resize", () => {
  initScratch();
});
