const stripCharacter = require("../../../../util/common/stripCharacter");

describe('stripCharacter', () => {

    it('should remove specified character from the beginning and end of the string', () => {
        expect(stripCharacter('***example***', '*')).toBe('example');
        expect(stripCharacter('###test###', '#')).toBe('test');
        expect(stripCharacter('!!!hello!!!', '!')).toBe('hello');
    });

    it('should remove only the specified character', () => {
        expect(stripCharacter('***example***', '*')).toBe('example');
        expect(stripCharacter('***example###', '#')).toBe('***example');
        expect(stripCharacter('###example***', '#')).toBe('example***');
    });

    it('should remove multiple instances of the character from the beginning and end', () => {
        expect(stripCharacter('****example****', '*')).toBe('example');
        expect(stripCharacter('####test####', '#')).toBe('test');
        expect(stripCharacter('!!!hello!!!', '!')).toBe('hello');
    });

    it('should handle strings with no specified character at the edges', () => {
        expect(stripCharacter('example', '*')).toBe('example');
        expect(stripCharacter('test', '#')).toBe('test');
        expect(stripCharacter('hello', '!')).toBe('hello');
    });

    it('should handle empty strings', () => {
        expect(stripCharacter('', '*')).toBe('');
        expect(stripCharacter('', '#')).toBe('');
    });

    test('should handle strings that are entirely the specified character', () => {
        expect(stripCharacter('****', '*')).toBe('');
        expect(stripCharacter('######', '#')).toBe('');
        expect(stripCharacter('!!!!!!', '!')).toBe('');
    });

    it('should handle special regex characters', () => {
        expect(stripCharacter('^^example^^', '^')).toBe('example');
        expect(stripCharacter('$$$test$$$', '$')).toBe('test');
        expect(stripCharacter('((hello))', '(')).toBe('hello))');
        expect(stripCharacter('[[world]]', ']')).toBe('[[world');
    });

    it('should remove double quotes by default', () => {
      expect(stripCharacter('""example""')).toBe('example');
    });

    it('should remove default character from the beginning and end of the string', () => {
      expect(stripCharacter('""example""')).toBe('example');
    });

});