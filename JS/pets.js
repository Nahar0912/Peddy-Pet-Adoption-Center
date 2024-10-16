//Fetch the categories data
const loadPetsByCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
      .then((res) => res.json())
      .then((data) => displayCategories(data.categories))
      .catch((error) => console.log(error));
};

//Fetch All Pets Data 
const loadPets = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => displayPets(data.pets))
    .catch((error) => console.log(error));
};

//Fetch Pets Data By Category
const ClickPetsByCategory = (category) => {
  toggleSpinner(true); 

  fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
    .then((res) => res.json())
    .then((data) => {
      toggleSpinner(false); 
      displayPets(data.data);
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${category}`);
      activeBtn.classList.add("bg-teal-100", "text-black", "border", "border-teal-300","rounded-full");
      activeBtn.classList.remove("bg-gray-100", "text-gray-600");
    })
    .catch((error) => {
      toggleSpinner(false); 
      console.error(error);
    });
};

//<-----------Display Categories BUTTON---------->
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  categories.forEach((item) => {
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
      <button id="btn-${item.category}" class="btn category-btn btn-lg btn-wide bg-gray-100 text-gray-600" onclick="ClickPetsByCategory('${item.category}')">
        <img src="${item.category_icon}" alt=""><span class="font-bold">${item.category}</span>
      </button>
    `;
    categoryContainer.append(buttonContainer);
  });
};


//<-------Display pet details In the MODAL of CARD-------->
const loadDetails = async (Id) => {
  try {
    console.log(Id);
    const uri = `https://openapi.programming-hero.com/api/peddy/pet/${Id}`;
    const res = await fetch(uri);
    if (!res.ok) {
      throw new Error(`Failed to fetch details for pet with ID: ${Id}`);
    }
    const data = await res.json();
    displayDetailsOfPets(data.petData);
  } catch (error) {
    console.error("Error loading pet details:", error);
  }
};
const displayDetailsOfPets = (petData) => {
  const modal = document.getElementById("pet-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.getElementById("modal-image").src = petData.image;
  document.getElementById("modal-name").innerText = petData.pet_name;
  document.getElementById("modal-details").innerText = petData.pet_details;
  document.getElementById("modal-price").innerText = `$ Price: ${petData.price}`;
  document.getElementById("modal-breed").innerText = `Breed: ${petData.breed}`;
  document.getElementById("modal-dob").innerText = `Date of Birth: ${petData.date_of_birth}`;
  document.getElementById("modal-gender").innerText = `Gender: ${petData.gender}`;
  document.getElementById("modal-vaccination").innerText = `Vaccination Status: ${petData.vaccinated_status}`;
  document.getElementById("close-modal").addEventListener("click", () => {
    const modal = document.getElementById("pet-modal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });
};


//<-----------Display Pets on cards------------>
const displayPets = (pets) => {
  const petsContainer = document.getElementById("pets");
  petsContainer.innerHTML = "";

  // No Content Found  
  if (pets.length === 0) {
    petsContainer.classList.remove("grid");
    petsContainer.innerHTML = `
      <div class="min-h-[500px] flex flex-col justify-center items-center lg:ml-96">
        <img src="../images/error.webp" alt="No Content" /><br>
        <h2 class="text-center text-xl font-bold"> No Content Here in this Category </h2> 
      </div>`;
    document.getElementById("likedPetsBox").classList.add("hidden");  
  } else {
    petsContainer.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-4");
    document.getElementById("likedPetsBox").classList.remove("hidden"); 
  }

  pets.forEach((pet) => {
    const breed = pet.breed || 'Not Found';
    const birthDate = pet.date_of_birth || 'Not Found';
    const gender = pet.gender || 'Not Found';
    const price = pet.price !== null && pet.price !== undefined ? `$${pet.price}` : 'Not Found';

    const card = document.createElement("div");
    card.classList = "card card-compact w-full max-w-xs mx-auto";
    card.innerHTML = `
     <div class="card bg-base-100 border shadow-xl">
      <figure class="px-5 pt-10">
          <img src="${pet.image}" alt="Pet" class="rounded-xl" />
      </figure>
      <div class="card-body">
          <h2 class="card-title">${pet.pet_name}</h2>
          <p>Breed: ${breed}</p>
          <p>Birth: ${birthDate}</p>
          <p>Gender: ${gender}</p>
          <p>Price: ${price}</p>
          <div class="card-actions flex justify-between">
              <button class="btn font-bold" onclick="likedPet('${pet.image}')">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                  </svg>
              </button>
              <button class="btn text-teal-600 font-bold adopt-button" onclick="adoptPet(this)">Adopt</button>
              <button class="btn text-teal-600 font-bold" onclick="loadDetails(${pet.petId})">Details</button>
          </div>
      </div>
      </div>
    `;
    petsContainer.append(card);
  });
};

//<--------------Display pets on LIKE box------------>
const likedPets = [];
const likedPet = (image) => {
  if (likedPets.includes(image)) {
    return;
  }
  likedPets.push(image);

  const likedPetsContainer = document.getElementById("likedPets");
  const likedPetItem = document.createElement("div");
  likedPetItem.classList.add("flex", "items-center");
  likedPetItem.innerHTML = `<img src="${image}" alt="" class="w-32 h-28 rounded-md">`;

  likedPetsContainer.append(likedPetItem);
};

loadPetsByCategories();
loadPets();