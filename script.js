"use strict";

const menuBtn = document.querySelector(".menu__icon");
const mobMenu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");
const wrapper = document.querySelector(".wrapper");



menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("menu__icon--active");
  mobMenu.classList.toggle("menu--active");
  overlay.classList.toggle("overlay--active");
  wrapper.classList.toggle("wrapper--active");
});

document.addEventListener("click", (event) => {
  const isMenuOpen = mobMenu.classList.contains("menu--active");
  
  const clickedOutsideMenu = !mobMenu.contains(event.target);
  const clickedOutsideBtn = !menuBtn.contains(event.target);

  if (isMenuOpen && clickedOutsideMenu && clickedOutsideBtn) {
    menuBtn.classList.remove("menu__icon--active");
    mobMenu.classList.remove("menu--active");
    overlay.classList.remove("overlay--active");
    wrapper.classList.remove("wrapper--active");
  }
});

const navLink = document.querySelectorAll(".menu__link");
navLink.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    menuBtn.classList.remove("menu__icon--active");
    mobMenu.classList.remove("menu--active");
    overlay.classList.remove("overlay--active");
    wrapper.classList.remove("wrapper--active");

    const blockId = item.getAttribute("href").substring(1);

    document.getElementById(blockId).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

function DynamicAdapt(type) {
  this.type = type;
}
DynamicAdapt.prototype.init = function () {
  this.objects = [];
  this.daClassname = "_dynamic_adapt_";
  this.nodes = document.querySelectorAll("[data-da]");

  for (const node of this.nodes) {
    const [selector, breakpoint = "767", place = "last"] =
      node.dataset.da.split(",").map(item => item.trim());

    const object = {
      element: node,
      parent: node.parentNode,
      destination: document.querySelector(selector),
      breakpoint,
      place,
      index: this.indexInParent(node.parentNode, node),
    };

    this.objects.push(object);
  }

  this.arraySort(this.objects);

  this.mediaQueries = [
    ...new Set(
      this.objects.map(
        item => `(${this.type}-width: ${item.breakpoint}px),${item.breakpoint}`,
      ),
    ),
  ];

  for (const media of this.mediaQueries) {
    const [query, breakpoint] = media.split(",");
    const matchMedia = window.matchMedia(query);
    const objectsFilter = this.objects.filter(
      item => item.breakpoint === breakpoint,
    );

    matchMedia.addEventListener("change", () =>
      this.mediaHandler(matchMedia, objectsFilter),
    );

    this.mediaHandler(matchMedia, objectsFilter);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, objects) {
  for (const object of objects) {
    if (matchMedia.matches) {
      object.index = this.indexInParent(object.parent, object.element);
      this.moveTo(object.place, object.element, object.destination);
    } else if (object.element.classList.contains(this.daClassname)) {
      this.moveBack(object.parent, object.element, object.index);
    }
  }
};

DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);

  if (place === "first") return destination.prepend(element);

  if (place === "last" || place >= destination.children.length) {
    return destination.append(element);
  }

  destination.children[place].before(element);
};

DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);

  const target = parent.children[index];

  if (target) {
    target.before(element);
  } else {
    parent.append(element);
  }
};

DynamicAdapt.prototype.indexInParent = function (parent, element) {
  return [...parent.children].indexOf(element);
};

DynamicAdapt.prototype.arraySort = function (arr) {
  const isMin = this.type === "min";

  arr.sort((a, b) => {
    if (a.breakpoint !== b.breakpoint) {
      return isMin
        ? a.breakpoint - b.breakpoint
        : b.breakpoint - a.breakpoint;
    }

    if (a.place === b.place) return 0;

    if (a.place === "first" || b.place === "last") {
      return isMin ? -1 : 1;
    }

    if (a.place === "last" || b.place === "first") {
      return isMin ? 1 : -1;
    }

    return isMin
      ? a.place - b.place
      : b.place - a.place;
  });
};

const da = new DynamicAdapt("max");
da.init();


const slider = document.querySelector(".timeline__items");

let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});

slider.addEventListener("mouseleave", () => {
  isDown = false;
});

slider.addEventListener("mouseup", () => {
  isDown = false;
});

slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;

  e.preventDefault();

  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1.5;

  slider.scrollLeft = scrollLeft - walk;
});


const titles = document.querySelectorAll(".footer-title");

titles.forEach((title) => {
  title.addEventListener("click", () => {
    title.parentElement.classList.toggle("active");
  });
});

