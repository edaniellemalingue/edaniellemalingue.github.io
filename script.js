const typedStatement = document.getElementById("typedStatement");

const statement =
  "I blend design, technology, and business to solve real human problems.";

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