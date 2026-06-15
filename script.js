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
      setTimeout(typeHeroStatement, 72);
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
        setTimeout(typeHeroStatement, 70);
      }
    } else {
      charIndex--;
      render(word.slice(0, charIndex));
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeHeroStatement, 250); // brief pause before next word
      } else {
        setTimeout(typeHeroStatement, 40);
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
    "images/coolbunny.png",
    "images/bunnycelebrating.png",
    "images/confettibunny.png",
    "images/bunnypointingforward.png",
    "images/bunnyclock.png"
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

    artifactSources.forEach((src, i) => {
      const img = document.createElement("img");
      img.className = "artifact-img";
      img.src = src;
      img.alt = "";

      // a random resting spot across the screen, slightly tilted
      const restX = window.innerWidth * (0.14 + Math.random() * 0.72);
      const restY = window.innerHeight * (0.16 + Math.random() * 0.6);
      const rot = Math.random() * 44 - 22;

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
}

/* TOOLS — hover tooltip showing proficiency.
   EDIT THESE LEVELS — [label, dots out of 5]. They're starter guesses. */
const proficiency = {
  "Figma":         ["Advanced", 4],
  "Canva":         ["Expert", 5],
  "Expo":          ["Advanced", 4],
  "Claude Code":   ["Advanced", 4],
  "React Native":  ["Proficient", 3],
  "TypeScript":    ["Proficient", 3],
  "HTML":          ["Advanced", 4],
  "CSS":           ["Advanced", 4],
  "Python":        ["Proficient", 3],
  "Firebase":      ["Proficient", 3],
  "RevenueCat":    ["Familiar", 2],
  "Vercel":        ["Proficient", 3],
  "GitHub":        ["Advanced", 4],
  "Google Docs":   ["Expert", 5],
  "Google Sheets": ["Advanced", 4],
  "Google Drive":  ["Expert", 5],
  "Google Analytics": ["Proficient", 3],
  "Notion":        ["Advanced", 4],
  "Gmail":         ["Expert", 5],
  "Outlook":       ["Advanced", 4],
  "Teams":         ["Advanced", 4],
  "Word":          ["Expert", 5],
  "Excel":         ["Advanced", 4]
};

// one shared tooltip on <body> so it's never clipped by the marquee
const profTip = document.createElement("div");
profTip.className = "tool-prof";
profTip.setAttribute("aria-hidden", "true");
document.body.appendChild(profTip);

function dotsHTML(score) {
  let dots = "";
  for (let i = 0; i < 5; i++) {
    dots += '<i class="' + (i < score ? "on" : "") + '"></i>';
  }
  return dots;
}

document.querySelectorAll(".tool").forEach((tool) => {
  const label = tool.querySelector("span");
  if (!label) return;
  const info = proficiency[label.textContent.trim()];
  if (!info) return;

  const [level, score] = info;

  tool.addEventListener("mouseenter", () => {
    profTip.innerHTML =
      '<span class="tool-prof-level">' + level + "</span>" +
      '<span class="tool-prof-dots">' + dotsHTML(score) + "</span>";
    const r = tool.getBoundingClientRect();
    profTip.style.left = r.left + r.width / 2 + "px";
    profTip.style.top = r.top - 14 + "px";
    profTip.classList.add("show");
  });

  tool.addEventListener("mouseleave", () => {
    profTip.classList.remove("show");
  });
});

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
