import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/* =========================================
   SUPABASE
========================================= */

const SUPABASE_URL =
  "https://jqhntznlvrjxfwyvcylm.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_L2yb80_XzfBWW2EyvHl3Sw_WXBsRhCA";

const supabase =
  createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );


/* =========================================
   SIGNUP
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("signup-form");

  const message =
    document.getElementById("signup-message");


  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    /* -------------------------
       GET FORM VALUES
    ------------------------- */

    const name =
      document
        .getElementById("name")
        .value
        .trim();

    const email =
      document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password =
      document
        .getElementById("password")
        .value;


    console.log(
      "EMAIL BEING SENT:",
      JSON.stringify(email)
    );


    /* -------------------------
       BASIC VALIDATION
    ------------------------- */

    if (!name || !email || !password) {

      message.textContent =
        "please fill everything in ♡";

      return;
    }


    if (password.length < 6) {

      message.textContent =
        "your password needs at least 6 characters ♡";

      return;
    }


    /* -------------------------
       EMAIL FORMAT CHECK
    ------------------------- */

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

      message.textContent =
        "please enter a valid email address ♡";

      return;
    }


    message.textContent =
      "creating your little corner... ♡";


    /* =========================================
       SUPABASE SIGN UP
    ========================================= */

    try {

      const { data, error } =
        await supabase.auth.signUp({

          email: email,

          password: password,

          options: {

            data: {
              name: name
            }

          }

        });


      /* -------------------------
         ERROR
      ------------------------- */

      if (error) {

        console.error(
          "SUPABASE ERROR:",
          error
        );

        console.log(
          "ERROR MESSAGE:",
          error.message
        );

        console.log(
          "ERROR CODE:",
          error.code
        );

        console.log(
          "ERROR STATUS:",
          error.status
        );

        console.log(
          "ERROR NAME:",
          error.name
        );


        /* -------------------------
           USER FRIENDLY ERRORS
        ------------------------- */

        if (
          error.code ===
          "email_address_invalid"
        ) {

          message.textContent =
            "Supabase says this email address is invalid ♡";

        }

        else if (
          error.code ===
          "email_address_not_authorized"
        ) {

          message.textContent =
            "this email isn't allowed by Supabase email settings ♡";

        }

        else if (
          error.code ===
          "signup_disabled"
        ) {

          message.textContent =
            "new account signup is currently disabled ♡";

        }

        else if (
          error.code ===
          "email_provider_disabled"
        ) {

          message.textContent =
            "email signup is disabled in Supabase ♡";

        }

        else if (
          error.code ===
          "weak_password"
        ) {

          message.textContent =
            "please choose a stronger password ♡";

        }

        else if (
          error.message
            .toLowerCase()
            .includes(
              "already registered"
            )
        ) {

          message.textContent =
            "this email already has a little corner ♡";

        }

        else {

          message.textContent =
            error.message;

        }

        return;
      }


      /* =========================================
         SIGNUP SUCCESS — NOW AUTO-LOGIN
      ========================================= */

      console.log(
        "SIGNUP SUCCESS:",
        data
      );


      // Show welcome message
      message.textContent =
        `welcome, ${name} ♡`;


      // Magic burst animation
      createMagicBurst();


      // ═════════════════════════════════════════
      //  🔐 STEP 1: AUTO-LOGIN AFTER SIGNUP
      // ═════════════════════════════════════════

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });


      if (loginError) {

        console.error(
          "AUTO-LOGIN FAILED:",
          loginError
        );

        // Still redirect to login page as fallback
        setTimeout(() => {
          window.location.href =
            "login.html";
        }, 1200);

        return;
      }


      console.log(
        "AUTO-LOGIN SUCCESS:",
        loginData
      );


      // ═════════════════════════════════════════
      //  🎉 STEP 2: REDIRECT TO INDEX (LOGGED IN)
      // ═════════════════════════════════════════

      // Show logged-in message briefly
      message.textContent =
        `you're in! redirecting to your corner... ♡`;


      setTimeout(() => {

        window.location.href =
          "index.html";  // ⬅️ Now goes to main page, NOT login!

      }, 1200);

    }


    /* =========================================
       CATCH
    ========================================= */

    catch (error) {

      console.error(
        "UNEXPECTED ERROR:",
        error
      );

      message.textContent =
        "something went wrong... please try again ♡";

    }

  });


  /* =========================================
     MAGIC BURST
  ========================================= */

  function createMagicBurst() {

    const symbols = [
      "♡",
      "✦",
      "✧",
      "✨",
      "🎀"
    ];


    for (let i = 0; i < 16; i++) {

      const item =
        document.createElement("span");


      item.textContent =
        symbols[
          Math.floor(
            Math.random() *
            symbols.length
          )
        ];


      item.style.position =
        "fixed";

      item.style.left =
        "50%";

      item.style.top =
        "50%";

      item.style.pointerEvents =
        "none";

      item.style.zIndex =
        "100";

      item.style.fontSize =
        12 +
        Math.random() * 15 +
        "px";


      item.style.setProperty(
        "--x",
        (Math.random() - 0.5) *
        300 +
        "px"
      );


      item.style.setProperty(
        "--y",
        (Math.random() - 0.5) *
        250 +
        "px"
      );


      item.style.animation =
        "signupMagic .9s ease-out forwards";


      document.body.appendChild(
        item
      );


      setTimeout(() => {

        item.remove();

      }, 1000);

    }

  }

});


/* =========================================
   MAGIC BURST ANIMATION
========================================= */

const style =
  document.createElement("style");


style.textContent = `

@keyframes signupMagic {

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


/* =========================================
   FLOATING PARTICLES
========================================= */

const particleContainer =
  document.getElementById(
    "particles"
  );


function createHeart() {

  if (!particleContainer)
    return;


  const heart =
    document.createElement("span");


  heart.className =
    "particle";


  heart.textContent = [

    "♡",
    "♥",
    "✦",
    "˚",
    "✧"

  ][

    Math.floor(
      Math.random() * 5
    )

  ];


  heart.style.left =
    `${Math.random() * 100}%`;


  heart.style.bottom =
    "-30px";


  heart.style.fontSize =
    `${10 + Math.random() * 14}px`;


  heart.style.animationDuration =
    `${7 + Math.random() * 7}s`;


  heart.style.animationDelay =
    `${Math.random() * 2}s`;


  particleContainer.appendChild(
    heart
  );


  setTimeout(() => {

    heart.remove();

  }, 16000);

}


/* =========================================
   INITIAL PARTICLES
========================================= */

for (let i = 0; i < 12; i++) {

  setTimeout(
    createHeart,
    i * 400
  );

}


/* =========================================
   CONTINUOUS PARTICLES
========================================= */

setInterval(
  createHeart,
  900
);