const typedStatement = document.getElementById("typedStatement");

const statement =
  "I blend design, technology, and business to create human-centered solutions.";

let charIndex = 0;

function typeHeroStatement() {
  if (!typedStatement) return;

  if (charIndex < statement.length) {
    typedStatement.textContent += statement.charAt(charIndex);
    charIndex++;
    setTimeout(typeHeroStatement, 52);
  }
}

window.addEventListener("load", typeHeroStatement);

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