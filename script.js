// Definiram listu kategorija. Ako se aplikacija pokreće po prvi put
// default je da budu ove dole kategorije u toj listi.
// Ako ima nešto onda to uzimam iz LS-a.
let categoryList = [];
// Svi zadatci idu u jedan array objekata
let all = [];
// Početni status je false, što znači da prikazujemo NE završene zadatke
let appStatus = false;
// Početna kategorija koja se prikazuje je all
let currentCategory = "all";

function categoryListUpdate() {
  if (localStorage.getItem("cat list") === null) {
    categoryList = ["programming", "reading", "house tasks", "other"];
    localStorage.setItem("cat list", JSON.stringify(categoryList));
  } else {
    categoryList = JSON.parse(localStorage.getItem("cat list"));
  }
}
categoryListUpdate();

// Funkcija za prikazivanje liste kategorija u dom-u u navu di su kategorije zadataka
function categoryListRenderer() {
  const DOMnavCategoryList = document.querySelector(
    ".tasks-category-section__list"
  );
  for (let i = 0; i < categoryList.length; i++) {
    const catListItem = document.createElement("li");
    catListItem.classList.add("tasks-category-section__single-task-category");
    catListItem.textContent = categoryList[i];
    // kreiranje delete btn za pojedinu kategoriju
    // <i class="material-icons">clear</i>
    const deleteCategory = document.createElement("i");
    deleteCategory.classList.add(
      "material-icons",
      "tasks-category-section__delete-btn"
    );
    deleteCategory.textContent = "clear";
    // dodavanje delete btn li itemu
    catListItem.appendChild(deleteCategory);
    DOMnavCategoryList.lastElementChild.before(catListItem);
  }
}
categoryListRenderer();

// Funkcija za toggle class lista kategorije
function showAddCategoryWindow() {
  // činim vidljivim polje unosa nove kategorije
  const createCatSection = document.querySelector(
    ".create-new-category-section"
  );
  createCatSection.classList.toggle("open-close-form");
  // dodajem ili mičem blur main-containeru
  document.querySelector(".main-container").classList.toggle("blur-effect");
}

// Event listener za otvaranje prozora za dodavanje nove kategorije
document
  .querySelector(".tasks-category-section__add-task")
  .addEventListener("click", showAddCategoryWindow);

// Event Listener za Create Btn unutar prozora za dodavanje nove kategorije
document
  .querySelector(".create-new-category-form__create-btn")
  .addEventListener("click", function (e) {
    // Uzimam input iz input polja
    const catInput = document
      .querySelector(".create-new-category-form__description")
      .value.toLowerCase();

    // Provjera postoji li kategorija s istim imenom
    let alreadyExist = false; // moram status varijablu koristiti
    for (const cat of categoryList) {
      if (catInput === cat) {
        alreadyExist = true; // minja status varijablu u true ako nađe isto ime
        alert(
          "There is already a category with the same name! Change the category name."
        );
        break;
      }
    }
    // Ako ne nađe isto ime gura
    if (!alreadyExist) {
      // guram ga u listu kategorija
      categoryList.push(catInput);
      // updejtam LS
      localStorage.setItem("cat list", JSON.stringify(categoryList));
      categoryListUpdate();

      // Dodam novu kategoriju listi kategorija
      function addNewCategory() {
        const DOMnavCategoryList = document.querySelector(
          ".tasks-category-section__list"
        );
        const catListItem = document.createElement("li");
        catListItem.classList.add(
          "tasks-category-section__single-task-category"
        );
        catListItem.textContent = categoryList[i];
        DOMnavCategoryList.lastElementChild.before(catListItem);
      }
      addNewCategory();
    }

    // brišem text iz inputa da bude prazan prilikom novog otvaranja prozora
    document.querySelector(".create-new-category-form__description").value = "";

    // Zatvaram prozor za kreiranje nove kategorije
    showAddCategoryWindow();
    e.preventDefault();
  });

// Event Listener za Cancel Btn unutar prozora za dodavanje nove kategorije
document
  .querySelector(".create-new-category-form__cancel-btn")
  .addEventListener("click", (e) => {
    const section = document.querySelector(".create-new-category-section");
    section.classList.toggle("open-close-form");
    // dodajem ili mičem blur main-containeru
    document.querySelector(".main-container").classList.toggle("blur-effect");
    e.preventDefault();
  });

// Event Listener za brisanje pojedine kategorije iz liste kategorija
document
  .querySelector(".tasks-category-section__list")
  .addEventListener("click", function (e) {
    if (
      e.target.parentElement.classList.contains(
        "tasks-category-section__single-task-category"
      )
    ) {
      const selectedCategoryForDeletion = e.target.parentElement.textContent.slice(
        0,
        e.target.parentElement.textContent.length - 5
      );

      // Provjeravanje postoji li task unutar odabrane kategorije
      let del = true;
      for (const task of all) {
        if (task.category === selectedCategoryForDeletion) {
          alert(
            "There are some tasks in the chosen category! First delete all tasks from the chosen category, either finished or unfinished."
          );
          del = false;
          break; // da se iteracija zaustavi čim naiđe na uzorak. Inače ako imam više zadataka vidim više alert poruka
        }
      }
      // Iteracija po listi kategorija
      for (let i = 0; i < categoryList.length; i++) {
        if (categoryList[i] === selectedCategoryForDeletion && del) {
          categoryList.splice(i, 1);
          localStorage.setItem("cat list", JSON.stringify(categoryList));
          e.target.parentElement.remove();
        }
      }
    }
    categoryOptionRenderer(); // bez ovoga se opcije prije reloda ne updejtaju + dodatak u samoj funkciji
  });

