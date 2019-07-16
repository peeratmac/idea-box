var ideaArray = [];
var titleInput = document.querySelector('.section__form__input-title');
var bodyInput = document.querySelector('.section__form__input-body');
var saveButton = document.querySelector('.section__form__div__button');
var main = document.querySelector('.main');

// Functions on page load
promptIdea();

saveButton.addEventListener('click', saveHandler);
main.addEventListener('click', mainHandler);
titleInput.addEventListener('keyup', enableSaveButton);
bodyInput.addEventListener('keyup', enableSaveButton);

function saveHandler(event) {
  event.preventDefault();
  // debugger;
  newIdea();
  promptIdea();
  clearInput(titleInput);
  clearInput(bodyInput);
}

function mainHandler() {
  
}

function newIdea() {
  var idea = new Idea(Date.now(), titleInput.value, bodyInput.value);
  ideaArray.push(idea);
  console.log(ideaArray);
  appendCard(idea);
}

function appendCard(idea) {
  main.insertAdjacentHTML('afterbegin', `<container class="main__container" data-id="${idea.id}">
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
  <h3 class="main__container__h3">${idea.title}</h3>
  <p class="main__container__p">${idea.body}</p>
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
</container>`)
}

function promptIdea() {
  if(ideaArray.length === 0) {
    main.insertAdjacentHTML('afterbegin', `<p class= main__p-idea-prompt>Give Ideas!</p>`)
  } else if(ideaArray.length > 1){
    return
  } else {
    var prompt = document.querySelector('.main__p-idea-prompt');
    prompt.remove();
  }
}

function enableSaveButton() {
  if(titleInput.value !== '' && bodyInput.value !== '') {
    saveButton.disabled = false;
  }
}

function clearInput(input) {
  input.value = '';
}