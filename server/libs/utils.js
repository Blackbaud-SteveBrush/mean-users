var _;

_ = require('lodash');


/**
 * Removes any undefined elements from an array.
 */
function cleanArray(arr) {
    var i;
    for (i = 0; i < arr.length; ++i) {
        if (arr[i] === undefined) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

/**
 * Checks for a duplicate value within an array of objects, by key.
 */
function checkDuplicateValueInObjects(arr, key) {
    var values;

    if (_.isArray(arr)) {
        values = arr.map(function (obj) {
            return obj[key];
        });
        return (_.uniq(values).length !== values.length);
    }

    return false;
}


/**
 * Returns a duplicate of an object.
 */
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


/**
 * Compares two objects to see if their key->value pairings match.
 */
function compareObjects(obj1, obj2) {
    var dup1,
        dup2;

    // Create duplicates for the comparison.
    // This also converts MongoDB ID's to strings.
    dup1 = clone(obj1);
    dup2 = clone(obj2);

    // Remove the _id field for the comparison.
    delete dup1._id;
    delete dup2._id;

    return _.isEqual(dup1, dup2);
}


function mixin(destination, source) {
    var k;

    for (k in source.prototype) {
        if (destination.prototype.hasOwnProperty(k) === false) {
            destination.prototype[k] = source.prototype[k];
        } else {
            console.log("ERROR: Mixin " + k + " already exists!");
        }
    }

    // Add static methods.
    if (source.static) {
        destination.static = destination.static || {};
        for (k in source.static) {
            if (source.static.hasOwnProperty(k)) {
                destination.static[k] = source.static[k];
            }
        }
    }
}


/**
 * Formats the response to send a success.
 */
function parseSuccess(response, data) {
    response.status(200);
    if (_.isArray(data)) {
        return response.json({
            count: data.length || 0,
            value: data
        });
    } else {
        return response.json(data);
    }
}

/**
 * Converts a phrase into a URL-safe string.
 * Spaces are replaced with dashes, etc. (see below)
 */
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}


module.exports = {
    cleanArray: cleanArray,
    clone: clone,
    compareObjects: compareObjects,
    checkDuplicateValueInObjects: checkDuplicateValueInObjects,
    mixin: mixin,
    parseSuccess: parseSuccess,
    slugify: slugify
};
