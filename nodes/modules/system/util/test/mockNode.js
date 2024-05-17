// Function to mock the node object
const mockNode = (node) => {
    // Mocked warn function that logs the message to the console
    node.warn = (message) => console.log(`[WARN]: ${message}`);
    // Mocked send function that logs the message to the console and returns the message as-is
    node.send = (message) => {
      console.log(`[SEND]: ${JSON.stringify(message)}`);
      return message;
    };
    // Return the modified node object
    return node;
  };
  
  // Export the mockNode function
  module.exports = mockNode;