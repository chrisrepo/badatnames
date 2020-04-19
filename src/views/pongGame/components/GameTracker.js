export class GameTracker extends Object {
  constructor(playerList) {
    super();
    this.roundEnded = false;
    //TODO When players are passed in
    //this.setupScoreObject(playerList);
  }

  setupScoreObject(playerList) {
    this.score = {};
    playerList.forEach((player) => {
      this.score[player] = 0;
    });
  }

  setRoundEnded(ended) {
    this.roundEnded = ended;
  }
}
