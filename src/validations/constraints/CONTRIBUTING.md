# 4. Testing FedRAMP OSCAL constraints
This section describes running unit tests and analyzing test results.

## 4.1. Executing out-of-the-box unit tests
OSCAL JS comes with a large set of predefined FedRAMP OSCAL Metaschema constraints.

To execute unit tests that come with the tool
1. Open the terminal.  
2. To change to the root directory of the cloned repository, run the following command:  
   `$ cd <cloned-repository-path>`  
3. To execute  
   * All default tests, run the following command:
   `$ make test`
   * A single test, run the following command: (omitting test-id will produce a drop down)
   `$ npm run constraint <test-id>`
  If a test does not exist, the command shows prompts to help you generate the test.

## 4.2. Analyzing test results
After running unit tests, to view the generated report, open the following file:  
`<cloned-repository-path>/reports/constraints.html`

To view generated SARIF reports, browse to the following directory:  
`<cloned-repository-path>/sarif`

# 5. Creating custom unit tests
This section describes steps for creating your own OSCAL Metaschema constraints and YAML unit tests.  

## 5.1. Creating unit tests
To create FedRAMP OSCAL unit tests
1. Open the terminal.  
2. To change to the **constraints** directory, run the following command:  
   `$ cd <cloned-repository-path>/src/validations/constraints`  
3. Create your FedRAMP OSCAL Metaschema XML file.  
4. To pick up changes, run the following command:  
   `$ make test`
The tool parses your Metaschema file and generates the **pass** and **fail** YAML unit test files in the following directory:  
`<cloned-repository-path>/src/validations/constraints/unit-tests`

## 5.2. Sample FedRAMP OSCAL Metaschema and YAML files
You can find sample FedRAMP OSCAL Metaschema XML files in the following directory:  
`<cloned-repository-path>/src/validations/constraints`

Sample **pass** and **fail** YAML unit test files reside in the following directory:  
`<cloned-repository-path>/src/validations/constraints/unit-tests`

# 6\. Providing feedback
If you encounter a bug or have a feature to request, submit an issue at [https://github.com/GSA/fedramp-automation/issues/new/choose](https://github.com/GSA/fedramp-automation/issues/new/choose).  