// Funkcija za prikazivanje taskova
function allTasksRender() {
  // Dobavljamo ul element
  const tasksList = document.querySelector(".tasks-list");
  // Ako u LS-u ne postoji key all tasks onda će all biti ovo doli
  // Ako postoji onda all preuzima podatke iz LS-a.
  if (localStorage.getItem("all tasks") === null) {
    all = [
      {
        description: "Create a task",
        category: "other",
        priority: "top-priority",
        status: false,
        changeStatusBtn: "finish",
      },
    ];
  } else {
    all = JSON.parse(localStorage.getItem("all tasks"));
  }
  // Prikazuje task
  for (let i = 0; i < all.length; i++) {
    if (all[i].status === appStatus && currentCategory === "all") {
      tasksList.insertAdjacentHTML(
        "beforeend",
        `<li class="single-task">
        <p class="single-task__description">${all[i].description}</p>
        <span class="single-task__priority ${all[i].priority}">${all[i].priority}</span>
        <button class="single-task__fin-unfin-btn">${all[i].changeStatusBtn}</button>
        <button class="single-task__delete-btn"><i class="material-icons">clear</i></button>
    </li>`
      );
    } else if (
      all[i].status === appStatus &&
      all[i].category === currentCategory
    ) {
      tasksList.insertAdjacentHTML(
        "beforeend",
        `<li class="single-task">
        <p class="single-task__description">${all[i].description}</p>
        <span class="single-task__priority ${all[i].priority}">${all[i].priority}</span>
        <button class="single-task__fin-unfin-btn">${all[i].changeStatusBtn}</button>
        <button class="single-task__delete-btn"><i class="material-icons">clear</i></button>
    </li>`
      );
    }
  }
}
allTasksRender();

// Ovo je za prikazivanje postojećih kategorija u opcijama
function categoryOptionRenderer() {
  const categoryListVar = document.querySelector(".category-selection");
  categoryListVar.textContent = ""; // bez ovoga se opcije prije reloda ne updejtaju + u EL za brisanje
  for (let i = 0; i < categoryList.length; i++) {
    categoryListVar.insertAdjacentHTML(
      "beforeend",
      `<option class='create-new-task-form__select-option catregory-selection-option'>
        ${categoryList[i].replace(
          categoryList[i][0],
          categoryList[i][0].toUpperCase()
        )}</option>`
    );
  }
}
categoryOptionRenderer();

// Event Listener za kreiranje novog taska
const createTask = document.querySelector(".create-new-task-form__create-btn");
createTask.addEventListener("click", function (e) {
  const category = document
    .querySelector(".category-selection")
    .value.toLowerCase();
  const priority = document
    .querySelector(".priority-selection")
    .value.toLowerCase();
  const description = document.querySelector(
    ".create-new-task-form__description"
  ).value;
  const tasksList = document.querySelector(".tasks-list");

  const newTask = {
    description: description,
    category: category,
    priority: priority,
    status: false,
    changeStatusBtn: "finish",
  };

  all.push(newTask);
  // Local storage for all
  localStorage.setItem("all tasks", JSON.stringify(all));

  tasksList.insertAdjacentHTML(
    "beforeend",
    `<li class="single-task">
        <p class="single-task__description">${newTask.description}</p>
        <span class="single-task__priority ${newTask.priority}">${newTask.priority}</span>
        <button class="single-task__fin-unfin-btn">${newTask.changeStatusBtn}</button>
        <button class="single-task__delete-btn"><i class="material-icons">clear</i></button>
    </li>`
  );

  const section = document.querySelector(".create-new-task-form-section");
  section.classList.toggle("open-close-form");
  document.querySelector(".main-container").classList.toggle("blur-effect");
  document.querySelector(".create-new-task-form__description").value = "";

  e.preventDefault();
});

// Event Listener za donji botun
const crateNewTaskBtn = document.querySelector(
  ".create-new-task-btn-section__create-btn"
);
crateNewTaskBtn.addEventListener("click", () => {
  const section = document.querySelector(".create-new-task-form-section");
  section.classList.toggle("open-close-form");
  // dodajem ili mičem blur main-containeru
  document.querySelector(".main-container").classList.toggle("blur-effect");
});

// Event Listener za header botun
const createNewTaskTitleBtn = document.querySelector(
  ".header-section__create-btn"
);
createNewTaskTitleBtn.addEventListener("click", () => {
  const section = document.querySelector(".create-new-task-form-section");
  section.classList.toggle("open-close-form");
  // dodajem ili mičem blur main-containeru
  document.querySelector(".main-container").classList.toggle("blur-effect");
});

