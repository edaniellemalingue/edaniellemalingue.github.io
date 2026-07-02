const typedStatement = document.getElementById("typedStatement");

if (typedStatement) {
  // Type the prefix once, then cycle the final word: solutions → products → experiences
  const prefix = "I blend design, technology, and business to create human-centered ";
  const words = ["solutions.", "products.", "experiences."];
  const colors = ["#7f9c78", "#c15f3c", "#4a6fa5"]; // one color per word

  let prefixIndex = 0;   // how much of the prefix is typed
  let wordIndex = 0;     // which rotating word
  let charIndex = 0;     // how much of the current word is shown
  let deleting = false;

  // wrap the word "blend" in a gradient span (once it's fully typed)
  function withGradient(str) {
    return str.replace("blend", '<span class="grad-word">blend</span>');
  }

  // render the prefix plus the current word slice, the word colored
  function render(wordSlice) {
    typedStatement.innerHTML =
      withGradient(prefix) +
      '<span style="color:' + colors[wordIndex] + '">' + wordSlice + "</span>";
  }

  function typeHeroStatement() {
    // Phase 1 — type the fixed prefix
    if (prefixIndex < prefix.length) {
      prefixIndex++;
      typedStatement.innerHTML = withGradient(prefix.slice(0, prefixIndex));
      setTimeout(typeHeroStatement, 30);
      return;
    }

    // Phase 2 — type / backspace the rotating word
    const word = words[wordIndex];

    if (!deleting) {
      charIndex++;
      render(word.slice(0, charIndex));
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(typeHeroStatement, 1500); // hold on the full word
      } else {
        setTimeout(typeHeroStatement, 30);
      }
    } else {
      charIndex--;
      render(word.slice(0, charIndex));
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeHeroStatement, 200); // brief pause before next word
      } else {
        setTimeout(typeHeroStatement, 20);
      }
    }
  }

  window.addEventListener("load", typeHeroStatement);
}

window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;
  
    document.querySelector(".skyline-back").style.transform =
      `translateY(${scrollY * 0.04}px)`;
  
    document.querySelector(".skyline-front").style.transform =
      `translateY(${scrollY * 0.08}px)`;
  
    document.querySelectorAll(".light").forEach((light, index) => {
      light.style.transform =
        `translateY(${scrollY * (0.03 + index * 0.02)}px)`;
    });
  
  });
  const aboutTyped = document.getElementById("typedAbout");

const aboutText = "Hi, I’m Eunice-Danielle.";

let aboutIndex = 0;

function typeAboutHeader() {

  if (!aboutTyped) return;

  if (aboutIndex < aboutText.length) {

    aboutTyped.textContent += aboutText.charAt(aboutIndex);

    aboutIndex++;

    setTimeout(typeAboutHeader, 65);
  }
}

window.addEventListener("load", () => {

  setTimeout(() => {
    typeAboutHeader();
  }, 400);

});

/* TREASURE BOX — click to release artifacts, click again to put them back */
const treasure = document.getElementById("treasure");

