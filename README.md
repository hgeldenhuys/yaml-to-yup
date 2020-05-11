# YAML or JSON to YUP

Write your YUP validation as human readable YAML or computer-friendly JSON.

    yarn add yaml-to-yup
    
## Use cases

### Non-technical people writing validation

### Code-safe yup injection


### Example

`Validation YAML`
```yaml
%YAML 1.2
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
                    notRequired: true
```

`Data YAML`
```yaml
%YAML 1.2
---
marketingConsent: true
email: "NOBODY@NOWHERE.COM"
```

`Result`
```typescript
import expect;
import yamlToSchema;
const yupYaml = "Validation YAML above";
const VALID_DATA = "Data YAML above";

expect(yamlToSchema(yupYaml).isValidSync(VALID_DATA)).equals(true);
```

# 
