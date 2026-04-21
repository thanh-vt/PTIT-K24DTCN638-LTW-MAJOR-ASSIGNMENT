class TechRibbon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.items = [
      {name: "Java", icon: "images/java.png"},
      {name: "PHP", icon: "images/php.png"},
      {name: "C", icon: "images/c.png"},
      {name: "C++", icon: "images/c++.png"},
      {name: "C#", icon: "images/cs.png"},
      {name: "Javascript", icon: "images/javascript.png"},
      {name: "Golang", icon: "images/golang.png"},
      {name: "Ruby", icon: "images/ruby.png"},
      {name: "Rust", icon: "images/rust.png"}
    ];

  }

  async connectedCallback() {
    const css = await fetch("style/tech-ribbon.css").then(r => r.text());
    const groupHTML = this.items.map((it, i) => `
            <div class="item">
                <img class="icon" src="${it.icon}" alt="${it.name}" data-index="${i}">
                <span class="tooltip">${it.name}</span>
            </div>
        `).join("");

    this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <div class="wrapper">
            <div class="clip">
                <div class="track">
                    <div class="group">${groupHTML}</div>
                    <div class="group">${groupHTML}</div>
                    <div class="group">${groupHTML}</div>
                </div>
            </div>

            <div class="overlay">
                <div class="tooltip" id="tooltip"></div>
            </div>
        </div>
        `;
    this.bindTooltip();
  }

  bindTooltip() {
    const tooltip = this.shadowRoot.getElementById("tooltip");
    const icons = this.shadowRoot.querySelectorAll(".icon");

    icons.forEach(icon => {
      const name = this.items[icon.dataset.index].name;

      icon.addEventListener("mouseenter", (e) => {
        tooltip.textContent = name;
        tooltip.classList.add("show");

        const rect = icon.getBoundingClientRect();
        const hostRect = this.getBoundingClientRect();

        // convert to local coordinate
        const x = rect.left - hostRect.left + rect.width / 2;
        const y = rect.top - hostRect.top;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
      });

      icon.addEventListener("mouseleave", () => {
        tooltip.classList.remove("show");
      });
    });
  }
}

customElements.define("tech-ribbon", TechRibbon);