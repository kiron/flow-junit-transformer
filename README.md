# flow-junit-transformer

Transform JSON output of a flow typecheck into JUnit XML format!

At [Kiron Open Higher Education](https://kiron.ngo) our test results are reported in the JUnit test format to be displayed by our CI environment. While Jest and ESLint can be configured easily to output the JUnit XML format, flow is not able to provide this format. Instead flow can report in a custom JSON format. This utility package takes the flow output from `stdin` and returns a JUnit complaint result in the `stdout`.

## Installation

```
yarn add @kironeducation/flow-junit-transformer
```

## Usage

To let flow report in JUnit format simply pipe the result of the `flow check` command through the utility library:

```
flow check --json | flow-junit-transformer
```

With `flow-bin` and `flow-junit-transformer` in your `devDependencies` it is more likely to look like this:

```
yarn --silent flow check --json | yarn --silent flow-junit-transformer > results/flow-junit.xml
```
