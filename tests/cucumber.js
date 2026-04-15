module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['./steps/**/*.ts', './support/**/*.ts'],
    paths: ['./features/**/*.feature'],
    format: ['progress-bar', 'summary', 'progress'],
    language: 'fr',
    publishQuiet: true
  }
}
