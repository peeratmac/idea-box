// Global Variables
var ideaArray = JSON.parse(localStorage.getItem('ideaObj')) || [];
var qualities = ['Swill', 'Plausible', 'Genius'];
var qualitySearch = 0;
var starSearch = 0;

// Query Selectors
var titleInput = document.querySelector('.section__form__input-title');
var bodyInput = document.querySelector('.section__form__input-body');
var saveButton = document.querySelector('.section__form__div__button');
var searchIdeas = document.querySelector('.section__form__div__input-search');
var emptyIdea = document.querySelector('.idea-empty');
var main = document.querySelector('.main');
var asideDiv = document.querySelector('.aside__div');
// var swill = document.querySelector('#swill');
// var plausible = document.querySelector('#plausible');
// var genius = document.querySelector('#genius');
var searchBox = document.querySelector('.section__form__div__input-search');
var starredIdeasButton = document.querySelector('#starred-ideas');
var burgerMenu = document.querySelector('.burger-menu');
var burgerClose = document.querySelector('.burger-menu-close');
var burgerContent = document.querySelector('.burger__p');
var burgerBurger = document.querySelector('.burger-burger');
var showMoreLess = document.querySelector('.show-more-less');

// Functions on page load
reassignClass();
spliceOnLoad();
persist();
promptIdea();
setupBurgerMenu();

// Event Listeners
saveButton.addEventListener('click', saveHandler);
searchIdeas.addEventListener('keyup', function() {
  searchFilter();
  // searchFilter(qualityArray); -- what does this do? why are we using qualityArray as an argument in searchFilter?
});
showMoreLess.addEventListener('click', toggleShow);
titleInput.addEventListener('keyup', enableSaveButton);
bodyInput.addEventListener('keyup', enableSaveButton);
main.addEventListener('click', mainHandler);
main.addEventListener('keydown', enterEvent);
asideDiv.addEventListener('click', updateQualitySearch)
// swill.addEventListener('click', swillHandler);
// plausible.addEventListener('click', plausibleHandler);
// genius.addEventListener('click', geniusHandler);
starredIdeasButton.addEventListener('click', starHandler);
burgerMenu.addEventListener('click', toggleBurger);
burgerClose.addEventListener('click', toggleBurger);

function saveHandler(event) {
  event.preventDefault();
  newIdea();
  clearInput(titleInput);
  clearInput(bodyInput);
  promptIdea();
  saveButton.disabled = true;
}

function mainHandler(event) {
  findIndex(event);
  deleteCard(event);
  editCardTitle('.main__container__h3', event);
  editCardP('.main__container__p', event);
  starIt(event);
  upvote(event);
  downvote(event);
  enterEvent(event);
  promptIdea();
}

function toggleShow() {
  show();
}

function enterEvent(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if (event.target.closest('.main__container__h3')) {
      event.target.closest('.main__container__h3').blur();
    } else if (event.target.closest('.main__container__p')) {
      event.target.closest('.main__container__p').blur();
    }
  }
  editCardTitle('.main__container__h3', event);
  editCardP('.main__container__p', event);
}

function updateQualitySearch(event) {
  if (event.target.closest('#swill')){
    qualitySearch = 1;
    swillHandler(event);
    searchFilter();
  } else if (event.target.closest('#plausible')) {
    qualitySearch = 2;
    plausibleHandler(event);
    searchFilter();
  } else if (event.target.closest('#genius')) {
    qualitySearch = 3;
    geniusHandler(event);
    searchFilter();
  }
}

function swillHandler(event) {
  // console.log(event)
  if (event.target.closest('.active-button')) {
    event.target.classList.remove('active-button');
    qualitySearch = 0;
  } else {
    event.target.classList.add('active-button');
    event.target.nextElementSibling.classList.remove('active-button');
    event.target.nextElementSibling.nextElementSibling.classList.remove('active-button');
  }
}

function plausibleHandler(event) {
  if (event.target.closest('.active-button')) {
      event.target.classList.remove('active-button');
      qualitySearch = 0;
  } else {
    event.target.classList.add('active-button');
    event.target.previousElementSibling.classList.remove('active-button');
    event.target.nextElementSibling.classList.remove('active-button');
  }
}

function geniusHandler(event) {
  if (event.target.closest('.active-button')) {
    event.target.classList.remove('active-button');
    qualitySearch = 0;
  } else {
    event.target.classList.add('active-button');
    event.target.previousElementSibling.classList.remove('active-button');
    event.target.previousElementSibling.previousElementSibling.classList.remove('active-button');
  }
}

