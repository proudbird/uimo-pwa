"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const plugin_syntax_jsx_1 = __importDefault(require("@babel/plugin-syntax-jsx"));
const core_1 = require("@babel/core");
const isString_1 = __importDefault(require("lodash/isString"));
const identity_1 = __importDefault(require("lodash/identity"));
const ary_1 = __importDefault(require("lodash/ary"));
const nameProperty = 'tagName';
const attributesProperty = 'attributes';
const childrenProperty = 'children';
function default_1() {
    /* ==========================================================================
     * Utilities
     * ======================================================================= */
    const transformOnType = transforms => node => {
        const transformer = transforms[node.type];
        if (transformer) {
            return transformer(node);
        }
        throw new Error(`${node.type} could not be transformed`);
    };
    /* ==========================================================================
     * Initial configuration
     * ======================================================================= */
    const initConfig = (path, state) => {
        const { useNew = false, module: constructorModule, function: constructorFunction, useVariables = false } = state.opts;
        let variablesRegex, jsxObjectTransformer;
        if (useVariables === true) {
            // Use the default variables regular expression when true.
            variablesRegex = /^[A-Z]/;
        }
        else if ((0, isString_1.default)(useVariables)) {
            // If it’s a plain regular expression string.
            variablesRegex = new RegExp(useVariables);
        }
        const executeExpression = useNew ? core_1.types.newExpression : core_1.types.callExpression;
        const jsxObjectTransformerCreator = expression => value => executeExpression(expression, [value]);
        if (constructorModule) {
            // If the constructor function will be retrieved from a module.
            const moduleName = path.scope.generateUidIdentifier(useNew ? 'JSXNode' : 'jsx');
            jsxObjectTransformer = jsxObjectTransformerCreator(moduleName);
            const importDeclaration = core_1.types.importDeclaration([core_1.types.importDefaultSpecifier(moduleName)], core_1.types.stringLiteral(constructorModule));
            // Add the import declration to the top of the file.
            path.findParent(p => p.isProgram()).unshiftContainer('body', importDeclaration);
        }
        else if (constructorFunction) {
            // If the constructor function will be an in scope function.
            const expression = constructorFunction.split('.').map((0, ary_1.default)(core_1.types.identifier, 1)).reduce((0, ary_1.default)(core_1.types.memberExpression, 2));
            jsxObjectTransformer = jsxObjectTransformerCreator(expression);
        }
        else {
            // Otherwise, we won‘t be mapping.
            jsxObjectTransformer = identity_1.default;
        }
        return {
            variablesRegex,
            jsxObjectTransformer
        };
    };
    /* =========================================================================
     * Visitors
     * ======================================================================= */
    const visitJSXElement = (path, state) => {
        if (!state.get('jsxConfig')) {
            state.set('jsxConfig', initConfig(path, state));
        }
        const { variablesRegex, jsxObjectTransformer } = state.get('jsxConfig');
        /* ==========================================================================
         * Node Transformers
         * ======================================================================= */
        const JSXIdentifier = node => core_1.types.stringLiteral(node.name);
        const JSXNamespacedName = node => core_1.types.stringLiteral(`${node.namespace.name}:${node.name.name}`);
        const JSXMemberExpression = transformOnType({
            JSXIdentifier: node => core_1.types.identifier(node.name),
            JSXMemberExpression: node => (core_1.types.memberExpression(JSXMemberExpression(node.object), JSXMemberExpression(node.property)))
        });
        const JSXElementName = transformOnType({
            JSXIdentifier: variablesRegex
                ? node => variablesRegex.test(node.name) ? core_1.types.identifier(node.name) : JSXIdentifier(node)
                : JSXIdentifier,
            JSXNamespacedName,
            JSXMemberExpression
        });
        const JSXExpressionContainer = node => node.expression;
        const JSXAttributeName = transformOnType({ JSXIdentifier, JSXNamespacedName, JSXMemberExpression });
        const JSXAttributeValue = transformOnType({
            StringLiteral: node => node,
            JSXExpressionContainer
        });
        const JSXAttributes = nodes => {
            let object = [];
            const objects = [];
            nodes.forEach(node => {
                var _a;
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (!object) {
                            object = [];
                        }
                        const namespasce = (_a = node.name.namespace) === null || _a === void 0 ? void 0 : _a.name;
                        if (namespasce !== 'a') {
                            break;
                        }
                        const attributeName = node.name.name.name;
                        const objectKey = core_1.types.identifier(attributeName);
                        object.push(core_1.types.objectProperty(objectKey, JSXAttributeValue(node.value)));
                        break;
                    }
                    case 'JSXSpreadAttribute': {
                        if (object) {
                            objects.push(core_1.types.objectExpression(object));
                            object = null;
                        }
                        objects.push(node.argument);
                        break;
                    }
                    default:
                        throw new Error(`${node.type} cannot be used as a JSX attribute`);
                }
            });
            if (object && object.length > 0) {
                objects.push(core_1.types.objectExpression(object));
            }
            if (objects.length === 0) {
                return core_1.types.objectExpression([]);
            }
            else if (objects.length === 1) {
                return objects[0];
            }
            return (core_1.types.callExpression(state.addHelper('extends'), objects));
        };
        const JSXProps = nodes => {
            let object = [];
            const objects = [];
            nodes.forEach(node => {
                var _a;
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (!object) {
                            object = [];
                        }
                        const namespasce = (_a = node.name.namespace) === null || _a === void 0 ? void 0 : _a.name;
                        if (namespasce !== 'p') {
                            break;
                        }
                        const attributeName = node.name.name.name;
                        const objectKey = core_1.types.identifier(attributeName);
                        object.push(core_1.types.objectProperty(objectKey, JSXAttributeValue(node.value)));
                        break;
                    }
                    case 'JSXSpreadAttribute': {
                        if (object) {
                            objects.push(core_1.types.objectExpression(object));
                            object = null;
                        }
                        objects.push(node.argument);
                        break;
                    }
                    default:
                        throw new Error(`${node.type} cannot be used as a JSX attribute`);
                }
            });
            if (object && object.length > 0) {
                objects.push(core_1.types.objectExpression(object));
            }
            if (objects.length === 0) {
                return core_1.types.objectExpression([]);
            }
            else if (objects.length === 1) {
                return objects[0];
            }
            return (core_1.types.callExpression(state.addHelper('extends'), objects));
        };
        const JSXEvents = nodes => {
            let object = [];
            const objects = [];
            nodes.forEach(node => {
                var _a;
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (!object) {
                            object = [];
                        }
                        const namespasce = (_a = node.name.namespace) === null || _a === void 0 ? void 0 : _a.name;
                        if (namespasce !== 'e') {
                            break;
                        }
                        const eventName = node.name.name.name;
                        const objectKey = core_1.types.identifier(eventName);
                        object.push(core_1.types.objectProperty(objectKey, JSXAttributeValue(node.value)));
                        break;
                    }
                    case 'JSXSpreadAttribute': {
                        if (object) {
                            objects.push(core_1.types.objectExpression(object));
                            object = null;
                        }
                        objects.push(node.argument);
                        break;
                    }
                    default:
                        throw new Error(`${node.type} cannot be used as a JSX attribute`);
                }
            });
            if (object && object.length > 0) {
                objects.push(core_1.types.objectExpression(object));
            }
            if (objects.length === 0) {
                return core_1.types.objectExpression([]);
            }
            else if (objects.length === 1) {
                return objects[0];
            }
            return (core_1.types.callExpression(state.addHelper('extends'), objects));
        };
        const JSXStyle = nodes => {
            let object = [];
            const objects = [];
            nodes.forEach(node => {
                var _a;
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (!object) {
                            object = [];
                        }
                        const namespasce = (_a = node.name.namespace) === null || _a === void 0 ? void 0 : _a.name;
                        if (namespasce !== 's') {
                            break;
                        }
                        const eventName = node.name.name.name;
                        const objectKey = core_1.types.identifier(eventName);
                        object.push(core_1.types.objectProperty(objectKey, JSXAttributeValue(node.value)));
                        break;
                    }
                    case 'JSXSpreadAttribute': {
                        if (object) {
                            objects.push(core_1.types.objectExpression(object));
                            object = null;
                        }
                        objects.push(node.argument);
                        break;
                    }
                    default:
                        throw new Error(`${node.type} cannot be used as a JSX attribute`);
                }
            });
            if (object && object.length > 0) {
                objects.push(core_1.types.objectExpression(object));
            }
            if (objects.length === 0) {
                return core_1.types.objectExpression([]);
            }
            else if (objects.length === 1) {
                return objects[0];
            }
            return (core_1.types.callExpression(state.addHelper('extends'), objects));
        };
        const JSXData = nodes => {
            let object = [];
            const objects = [];
            nodes.forEach(node => {
                var _a;
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (!object) {
                            object = [];
                        }
                        const namespasce = (_a = node.name.namespace) === null || _a === void 0 ? void 0 : _a.name;
                        if (namespasce !== 'd') {
                            break;
                        }
                        const eventName = node.name.name.name;
                        const objectKey = core_1.types.identifier(eventName);
                        object.push(core_1.types.objectProperty(objectKey, JSXAttributeValue(node.value)));
                        break;
                    }
                    case 'JSXSpreadAttribute': {
                        if (object) {
                            objects.push(core_1.types.objectExpression(object));
                            object = null;
                        }
                        objects.push(node.argument);
                        break;
                    }
                    default:
                        throw new Error(`${node.type} cannot be used as a JSX attribute`);
                }
            });
            if (object && object.length > 0) {
                objects.push(core_1.types.objectExpression(object));
            }
            if (objects.length === 0) {
                return core_1.types.objectExpression([]);
            }
            else if (objects.length === 1) {
                return objects[0];
            }
            return (core_1.types.callExpression(state.addHelper('extends'), objects));
        };
        const JSXChildrenAsAttribute = nodes => {
            let result = null;
            nodes.forEach(node => {
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (node.name.name !== 'children') {
                            break;
                        }
                        const objectKey = core_1.types.identifier(node.name.name);
                        result = core_1.types.assignmentExpression('=', objectKey, JSXAttributeValue(node.value));
                    }
                }
            });
            return result;
        };
        const JSXAlias = nodes => {
            let result = null;
            const objects = [];
            nodes.forEach(node => {
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (node.name.name !== 'alias') {
                            break;
                        }
                        const objectKey = core_1.types.identifier(node.name.name);
                        result = core_1.types.assignmentExpression('=', objectKey, JSXAttributeValue(node.value));
                    }
                }
            });
            return result;
        };
        const JSXClassName = nodes => {
            let result = null;
            const objects = [];
            nodes.forEach(node => {
                switch (node.type) {
                    case 'JSXAttribute': {
                        if (node.name.name !== 'className') {
                            break;
                        }
                        const objectKey = core_1.types.identifier(node.name.name);
                        result = core_1.types.assignmentExpression('=', objectKey, JSXAttributeValue(node.value));
                    }
                }
            });
            return result;
        };
        const JSXText = node => {
            if (state.opts.noTrim)
                return core_1.types.stringLiteral(node.value);
            const value = node.value.replace(/\n\s*/g, '');
            return value === '' ? null : core_1.types.stringLiteral(value);
        };
        const JSXElement = node => {
            const properties = [];
            if (node.openingElement.name.namespace) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier(nameProperty), core_1.types.stringLiteral(node.openingElement.name.name.name)), core_1.types.objectProperty(core_1.types.identifier('type'), JSXElementName(node.openingElement.name.namespace)));
            }
            else {
                properties.push(core_1.types.objectProperty(core_1.types.identifier(nameProperty), JSXElementName(node.openingElement.name)), core_1.types.objectProperty(core_1.types.identifier('type'), core_1.types.stringLiteral('element')));
            }
            const alias = JSXAlias(node.openingElement.attributes);
            const className = JSXClassName(node.openingElement.attributes);
            const attributes = JSXAttributes(node.openingElement.attributes);
            const props = JSXProps(node.openingElement.attributes);
            const events = JSXEvents(node.openingElement.attributes);
            const style = JSXStyle(node.openingElement.attributes);
            const data = JSXData(node.openingElement.attributes);
            const children = JSXChildrenAsAttribute(node.openingElement.attributes);
            if (alias) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('alias'), alias));
            }
            if (className) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('className'), className));
            }
            if (attributes.properties.length > 0) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('attributes'), attributes));
            }
            if (props.properties.length > 0) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('props'), props));
            }
            if (events.properties.length > 0) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('events'), events));
            }
            if (style.properties.length > 0) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('style'), style));
            }
            if (data.properties.length > 0) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('data'), data));
            }
            if (children) {
                properties.push(core_1.types.objectProperty(core_1.types.identifier('children'), children));
            }
            properties.push(core_1.types.objectProperty(core_1.types.identifier(childrenProperty), node.closingElement ? JSXChildren(node.children) : children ? children : core_1.types.nullLiteral()));
            return jsxObjectTransformer(core_1.types.objectExpression(properties));
        };
        const JSXChild = transformOnType({ JSXText, JSXElement, JSXExpressionContainer });
        const JSXChildren = nodes => core_1.types.arrayExpression(nodes
            .map(JSXChild)
            .filter(Boolean)
            // Normalize all of our string children into one big string. This can be
            // an optimization as we minimize the number of nodes created.
            // This step just turns `['1', '2']` into `['12']`.
            .reduce((children, child) => {
            const lastChild = children.length > 0 ? children[children.length - 1] : null;
            // If this is a string literal, and the last child is a string literal, merge them.
            if (child.type === 'StringLiteral' && lastChild && lastChild.type === 'StringLiteral') {
                return [...children.slice(0, -1), core_1.types.stringLiteral(lastChild.value + child.value)];
            }
            // Otherwise just append the child to our array normally.
            return [...children, child];
        }, []));
        // Actually replace JSX with an object.
        path.replaceWith(JSXElement(path.node));
    };
    /* ==========================================================================
     * Plugin
     * ======================================================================= */
    return {
        inherits: plugin_syntax_jsx_1.default,
        visitor: {
            JSXElement: visitJSXElement
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map