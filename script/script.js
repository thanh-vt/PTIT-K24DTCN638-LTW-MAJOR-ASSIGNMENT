// Tạo header component dùng chung cho các page
class AppHeader extends HTMLElement {
  async connectedCallback() {
    const css = await fetch("style/menu.css").then(r => r.text());
    this.innerHTML = `
        <style>${css}</style>
        <header>
          <nav class="navbar">
          <gradient-dialog></gradient-dialog>
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
    const currentPath = globalThis.location.pathname.split("/").pop()
        || "index.html";

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
