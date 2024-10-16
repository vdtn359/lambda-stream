'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStream = exports.fromHttpResponse = exports.streamifyResponse = exports.isInAWS = void 0;
const ResponseStream_1 = require("./ResponseStream");
function isInAWS() {
    return (
    // @ts-ignore
    globalThis.awslambda !== undefined &&
        // @ts-ignore
        awslambda.streamifyResponse !== undefined);
}
exports.isInAWS = isInAWS;
function streamifyResponse(handler) {
    // Check for global awslambda
    if (isInAWS()) {
        // @ts-ignore
        return awslambda.streamifyResponse(handler);
    }
    else {
        return new Proxy(handler, {
            apply: async function (target, _, argList) {
                var _a, _b, _c;
                const responseStream = patchArgs(argList);
                await target(...argList);
                return Object.assign(Object.assign({ statusCode: (_b = (_a = responseStream._metadata) === null || _a === void 0 ? void 0 : _a.statusCode) !== null && _b !== void 0 ? _b : 200, headers: Object.assign({ 'content-type': responseStream._contentType || 'application/json' }, (_c = responseStream._metadata) === null || _c === void 0 ? void 0 : _c.headers) }, (responseStream._isBase64Encoded
                    ? { isBase64Encoded: responseStream._isBase64Encoded }
                    : {})), { body: responseStream._isBase64Encoded
                        ? responseStream.getBufferedData().toString('base64')
                        : responseStream.getBufferedData().toString() });
            },
        });
    }
}
exports.streamifyResponse = streamifyResponse;
function fromHttpResponse(responseStream, metadata) {
    if (isInAWS()) {
        // @ts-ignore
        return awslambda.HttpResponseStream.from(responseStream, metadata);
    }
    else {
        responseStream.setMetadata(metadata);
        return responseStream;
    }
}
exports.fromHttpResponse = fromHttpResponse;
function patchArgs(argList) {
    if (!(argList[1] instanceof ResponseStream_1.ResponseStream)) {
        const responseStream = new ResponseStream_1.ResponseStream();
        argList.splice(1, 0, responseStream);
    }
    return argList[1];
}
var ResponseStream_2 = require("./ResponseStream");
Object.defineProperty(exports, "ResponseStream", { enumerable: true, get: function () { return ResponseStream_2.ResponseStream; } });
//# sourceMappingURL=index.js.map