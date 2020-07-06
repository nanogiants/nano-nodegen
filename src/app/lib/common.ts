import Generator from 'yeoman-generator';

import { Filenames } from '../../enums/filenames';
interface IConfig {
  title: string;
  author: string;
}

export const createBase = (ctx: Generator, config: IConfig): void => {
  const { title, author } = config;
  ctx.fs.copy(
    ctx.templatePath(Filenames.TS_CONFIG),
    ctx.destinationPath(Filenames.TS_CONFIG)
  );

  ctx.fs.copy(
    ctx.templatePath(Filenames.GIT_IGNORE),
    ctx.destinationPath(Filenames.GIT_IGNORE)
  );

  ctx.fs.copy(
    ctx.templatePath(Filenames.SRC_FOLDER),
    ctx.destinationPath(Filenames.SRC_FOLDER)
  );

  ctx.fs.copyTpl(
    ctx.templatePath(Filenames.PACKAGE_JSON),
    ctx.destinationPath(Filenames.PACKAGE_JSON),
    {
      title,
      author,
    }
  );
};
