class Clue {
    constructor(data = {}) {
        this.id = null;
        this.clue = null;
        this.valid = null;
        Object.assign(this, data);
    }
}
export default Clue;
