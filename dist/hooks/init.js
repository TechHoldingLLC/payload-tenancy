"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitHook = void 0;
var pathMapping_1 = require("../middleware/pathMapping");
var domainMapping_1 = require("../middleware/domainMapping");
/**
 * Move the last middleware up in the stack as far as possible (after
 * "expressInit" middleware).
 *
 * @param express Express application
 */
var prioritizeLastMiddleware = function (express) {
    var router = express._router;
    var index = router.stack.findIndex(function (layer) { return layer.name === "expressInit"; });
    router.stack = __spreadArray(__spreadArray(__spreadArray([], router.stack.slice(0, index + 1), true), router.stack.slice(-1), true), router.stack.slice(index + 1, -1), true);
};
/**
 * Check if middleware already exists in the application. Used to make sure that
 * middleware is not inserted multiple times.
 *
 * @param express Express application
 * @param middleware Middleware handler to check
 * @returns True if middleware exists already in the application
 */
var middlewareExists = function (express, middleware) {
    return express._router.stack.some(function (layer) { return layer.handle === middleware; });
};
var createInitHook = function (_a) {
    var options = _a.options, config = _a.config;
    var middleware;
    return function (payload) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ((_a = config.onInit) === null || _a === void 0 ? void 0 : _a.call(config, payload))];
                case 1:
                    _b.sent();
                    if (!payload.express) {
                        return [2 /*return*/];
                    }
                    if (!middleware) {
                        // Choose a middleware to use.
                        if (options.isolationStrategy === "path") {
                            middleware = (0, pathMapping_1.createPathMapping)({ options: options, config: config, payload: payload });
                        }
                        if (options.isolationStrategy === "domain") {
                            middleware = (0, domainMapping_1.createDomainMapping)({ options: options, config: config, payload: payload });
                        }
                    }
                    if (middleware && !middlewareExists(payload.express, middleware)) {
                        // Middleware chosen and does not exist already.
                        payload.express.use(middleware);
                        prioritizeLastMiddleware(payload.express);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.createInitHook = createInitHook;
