gsap.registerPlugin(ScrollTrigger);

/* ****************************** */
/* Navigation animations */
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
/* ****************************** */

/* ****************************** */
/* Reveal-gallery animations */
const sections = gsap.utils.toArray(".rg__column");
function initHoverReveal() {
  sections.forEach((section) => {
    section.imageBlock = section.querySelector(".rg__image");
    section.image = section.querySelector(".rg__image img");
    section.imageMask = section.querySelector(".rg__image--mask");
    section.text = section.querySelector(".rg__text");
    section.textCopy = section.querySelector(".rg__text--copy");
    section.textMask = section.querySelector(".rg__text--mask");

    // reset initial position
    gsap.set([section.imageBlock, section.textCopy], { yPercent: -101 });
    gsap.set([section.imageMask, section.textMask], { yPercent: 101 });
    gsap.set(section.image, { scale: 1.2 });

    // add event listeners to section
    section.addEventListener("mouseenter", createHoverReveal);
    section.addEventListener("mouseleave", createHoverReveal);
  });
}

const getTextHeight = (textCopy) => textCopy.clientHeight;
const fillBackgroundEl = document.querySelector(".fill-background");

function createHoverReveal(evt) {
  const isHovering = evt.type === "mouseenter";
  const { imageMask, imageBlock, image, text, textCopy, textMask } = evt.target;

  const tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "Power4.out",
    },
  });

  if (isHovering) {
    tl.to([imageMask, imageBlock, textCopy, textMask], { yPercent: 0 })
      .to(image, { duration: 1.1, scale: 1 }, 0)
      .to(
        text,
        {
          y: () => -getTextHeight(textCopy) / 2,
        },
        0
      )
      .to(fillBackgroundEl, { backgroundColor: evt.target.dataset.color }, 0);
  } else {
    tl.to([imageBlock, textCopy], { yPercent: -101 })
      .to([imageMask, textMask], { yPercent: 100 }, 0)
      .to(image, { duration: 1.1, scale: 1.2 }, 0)
      .to(
        text,
        {
          y: () => getTextHeight(textCopy) / 2,
        },
        0
      );
  }
  return tl;
}
/* ****************************** */

/* ****************************** */
/* Animate portfolio images on hover */
const portfolioCategoriesContainer = document.querySelector(
  ".portfolio__categories"
);
const portfolioCategories = gsap.utils.toArray(".portfolio__categories a");
const portfoliImageContainerLarge = document.querySelector(
  ".portfolio .portfolio__image--l"
);
const portfoliImageContainerSmall = document.querySelector(
  ".portfolio .portfolio__image--s"
);
const portfoliImageLarge = portfoliImageContainerLarge.querySelector("div");
const portfoliImageSmall = portfoliImageContainerSmall.querySelector("div");

function initHoverPortfolio() {
  portfolioCategories.forEach((el) => {
    el.addEventListener("mouseenter", revealImagesOnHover);
    el.addEventListener("mouseleave", revealImagesOnHover);
    el.addEventListener("mousemove", createPortfoiloMove);
  });
}

function createPortfoiloMove(evt) {
  const { clientY } = evt;

  gsap.to(portfoliImageContainerLarge, {
    duration: 1.2,
    y: getPortfolioOffset(clientY) / 6,
    ease: "Power3.out",
  });
  gsap.to(portfoliImageContainerSmall, {
    duration: 1.5,
    y: getPortfolioOffset(clientY) / 3,
    ease: "Power3.out",
  });
}

function getPortfolioOffset(clientY) {
  return -(portfolioCategoriesContainer.clientHeight - clientY);
}

function revealImagesOnHover(evt) {
  const el = evt.currentTarget;
  const { imagelarge, imagesmall, color } = el.dataset;

  const tl = gsap.timeline({
    defaults: {
      duration: 1,
      ease: "Power4.out",
    },
  });

  if (evt.type === "mouseenter") {
    tl.to(portfolioCategories, {
      duration: 1,
      color: "#fff",
      autoAlpha: 0.2,
    })
      .to(el, { duration: 1, autoAlpha: 1 }, 0)
      .set(portfoliImageLarge, { backgroundImage: `url(${imagelarge})` }, 0)
      .set(portfoliImageSmall, { backgroundImage: `url(${imagesmall})` }, 0)
      .to(
        [portfoliImageContainerLarge, portfoliImageContainerSmall],
        { autoAlpha: 1 },
        0
      )
      .to(fillBackgroundEl, { backgroundColor: color, ease: "none" }, 0);
  } else {
    tl.to(
      portfolioCategories,
      { duration: 1, color: "#000", autoAlpha: 1 },
      0
    ).to(
      [portfoliImageContainerLarge, portfoliImageContainerSmall],
      { autoAlpha: 0 },
      0
    );
  }
}
/* ****************************** */

/* ****************************** */
/* Parallax images on scroll */
function initImageParallax() {
  const parallaxSections = gsap.utils.toArray(".with-parallax");
  parallaxSections.forEach((section) => {
    const img = section.querySelector("img");

    gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        scrub: true,
      },
    });
  });
}
function updateFillBackground(color) {
  document.documentElement.style.setProperty("--bgc-fill-color", color);
}

function initPinSteps() {
  ScrollTrigger.create({
    trigger: ".fixed-nav",
    start: "top center",
    endTrigger: "#stage4",
    end: "center center",
    pin: true,
    markers: true,
  });

  gsap.utils.toArray(".stage").forEach((stage, index) => {
    const navLinksItems = gsap.utils.toArray(".fixed-nav li");

    ScrollTrigger.create({
      trigger: stage,
      start: "top center",
      end: "top",
      toggleClass: {
        targets: navLinksItems[index],
        className: "is-active",
      },
      onEnter: () => updateFillBackground(stage.dataset.color),
      onEnterBack: () => updateFillBackground(stage.dataset.color),
    });
  });
}
/* ****************************** */

function init() {
  /* Navigation animations */
  // initNavigation();
  // initNavTilt();
  /* Reveal-gallery animations */
  // initHoverReveal();
  /* Animate portfolio images on hover */
  // initHoverPortfolio();
  /* Parallax images on scroll */
  initImageParallax();
  initPinSteps();
}

// window.addEventListener("load", function () {
//   init();
// });

const mq = window.matchMedia("(min-width: 768px)");

function removeInlineStyles(...elements) {
  if (elements.length) {
    gsap.killTweensOf("*");
    elements.forEach((el) => el && gsap.set(el, { clearProps: "all" }));
  }
}

function handleWidthChange(matchMedia) {
  if (matchMedia.matches) {
    return init();
  }
  sections.forEach((section) => {
    section.removeEventListener("mouseenter", createHoverReveal);
    section.removeEventListener("mouseleave", createHoverReveal);

    const { imageMask, imageBlock, image, text, textCopy, textMask } = section;
    removeInlineStyles(imageMask, imageBlock, image, text, textCopy, textMask);
  });
}

mq.addListener(handleWidthChange);

handleWidthChange(mq);
