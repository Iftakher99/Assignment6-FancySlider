const main = document.querySelector(".main");
const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const searchForm = document.getElementById("search-form");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");
const loading = document.getElementById("loading");
const emptyBox = document.getElementById("front-img");
const notFound = document.getElementById("unavailable");
// selected image
let sliders = [];

// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  // hide loading
  toggleItemVisibility(loading.classList, false);

  imagesArea.style.display = "block";
  // show gallery title
  galleryHeader.style.display = "flex";
  images.forEach((image) => {
    let div = document.createElement("div");
    div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  });
};

const getImages = (query) => {
  fetch(
    `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (!data.hits.length) {
        toggleItemVisibility(loading.classList, false);
        toggleItemVisibility(notFound.classList, true);
        return;
      }
      showImages(data.hits);
    })
    .catch((err) => console.log(err));
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
    element.classList.add("added");
  } else {
    sliders.splice(item, 1);
    element.classList.remove("added");
  }
};

//   adding and removing images
const goBack = () => {
  main.style.display = "none";
  imagesArea.style.display = "block";
  // clear previous interval
  clearInterval(timer);
};

var timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    return;
  }
  // create slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  main.style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";
  // turn negative duration to positive
  const validDuration = Math.abs(document.getElementById("duration").value);
  const duration = validDuration || 1000;

  sliders.forEach((slide) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  });
  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
  //  adding or removing images button.
  let goBackButton = `<button id="backButton" onclick="goBack()" class="btn btn-primary mb-4">Add or Remove Image</button>`;
  sliderContainer.insertAdjacentHTML("afterbegin", goBackButton);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  items[index].style.display = "block";
};
let submitForm = (event) => {
  event.preventDefault();
  gallery.innerHTML = "";
  toggleItemVisibility(emptyBox.classList, false);
  toggleItemVisibility(notFound.classList, false);
  main.style.display = "none";
  toggleItemVisibility(loading.classList, true);
  main.style.display = "none";
  clearInterval(timer);
  const search = document.getElementById("search");
  getImages(search.value);
  sliders.length = 0;
};
sliderBtn.addEventListener("click", function () {
  createSlider();
});
let toggleItemVisibility = (item, visibility) => {
  let loadingClassList = item;
  let addClass = (className) => loadingClassList.add(className);
  let removeClass = (className) => loadingClassList.remove(className);
  if (visibility) {
    removeClass("d-none");
    addClass("d-flex");
  } else {
    removeClass("d-flex");
    addClass("d-none");
  }
};
