var ideaArray = JSON.parse(localStorage.getItem("ideaObj")) || [];
var titleInput = document.querySelector('.section__form__input-title');
var bodyInput = document.querySelector('.section__form__input-body');
var saveButton = document.querySelector('.section__form__div__button');
var main = document.querySelector('.main');

// Functions on page load
promptIdea();
reassignClass();
persist();
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

function mainHandler(event) {
  findIndex(event);
  deleteCard(event);
}

function newIdea() {
  var idea = new Idea(Date.now(), titleInput.value, bodyInput.value);
  ideaArray.push(idea);
  idea.saveToStorage(ideaArray);
  console.log(ideaArray);
  appendCard(idea);
}

function remakeNewIdea(id, title, body, star, quality){
  var idea = new Idea(id, title, body, star, quality);
  ideaArray.push(idea);
  ideaArray.shift();

}

function reassignClass(){
  ideaArray.filter(function(property){
    var id =  property.id;
    var title = property.title;
    var body = property.body;
    var star = property.star;
    var quality = property.quality;
    remakeNewIdea(id, title, body, star, quality);
  })
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

function findID(event) {
   return parseInt(event.target.closest('.main__container').dataset.id)
}

function findIndex(event){
  var id = findID(event);
  for (var i=0; i<ideaArray.length; i++){
      if (id === ideaArray[i].id){
        return parseInt(i)
      }
  }
}

function deleteCard(event){
  var cardIndex = findIndex(event)
  if (event.target.closest('.main__container__header__img-delete')){
    event.target.closest('.main__container').remove();
    ideaArray[cardIndex].deleteFromStorage(cardIndex);
  }
}


function persist(){

  ideaArray.map(anIdea => appendCard(anIdea));


}


