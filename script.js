const typedStatement = document.getElementById("typedStatement");

const statement =
  "I blend design, technology, and business to solve real human problems for social good.";

let charIndex = 0;

function typeHeroStatement() {
  if (!typedStatement) return;

  if (charIndex < statement.length) {
    typedStatement.textContent += statement.charAt(charIndex);
    charIndex++;
    setTimeout(typeHeroStatement, 42);
  }
}

window.addEventListener("load", typeHeroStatement);