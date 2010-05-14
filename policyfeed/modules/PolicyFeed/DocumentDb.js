/*
 *
 */

// todo:
//  - locking

module.shared = true;

import("config");
import("fs");
import("ringo/scheduler");

/**
 * Path where document data is stored.
 */
var path = config.DATA_DIR + "/DocumentDB/";


/**
 * 
 */
var triggers = {
    "read": []
    ,"write": []
    ,"remove": []
};


// --- Common operations: ---


/**
 *
 */
exports.getFileName = function(id) {
    return path + id + ".json";
}

/**
 *
 */
exports.exists = function(id) {
    return fs.exists(this.getFileName(id));
}


/**
 *
 */
exports.read = function(id) {
    if (!this.exists(id)) {
        return false;
    }
    else {
        var doc;
        if (doc = JSON.parse(fs.read(this.getFileName(id))) ) {
            this.runTriggers("read", id, doc);
            return doc;
        }
        else {
            return this.error("read", id);
        }
    }
}


/**
 *
 */
exports.remove = function(id) {
    if (!this.exists(id)) {
        return false;
    }

    fs.remove(this.getFileName(id));
    this.runTriggers("remove", id, false);
    return true;
}


/**
 *
 */
exports.write = function(id, data) {
    var file_name = this.getFileName(id);

    fs.makeTree(fs.directory(file_name));
    fs.write(file_name, JSON.stringify(data));

    this.runTriggers("write", id, data);
    return true;
}


// --- Triggers: ---

/**
 *
 */
exports.addTrigger = function(action, pattern, callback) {
    triggers[action].push([pattern, callback]);
}


/**
 *
 */
exports.runTriggers = function(action, id, doc) {
    for each (var trigger in triggers[action]) {
       if (id.match(trigger[0])) {
           // todo: check if this closure does not produce weird errors.
           scheduler.setTimeout(function () { trigger[1](action, id, doc); }, 0);
       }
    }
}



