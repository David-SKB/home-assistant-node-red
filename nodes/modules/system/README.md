# Project Name Test Suite

This repository contains the test suite for [Project Name]. It includes unit tests, integration tests, or end-to-end tests to ensure the correctness and robustness of the application.

## Prerequisites

Before running the tests, make sure you have the following prerequisites installed:

- Node.js and npm (or yarn) - [Download and Install Node.js](https://nodejs.org/)
- Git - [Download and Install Git](https://git-scm.com/)

## Installation

To install the test suite, follow these steps:

1. Clone the repository to your local machine:
```shell
git clone <repository-url>
```
2. Navigate to the project directory:
```shell
cd node-red/nodes/modules/system
```
3. Install dependencies using npm or yarn:
```shell
npm install
# or
yarn install
```
## Running Tests

To run the tests:

### Unit tests

#### Terminal:

```shell
npm test
# or
yarn test
```
*This command will execute all tests in the project and provide a summary of the test results.*

#### VS code editor:

Install the [jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest) extension and use the following command:
```bash
ctrl+shift+p >Jest:Toggle Coverage
```

## Customizing Tests
You can customize the behavior of the test suite by modifying the Jest configuration in the jest.config.js file. Refer to the Jest documentation for more information on Jest configuration options.

## Contributing
If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request. Contributions are welcome!

## License
This project is licensed under the MIT License.