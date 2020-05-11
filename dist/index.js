"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = require("js-yaml");
const jp = require("jsonpath");
const dist_1 = require("../dist");
const json_to_yup_1 = require("json-to-yup");
exports.yamlToJson = (dataYaml, config) => {
    const { noWarnings } = config || {};
    return js_yaml_1.load(dataYaml, {
        onWarning(e) {
            noWarnings && console.warn(e);
        }
    });
};
exports.yamlToSchema = (yaml, config) => {
    const json = exports.yamlToJson(yaml, config);
    return dist_1.jsonToSchema(json);
};
exports.yamlToSchemaWithData = (validationYaml, dataYaml, config) => {
    const pathsRx = new RegExp("(value|list)=([\\$\\.\\S]*)", 'g');
    const data = js_yaml_1.load(dataYaml);
    const matches = [...validationYaml.matchAll(pathsRx)];
    matches.forEach(groups => {
        const path = new RegExp(groups[0].replace('$.', '\\$\\.'), 'g');
        const value = groups[0].startsWith('value=') ?
            jp.value(data, groups[0].replace('value=', '')) :
            jp.query(data, groups[0].replace('list=', ''));
        if (value === undefined)
            throw new json_to_yup_1.ValidatorException(`No value found for ${groups[0]}`);
        validationYaml = validationYaml.replace(path, JSON.stringify(value));
    });
    return exports.yamlToJson(validationYaml, config);
};
exports.default = {
    yamlToSchema: exports.yamlToSchema,
    yamlToJson: exports.yamlToJson,
    yamlToSchemaWithData: exports.yamlToSchemaWithData
};
//# sourceMappingURL=index.js.map