class Game {
    constructor(data = {}) {
      this.id = null;
      this.token = null;
      this.status = null;
      this.normalMode = null;
      this.score = null;
      this.round = null;
      this.currentUserId = null;
      Object.assign(this, data);
    }
  }
  export default Game;
  