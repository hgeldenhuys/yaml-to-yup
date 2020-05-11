export declare const yamlToJson: (dataYaml: string, config?: {
    noWarnings?: boolean | undefined;
} | undefined) => any;
export declare const yamlToSchema: (yaml: string, config?: {
    noWarnings?: boolean | undefined;
} | undefined) => any;
export declare const yamlToSchemaWithData: (validationYaml: string, dataYaml: string, config?: {
    noWarnings?: boolean | undefined;
} | undefined) => any;
declare const _default: {
    yamlToSchema: (yaml: string, config?: {
        noWarnings?: boolean | undefined;
    } | undefined) => any;
    yamlToJson: (dataYaml: string, config?: {
        noWarnings?: boolean | undefined;
    } | undefined) => any;
    yamlToSchemaWithData: (validationYaml: string, dataYaml: string, config?: {
        noWarnings?: boolean | undefined;
    } | undefined) => any;
};
export default _default;
