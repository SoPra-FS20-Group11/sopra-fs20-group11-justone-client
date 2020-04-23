/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.score = null;
    this.gamesPlayed = null;
    Object.assign(this, data);
  }
}
export default User;
