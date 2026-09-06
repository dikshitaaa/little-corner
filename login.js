import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* =========================
   SUPABASE
========================= */

const SUPABASE_URL = "https://jqhntznlvrjxfwyvcylm.supabase.co";
const SUPABASE_KEY = "sb_publishable_L2yb80_XzfBWW2EyvHl3Sw_WXBsRhCA";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("login-form");
  const message = document.getElementById("login-message");
  const particleContainer = document.getElementById("particles");


  /* =========================
     SUPABASE LOGIN
  ========================= */

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    if (!email || !password) {

      message.textContent =
        "please fill everything in ♡";

      return;
    }

    message.textContent =
      "checking your little corner… ♡";


    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });


    /* =========================
       LOGIN ERROR
    ========================= */

    if (error) {

      console.error(error);

      message.textContent =
        "hmm… email or password doesn't look right ♡";

      return;
    }


    /* =========================
       SUCCESS
    ========================= */

    message.textContent =
      "welcome back… opening your little corner ✨";

    createMagicBurst();

    setTimeout(() => {

      window.location.href = "index.html";

    }, 900);

  });


  /* =========================
     FLOATING PARTICLES
  ========================= */

  function createParticle() {

    if (!particleContainer) return;

    const particle =
      document.createElement("span");

    particle.className = "particle";

    particle.textContent =
      ["♡", "✦", "˚", "✧", "🌷"][
        Math.floor(Math.random() * 5)
      ];

    particle.style.left =
      Math.random() * 100 + "%";

    particle.style.animationDuration =
      (7 + Math.random() * 6) + "s";

    particle.style.fontSize =
      (10 + Math.random() * 12) + "px";

    particleContainer.appendChild(particle);

    setTimeout(() => {

      particle.remove();

    }, 14000);

  }


  setInterval(createParticle, 900);

  for (let i = 0; i < 7; i++) {
    createParticle();
  }


  /* =========================
     LITTLE MAGIC
  ========================= */

  function createMagicBurst() {

    const symbols = ["♡", "✦", "✧", "✨"];

    for (let i = 0; i < 14; i++) {

      const item =
        document.createElement("span");

      item.textContent =
        symbols[
          Math.floor(Math.random() * symbols.length)
        ];

      item.style.position = "fixed";
      item.style.left = "50%";
      item.style.top = "50%";

      item.style.pointerEvents = "none";
      item.style.zIndex = "100";

      item.style.fontSize =
        12 + Math.random() * 15 + "px";

      item.style.setProperty(
        "--x",
        (Math.random() - .5) * 300 + "px"
      );

      item.style.setProperty(
        "--y",
        (Math.random() - .5) * 250 + "px"
      );

      item.style.animation =
        "loginMagic .9s ease-out forwards";

      document.body.appendChild(item);

      setTimeout(() => item.remove(), 1000);
    }
  }

});


/* =========================
   MAGIC ANIMATION
========================= */

const style =
document.createElement("style");

style.textContent = `
@keyframes loginMagic {

  0% {
    opacity: 1;
    transform:
      translate(-50%, -50%)
      scale(.5);
  }

  100% {
    opacity: 0;
    transform:
      translate(
        calc(-50% + var(--x)),
        calc(-50% + var(--y))
      )
      scale(1.3);
  }

}
`;

document.head.appendChild(style);