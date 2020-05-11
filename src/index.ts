import {load, YAMLException} from "js-yaml";
import * as jp from "jsonpath";
import {ValidatorException, jsonToSchema} from "json-to-yup";

export const yamlToJson = (dataYaml: string, config?: {noWarnings?: boolean}) => {
    const {noWarnings} = config || {};
    return load(dataYaml, {
        onWarning(e: YAMLException) {
            noWarnings && console.warn(e);
        }
    })
};

export const yamlToSchema = (yaml: string, config?: {noWarnings?: boolean}) => {
    const json = yamlToJson(yaml, config);
    return jsonToSchema(json);
};

export const yamlToSchemaWithData = (validationYaml: string, dataYaml: string, config?: {noWarnings?: boolean}) => {
    const pathsRx = new RegExp("(value|list)=([\\$\\.\\S]*)", 'g');
    const data = load(dataYaml);
    const matches = [...validationYaml.matchAll(pathsRx)];
    matches.forEach(groups => {
        const path = new RegExp(groups[0].replace('$.', '\\$\\.'), 'g');
        const value = groups[0].startsWith('value=') ?
            jp.value(data, groups[0].replace('value=', '')) :
            jp.query(data, groups[0].replace('list=', ''));
        if (value === undefined)
            throw new ValidatorException(`No value found for ${groups[0]}`);
        validationYaml = validationYaml.replace(path, JSON.stringify(value))
    })

    return yamlToJson(validationYaml, config);
};


export default {
    yamlToSchema,
    yamlToJson,
    yamlToSchemaWithData
}

