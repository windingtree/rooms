"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (request, response) {
    var _a = request.query.name, name = _a === void 0 ? 'World' : _a;
    response.status(200).send("Hello " + name + "!");
});
//# sourceMappingURL=index.js.map