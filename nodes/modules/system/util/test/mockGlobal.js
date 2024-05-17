// Mocked global object
const mockGlobal = {
    // Object to store mocked return values for global.get
    mockedValues: {},
    
    // Function to mock the global.get method
    get: (global_id) => {
      // Check if a mocked value exists for the global_id
      if (mockGlobal.mockedValues[global_id]) {
        return mockGlobal.mockedValues[global_id];
      } else {
        // Return null or any other default value if not mocked
        return undefined;
      }
    },
    
    // Function to set up mocked return value for global.get
    setReturnValue: (global_id, returnValue) => {
      mockGlobal.mockedValues[global_id] = returnValue;
    }
  };
  
  // Export the mockGlobal object
  module.exports = mockGlobal;
  