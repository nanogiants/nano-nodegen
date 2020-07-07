import { pingpong } from './hello';

describe('pingpong()', () => {
  describe('given specific type to function', () => {
    const testString = 'Hello World!';
    const testNumber = 5;
    it('should return correct type', () => {
      expect(typeof pingpong<number>(testNumber)).toBe(typeof testNumber);
      expect(typeof pingpong<string>(testString)).toBe(typeof testString);
    });
    it('should return correct value', () => {
      expect(pingpong<number>(testNumber)).toBe(testNumber);
      expect(pingpong<string>(testString)).toBe(testString);
    });
  });
});
