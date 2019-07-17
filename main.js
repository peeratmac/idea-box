var ideaArray = JSON.parse(localStorage.getItem('ideaObj')) || [];
var titleInput = document.querySelector('.section__form__input-title');
var bodyInput = document.querySelector('.section__form__input-body');
var saveButton = document.querySelector('.section__form__div__button');
var main = document.querySelector('.main');

// Functions on page load
promptIdea();
reassignClass();
spliceOnLoad();
persist();

// Event Listeners
saveButton.addEventListener('click', saveHandler);
main.addEventListener('click', mainHandler);
main.addEventListener('keyup', function() {
  editCard('.main__container__p', event);
});
titleInput.addEventListener('keyup', enableSaveButton);
bodyInput.addEventListener('keyup', enableSaveButton);

function saveHandler(event) {
  event.preventDefault();
  newIdea();
  promptIdea();
  clearInput(titleInput);
  clearInput(bodyInput);
}

function mainHandler(event) {
  findIndex(event);
  deleteCard(event);
  editCard('.main__container__h3', event);
  editCard('.main__container__p', event);
}

function newIdea() {
  var idea = new Idea(Date.now(), titleInput.value, bodyInput.value);
  ideaArray.push(idea);
  idea.saveToStorage(ideaArray);
  console.log(ideaArray);
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
  main.insertAdjacentHTML(
    'afterbegin',
    `<container class="main__container" data-id="${idea.id}">
  <header class="main__container__header">
    <img
      class="main__container__header__img-starred"
      src="images/star.svg"
      alt="starred"
    />
    <img
      class="main__container__header__img-delete"
      src="images/delete.svg"
      alt="delete button"
    />
  </header>
  <h3 class="main__container__h3" contenteditable="true">${idea.title}</h3>
  <p class="main__container__p" contenteditable="true">${idea.body}</p>
  <footer class="main__container__footer">
    <img
      class="main__container__footer__img-upvote"
      src="images/upvote.svg"
      alt="increase quality"
    />
    <p class="main__container__footer__p">Quality: Swill</p>
    <img
      class="main__container__footer__img-downvote"
      src="images/downvote.svg"
      alt="decrease quality"
    />
  </footer>
</container>`
  );
}

function promptIdea() {
  if (ideaArray.length === 0) {
    main.insertAdjacentHTML(
      'afterbegin',
      `<p class= main__p-idea-prompt>Give Ideas!</p>`
    );
  } else if (ideaArray.length > 1) {
    return;
  } else {
    var prompt = document.querySelector('.main__p-idea-prompt');
    prompt.remove();
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

function findID(event) {
  return parseInt(event.target.closest('.main__container').dataset.id);
}

function findIndex(event) {
  var id = findID(event);
  for (var i = 0; i < ideaArray.length; i++) {
    if (id === ideaArray[i].id) {
      return parseInt(i);
    }
  }
}

function deleteCard(event) {
  var cardIndex = findIndex(event);
  if (event.target.closest('.main__container__header__img-delete')) {
    event.target.closest('.main__container').remove();
    ideaArray[cardIndex].deleteFromStorage(cardIndex);
  }
}

function editCard(classX, event) {
  var cardIndex = findIndex(event);
  if (event.target.closest(classX)) {
    event.target.closest(classX).contentEditable = true;
    var bodyText = document.querySelector(classX);
    ideaArray[cardIndex].body = bodyText.innerText;
  }
}

function persist() {
  ideaArray.map(anIdea => appendCard(anIdea));
}
