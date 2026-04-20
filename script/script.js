

// Tạo header component dùng chung cho các page
class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
<header>
  <nav class="navbar">
    <label style="color: aquamarine">
      <input type="color" onchange="changeColor(this)">
      Đổi màu nền
    </label>
    <ul class="menu">
      <li><a href="index.html">Trang chủ</a></li>
      <li><a href="about.html">Giới thiệu</a></li>
      <li><a href="project.html">Dự án</a></li>
    </ul>
  </nav>
</header>
        `;
    this.setActiveLink();
  }

  // set trạng thái active của trang
  setActiveLink() {
    const currentPath = globalThis.location.pathname.split("/").pop() || "index.html";

    const links = this.querySelectorAll("a");

    links.forEach(link => {
      const href = link.getAttribute("href");

      if (href === currentPath) {
        link.classList.add("active");
      }
    });
  }
}

customElements.define("app-header", AppHeader);

// Color picker (nếu có)
const picker = document.getElementById("colorPicker");
if (picker) {
  const saved = localStorage.getItem("bgColor");
  if (saved) {
    document.body.style.backgroundColor = saved;
    picker.value = saved;
  }
}

function changeColor(e) {
  const color = e.value;
  document.body.style.backgroundColor = color;
  localStorage.setItem("bgColor", color);
}

function loadGame(url) {
  const frame = document.getElementById("gameFrame");
  frame.src = url;
}