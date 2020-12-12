gsap.registerPlugin(ScrollTrigger);

function initNavigation() {
  const navLinks = gsap.utils.toArray(".main-nav a");
  const navLinksRev = gsap.utils.toArray(".main-nav a").reverse();

  navLinks.forEach((link) => {
    link.addEventListener("mouseleave", () => {
      link.classList.add("animate-out");

      setTimeout(() => {
        link.classList.remove("animate-out");
      }, 300);
    });
  });

  function navAnimation({ direction }) {
    const isScrollDown = direction === 1;
    const links = isScrollDown ? navLinks : navLinksRev;

    return gsap.to(links, {
      duration: 0.3,
      stagger: 0.05,
      autoAlpha: () => (isScrollDown ? 0 : 1),
      y: () => (isScrollDown ? 20 : 0),
      ease: "Power4.out",
    });
  }

  ScrollTrigger.create({
    start: 100,
    end: "bottom bottom-=200",
    toggleClass: {
      targets: "body",
      className: "has-scrolled",
    },
    onEnter: navAnimation,
    onLeaveBack: navAnimation,
  });
}

function initNavTilt() {
  document.querySelector("header").addEventListener("mousemove", moveImages);
}

function moveImages(evt) {
  const { offsetX, offsetY, target } = evt;
  const { clientWidth, clientHeight } = target;

  const xPos = offsetX / clientWidth - 0.5;
  const yPos = offsetY / clientHeight - 0.5;

  const modifier = (index) => index * 1.2 + 0.5;

  const leftImages = gsap.utils.toArray(".hg__left .hg__image");
  const rightImages = gsap.utils.toArray(".hg__right .hg__image");
  const imagesNum = leftImages.length + rightImages.length;

  [...leftImages, ...rightImages].forEach((image, idx) => {
    const isRightImages = idx + 1 > Math.floor(imagesNum / 2);

    gsap.to(image, {
      duration: 1.2,
      x: xPos * 20 * modifier(idx),
      y: (isRightImages ? -1 : 1) * yPos * 30 * modifier(idx),
      rotationX: yPos * 10,
      rotationY: xPos * 40,
      ease: "Power3.out",
    });
  });

  gsap.to(".decor__circle", {
    duration: 1.7,
    x: 100 * xPos,
    y: 120 * yPos,
    ease: "Power4.out",
  });
}

function init() {
  initNavigation();
  initNavTilt();
}

window.addEventListener("load", function () {
  init();
});
