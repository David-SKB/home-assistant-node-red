const fs = require('fs');

// Function to create a mock function node
const mockFunction = (filePath) => {
    console.log(`Mocking function node from file: ${filePath}`);
    console.log(filePath);
    // log current working directory
    console.log(process.cwd());
  
    // Read the function node code from the file
    const functionCode = fs.readFileSync(filePath, 'utf8');
  
    // Return an object with an execute method
    return {
        // Method to execute the mock function node
        execute: (context, env, msg, global) => {
            // Mocked node object
            const node = {
                warn: jest.fn((message) => console.log(`[NODE.WARN]: ${message}`)),
                send: jest.fn((message) => console.log(`[NODE.SEND]: ${JSON.stringify(message)}`))
            };
            console.log(`msg: ${msg}`);
            console.log(msg);

            console.log(`global: ${global}`);
            console.log(global);
            const executeFunction = eval(`function execute(context, env, msg, global) {\n${functionCode}\n}`);
            // Execute the function node code with the provided arguments
            const wrappedFunction = new Function('context', 'env', 'msg', 'node', 'global', executeFunction);
            return wrappedFunction(context, env, msg, node, global);
            // Execute the function node code
            // const execute = eval(`(${functionCode})`);
            // return execute(context, env, msg, node, global);
            return executeFunction(context, env, msg, global);

            function Date(n) {
                return [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ][n % 7 || 0];
              }
              function runCodeWithDateFunction(obj) {
                return Function("Date", `"use strict";return (${obj});`)(Date);
              }
              console.log(runCodeWithDateFunction("Date(5)")); // Saturday
              
        }
    };
};

module.exports = mockFunction;
