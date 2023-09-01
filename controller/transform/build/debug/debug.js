"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const index_1 = __importDefault(require("../index"));
const code = (0, fs_1.readFileSync)((0, path_1.resolve)(__dirname, '../../debug/view.tsx'), 'utf-8');
(0, index_1.default)(code, 'view.tsx').then(result => {
    console.log(result === null || result === void 0 ? void 0 : result.code);
});
//# sourceMappingURL=debug.js.map