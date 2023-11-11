process.env.ENV_NAME = 'test';

module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['<rootDir>/test/setup', '<rootDir>/test/autoclean'],
  // https://github.com/shelfio/jest-mongodb#6-jest-watch-mode-gotcha
  watchPathIgnorePatterns: ['globalConfig'],
};
