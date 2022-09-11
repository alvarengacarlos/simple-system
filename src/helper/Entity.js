export default class Entity {

    _id = null;
    _createAt = new Date();
    _updateAt = new Date();

    setId(id) {
        if (this._id != null) {
            throw new Error("the id is set");
        }

        this._id = id;
        return this;
    }

    setCreateAt(createAt) {
        this._createAt = createAt;
        return this;
    }

    setUpdateAt(updateAt) {
        this._updateAt = updateAt;
        return this;
    }

    getId() {
        return this._id;
    }

    getCreateAt() {
        return this._createAt;
    }

    getUpdateAt() {
        return this._updateAt;
    }

}