function starHandler() {
  toggleStarText();
  searchFilter();
  // searchBox.value = '';
  // starredCards();
}

function newIdea() {
  var idea = new Idea(Date.now(), titleInput.value, bodyInput.value);
  ideaArray.push(idea);
  idea.saveToStorage(ideaArray);
  // appendCard(idea);
  // persist();
}

function remakeNewIdea(id, title, body, star, quality) {
  var idea = new Idea(id, title, body, star, quality);
  ideaArray.push(idea);
}

function spliceOnLoad() {
  ideaArray.splice(0, ideaArray.length / 2);
}

function reassignClass() {
  ideaArray.forEach(function(property) {
    var id = property.id;
    var title = property.title;
    var body = property.body;
    var star = property.star;
    var quality = property.quality;
    remakeNewIdea(id, title, body, star, quality);
  });
}

function appendCard(idea) {
  var s = idea.star ? 'images/star-active.svg' : 'images/star.svg';

  main.insertAdjacentHTML(
    'afterbegin',
    `<container class="main__container" data-id="${idea.id}">
  <header class="main__container__header">
    <img
      class="main__container__header__img-starred"
      src="${s}"
      alt="starred"
    />
    <img
      class="main__container__header__img-delete"
      src="images/delete.svg"
      alt="delete button"
    />
  </header>
  <h3 class="main__container__h3" id="main__container__h3" contenteditable="true">${
    idea.title
  }</h3>
  <p class="main__container__p" id="main__container__p" contenteditable="true">${
    idea.body
  }</p>
  <footer class="main__container__footer">
    <img
      class="main__container__footer__img-upvote"
      src="images/upvote.svg"
      alt="increase quality"
    />
    <p class="main__container__footer__p">Quality: ${
      qualities[idea.quality - 1]
    }</p>
    <img
      class="main__container__footer__img-downvote"
      src="images/downvote.svg"
      alt="decrease quality"
    />
  </footer>
</container>`
  );
  promptIdea();
}

function promptIdea() {
  if (ideaArray.length > 0) {
    emptyIdea.classList.add('hidden');
  } else {
    emptyIdea.classList.remove('hidden');
  }
}

function enableSaveButton() {
  if (titleInput.value !== '' && bodyInput.value !== '') {
    saveButton.disabled = false;
  }
}

function clearInput(input) {
  input.value = '';
}

function searchFilter() {
  var search = searchBox.value.toLowerCase();
  var results = ideaArray.filter(function(cardObj) {
    return ( (cardObj.title.toLowerCase().includes(search) || cardObj.body.toLowerCase().includes(search)) && 
      (qualitySearch === 0 || cardObj.quality === qualitySearch) && 
      (cardObj.star === starSearch || starSearch === 0 ) );
  });
  main.innerHTML = '';
  results.map(function(cardObj) {
    appendCard(cardObj);
  });
}

function findID(event) {
  var container = event.target.closest('.main__container');
  if (ideaArray.length > 0 && container) {
    return parseInt(event.target.closest('.main__container').dataset.id);
  }
}

function findIndex(event) {
  var id = findID(event);
  for (var i = 0; i < ideaArray.length; i++) {
    if (id === ideaArray[i].id) {
      return parseInt(i);
    }
  }
}

function starIt(event) {
  var cardIndex = findIndex(event);
  var targetStar = event.target.closest(
    '.main__container__header__img-starred'
  );
  var notStarred = 'images/star.svg';
  var starred = 'images/star-active.svg';

  if (event.target == targetStar) {
    if (ideaArray[cardIndex].star == false) {
      targetStar.src = starred;
      ideaArray[cardIndex].star = true;
      ideaArray[cardIndex].updateIdea(ideaArray);
    } else {
      targetStar.src = notStarred;
      ideaArray[cardIndex].star = false;
      ideaArray[cardIndex].updateIdea(ideaArray);
    }
  }
}

function upvote(event) {
  var cardIndex = findIndex(event);
  var upvote = event.target.closest('.main__container__footer__img-upvote');

  if (event.target == upvote) {
    if (upvote) {
      if (ideaArray[cardIndex].quality >= qualities.length) {
        return;
      } else {
        ideaArray[cardIndex].quality += 1;
        ideaArray[cardIndex].updateQuality(ideaArray);
        qualityTextChange(ideaArray[cardIndex].quality, event);
      }
    }
  }
}

