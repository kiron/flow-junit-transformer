module.exports = function flowJUnitTransformer(input) {
  const errors = input.errors.map(
    error => `
    <testcase
      time="0"
      classname="org.flow.${error.level.toLowerCase()}"
      id="flow-error"
      name="org.flow.${error.level.toLowerCase()}"
      >
        <failure
          type="${error.level.toUpperCase()}"
          message="${error.message.map(message => message.descr).join(' ')}"
          >
            <![CDATA[
Context: ${error.message[0].context}
Message: ${error.message.map(message => message.descr).join(' ')}
            ]]>
          </failure>
        </testcase>`,
  );

  return `<?xml version="1.0" encoding="UTF-8" ?>
<testsuites id="flow">
  <testsuite
    package="org.flow"
    tests="${errors.length}"
    time="0"
    skipped="0"
    errors="${errors.length}"
    id="flow-suite"
    name="Flow type check"
    >${errors.join('')}
  </testsuite>
</testsuites>
`;
};
