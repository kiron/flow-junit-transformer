#!/usr/bin/env node
const transformer = require('./');

let input = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    input += chunk;
  }
});

process.stdin.on('end', () => {
  const parsed = JSON.parse(input);
  const write = process.stdout.write(transformer(parsed));

  if (!write) {
    throw new Error('Could not write to stdout!');
  }
});

process.stdin.on('error', error => {
  throw error;
});
