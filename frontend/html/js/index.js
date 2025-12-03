$(document).ready(function() {

    var main01_slider = new Swiper('#main01 .main_slider', {
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        }
    });

    var main03_slider = new Swiper('#main03 .main3_slider', {
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        }
    });

});

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll("#main02 h4");
  const speed = 1000; // 카운트 속도 (ms)
  let animated = false; // 중복 실행 방지

  const countUp = (el) => {
    const target = +el.innerText.replace(/,/g, ""); // 숫자만 추출
    let start = 0;
    const duration = speed;
    const stepTime = 16; // 약 60fps
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        el.innerText = target.toLocaleString(); // 콤마포함 표시
      } else {
        el.innerText = Math.floor(start).toLocaleString();
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        document.querySelectorAll("#main02 li").forEach(li => li.classList.add("visible"));
        counters.forEach(el => countUp(el));
      }
    });
  }, { threshold: 0.5 });

  observer.observe(document.querySelector("#main02"));
});
