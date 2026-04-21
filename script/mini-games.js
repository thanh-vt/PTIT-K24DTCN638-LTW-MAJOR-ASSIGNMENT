const frame = document.getElementById("gameFrame");
const loader = document.getElementById("loader");

let timeout;
function loadGame(url) {
  loader.classList.remove("hidden");

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    loader.classList.add("hidden");
  }, 5000);
  frame.src = url;
}

window.onload = () => {
  loader.classList.add("hidden");
}

frame.onload = () => {
  loader.classList.add("hidden");
};
