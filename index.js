/* @flow */
const crypto = require('crypto');

/*::
type FlowReport = {
  flowVersion: string,
  errors: ErrorReport[],
};

type ErrorReport = {
  kind: 'infer' | 'parse' | string,
  level: 'error' | 'warning',
  suppressions: any[],
  message: Message[],
  extra?: ExtraReport[],
};

type ExtraReport = {
  message: Message[],
  children?: ExtraReport[],
}

type Message = BlameMessage | CommentMessage;

type BlameMessage = {
  type: 'Blame',
  descr: string,
  context: string,
  line: number,
  endline: number,
  path: string,
  start: number,
  end: number,
};

type CommentMessage = {
  type: 'Comment',
  descr: string,
  context: null,
  line: number,
  endline: number,
  path: string,
  start: number,
  end: number,
}
*/

function errorToString(error /*: ErrorReport */) /*: string */ {
  const title = error.message.map(message => message.descr).join(' ');
  let message = `Error: ${title}

${error.message.map(messageToString).join('\n\n')}`;
  if (error.extra) {
    message += '\n\nExtra information - ';
    message += error.extra.map(extraToString).join('\n');
  }
  return message;
}

function extraToString(extra /*: ExtraReport */) /*: string */ {
  let message = extra.message.map(messageToString).join('\n\n');
  if (extra.children) {
    return message + '\n\n' + extra.children.map(extraToString).join('\n\n');
  }
  return message;
}

function messageToString(message /*: Message */) /*: string */ {
  if (message.context !== null) {
    return blameToString(message);
  }
  return commentToString(message);
}

function blameToString(blame /*: BlameMessage */) /*: string */ {
  let location = '';
  if ((blame.context, blame.end - blame.start + 1 > 0)) {
    location = '^'.repeat(blame.end - blame.start + 1);
  }
  return (
    blame.context + '\n' + ' '.repeat(Math.max(0, blame.start - 1)) + location + ' ' + blame.descr
  );
}

function commentToString(comment /*: CommentMessage */) /*: string */ {
  return comment.descr;
}

module.exports = function flowJUnitTransformer(input /*: FlowReport */) {
  const errors = input.errors.map(error => {
    const context = error.message[0].context;
    const title = error.message.map(message => message.descr).join(' ');
    const message = errorToString(error);
    const hash = crypto
      .createHash('sha256')
      .update(message)
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
          message="${title}"
          >
            <![CDATA[
${message}
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
