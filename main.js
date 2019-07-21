var ideaArray = JSON.parse(localStorage.getItem('ideaObj')) || [];
var qualities = ['Swill', 'Plausible', 'Genius'];
var titleInput = document.querySelector('.section__form__input-title');
var bodyInput = document.querySelector('.section__form__input-body');
var saveButton = document.querySelector('.section__form__div__button');
var searchIdeas = document.querySelector('.section__form__div__input-search');
var emptyIdea = document.querySelector('.idea-empty');
var main = document.querySelector('.main');

// Functions on page load
reassignClass();
spliceOnLoad();
persist();
promptIdea();

// Event Listeners
saveButton.addEventListener('click', saveHandler);
searchIdeas.addEventListener('keyup', searchFilter);
main.addEventListener('click', mainHandler);
main.addEventListener('keydown', function(event) {
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
});
titleInput.addEventListener('keyup', enableSaveButton);
bodyInput.addEventListener('keyup', enableSaveButton);

function saveHandler(event) {
  event.preventDefault();
  newIdea();
  clearInput(titleInput);
  clearInput(bodyInput);
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
}

function newIdea() {
  var idea = new Idea(Date.now(), titleInput.value, bodyInput.value);
  ideaArray.push(idea);
  idea.saveToStorage(ideaArray);
  appendCard(idea);
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

function searchFilter(event) {
  var searchBox = event.target
    .closest('.section__form__div__input-search')
    .value.toLowerCase();
  var results = ideaArray.filter(function(word) {
    return (
      word.title.toLowerCase().includes(searchBox) ||
      word.body.toLowerCase().includes(searchBox)
    );
  });
  main.innerHTML = '';
  results.map(function(word) {
    appendCard(word);
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
  ideaArray.map(anIdea => appendCard(anIdea));
}
