var merge;

merge = require('merge');

function DatabaseObject(options) {
    var defaults,
        self;

    self = this;
    self.hooks = {};
    defaults = {};
    self.settings = merge.recursive(true, defaults, options || {});
}

DatabaseObject.prototype = {
    create: function (data) {
        var newDocument,
            self;

        self = this;
        newDocument = new self.settings.model(data);

        if (typeof self.hooks.onAfterCreate === 'function') {
            return self.hooks.onAfterCreate(data).then(function () {
                return newDocument.save.exec();
            });
        }

        return newDocument.save();
    },
    deleteAll: function () {
        var self;
        self = this;
        return self.settings.model.remove({}).exec().then(new Promise(function (resolve, reject) {
            self.settings.model.collection.dropAllIndexes(function (error) {
                if (error) {
                    return reject(error);
                }
                return resolve();
            });
        }));
    },
    deleteById: function (id) {
        return this.settings.model.findOneAndRemove({
            _id: id
        }).exec();
    },
    getAll: function () {
        return this.settings.model.find({}).exec();
    },
    getById: function (id) {
        return this.settings.model.findOne({
            _id: id
        }).exec();
    },
    getByIds: function (ids) {
        return this.settings.model.find({
            '_id': { $in: ids }
        }).exec();
    },
    updateById: function (id, data) {
        var self;
        self = this;
        function update() {
            return self.getById(id).then(function (doc) {
                var k;
                for (k in data) {
                    if (data.hasOwnProperty(k)) {
                        doc[k] = data[k];
                    }
                }
                return doc.save();
            });
        }
        if (typeof self.hooks.onBeforeUpdate === 'function') {
            return self.hooks.onBeforeUpdate(data).then(update);
        }
        return update();
    }
};

module.exports = DatabaseObject;