if (treasure) {
  const chest = treasure.querySelector(".chest");

  /* Artifact images. These are PLACEHOLDERS (Addison bunny stickers) so you
     can see the effect — swap them for your USC stickers / pins. Drop the
     files in images/artifacts/ and list their paths here. */
  const artifactSources = [
    "images/bunnycelebrating.png",
    "images/bunnypointingforward.png",
    "images/cameroon-flag.webp",
    "images/fight-on.gif",
    "images/danielle-headphones.jpg"
  ];

  let isOpen = false;
  let active = [];

  function chestOrigin() {
    const r = chest.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function openChest() {
    chest.classList.add("open");
    const o = chestOrigin();

    // corner/margin zones so trinkets land clear of the centered hero text
    const zones = [
      { x: [0.04, 0.15], y: [0.14, 0.36] },
      { x: [0.03, 0.13], y: [0.40, 0.58] },
      { x: [0.04, 0.15], y: [0.60, 0.82] },
      { x: [0.85, 0.96], y: [0.14, 0.36] },
      { x: [0.87, 0.97], y: [0.40, 0.58] },
      { x: [0.85, 0.96], y: [0.60, 0.82] },
    ];
    for (let z = zones.length - 1; z > 0; z--) {
      const j = Math.floor(Math.random() * (z + 1));
      [zones[z], zones[j]] = [zones[j], zones[z]];
    }
    const spotIn = (z) => ({
      x: window.innerWidth * (z.x[0] + Math.random() * (z.x[1] - z.x[0])),
      y: window.innerHeight * (z.y[0] + Math.random() * (z.y[1] - z.y[0])),
    });

    artifactSources.forEach((src, i) => {
      const img = document.createElement("img");
      img.className = "artifact-img";
      if (src.indexOf("headphones") !== -1) img.classList.add("artifact-photo");
      img.src = src;
      img.alt = "";

      // a resting spot in a margin zone, slightly tilted
      const spot = spotIn(zones[i % zones.length]);
      const restX = spot.x;
      const restY = spot.y;
      const rot = Math.random() * 30 - 15;

      // start at the chest
      img.style.left = o.x + "px";
      img.style.top = o.y + "px";
      img.style.transitionDelay = i * 0.06 + "s";
      document.body.appendChild(img);

      // next frame: animate out to the resting spot
      const dx = restX - o.x;
      const dy = restY - o.y;
      requestAnimationFrame(() => {
        img.style.opacity = "1";
        img.style.transform =
          "translate(calc(-50% + " + dx + "px), calc(-50% + " + dy + "px)) " +
          "rotate(" + rot + "deg) scale(1)";
      });

      active.push(img);
    });

    // a "coded with love" handwritten trinket flies out too
    const note = document.createElement("div");
    note.className = "artifact-img artifact-note";
    note.textContent = "coded with love";
    const nSpot = spotIn(zones[artifactSources.length % zones.length]);
    const nRestX = Math.min(Math.max(nSpot.x, 100), window.innerWidth - 100);
    const nRestY = nSpot.y;
    const nRot = Math.random() * 20 - 10;
    note.style.left = o.x + "px";
    note.style.top = o.y + "px";
    note.style.transitionDelay = artifactSources.length * 0.06 + "s";
    document.body.appendChild(note);
    const nDx = nRestX - o.x;
    const nDy = nRestY - o.y;
    requestAnimationFrame(() => {
      note.style.opacity = "1";
      note.style.transform =
        "translate(calc(-50% + " + nDx + "px), calc(-50% + " + nDy + "px)) " +
        "rotate(" + nRot + "deg) scale(1)";
    });
    active.push(note);
  }

  function closeChest() {
    chest.classList.remove("open");

    active.forEach((img, i) => {
      img.style.transitionDelay = i * 0.04 + "s";
      img.style.opacity = "0";
      img.style.transform = "translate(-50%, -50%) rotate(0deg) scale(0.15)";
      img.addEventListener("transitionend", () => img.remove(), { once: true });
    });

    active = [];
  }

  treasure.addEventListener("click", () => {
    isOpen = !isOpen;
    if (isOpen) {
      openChest();
    } else {
      closeChest();
    }
  });

  /* Clear the released artifacts as soon as the user scrolls so they
     don't stay pinned to the viewport. */
  window.addEventListener("scroll", () => {
    if (isOpen) {
      isOpen = false;
      closeChest();
    }
  }, { passive: true });
}

/* TOOLS — proficiency levels are now rendered inline as visible dots on each
   .tool-card in index.html (no hover tooltip needed). */

/* FLOATING MUSIC PLAYER — toggle open/closed */
const musicToggle = document.getElementById("musicToggle");
const musicBody = document.getElementById("musicBody");

if (musicToggle && musicBody) {
  musicToggle.addEventListener("click", () => {
    const open = musicBody.hasAttribute("hidden");
    if (open) {
      musicBody.removeAttribute("hidden");
    } else {
      musicBody.setAttribute("hidden", "");
    }
    musicToggle.setAttribute("aria-expanded", String(open));
  });
}

/* DECISION CARDS — click / tap / keyboard to flip (hover handled by CSS) */
document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.classList.toggle("flipped");
    }
  });
});

