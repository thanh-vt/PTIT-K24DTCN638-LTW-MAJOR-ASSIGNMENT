const frame = document.getElementById("gameFrame");
const loader = document.getElementById("loader");

let timeout;
function loadGame(url) {
  loader.classList.remove("hidden");

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    loader.classList.add("hidden");
  }, 8000);
  frame.src = url;
}

frame.onload = () => {
  loader.classList.add("hidden");
};