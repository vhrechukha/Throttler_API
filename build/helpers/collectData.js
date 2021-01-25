"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function collectData(request, callback) {
    let data = '';
    request.on('data', (chunk) => {
        data += chunk;
    });
    request.on('end', () => {
        callback(JSON.parse(data));
    });
}
exports.default = collectData;
//# sourceMappingURL=collectData.js.map