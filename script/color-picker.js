class GradientDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"}); // tạo shadow root
  }

  async connectedCallback() {
    const css = await fetch("style/color-picker.css").then(r => r.text());
    const commonCss = await fetch("style/common.css").then(r => r.text());
    this.presets = [
      "linear-gradient(90deg, rgba(42,123,155,1) 0%, rgba(87,199,133,1) 50%, rgba(237,221,83,1) 100%)",
      "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
      "linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
      "radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)",
      "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
      "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
    ];
    this.stops = [
      {color: "#22C1C3", pos: 0},
      {color: "#FDBB2D", pos: 100}
    ];
    this.shadowRoot.innerHTML = `
        <style>${commonCss}</style>
        <style>${css}</style>
        <button id="open" class="open-btn">Đổi nền</button>
        <dialog class="theme-dialog">
            <h3>Cấu hình màu gradient</h3>
            <div class="preset-list">
                ${this.presets.map(g => `
                    <div class="preset" data-g="${g}"></div>
                `).join("")}
            </div>
            <div class="gradient-config">
                <div>
                    <label>Kiểu:</label>
                    <select id="type">
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                    </select>
                </div>

                <div>
                    <label>Góc:</label>
                    <input type="number" id="angle" value="90"> deg
                </div>

                <div class="stops" id="stops"></div>
                <div class="gradient-bar" id="bar">
                    <div class="handles" id="handles"></div>
                </div>
<!--                <button id="addStop">+ Thêm màu</button>-->
            </div>

            <div class="preview" id="preview"></div>

            <div class="dialog-actions">
                <button id="apply">Áp dụng</button>
                <button id="close">Đóng</button>
            </div>
        </dialog>
        `;

    this.dialog = this.shadowRoot.querySelector("dialog");
    this.bindEvents();
    this.loadSaved();
    this.updatePreview();
  }

  bindEvents() {
    this.shadowRoot.querySelector("#open").onclick = () => this.open();
    this.shadowRoot.querySelector("#close").onclick = () => this.close();
    this.shadowRoot.querySelector("#apply").onclick = () => this.apply();
    // this.shadowRoot.querySelector("#addStop").addEventListener("click", () => this.addStop());

    this.shadowRoot.querySelectorAll(".preset").forEach(el => {
      const g = el.dataset.g;
      el.style.background = g;
      el.addEventListener("click", () => {
        this.applyPreset(g);

        this.shadowRoot.querySelectorAll(".preset")
        .forEach(p => p.classList.remove("active"));

        el.classList.add("active");
      });
    });
    this.shadowRoot.querySelector("#bar").addEventListener("click", (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width * 100;

      this.stops.push({
        color: "#ffffff",
        pos: Math.round(percent)
      });

      this.renderHandles();
      this.renderStops();
      this.updatePreview();
    });
  }

  getGradient() {
    const type = this.shadowRoot.querySelector("#type").value;
    const angle = this.shadowRoot.querySelector("#angle").value;

    const stopsStr = this.stops
    .sort((a, b) => a.pos - b.pos)
    .map(s => `${s.color} ${s.pos}%`)
    .join(", ");

    return type === "linear"
        ? `linear-gradient(${angle}deg, ${stopsStr})`
        : `radial-gradient(circle, ${stopsStr})`;
  }

  bindStopEvents() {
    this.shadowRoot.querySelectorAll(".stop-row").forEach(row => {
      const i = +row.dataset.index;

      row.querySelector(".color").oninput = (e) => {
        this.stops[i].color = e.target.value;
        this.updatePreview();
      };

      row.querySelector(".pos").oninput = (e) => {
        this.stops[i].pos = +e.target.value;
        this.updatePreview();
      };

      row.querySelector(".remove").onclick = () => {
        this.stops.splice(i, 1);
        this.renderStops();
        this.renderHandles();
        this.updatePreview();
      };
    });
  }

  renderStops() {
    const container = this.shadowRoot.querySelector("#stops");

    container.innerHTML = this.stops.map((s, i) => `
        <div class="stop-row" data-index="${i}">
            <input type="color" value="${s.color}" class="color">
            <input type="number" value="${s.pos}" min="0" max="100" class="pos">
            <button class="remove">-</button>
        </div>
    `).join("");

    this.bindStopEvents();
  }

  bindDrag() {
    const bar = this.shadowRoot.querySelector("#bar");

    this.shadowRoot.querySelectorAll(".handle").forEach(handle => {
      const i = +handle.dataset.index;

      let dragging = false;

      handle.addEventListener("mousedown", () => dragging = true);
      handle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectedIndex = i;
      });
      window.addEventListener("mouseup", () => dragging = false);

      window.addEventListener("mousemove", (e) => {
        if (!dragging) return;

        const rect = bar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width * 100;

        percent = Math.max(0, Math.min(100, percent));

        this.stops[i].pos = Math.round(percent);

        this.renderHandles();
        this.updatePreview();
      });
    });
  }

  renderHandles() {
    const container = this.shadowRoot.querySelector("#handles");

    container.innerHTML = this.stops.map((s, i) => `
        <div class="handle" 
             data-index="${i}" 
             style="left:${s.pos}%; background:${s.color}">
        </div>
    `).join("");

    this.bindDrag();
  }

  updatePreview() {
    const g = this.getGradient();

    this.shadowRoot.querySelector("#preview").style.background = g;
    this.shadowRoot.querySelector("#bar").style.background = g;
  }

  apply() {
    const g = this.getGradient();
    document.body.style.background = g;
    localStorage.setItem("bgGradient", g);
    this.close();
  }

  applyPreset(g) {
    // parse stops từ gradient string
    const matches = g.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{6})\s+(\d+)%/g);
    console.log(matches);
    if (matches) {
      this.stops = matches.map(m => {
        const [color, pos] = m.split(/\s+/);
        return {color, pos: parseInt(pos)};
      });
    }

    this.renderStops();
    this.renderHandles();
    this.updatePreview();

    document.body.style.background = g;
  }

  loadSaved() {
    const saved = localStorage.getItem("bgGradient");
    if (saved) {
      document.body.style.background = saved;
    }
  }

  open() {
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }
}

customElements.define("gradient-dialog", GradientDialog);

