var merge;

merge = require('merge');

function DatabaseObject(options) {
    var defaults,
        self;

    defaults = {};
    self = this;
    self.settings = merge.recursive(true, defaults, options || {});

    self.create = function (data) {
        var newDocument;
        newDocument = new self.settings.model(data);
        return newDocument.save();
    };

    self.deleteAll = function () {
        return self.settings.model.remove({}).exec();
    };

    self.deleteById = function (id) {
        return self.settings.model.findOneAndRemove({
            _id: id
        }).exec();
    };

    self.getAll = function () {
        return self.settings.model.find({}).exec();
    };

    self.getById = function (id) {
        return self.settings.model.findOne({
            _id: id
        }).exec();
    };

    self.getByIds = function (ids) {
        return self.settings.model.find({
            '_id': { $in: ids }
        }).exec();
    };

    self.updateById = function (id, data) {
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
        if (typeof self.onBeforeUpdate === 'function') {
            return self.onBeforeUpdate(data).then(update);
        }
        return update();
    };
}

module.exports = DatabaseObject;
