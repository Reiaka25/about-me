document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupSlider();
  setupContactForm();
  setupPageTop();
  setupFadeIn();
});

function setupMenu() {
  const menuButton = document.querySelector(".menu-button");
  const globalNav = document.querySelector("#global-nav");

  if (!menuButton || !globalNav) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("is-menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
  });

  globalNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("is-menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "メニューを開く");
    });
  });
}

function setupSlider() {
  const slider = document.querySelector("[data-slider]");

  if (!slider) {
    return;
  }

  const track = slider.querySelector("[data-slider-track]");
  const slides = Array.from(slider.querySelectorAll(".slider__slide"));
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  const dotsArea = slider.querySelector("[data-slider-dots]");

  if (!track || slides.length === 0 || !dotsArea) {
    return;
  }

  let currentIndex = 0;
  let timerId = null;

  const dots = slides.map((slide, index) => {
    slide.setAttribute("aria-hidden", index === 0 ? "false" : "true");

    const dot = document.createElement("button");
    dot.className = "slider__dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `${index + 1}枚目の画像を表示`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartAutoPlay();
    });
    dotsArea.appendChild(dot);
    return dot;
  });

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", slideIndex === currentIndex ? "false" : "true");
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  };

  const nextSlide = () => showSlide(currentIndex + 1);
  const prevSlide = () => showSlide(currentIndex - 1);

  const startAutoPlay = () => {
    if (timerId) {
      return;
    }
    timerId = window.setInterval(nextSlide, 4500);
  };

  const stopAutoPlay = () => {
    if (!timerId) {
      return;
    }
    window.clearInterval(timerId);
    timerId = null;
  };

  const restartAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      prevSlide();
      restartAutoPlay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextSlide();
      restartAutoPlay();
    });
  }

  slider.addEventListener("mouseenter", stopAutoPlay);
  slider.addEventListener("mouseleave", startAutoPlay);
  slider.addEventListener("focusin", stopAutoPlay);
  slider.addEventListener("focusout", startAutoPlay);

  showSlide(0);
  startAutoPlay();
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");

  if (!form) {
    return;
  }

  const fields = Array.from(form.querySelectorAll("[data-required]"));
  const status = form.querySelector("[data-form-status]");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (field, message) => {
    const fieldWrap = field.closest(".form-field");
    const errorText = form.querySelector(`[data-error-for="${field.name}"]`);

    if (fieldWrap) {
      fieldWrap.classList.toggle("is-error", Boolean(message));
    }

    if (errorText) {
      errorText.textContent = message;
    }
  };

  const validateField = (field) => {
    const value = field.value.trim();

    if (!value) {
      showError(field, "この項目を入力してください。");
      return false;
    }

    if (field.type === "email" && !emailPattern.test(value)) {
      showError(field, "メールアドレスの形式で入力してください。");
      return false;
    }

    showError(field, "");
    return true;
  };

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      validateField(field);
      if (status) {
        status.textContent = "";
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = fields.map(validateField).every(Boolean);

    if (status) {
      status.textContent = isValid
        ? "入力内容を確認しました。送信機能はありません。"
        : "入力内容を確認してください。";
    }
  });
}

function setupPageTop() {
  const pageTopButton = document.querySelector(".page-top");

  if (!pageTopButton) {
    return;
  }

  const toggleButton = () => {
    pageTopButton.classList.toggle("is-visible", window.scrollY > 360);
  };

  pageTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", toggleButton, { passive: true });
  toggleButton();
}

function setupFadeIn() {
  const fadeTargets = document.querySelectorAll("[data-fade]");

  if (fadeTargets.length === 0) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    fadeTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeTargets.forEach((target) => observer.observe(target));
}
