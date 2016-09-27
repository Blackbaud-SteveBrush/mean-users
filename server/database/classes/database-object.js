var merge;

merge = require('merge');

function DatabaseObject(options) {
    var defaults,
        self,
        settings;

    defaults = {};
    settings = merge.recursive(true, defaults, options || {});
    self = this;

    self.create = function (data) {
        var newDocument;
        newDocument = new settings.model(data);
        return newDocument.save();
    };

    self.deleteById = function (id) {
        return settings.model.findOneAndRemove({
            _id: id
        }).exec();
    };

    self.getAll = function () {
        return settings.model.find({}).exec();
    };

    self.getById = function (id) {
        return settings.model.findOne({
            _id: id
        }).exec();
    };

    self.getByIds = function (ids) {
        return settings.model.find({
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
        if (typeof settings.onBeforeUpdate === 'function') {
            return settings.onBeforeUpdate(data).then(update);
        }
        return update();
    };
}

module.exports = DatabaseObject;