/* SCROLL REVEAL — fade every section up as it enters the viewport */
(function () {
  const sections = document.querySelectorAll("section");
  if (!sections.length) return;

  const noAnim =
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (noAnim) {
    sections.forEach((s) => s.classList.add("in")); // just show everything
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -80px 0px" }
  );

  sections.forEach((s) => {
    s.classList.add("reveal");
    const rect = s.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      s.classList.add("in"); // above the fold: show now, no flash
    } else {
      io.observe(s);
    }
  });
})();

/* JOYFUL CURSOR — a sparkle trail in the brand palette */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#7f9c78", "#c15f3c", "#4a6fa5", "#e0a93b"];
  let last = 0;

  window.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - last < 45) return; // throttle so it stays subtle
    last = now;

    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = "✦";
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    s.style.fontSize = 8 + Math.random() * 10 + "px";
    s.style.setProperty("--sx", Math.random() * 26 - 13 + "px");

    s.addEventListener("animationend", () => s.remove());
    document.body.appendChild(s);
  });
})();
/* ---- PICK YOUR LENS — reframe hero + highlight matching work ---- */
(function () {
  const lensBtns = document.querySelectorAll(".lens-btn");
  const lensDesc = document.getElementById("lensDesc");
  const tiles = document.querySelectorAll(".bento-grid .tile");
  if (!lensBtns.length) return;

  const copy = {
    builder: "I'm a builder at heart. I'd rather make something real than just talk about it, so I prototype, ship, and keep improving until it works.",
    designer: "I design human-centered products and research-backed experiences, taking them from user insight to interface to a finished, tangible thing.",
    pm: "I take products from an ambiguous problem to a shipped V1, working across design, engineering, and stakeholders to get there.",
  };

  let active = null;

  function setLens(lens) {
    // clicking the active lens again clears it (back to "all")
    if (active === lens) lens = null;
    active = lens;

    lensBtns.forEach((b) =>
      b.classList.toggle("active", b.dataset.lens === lens)
    );
    lensDesc.textContent = lens ? copy[lens] : "";

    tiles.forEach((t) => {
      const matches =
        !lens || (t.dataset.lens || "").split(" ").includes(lens);
      t.classList.toggle("lens-dim", !matches);
    });
  }

  lensBtns.forEach((b) =>
    b.addEventListener("click", () => setLens(b.dataset.lens))
  );
})();

/* ---- HIRE-ME CTA — open/close the contact popup ---- */
(function () {
  const tile = document.getElementById("ctaTile");
  const modal = document.getElementById("ctaModal");
  const closeBtn = document.getElementById("ctaClose");
  const heading = document.getElementById("ctaHeading");
  if (!tile || !modal) return;

  const headingText = heading ? heading.textContent.trim() : "";
  let typeTimer = null;

  function typeHeading() {
    if (!heading) return;
    clearTimeout(typeTimer);
    let i = 0;
    (function step() {
      heading.innerHTML =
        headingText.slice(0, i) +
        (i < headingText.length ? '<span class="typing-cursor">|</span>' : "");
      if (i < headingText.length) {
        i++;
        typeTimer = setTimeout(step, 38);
      }
    })();
  }

  function open() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    typeHeading();
    closeBtn && closeBtn.focus();
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    clearTimeout(typeTimer);
    tile.focus();
  }

  tile.addEventListener("click", open);
  closeBtn && closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();

/* ---- ABOUT — cross-fade between headshots ---- */
(function () {
  const photos = document.querySelectorAll(".about-image .about-photo");
  if (photos.length < 2) return;
  let idx = 0;
  setInterval(() => {
    photos[idx].classList.remove("is-active");
    idx = (idx + 1) % photos.length;
    photos[idx].classList.add("is-active");
  }, 3000);
})();

/* ---- ABOUT — click to reveal "What I believe" ---- */
(function () {
  const pov = document.getElementById("aboutPov");
  const btn = document.getElementById("povToggle");
  if (!pov || !btn) return;
  btn.addEventListener("click", () => {
    const open = pov.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
})();
