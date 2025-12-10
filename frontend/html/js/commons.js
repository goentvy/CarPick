document.addEventListener("DOMContentLoaded", () => {
  const navMenu = document.getElementById("navMenu");
  const menuDim = document.getElementById("menuDim");
  const btnOpen = document.getElementById("btnMenuOpen");
  const btnClose = document.getElementById("btnMenuClose");

  // 메뉴 열기
  btnOpen.addEventListener("click", () => {
      navMenu.classList.add("active");
      menuDim.classList.add("active");
  });

  // 메뉴 닫기
  function closeMenu() {
      navMenu.classList.remove("active");
      menuDim.classList.remove("active");
  }

  btnClose.addEventListener("click", closeMenu);

  // dim 클릭 시 메뉴 닫힘
  menuDim.addEventListener("click", closeMenu);

  // navMenu 외부 클릭 시 닫기
  document.addEventListener("click", (e) => {
      const isClickInside = navMenu.contains(e.target) || btnOpen.contains(e.target);
      if (!isClickInside && navMenu.classList.contains("active")) {
          closeMenu();
      }
  });

});

function showPop(a){
	$(a).fadeIn();
}

function hidePop(a){
	$(a).fadeOut();
}

function fnMove(seq){
		var offset = $(seq).offset();
		$('html, body').animate({scrollTop : offset.top}, 400);
}

function fnback(n){
	history.back();
}
function loca(n){
	location.href=n;
}