// Event listener za cancle, da se zatvori
const cancleNewTaskBtn = document.querySelector(
  ".create-new-task-form__cancel-btn"
);
cancleNewTaskBtn.addEventListener("click", (e) => {
  const section = document.querySelector(".create-new-task-form-section");
  section.classList.toggle("open-close-form");
  // dodajem ili mičem blur main-containeru
  document.querySelector(".main-container").classList.toggle("blur-effect");
  e.preventDefault();
});

// Event listener za x, da se zatvori
const cancleNewTaskX = document.querySelector(".close-x");
cancleNewTaskX.addEventListener("click", (e) => {
  const section = document.querySelector(".create-new-task-form-section");
  section.classList.toggle("open-close-form");
  // dodajem ili mičem blur main-containeru
  document.querySelector(".main-container").classList.toggle("blur-effect");
  e.preventDefault();
});

// Brisanje taska kad kliknem x na njemu
const taskParent = document.querySelector(".tasks-list");
taskParent.addEventListener("click", (e) => {
  if (e.target.parentElement.parentElement.classList.contains("single-task")) {
    const tekst =
      e.target.parentElement.parentElement.firstElementChild.textContent;
    for (let i = 0; i < all.length; i++) {
      if (all[i].description === tekst) {
        all.splice(i, 1);
        localStorage.setItem("all tasks", JSON.stringify(all));
      }
    }
    e.target.parentElement.parentElement.remove();
  }
});

// Event listener za finish botun
// Mora sam stavit EL na parent element inače novi kreirani task nema EL
document.querySelector(".tasks-list").addEventListener("click", function (e) {
  if (e.target.classList.contains("single-task__fin-unfin-btn")) {
    if (e.target.textContent === "finish") {
      for (const task of all) {
        if (
          e.target.parentElement.firstElementChild.textContent ===
          task.description
        ) {
          task.status = true;
          task.changeStatusBtn = "unfinish";
          // Moram i updejtat LS za novo relodanje stranice
          localStorage.setItem("all tasks", JSON.stringify(all));
          e.target.parentElement.parentElement.textContent = "";
          allTasksRender();
        }
      }
    } else {
      for (const task of all) {
        if (
          e.target.parentElement.firstElementChild.textContent ===
          task.description
        ) {
          task.status = false;
          task.changeStatusBtn = "finish";
          // Moram i updejtat LS za novo relodanje stranice
          localStorage.setItem("all tasks", JSON.stringify(all));
          e.target.parentElement.parentElement.textContent = "";
        }
      }
    }
  }
  e.preventDefault();
});

// Event Listener za prikazivanje taskova po kategorijama
document
  .querySelector(".tasks-category-section__list")
  .addEventListener("click", function (e) {
    if (
      e.target.classList.contains(
        "tasks-category-section__single-task-category"
      )
    ) {
      currentCategory = e.target.textContent.slice(
        0,
        e.target.textContent.length - 5
      );
      document.querySelector(".tasks-list").textContent = "";
      allTasksRender();
    }
  });

// Posebni EL za all kategoriju
document
  .querySelector(".tasks-category-section__all-task-category")
  .addEventListener("click", function (e) {
    currentCategory = e.target.textContent.toLowerCase().trim();
    document.querySelector(".tasks-list").textContent = "";
    allTasksRender();
  });

// Event Listener za unfinished botun za prikazivanje unfinished zadataka
document
  .querySelector(".unfinished-btn")
  .addEventListener("click", function (e) {
    appStatus = false;
    e.preventDefault();
    document.querySelector(".tasks-list").textContent = "";
    allTasksRender();
    document.querySelector(".unfinished-btn").classList.add("selected-btn");
    document.querySelector(".finished-btn").classList.remove("selected-btn");
  });

// Event Listener za finished botun za prikazivanje završenih zadataka
document.querySelector(".finished-btn").addEventListener("click", function (e) {
  appStatus = true;
  e.preventDefault();
  document.querySelector(".tasks-list").textContent = "";
  allTasksRender();
  document.querySelector(".unfinished-btn").classList.remove("selected-btn");
  document.querySelector(".finished-btn").classList.add("selected-btn");
});

// Event Listener za mjenjanje CSS-a odabranoj kategoriji
const listaKategorija = document.querySelector(".tasks-category-section__list")
  .children;
document
  .querySelector(".tasks-category-section__list")
  .addEventListener("click", function (e) {
    if (
      e.target.classList.contains(
        "tasks-category-section__single-task-category"
      )
    ) {
      for (const li of listaKategorija) {
        li.classList.remove("selected-category");
        e.target.classList.add("selected-category");
      }
    }
  });

// Mora posebno za all kategoriju
document
  .querySelector(".tasks-category-section__list")
  .addEventListener("click", function (e) {
    if (
      e.target.classList.contains("tasks-category-section__all-task-category")
    ) {
      for (const li of listaKategorija) {
        li.classList.remove("selected-category");
        e.target.classList.add("selected-category");
      }
    }
  });
