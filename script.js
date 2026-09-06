/* =========================================================
   DIKSHITA'S SOFT CORNER ♡
   Supabase + Magical Interaction + Soft Music System
   ========================================================= */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL = "https://jqhntznlvrjxfwyvcylm.supabase.co";
const SUPABASE_KEY = "sb_publishable_L2yb80_XzfBWW2EyvHl3Sw_WXBsRhCA";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* =========================================================
   AUTH CHECK
========================================================= */

const {
  data: { session }
} = await supabase.auth.getSession();

if (!session) {
  window.location.href = "login.html";
}


/* =========================================================
   MAIN APP
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  /* ---------------------------------------------------------
     ELEMENTS
  --------------------------------------------------------- */

  const screens = {
    welcome: document.getElementById("screen-welcome"),
    write: document.getElementById("screen-write"),
    gift: document.getElementById("screen-gift"),
    wall: document.getElementById("screen-wall")
  };

  const dots = document.querySelectorAll(".dot");

  const goWrite = document.getElementById("go-write");
  const noteForm = document.getElementById("note-form");

  const noteName = document.getElementById("note-name");
  const noteMessage = document.getElementById("note-message");

  const foldStage = document.getElementById("fold-stage");
  const foldText = document.getElementById("fold-text");
  const foldHearts = document.getElementById("fold-hearts");

  const giftWrap = document.getElementById("gift-wrap");
  const openGift = document.getElementById("open-gift");

  const giftReveal = document.getElementById("gift-reveal");
  const giftMessage = document.getElementById("gift-message");
  const giftName = document.getElementById("gift-name");
  const giftEmoji = document.getElementById("gift-emoji");

  const goWall = document.getElementById("go-wall");
  const openAgain = document.getElementById("open-again");
  const writeAgain = document.getElementById("write-again");

  const wall = document.getElementById("wall");

  const secretStar = document.getElementById("secret-star");
  const secretOverlay = document.getElementById("secret-overlay");
  const secretClose = document.getElementById("secret-close");

  const confirmOverlay = document.getElementById("confirm-overlay");
  const confirmKeep = document.getElementById("confirm-keep");
  const confirmRemove = document.getElementById("confirm-remove");

  const themeToggle = document.getElementById("theme-toggle");
  const musicToggle = document.getElementById("music-toggle");

  let currentDeleteId = null;
  let currentNote = null;

  /* =========================================================
     SUPABASE NOTES
  ========================================================= */

  let notes = [];


  async function loadNotes() {

    const {
      data,
      error
    } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    if (error) {

      console.error("Could not load notes:", error);

      showTinyToast(
        "couldn't load the little memories ♡"
      );

      return;

    }

    notes = data || [];

    renderWall();

  }


  async function saveNote(note) {

    const {
      data,
      error
    } = await supabase
      .from("notes")
      .insert({
        user_id: session.user.id,
        name: note.name,
        message: note.message,
        prompt: note.prompt
      })
      .select()
      .single();

    if (error) {

      console.error("Could not save note:", error);

      showTinyToast(
        "the note couldn't be saved ♡"
      );

      return null;

    }

    return data;

  }


  async function deleteNote(id) {

    const {
      error
    } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {

      console.error("Could not delete note:", error);

      showTinyToast(
        "couldn't remove that note ♡"
      );

      return false;

    }

    notes =
      notes.filter(
        note => note.id !== id
      );

    renderWall();

    return true;

  }


  /* =========================================================
     ♡ SOFT DREAMY AUDIO ENGINE ♡
  ========================================================= */

  let audioContext = null;
  let masterGain = null;
  let musicGain = null;
  let musicTimer = null;
  let musicPlaying = false;

  const melody = [
    261.63, 329.63, 392.00, 329.63,
    293.66, 349.23, 440.00, 349.23,
    261.63, 329.63, 392.00, 523.25,
    440.00, 392.00, 329.63, 293.66
  ];

  let melodyIndex = 0;


  function initAudio() {

    if (audioContext) {

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      return;
    }

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioCtx) return;

    audioContext = new AudioCtx();

    masterGain =
      audioContext.createGain();

    musicGain =
      audioContext.createGain();

    masterGain.gain.value = 0.55;
    musicGain.gain.value = 0.045;

    musicGain.connect(masterGain);
    masterGain.connect(
      audioContext.destination
    );

    audioContext.resume();

  }


  function playSoftNote(
    frequency = 440,
    duration = 0.8,
    volume = 0.06
  ) {

    if (!audioContext) return;

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(
      0,
      audioContext.currentTime
    );

    gain.gain.linearRampToValueAtTime(
      volume,
      audioContext.currentTime + 0.04
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
      duration +
      0.05
    );

  }


  function playNoteWrittenSound() {

    initAudio();

    if (!audioContext) return;

    playSoftNote(
      523.25,
      0.55,
      0.09
    );

    setTimeout(() => {
      playSoftNote(
        659.25,
        0.65,
        0.07
      );
    }, 100);

    setTimeout(() => {
      playSoftNote(
        783.99,
        0.9,
        0.05
      );
    }, 200);

  }


  function playGiftOpenSound() {

    initAudio();

    if (!audioContext) return;

    playSoftNote(
      392.00,
      0.45,
      0.07
    );

    setTimeout(() => {
      playSoftNote(
        523.25,
        0.5,
        0.08
      );
    }, 100);

    setTimeout(() => {
      playSoftNote(
        659.25,
        0.6,
        0.08
      );
    }, 200);

    setTimeout(() => {
      playSoftNote(
        783.99,
        1.1,
        0.07
      );
    }, 320);

    setTimeout(() => {
      playSoftNote(
        1046.50,
        1.3,
        0.04
      );
    }, 450);

  }


  function playTinyClick() {

    initAudio();

    if (!audioContext) return;

    playSoftNote(
      740,
      0.18,
      0.025
    );

  }


  function playDreamyMusic() {

    initAudio();

    if (!audioContext || musicPlaying)
      return;

    musicPlaying = true;
    melodyIndex = 0;

    function playNext() {

      if (
        !musicPlaying ||
        !audioContext
      ) return;

      const frequency =
        melody[melodyIndex];

      const oscillator =
        audioContext.createOscillator();

      const gain =
        audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );

      gain.gain.setValueAtTime(
        0,
        audioContext.currentTime
      );

      gain.gain.linearRampToValueAtTime(
        0.8,
        audioContext.currentTime + 0.15
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 2.3
      );

      oscillator.connect(gain);
      gain.connect(musicGain);

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + 2.4
      );

      melodyIndex =
        (melodyIndex + 1) %
        melody.length;

      musicTimer =
        setTimeout(
          playNext,
          850
        );

    }

    playNext();

  }


  function stopDreamyMusic() {

    musicPlaying = false;

    if (musicTimer) {
      clearTimeout(musicTimer);
      musicTimer = null;
    }

  }


  /* =========================================================
     MUSIC TOGGLE
  ========================================================= */

  if (musicToggle) {

    musicToggle.addEventListener(
      "click",
      () => {

        initAudio();

        if (musicPlaying) {

          stopDreamyMusic();

          musicToggle.textContent =
            "🔇";

          showTinyToast(
            "soft music paused ♡"
          );

        } else {

          playDreamyMusic();

          musicToggle.textContent =
            "🎵";

          showTinyToast(
            "a little music for the moment ♡"
          );

        }

      }
    );

  }


  /* =========================================================
     SCREEN NAVIGATION
  ========================================================= */

  function showScreen(name) {

    Object.values(screens)
      .forEach(screen => {

        if (screen) {
          screen.classList.remove(
            "active"
          );
        }

      });

    if (screens[name]) {
      screens[name].classList.add(
        "active"
      );
    }

    const order = [
      "welcome",
      "write",
      "gift",
      "wall"
    ];

    const index =
      order.indexOf(name);

    dots.forEach((dot, i) => {

      dot.classList.toggle(
        "active",
        i === index
      );

    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    magicBurst(
      window.innerWidth / 2,
      window.innerHeight / 2,
      8
    );

  }


  /* =========================================================
     NAVIGATION
  ========================================================= */

  if (goWrite) {

    goWrite.addEventListener(
      "click",
      () => {

        initAudio();
        playTinyClick();

        buttonHeart(goWrite);

        showScreen("write");

      }
    );

  }


  if (goWall) {

    goWall.addEventListener(
      "click",
      async () => {

        initAudio();
        playTinyClick();

        buttonHeart(goWall);

        await loadNotes();

        showScreen("wall");

      }
    );

  }


  if (writeAgain) {

    writeAgain.addEventListener(
      "click",
      () => {

        initAudio();
        playTinyClick();

        noteForm.reset();

        showScreen("write");

      }
    );

  }


  if (openAgain) {

    openAgain.addEventListener(
      "click",
      () => {

        initAudio();

        giftWrap.classList.remove(
          "open"
        );

        giftReveal.hidden = true;

        openGift.hidden = false;

        currentNote = null;

        magicBurst(
          window.innerWidth / 2,
          window.innerHeight / 2,
          18
        );

      }
    );

  }


  /* =========================================================
     PROGRESS DOTS
  ========================================================= */

  dots.forEach(dot => {

    dot.addEventListener(
      "click",
      async () => {

        initAudio();
        playTinyClick();

        const step =
          Number(
            dot.dataset.step
          );

        const pages = [
          "welcome",
          "write",
          "gift",
          "wall"
        ];

        if (pages[step] === "wall") {
          await loadNotes();
        }

        showScreen(
          pages[step]
        );

      }
    );

  });


  /* =========================================================
     PROMPT CHIPS
  ========================================================= */

  const promptChips =
    document.querySelectorAll(
      ".prompt-chip"
    );

  promptChips.forEach(chip => {

    chip.addEventListener(
      "click",
      () => {

        initAudio();
        playTinyClick();

        promptChips.forEach(c => {
          c.classList.remove(
            "active"
          );
        });

        chip.classList.add(
          "active"
        );

        const prompt =
          chip.dataset.prompt;

        noteMessage.placeholder =
          `${prompt.replace(
            /^[^\w]+/,
            ""
          )}... ♡`;

        noteMessage.focus();

        buttonHeart(chip);

      }
    );

  });


  /* =========================================================
     NOTE SUBMISSION
  ========================================================= */

  if (noteForm) {

    noteForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const name =
          noteName.value.trim() ||
          "someone sweet";

        const message =
          noteMessage.value.trim();

        if (!message) {

          initAudio();
          playTinyClick();

          noteMessage.focus();

          shakeElement(
            noteMessage
          );

          showTinyToast(
            "write a little something first ♡"
          );

          return;

        }


        playNoteWrittenSound();


        const selectedPrompt =
          document.querySelector(
            ".prompt-chip.active"
          );


        const noteData = {

          name,

          message,

          prompt:
            selectedPrompt?.dataset.prompt ||
            ""

        };


        /* -----------------------------------------------
           SAVE TO SUPABASE
        ------------------------------------------------ */

        const savedNote =
          await saveNote(noteData);


        if (!savedNote) {
          return;
        }


        notes.unshift(
          savedNote
        );

        currentNote =
          savedNote;


        /* -----------------------------------------------
           FOLDING ANIMATION
        ------------------------------------------------ */

        if (foldText) {
          foldText.textContent =
            message;
        }


        if (foldStage) {

          foldStage.hidden = false;

          createFoldHearts();


          setTimeout(() => {

            foldStage.hidden =
              true;

            createHeartFlight();


            setTimeout(() => {

              prepareGift(
                savedNote
              );

              showScreen(
                "gift"
              );

            }, 700);

          }, 1700);


        } else {

          prepareGift(
            savedNote
          );

          showScreen(
            "gift"
          );

        }


        noteForm.reset();


        promptChips.forEach(c => {
          c.classList.remove(
            "active"
          );
        });

      }
    );

  }


  /* =========================================================
     FOLDING HEARTS
  ========================================================= */

  function createFoldHearts() {

    if (!foldHearts) return;

    foldHearts.innerHTML = "";

    const symbols = [
      "♡",
      "♥",
      "✦",
      "˚",
      "♡"
    ];


    for (let i = 0; i < 14; i++) {

      const heart =
        document.createElement(
          "span"
        );

      heart.className =
        "fold-heart";

      heart.textContent =
        symbols[
          Math.floor(
            Math.random() *
            symbols.length
          )
        ];

      heart.style.left =
        `${35 + Math.random() * 30}%`;

      heart.style.top =
        `${45 + Math.random() * 15}%`;

      heart.style.animationDelay =
        `${Math.random() * .5}s`;

      foldHearts.appendChild(
        heart
      );

    }

  }


  /* =========================================================
     NOTE → HEART MAGIC
  ========================================================= */

  function createHeartFlight() {

    const heart =
      document.createElement(
        "div"
      );

    heart.className =
      "flying-memory-heart";

    heart.innerHTML = "♡";

    document.body.appendChild(
      heart
    );

    heart.style.left = "50%";
    heart.style.top = "50%";


    requestAnimationFrame(() => {
      heart.classList.add(
        "fly"
      );
    });


    setTimeout(() => {
      heart.remove();
    }, 1400);

  }


  /* =========================================================
     PREPARE GIFT
  ========================================================= */

  function prepareGift(note) {

    if (!note) return;


    const messages = [

      `thank you for leaving a little piece of your thoughts here, ${note.name} ♡`,

      `you left a little memory here… so here's a little piece of magic for you ✨`,

      `some words deserve to be kept somewhere soft… just like this little moment ♡`,

      `you came here to leave a note for Dikshita, but maybe you were meant to find this little surprise too 🌷`

    ];


    const message =
      messages[
        Math.floor(
          Math.random() *
          messages.length
        )
      ];


    if (giftName) {
      giftName.textContent =
        "a little secret for you ♡";
    }


    if (giftEmoji) {
      giftEmoji.textContent =
        "💌";
    }


    if (giftMessage) {
      giftMessage.textContent =
        message;
    }


    if (giftReveal) {

      giftReveal.style.opacity =
        "0";

      giftReveal.style.transform =
        "translateY(25px) scale(.92)";

    }

  }


  /* =========================================================
     MAGICAL GIFT OPEN
  ========================================================= */

  if (openGift) {

    openGift.addEventListener(
      "click",
      () => {

        if (!giftWrap) return;

        initAudio();

        playGiftOpenSound();

        buttonHeart(
          openGift
        );

        giftWrap.classList.add(
          "shake"
        );

        createGiftAura();


        setTimeout(() => {

          giftWrap.classList.remove(
            "shake"
          );

          giftWrap.classList.add(
            "open"
          );

          openGift.hidden =
            true;

          giftMagicExplosion();


          setTimeout(() => {

            showMagicalLetter();

          }, 500);


        }, 700);

      }
    );

  }


  /* =========================================================
     GIFT AURA
  ========================================================= */

  function createGiftAura() {

    const aura =
      document.createElement(
        "div"
      );

    aura.className =
      "gift-aura";

    aura.style.position =
      "fixed";

    aura.style.left = "50%";
    aura.style.top = "52%";

    aura.style.width = "180px";
    aura.style.height = "180px";

    aura.style.borderRadius =
      "50%";

    aura.style.transform =
      "translate(-50%, -50%)";

    aura.style.pointerEvents =
      "none";

    aura.style.zIndex = "1";

    aura.style.background =
      "radial-gradient(circle, rgba(255,180,215,.35), rgba(200,182,255,.18), transparent 70%)";

    aura.style.filter =
      "blur(8px)";

    aura.style.animation =
      "giftAuraPulse 1.4s ease-out forwards";

    document.body.appendChild(
      aura
    );


    setTimeout(() => {
      aura.remove();
    }, 1500);

  }


  /* =========================================================
     MAGICAL LETTER
  ========================================================= */

  function showMagicalLetter() {

    if (!giftReveal) return;


    giftReveal.hidden =
      false;

    giftReveal.style.opacity =
      "1";

    giftReveal.style.transform =
      "translateY(0) scale(1)";

    giftReveal.style.transition =
      "opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)";


    if (giftEmoji) {

      giftEmoji.textContent =
        "💌";

      giftEmoji.style.fontSize =
        "4.5rem";

      giftEmoji.style.filter =
        "drop-shadow(0 8px 20px rgba(255,140,190,.45))";

      giftEmoji.style.animation =
        "magicalEnvelope 2.5s ease-in-out infinite";

    }


    if (giftName) {

      giftName.textContent =
        "a little note for you ♡";

    }


    if (giftMessage) {

      const noteText =
        giftMessage.textContent;

      giftMessage.textContent =
        "";

      giftMessage.style.opacity =
        "0";

      giftMessage.style.transform =
        "translateY(12px)";

      giftMessage.style.transition =
        "opacity .8s ease, transform .8s ease";


      setTimeout(() => {

        typeGiftMessage(
          giftMessage,
          noteText
        );

      }, 900);

    }


    createFloatingGiftMagic();

  }


  /* =========================================================
     TYPEWRITER
  ========================================================= */

  function typeGiftMessage(
    element,
    text
  ) {

    if (!element) return;

    element.style.opacity =
      "1";

    element.style.transform =
      "translateY(0)";

    let index = 0;


    const typing =
      setInterval(() => {

        element.textContent +=
          text[index];

        index++;


        if (index >= text.length) {

          clearInterval(
            typing
          );


          setTimeout(() => {

            magicBurst(
              window.innerWidth / 2,
              window.innerHeight / 2,
              12
            );

          }, 200);

        }

      }, 28);

  }


  /* =========================================================
     FLOATING GIFT MAGIC
  ========================================================= */

  function createFloatingGiftMagic() {

    const symbols = [
      "♡",
      "✦",
      "✧",
      "˚",
      "✨",
      "🌷",
      "💗"
    ];


    for (let i = 0; i < 24; i++) {

      const item =
        document.createElement(
          "span"
        );

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
        `${20 + Math.random() * 60}%`;

      item.style.top =
        `${55 + Math.random() * 10}%`;

      item.style.fontSize =
        `${12 + Math.random() * 15}px`;

      item.style.pointerEvents =
        "none";

      item.style.zIndex =
        "20";

      item.style.opacity =
        "0";


      item.style.setProperty(
        "--gift-x",
        `${(Math.random() - .5) * 300}px`
      );


      item.style.setProperty(
        "--gift-y",
        `${-80 - Math.random() * 180}px`
      );


      item.style.animation =
        `giftFloatMagic ${1.8 + Math.random() * 1.5}s ease-out forwards`;


      document.body.appendChild(
        item
      );


      setTimeout(() => {
        item.remove();
      }, 3500);

    }

  }


  /* =========================================================
     BIG SPARKLE EXPLOSION
  ========================================================= */

  function giftMagicExplosion() {

    const symbols = [
      "✨",
      "♡",
      "✦",
      "✧",
      "˚",
      "🌷",
      "💗",
      "⭐"
    ];


    for (let i = 45; i > 0; i--) {

      const sparkle =
        document.createElement(
          "span"
        );

      sparkle.className =
        "gift-sparkle";

      sparkle.textContent =
        symbols[
          Math.floor(
            Math.random() *
            symbols.length
          )
        ];


      sparkle.style.position =
        "fixed";

      sparkle.style.left =
        "50%";

      sparkle.style.top =
        "50%";


      sparkle.style.fontSize =
        `${10 + Math.random() * 18}px`;

      sparkle.style.pointerEvents =
        "none";

      sparkle.style.zIndex =
        "100";


      sparkle.style.setProperty(
        "--x",
        `${(Math.random() - .5) * 500}px`
      );


      sparkle.style.setProperty(
        "--y",
        `${(Math.random() - .5) * 420}px`
      );


      sparkle.style.animation =
        "giftSparkleMagic 1.5s ease-out forwards";


      document.body.appendChild(
        sparkle
      );


      setTimeout(() => {
        sparkle.remove();
      }, 1600);

    }

  }


  /* =========================================================
     MEMORY WALL
  ========================================================= */

  function renderWall() {

    if (!wall) return;

    wall.innerHTML = "";


    if (notes.length === 0) {

      wall.innerHTML = `

        <div class="wall-empty">

          <div class="empty-emoji">
            💌
          </div>

          <h3 class="title-hand">
            nothing here yet ♡
          </h3>

          <p class="subtitle">
            maybe you'll be the first little memory...
          </p>

        </div>

      `;

      return;

    }


    notes.forEach(
      (note, index) => {

        const card =
          document.createElement(
            "article"
          );

        card.className =
          "polaroid";


        const rotation =
          [-3, 2, -2, 4, -4, 1]
          [index % 6];


        card.style.transform =
          `rotate(${rotation}deg)`;


        const sticker =
          ["🌷", "♡", "✦", "🎀", "🧸", "🌸"]
          [index % 6];


        card.innerHTML = `

          <div class="tape"></div>

          <div class="hover-sparkle">
            ✦
          </div>

          <button
            class="delete-btn"
            title="remove this note"
            aria-label="remove this note"
          >
            🗑️
          </button>

          <p class="p-name">
            ${escapeHTML(note.name)} ♡
          </p>

          <div class="p-msg">
            ${escapeHTML(note.message)}
          </div>

          <div class="sticker">
            ${sticker}
          </div>

          <div class="note-date">
            ${formatDate(note.created_at)} · ♡
          </div>

        `;


        const deleteButton =
          card.querySelector(
            ".delete-btn"
          );


        deleteButton.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            currentDeleteId =
              note.id;

            if (confirmOverlay) {
              confirmOverlay.hidden =
                false;
            }

          }
        );


        card.addEventListener(
          "click",
          event => {

            magicBurst(
              event.clientX ||
                window.innerWidth / 2,

              event.clientY ||
                window.innerHeight / 2,

              6
            );

          }
        );


        wall.appendChild(
          card
        );

      }
    );

  }


  /* =========================================================
     DELETE NOTE
  ========================================================= */

  if (confirmKeep) {

    confirmKeep.addEventListener(
      "click",
      () => {

        confirmOverlay.hidden =
          true;

        currentDeleteId =
          null;

      }
    );

  }


  if (confirmRemove) {

    confirmRemove.addEventListener(
      "click",
      async () => {

        if (
          currentDeleteId !== null
        ) {

          const deleted =
            await deleteNote(
              currentDeleteId
            );

          if (deleted) {

            magicBurst(
              window.innerWidth / 2,
              window.innerHeight / 2,
              10
            );

          }

        }


        confirmOverlay.hidden =
          true;

        currentDeleteId =
          null;

      }
    );

  }


  /* =========================================================
     SECRET STAR
  ========================================================= */

  if (secretStar) {

    secretStar.addEventListener(
      "click",
      () => {

        initAudio();

        playGiftOpenSound();

        createMagicCurtain();


        setTimeout(() => {

          if (secretOverlay) {
            secretOverlay.hidden =
              false;
          }

        }, 500);

      }
    );

  }


  if (secretClose) {

    secretClose.addEventListener(
      "click",
      () => {

        if (secretOverlay) {
          secretOverlay.hidden =
            true;
        }


        magicBurst(
          window.innerWidth / 2,
          window.innerHeight / 2,
          20
        );

      }
    );

  }


  /* =========================================================
     MAGIC CURTAIN
  ========================================================= */

  function createMagicCurtain() {

    const curtain =
      document.createElement(
        "div"
      );

    curtain.className =
      "magic-curtain";

    document.body.appendChild(
      curtain
    );


    for (let i = 0; i < 30; i++) {

      const star =
        document.createElement(
          "span"
        );


      star.textContent =
        ["✦", "✧", "♡", "˚", "✨"]
        [Math.floor(
          Math.random() * 5
        )];


      star.style.left =
        `${Math.random() * 100}%`;

      star.style.top =
        `${Math.random() * 100}%`;

      star.style.animationDelay =
        `${Math.random() * .4}s`;


      curtain.appendChild(
        star
      );

    }


    setTimeout(() => {
      curtain.remove();
    }, 1000);

  }


  /* =========================================================
     BUTTON HEART
  ========================================================= */

  function buttonHeart(button) {

    if (!button) return;


    const heart =
      document.createElement(
        "span"
      );

    heart.className =
      "btn-heart";


    heart.textContent =
      ["♡", "♥", "✦"]
      [Math.floor(
        Math.random() * 3
      )];


    button.appendChild(
      heart
    );


    setTimeout(() => {
      heart.remove();
    }, 700);

  }


  /* =========================================================
     CLICK SPARKLES
  ========================================================= */

  document.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          "button, input, textarea"
        )
      ) return;


      magicBurst(
        event.clientX,
        event.clientY,
        4
      );

    }
  );


  function magicBurst(
    x,
    y,
    count = 8
  ) {

    const symbols =
      ["✦", "✧", "♡", "˚", "·"];


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const sparkle =
        document.createElement(
          "span"
        );


      sparkle.className =
        "click-sparkle";


      sparkle.textContent =
        symbols[
          Math.floor(
            Math.random() *
            symbols.length
          )
        ];


      sparkle.style.left =
        `${x}px`;

      sparkle.style.top =
        `${y}px`;


      sparkle.style.setProperty(
        "--dx",
        `${(Math.random() - .5) * 100}px`
      );


      sparkle.style.setProperty(
        "--dy",
        `${(Math.random() - .5) * 100}px`
      );


      document.body.appendChild(
        sparkle
      );


      setTimeout(() => {
        sparkle.remove();
      }, 900);

    }

  }


  /* =========================================================
     FLOATING PARTICLES
  ========================================================= */

  const particleContainer =
    document.getElementById(
      "particles"
    );


  function createFloatingParticle() {

    if (!particleContainer)
      return;


    const particle =
      document.createElement(
        "span"
      );


    particle.className =
      "particle";


    particle.textContent =
      ["♡", "✦", "˚", "✧", "🌷"]
      [Math.floor(
        Math.random() * 5
      )];


    particle.style.left =
      `${Math.random() * 100}%`;


    particle.style.animationDuration =
      `${7 + Math.random() * 7}s`;


    particle.style.animationDelay =
      `${Math.random() * 2}s`;


    particle.style.fontSize =
      `${10 + Math.random() * 13}px`;


    particleContainer.appendChild(
      particle
    );


    setTimeout(() => {
      particle.remove();
    }, 16000);

  }


  setInterval(
    createFloatingParticle,
    900
  );


  for (
    let i = 0;
    i < 8;
    i++
  ) {
    createFloatingParticle();
  }


  /* =========================================================
     DAY / NIGHT
  ========================================================= */

  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        document.body.classList.toggle(
          "night"
        );


        const isNight =
          document.body.classList.contains(
            "night"
          );


        themeToggle.textContent =
          isNight
            ? "🌙"
            : "☀️";


        if (isNight) {

          createNightStars();

        } else {

          removeNightStars();

        }

      }
    );

  }


  function createNightStars() {

    if (
      document.querySelector(
        ".night-stars"
      )
    ) return;


    const stars =
      document.createElement(
        "div"
      );


    stars.className =
      "night-stars";


    for (
      let i = 0;
      i < 30;
      i++
    ) {

      const star =
        document.createElement(
          "span"
        );


      star.textContent =
        Math.random() > .7
          ? "✦"
          : "·";


      star.style.left =
        `${Math.random() * 100}%`;


      star.style.top =
        `${Math.random() * 100}%`;


      star.style.animationDelay =
        `${Math.random() * 3}s`;


      stars.appendChild(
        star
      );

    }


    document.body.appendChild(
      stars
    );

  }


  function removeNightStars() {

    const stars =
      document.querySelector(
        ".night-stars"
      );


    if (stars) {
      stars.remove();
    }

  }


  /* =========================================================
     LITTLE TOAST
  ========================================================= */

  function showTinyToast(
    message
  ) {

    const toast =
      document.createElement(
        "div"
      );


    toast.className =
      "tiny-toast";


    toast.textContent =
      message;


    document.body.appendChild(
      toast
    );


    setTimeout(() => {

      toast.classList.add(
        "show"
      );

    }, 10);


    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2200);


    setTimeout(() => {

      toast.remove();

    }, 2600);

  }


  /* =========================================================
     SHAKE
  ========================================================= */

  function shakeElement(
    element
  ) {

    element.classList.add(
      "shake-soft"
    );


    setTimeout(() => {

      element.classList.remove(
        "shake-soft"
      );

    }, 500);

  }


  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  function escapeHTML(
    text
  ) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      text;


    return div.innerHTML;

  }


  /* =========================================================
     DATE FORMAT
  ========================================================= */

  function formatDate(
    date
  ) {

    if (!date)
      return "";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short"
      }
    );

  }


  /* =========================================================
     INITIAL WALL
  ========================================================= */

  await loadNotes();


  /* =========================================================
     KEYBOARD ESCAPE
  ========================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        if (
          secretOverlay &&
          !secretOverlay.hidden
        ) {

          secretOverlay.hidden =
            true;

        }


        if (
          confirmOverlay &&
          !confirmOverlay.hidden
        ) {

          confirmOverlay.hidden =
            true;

        }

      }

    }
  );

});