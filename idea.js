class Idea {
  constructor(id, title, body, star, quality) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.star = star || false;
    this.quality = quality || 1;
  }

  saveToStorage(ideaArray) {
    localStorage.setItem('ideaObj', JSON.stringify(ideaArray));
  }

  deleteFromStorage(cardIndex) {
    ideaArray.splice(cardIndex, 1);
    this.saveToStorage(ideaArray);
  }

  updateIdea(ideaArray) {
    localStorage.setItem('ideaObj', JSON.stringify(ideaArray));
  }

  updateQuality(ideaArray) {
    localStorage.setItem('ideaObj', JSON.stringify(ideaArray));
  }
}
