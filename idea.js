class Idea {
  constructor(id, title, body, star, quality) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.star = star || false;
    this.quality = quality || 0;
  }

  saveToStorage(ideaArray){
      localStorage.setItem("ideaObj", JSON.stringify(ideaArray));
  }

  deleteFromStorage(cardIndex){
    console.log('we deleted the thing we wanted')
    ideaArray.splice(cardIndex, 1);
    this.saveToStorage(ideaArray);
  }

  // updateIDea(){

  // }

  // updateQuality(){

  // }
}

