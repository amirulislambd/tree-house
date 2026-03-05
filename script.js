const categoriesContainer = document.getElementById("categories-container");
const treesContainer = document.getElementById("trees-container");
const loadingSpinner = document.getElementById("loadingSpinner");
const allButton = document.getElementById('all-btn')
const tree_details = document.getElementById('tree_details')
// console.log(categoriesContainer);
console.log(allButton)
allButton.addEventListener('click', ()=>{
    const allButtons= document.querySelectorAll('#categories-container button, #all-bnt')
    allButtons.forEach(btn=>{
        btn.classList.remove('btn-success')
        btn.classList.add('btn-outline')
       })
       allButton.classList.add('btn-success')
       allButton.classList.remove('btn-outline')
       loadTrees()
})
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
    btn.onclick=()=>selectCategory(category.id,btn)
    categoriesContainer.append(btn);
  });
}

async function selectCategory(id,btn){
    showLoading(true)
    // btn.classList.add('btn-success')
   const allButtons= document.querySelectorAll('#categories-container button, #all-bnt')
   allButtons.forEach(btn=>{
    btn.classList.remove('btn-success')
    btn.classList.add('btn-outline')
   })
   btn.classList.add('btn-success')
   btn.classList.remove('btn-outline')
   const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`)
   const data = await res.json()
   displayTrees(data.plants)
   showLoading(false)
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
    card.innerHTML = `
        <div class="card bg-base-100 shadow-sm">
              <figure>
                <img
                onclick="openTreeModal(${element.id})"
                class="h-48 w-full object-cover"
                  src=${element.image}
                  alt=${element.name}
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title">${element.name}</h2>
                <p class="line-clamp-2">
                  ${element.description}
                </p>
                <div class="badge badge-success badge-outline">Primary</div>
                <div class="card-actions items-center justify-between">
                  <h1 class="font-bold text-xl text-green-500">${element.price}</h1>
                  <button class="btn btn-success text-white">Buy Now</button>
                </div>
              </div>
            </div>
        `;
    treesContainer.append(card);
  });
}

function openTreeModal(treeId){
    console.log(treeId)
    tree_details.showModal()
}

loadCategories();
loadTrees();
