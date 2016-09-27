module.exports = function (error, request, response, next) { //jshint ignore:line
    if (typeof error === 'string') {
        return response.status(400).json({
            message: error,
            name: "Error"
        });
    }
    if (error.code === 11000) {
        console.log("Mongo Duplicate Key Error: ", error.message);
        error.message = "There is already a record in the database that meets those requirements. Please enter unique values.";
    }
    switch (error.name) {
        default:
        case 'Error':
            response.status(error.status || 500).json({
                message: error.message,
                name: error.name
            });
        break;
    }
};
