// Hiện thêm thông tin
function showMore() {
  const more = document.getElementById("moreInfo");
  more.classList.toggle("hidden");
}

// Hiện danh sách sở thích
function toggleHobby() {
  const list = document.getElementById("hobbyList");
  list.classList.toggle("hidden");
}

// Đổi màu nền
function changeColor() {
  const colors = ["#f4f4f4", "#ffe4e1", "#e6ffe6", "#e0f7fa"];
  const random = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = random;
}