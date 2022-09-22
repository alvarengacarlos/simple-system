/**
 * This class must not instanciate. It must be extend.
 */
import crypto from "crypto";

export default class Entity {

    _id = crypto.randomUUID();
    _createdAt = new Date();
    _updatedAt = new Date();

    getId() {
        return this._id;
    }

    setId(id) {
        this._id = id;
        return this;
    }

    getCreatedAt() {
        return this._createdAt;
    }

    setCreatedAt(createdAt) {
        this._createdAt = createdAt;
        return this;
    }

    getUpdatedAt() {
        return this._updatedAt;
    }

    setUpdatedAt(updatedAt) {
        this._updatedAt = updatedAt;
        return this;
    }  
    
}