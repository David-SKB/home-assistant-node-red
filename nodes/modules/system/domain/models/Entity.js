const exists = require("../../util/common/exists");
class Entity {
    constructor(entityObject) {
        this.aliases = entityObject.aliases || [];
        this.area_id = entityObject.area_id || null;
        this.capabilities = entityObject.capabilities || null;
        this.config_entry_id = entityObject.config_entry_id || null;
        this.device_class = entityObject.device_class || null;
        this.device_id = entityObject.device_id || null;
        this.disabled_by = entityObject.disabled_by || null;
        this.entity_category = entityObject.entity_category || null;
        this.entity_id = entityObject.entity_id || null;
        this.hidden_by = entityObject.hidden_by || null;
        this.icon = entityObject.icon || null;
        this.id = entityObject.id || null;
        this.has_entity_name = entityObject.has_entity_name || null;
        this.name = entityObject.name || null;
        this.options = entityObject.options || {};
        this.original_device_class = entityObject.original_device_class || null;
        this.original_icon = entityObject.original_icon || null;
        this.original_name = entityObject.original_name || null;
        this.platform = entityObject.platform || null;
        this.supported_features = entityObject.supported_features || 0;
        this.translation_key = entityObject.translation_key || null;
        this.unique_id = entityObject.unique_id || null;
        this.unit_of_measurement = entityObject.unit_of_measurement || null;
    }

    set name(value) {
        this._name = value;
        this.has_entity_name = !!value; 
    }

    get name() {
        return this._name;
    }

    get has_entity_name() {
        if (this._has_entity_name == null) this._has_entity_name = (this.name);
        return this._has_entity_name;
    }

    set has_entity_name(value) {
        this._has_entity_name = value;
    }
    

}

// Export an instance of the Entity class
module.exports = Entity;
