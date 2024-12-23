const indentString = require('../../../../util/common/indentString');

describe('indentString', () => {
  it('should indent a single line string by default (2 spaces)', () => {
    const input = 'This is a single line';
    const expected = '  This is a single line'; // Indented by 2 spaces
    expect(indentString(input)).toBe(expected);
  });

  it('should indent a single line string by the specified number of spaces', () => {
    const input = 'This is a single line';
    const expected = '      This is a single line'; // Indented by 6 spaces
    expect(indentString(input, 6)).toBe(expected);
  });

  it('should indent multiple lines by the default 2 spaces', () => {
    const input = `Line 1
Line 2
Line 3`;
    const expected = `  Line 1
  Line 2
  Line 3`;
    expect(indentString(input)).toBe(expected);
  });

  it('should indent multiple lines by the specified number of spaces', () => {
    const input = `Line 1
Line 2
Line 3`;
    const expected = `        Line 1
        Line 2
        Line 3`; // Each line indented by 8 spaces
    expect(indentString(input, 8)).toBe(expected);
  });

  it('should handle empty strings correctly', () => {
    const input = '';
    const expected = '  ';
    expect(indentString(input)).toBe(expected);
  });

  it('should handle a string with leading whitespace', () => {
    const input = `  Line 1
  Line 2`;
    const expected = `    Line 1
    Line 2`; // Adds 2 spaces to each line of the string
    expect(indentString(input)).toBe(expected);
  });

  it('should handle a string with multiple blank lines', () => {
    const input = `Line 1

Line 3`;
    const expected = `  Line 1
  
  Line 3`;
    expect(indentString(input)).toBe(expected);
  });

  it('should handle string with newlines only', () => {
    const input = `\n\n`;
    const expected = `  \n  \n  `;
    expect(indentString(input)).toBe(expected);
  });

  it('should indent a string with a single line and no newlines', () => {
    const input = 'SingleLineNoNewline';
    const expected = '  SingleLineNoNewline';
    expect(indentString(input)).toBe(expected);
  });

  it('should handle a string with special characters', () => {
    const input = `Special! @#$%^&*()_+`;
    const expected = `  Special! @#$%^&*()_+`;
    expect(indentString(input)).toBe(expected);
  });
});
