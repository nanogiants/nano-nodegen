/* eslint-disable @typescript-eslint/ban-ts-comment */
import assert from 'yeoman-assert';

import { Filenames } from '../lib/enums/filenames';
import { Names } from '../lib/enums/names';
import { GithubClient } from '../lib/helpers/github.client';
import { runBaseGenerator } from '../lib/test/helpers';

describe('licenses', () => {
  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(GithubClient.client, 'get').mockImplementation((url: string) => {
      if (url === 'licenses') {
        return Promise.resolve({ data: [{ name: 'mit', key: 'mit' }] });
      }
      if (url === 'licenses/mit') {
        return Promise.resolve({ data: 'test' });
      }
      return Promise.resolve({ data: 'test' });
    });
  });
  describe('given license selected', () => {
    describe('given fetching licenses failed', () => {
      beforeEach(() => {
        jest
          //@ts-ignore
          .spyOn(GithubClient.client, 'get')
          .mockImplementation((url: string) => {
            if (url === 'licenses') {
              return Promise.reject();
            }
            if (url === 'licenses/mit') {
              return Promise.resolve({ data: 'test' });
            }
            return Promise.resolve({ data: 'test' });
          });
      });
      it('should not create license file', async () => {
        await runBaseGenerator({
          [Names.WITH_LICENSE]: true,
        });

        assert.noFile(Filenames.LICENSE);
      });
    });
    describe('given fetching license failed', () => {
      beforeEach(() => {
        jest
          // @ts-ignore
          .spyOn(GithubClient.client, 'get')
          .mockImplementation((url: string) => {
            if (url === 'licenses') {
              return Promise.resolve({
                data: [{ name: 'mit', key: 'mit' }],
              });
            }
            if (url === 'licenses/mit') {
              return Promise.reject();
            }
            return Promise.resolve({ data: 'test' });
          });
      });
      it('should not create license file', async () => {
        await runBaseGenerator({
          [Names.WITH_LICENSE]: true,
        });

        assert.noFile(Filenames.LICENSE);
      });
    });
    describe('given fetching was successful', () => {
      it('should create license file', async () => {
        await runBaseGenerator({
          [Names.WITH_LICENSE]: true,
          [Names.LICENSE]: 'mit',
        });

        assert.file(Filenames.LICENSE);
      });
    });
  });

  describe('given no license selected', () => {
    it('should not create license file', async () => {
      await runBaseGenerator({
        [Names.WITH_LICENSE]: false,
      });

      assert.noFile(Filenames.LICENSE);
    });
  });
});
