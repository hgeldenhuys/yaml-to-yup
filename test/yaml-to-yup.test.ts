import {expect} from "chai";
import "mocha";
import {yamlToJson, yamlToSchema} from "../src";

const yupYaml = `%YAML 1.2
---
marketingConsent:
    boolean: true
email:
    string:
        nullable: true
        lowercase: true # converts to lower case
        email: "This is not a valid email format"
        when:
            this: marketingConsent
            is: true
            then:
                string:
                    lowercase: true
                    required: "Please supply your email if you want us to market to you"
            otherwise:
                string:
                    notRequired: true`


describe(`validate a good email`, () => {
    it(`must be valid in`, async () => {
        const VALID_DATA = `%YAML 1.2
---
email: anonymous@email.org`;
        expect(yamlToSchema(yupYaml).isValidSync(yamlToJson(VALID_DATA))).equals(true);
    });
});

describe(`validate a bad email`, () => {
    it(`this must fail`, async () => {
        const INVALID_DATA = `%YAML 1.2
---
email: anonymous`;
        expect(yamlToSchema(yupYaml).isValidSync(INVALID_DATA)).equals(false);
        try {
            yamlToSchema(yupYaml).validateSync(yamlToJson(INVALID_DATA));
        } catch (e) {
            expect(e.message).equals("This is not a valid email format");
        }
    });
});

describe(`don't require an email address if marketingConsent = false`, () => {
    it(`json: marketingConsent is false but email is missing`, async () => {
        const VALID_DATA = `%YAML 1.2
---
marketingConsent: false`;
        expect(yamlToSchema(yupYaml).isValidSync(yamlToJson(VALID_DATA))).equals(true);
    });
});

describe(`require an email address if marketingConsent = true`, () => {
    it(`marketingConsent is true but email is missing`, async () => {
        const VALID_DATA = yamlToJson(`%YAML 1.2
---
marketingConsent: true`);
        expect(yamlToSchema(yupYaml).isValidSync(VALID_DATA)).equals(false);
        try {
            yamlToSchema(yupYaml).validateSync(VALID_DATA);
        } catch (e) {
            expect(e.message).equals("Please supply your email if you want us to market to you");
        }
    });
});

describe(`marketingConsent = true and email in upper case but lowered case`, () => {
    it(`marketingConsent is true and has email in uppercase`, async () => {
        const VALID_DATA = yamlToJson(`%YAML 1.2
---
marketingConsent: true
email: "NOBODY@NOWHERE.COM"`);
        expect(yamlToSchema(yupYaml).isValidSync(VALID_DATA)).equals(true);
        expect(yamlToSchema(yupYaml).validateSync(VALID_DATA).email).equals("nobody@nowhere.com");
    });
});

