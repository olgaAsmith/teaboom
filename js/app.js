const packages = [
  {
    weight: "100 г",
    article: "01306",
    oldPrice: "349,20 ₽",
    price: "326,40 ₽",
  },
  {
    weight: "500 г",
    article: "01307",
    oldPrice: "1 646 ₽",
    price: "1 432 ₽",
  },
  {
    weight: "1000 г",
    article: "01308",
    oldPrice: "2 592 ₽",
    price: "2 064 ₽",
  },
  {
    weight: "5000 г",
    article: "01309",
    oldPrice: "8 710 ₽",
    price: "6 320 ₽",
  },
];

const packageList = document.querySelector("#product-packages");
const articleEl = document.querySelector("#product-article");
const priceEl = document.querySelector("#product-price");
const oldPriceEl = document.querySelector("#product-old-price");
const oldPriceWrap = document.querySelector("#product-old-price-wrap");
const addToCartBtn = document.querySelector("#add-to-cart");
const qtyWrap = document.querySelector("#product-qty");
const qtyEl = document.querySelector("#cart-qty");
const qtyMinusBtn = document.querySelector("#qty-minus");
const qtyPlusBtn = document.querySelector("#qty-plus");

const requiredElements = [
  packageList,
  articleEl,
  priceEl,
  oldPriceEl,
  oldPriceWrap,
  addToCartBtn,
  qtyWrap,
  qtyEl,
  qtyMinusBtn,
  qtyPlusBtn,
];

if (requiredElements.some((element) => !element)) {
  throw new Error("Не найден один из элементов карточки товара.");
}

let selectedIndex = 0;
const cartQty = packages.map(() => 0);

function replayAnimation(element) {
  element.classList.remove("is-animate");
  void element.offsetWidth;
  element.classList.add("is-animate");
}

function createPackageButton(item, index) {
  const itemEl = document.createElement("li");
  const button = document.createElement("button");

  button.className = "product-packages__btn product-btn";
  button.type = "button";
  button.dataset.index = String(index);
  button.setAttribute("aria-pressed", "false");
  button.textContent = item.weight;

  itemEl.append(button);
  return itemEl;
}

function renderPackages() {
  packageList.replaceChildren(...packages.map(createPackageButton));
}

function renderCartActions() {
  const qty = cartQty[selectedIndex];
  const isOpen = qty > 0;

  qtyEl.textContent = String(qty);
  qtyWrap.classList.toggle("is-open", isOpen);
  qtyWrap.setAttribute("aria-hidden", String(!isOpen));
  qtyWrap.toggleAttribute("inert", !isOpen);
}

function selectPackage(index, { animate = true } = {}) {
  const pack = packages[index];

  if (!pack) {
    return;
  }

  selectedIndex = index;

  packageList.querySelectorAll(".product-packages__btn").forEach((btn) => {
    const isSelected = Number(btn.dataset.index) === index;
    btn.classList.toggle("is-selected", isSelected);
    btn.setAttribute("aria-pressed", String(isSelected));
  });

  articleEl.textContent = pack.article;
  priceEl.textContent = pack.price;

  if (pack.oldPrice) {
    oldPriceEl.textContent = pack.oldPrice;
    oldPriceWrap.hidden = false;
  } else {
    oldPriceEl.textContent = "";
    oldPriceWrap.hidden = true;
  }

  if (animate) {
    replayAnimation(articleEl);
    replayAnimation(priceEl);
    replayAnimation(oldPriceWrap);
  }

  renderCartActions();
}

function handlePackageClick(event) {
  const button = event.target.closest("[data-index]");

  if (!button || !packageList.contains(button)) {
    return;
  }

  const index = Number(button.dataset.index);

  if (Number.isNaN(index) || index === selectedIndex) {
    return;
  }

  selectPackage(index);
}

function handleAddToCart() {
  cartQty[selectedIndex] += 1;
  renderCartActions();
}

function changeQty(delta) {
  cartQty[selectedIndex] = Math.max(0, cartQty[selectedIndex] + delta);
  renderCartActions();
}

function init() {
  renderPackages();
  selectPackage(0, { animate: false });

  packageList.addEventListener("click", handlePackageClick);
  addToCartBtn.addEventListener("click", handleAddToCart);
  qtyMinusBtn.addEventListener("click", () => changeQty(-1));
  qtyPlusBtn.addEventListener("click", () => changeQty(1));
}

init();
