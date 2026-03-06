const categoriesContainer = document.getElementById("categories-container");
const treesContainer = document.getElementById("trees-container");
const loadingSpinner = document.getElementById("loadingSpinner");
const allButton = document.getElementById("all-btn");
const tree_details = document.getElementById("tree_details");

const modalTitle = document.getElementById("modal-title");
const modalImg = document.getElementById("modal-img");
const modalDescription = document.getElementById("description");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");
const cardContainer = document.getElementById("cardContainer");
const totalPrice = document.getElementById("totalPrice");
const emptyMessage = document.getElementById("emptyMessege");
console.log(emptyMessage);
let card = [];
// console.log(categoriesContainer);
console.log(allButton);
allButton.addEventListener("click", () => {
  const allButtons = document.querySelectorAll(
    "#categories-container button, #all-bnt",
  );
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline");
  });
  allButton.classList.add("btn-success");
  allButton.classList.remove("btn-outline");
  loadTrees();
});
function showLoading(status) {
  if (status == true) {
    loadingSpinner.classList.remove("hidden");
    treesContainer.innerHTML = "";
  } else {
    loadingSpinner.classList.add("hidden");
  }
}
async function loadCategories() {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/categories",
  );
  const data = await res.json();
  // console.log(data);
  data.categories.forEach((category) => {
    // console.log(category)
    const btn = document.createElement("button");
    btn.className = "btn btn-outline w-full ";
    btn.textContent = category.category_name;
    btn.onclick = () => selectCategory(category.id, btn);
    categoriesContainer.append(btn);
  });
}

async function selectCategory(id, btn) {
  showLoading(true);
  // btn.classList.add('btn-success')
  const allButtons = document.querySelectorAll(
    "#categories-container button, #all-bnt",
  );
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline");
  });
  btn.classList.add("btn-success");
  btn.classList.remove("btn-outline");
  const res = await fetch(
    `https://openapi.programming-hero.com/api/category/${id}`,
  );
  const data = await res.json();
  displayTrees(data.plants);
  showLoading(false);
}

async function loadTrees() {
  showLoading(true);
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  showLoading(false);
  displayTrees(data.plants);
}

function displayTrees(trees) {
  trees.forEach((element) => {
    const card = document.createElement("div");
    card.className=`card h-full bg-base-100 shadow-sm border-b-2 ${element.price > 500 ? 'border-red-500' : 'border-green-500'}`
    card.innerHTML = `
        <div >
              <figure>
                <img
                onclick="openTreeModal(${element.id})"
                class="h-48 w-full object-cover cursor-pointer"
                  src=${element.image}
                  alt=${element.name}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">${element.name}</h2>
                <p class="line-clamp-2">
                  ${element.description}
                </p>
                <div class="badge badge-success badge-outline">${element.category}</div>
                <div class="card-actions items-center justify-between">
                  <h1 class="font-bold text-xl ${element.price > 500 ? "text-red-500" : "text-green-500"}">$${element.price}</h1>
                  <button onclick="addToCard(${element.id}, '${element.name}', ${element.price})" class="btn btn-success text-white">Add</button>
                </div>
              </div>
            </div>
        `;
    treesContainer.append(card);
  });
}

async function openTreeModal(treeId) {
  console.log(treeId);
  const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${treeId}`,
  );
  const data = await res.json();
  const platsDetails = data.plants;
  console.log(platsDetails.name);
  modalTitle.textContent = platsDetails.name;
  modalImg.src = platsDetails.image;
  modalDescription.textContent = platsDetails.description;
  modalCategory.textContent = platsDetails.category;
  modalPrice.textContent = platsDetails.price;
  console.log(platsDetails);
  tree_details.showModal();
}

function addToCard(id, name, price) {
  console.log(id, name, price);
  const existingCard = card.find((item) => item.id === id);
  if (existingCard) {
    existingCard.quantity += 1;
  } else {
    card.push({
      id,
      name,
      price,
      quantity: 1,
    });
  }
  updateCard();
}
function updateCard() {
  cardContainer.innerHTML = "";
  if (card.length === 0) {
    console.log(emptyMessage);
    emptyMessage.classList.remove("hidden");
    totalPrice.innerText = "0";
    return;
  }
  emptyMessage.classList.add("hidden");

  let total = 0;
  card.forEach((item) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="p-2 bg-white flex justify-between shadow-sm rounded-lg">
    <div>
      <h1 class="font-semibold">${item.name}</h1>
      <p class="flex font-semibold"><span>${item.quantity}</span>x<span>${item.price}</span></p>
    </div>
    <div class="space-y-3">
      <button class="btn" onclick="removeCard(${item.id})">x</button>
      <p class="text-xl font-bold text-green-500">$<span>${item.price * item.quantity}</span></p>
    </div>
  </div>
    `;
    cardContainer.append(div);
  });
  totalPrice.innerText = total;
}

function removeCard(treeId) {
  const filteringCard = card.filter((item) => item.id != treeId);
  card = filteringCard;
  updateCard();
}
loadCategories();
loadTrees();