function downvote(event) {
  var cardIndex = findIndex(event);
  var downvote = event.target.closest('.main__container__footer__img-downvote');

  if (event.target == downvote) {
    if (downvote) {
      if (ideaArray[cardIndex].quality <= 1) {
        return;
      } else {
        ideaArray[cardIndex].quality -= 1;
        ideaArray[cardIndex].updateQuality(ideaArray);
        qualityTextChange(ideaArray[cardIndex].quality, event);
      }
    }
  }
}

function deleteCard(event) {
  var cardIndex = findIndex(event);
  if (event.target.closest('.main__container__header__img-delete')) {
    event.target.closest('.main__container').remove();
    ideaArray[cardIndex].deleteFromStorage(cardIndex);
  }
  promptIdea();
}

function editCardTitle(classX, event) {
  var cardIndex = findIndex(event);
  if (event.target.closest(classX)) {
    ideaArray[cardIndex].title = event.target.innerText;
    ideaArray[cardIndex].updateIdea(ideaArray);
  }
}

function editCardP(classY, event) {
  var cardIndex = findIndex(event);
  if (event.target.closest(classY)) {
    ideaArray[cardIndex].body = event.target.innerText;
    ideaArray[cardIndex].updateIdea(ideaArray);
  }
}

function qualityTextChange(quality, event) {
  var q = event.target;
  if (q) {
    event.target.parentNode.children[1].innerText = `Quality: ${
      qualities[quality - 1]
    }`;
  } else {
    return;
  }
}

function persist() {
  main.innerHTML = '';
  var tempArray = []
  for(var i = 0; i < ideaArray.length; i++) {
    tempArray.push(ideaArray[i]);
    if(tempArray.length > 10) {
      tempArray.shift()
    }
  }
  tempArray.map(anIdea => appendCard(anIdea));
}

function newIdea() {
  var idea = new Idea(Date.now(), titleInput.value, bodyInput.value);
  ideaArray.push(idea);
  idea.saveToStorage(ideaArray);
  if(ideaArray.length < 10) {
  appendCard(idea);
} else {
  persist();
  }
}

function filter(qualities) {
  main.innerHTML = '';
  qualityArray = ideaArray.filter(idea => idea.quality === qualities);
  qualityArray.map(filteredIdeas => appendCard(filteredIdeas));
  starredIdeasButton.innerHTML = 'View All Ideas';
}

// function starredCards() {
//   main.innerHTML = '';
//   starArray = ideaArray.filter(idea => idea.star === true);
//   starArray.map(starred => appendCard(starred));
// }

function toggleStarText() {
  if (starredIdeasButton.innerHTML == 'Show Starred Ideas') {
    starredIdeasButton.innerHTML = 'View All Ideas';
    starSearch = true;
  } else {
    starredIdeasButton.innerHTML = 'Show Starred Ideas';
    starSearch = 0;
    // persist();
  }
}

function toggleBurger(event) {
  if (event.target === burgerMenu) {
    toggleOn();
  }
  if (event.target === burgerClose) {
    toggleOff();
  }
}

function toggleOn() {
  burgerMenu.classList.add('hidden');
  burgerClose.classList.remove('hidden');
  burgerContent.classList.remove('hidden');
  main.classList.add('main-color');
}

function toggleOff() {
  burgerClose.classList.add('hidden');
  burgerMenu.classList.remove('hidden');
  burgerContent.classList.add('hidden');
  main.classList.remove('main-color');
}

function setupBurgerMenu() {
  burgerContent.insertAdjacentHTML(
    'afterbegin',
    `<h2 class="aside__h2">Filter Starred Ideas</h2>
    <button id="starred-ideas" class="aside__button aside__button-large">
      Show Starred Ideas
    </button>
    <div class="aside__div">
      <h2 class="aside__h2">Filter by Quality</h2>
      <button id="swill" class="aside__button aside__button-quality">
        Swill
      </button>
      <button id="plausible" class="aside__button aside__button-quality">
        Plausible
      </button>
      <button id="genius" class="aside__button aside__button-quality">
        Genius
      </button>
      <h2 class="aside__h2">New Quality</h2>
      <input class="aside__input" type="text" />
      <button type="submit" class="aside__button aside__button-large">
        Add New Quality
      </button>
    </div>`
  );

  toggleOff();
}

function show() {
  if(showMoreLess.innerText === 'Show More') {
    console.log('show more hellooooooo')
  main.innerHTML = '';
  ideaArray.map(anIdea => appendCard(anIdea));
  showMoreLess.innerHTML = 'Show Less';
  } else if (showMoreLess.innerText === 'Show Less') {
    console.log('show les hiiiiiiii')
    main.innerHTML = '';
    persist();
    showMoreLess.innerHTML = 'Show More';
  }
}