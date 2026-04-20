// Trang chủ
function showMore() {
  const el = document.getElementById("moreInfo");
  if (el) el.classList.toggle("hidden");
}

// Trang dự án
function toggleProject() {
  const el = document.getElementById("projectList");
  if (el) el.classList.toggle("hidden");
}

// Color picker (nếu có)
const picker = document.getElementById("colorPicker");
if (picker) {
  const saved = localStorage.getItem("bgColor");
  if (saved) {
    document.body.style.backgroundColor = saved;
    picker.value = saved;
  }

  picker.addEventListener("input", (e) => {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    localStorage.setItem("bgColor", color);
  });
}