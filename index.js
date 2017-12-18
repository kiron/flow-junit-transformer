const crypto = require('crypto');

module.exports = function flowJUnitTransformer(input) {
  const errors = input.errors.map(error => {
    const context = error.message[0].context;
    const message = error.message.map(message => message.descr).join(' ');
    const hash = crypto
      .createHash('sha256')
      .update(context + message)
      .digest('hex')
      .substr(0, 16);
    return `
    <testcase
      time="0"
      classname="org.flow.${error.level.toLowerCase()}.${hash}"
      id="flow-error"
      name="org.flow.${error.level.toLowerCase()}.${hash}"
      >
        <failure
          type="${error.level.toUpperCase()}"
          message="${message}"
          >
            <![CDATA[
Context: ${context}
Message: ${message}
            ]]>
          </failure>
        </testcase>`;
  });

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
