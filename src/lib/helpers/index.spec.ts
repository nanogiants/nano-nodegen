import { validatePackageJsonName } from '.';

describe('validatePackageJsonName()', () => {
  describe('given valid name', () => {
    it('should return true', () => {
      expect(validatePackageJsonName('valid')).toBe(true);
    });
  });

  describe('given invalid name', () => {
    it('should return false', () => {
      expect(validatePackageJsonName('Invalid')).toBe(false);
    });
  });
});
