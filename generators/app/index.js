'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const path = require('path')

module.exports = class extends Generator {
  prompting () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the dandy ' + chalk.red('generator-kth-node-api') + ' generator!'
    ))

    this.log(this.sourceRoot(), )

    const prompts = [
      {
        type: 'text',
        name: 'name',
        message: "What's the name of the app?",
        default: process.cwd().split(path.sep).pop()
      },
      {
        type: 'confirm',
        name: 'useMongo',
        message: 'Would you like to use a Mongo database?',
        default: false
      },
      {
        type: 'confirm',
        name: 'useAuth',
        message: 'Would you like to use authentication?',
        default: false
      },
      {
        type: 'confirm',
        name: 'useSwagger',
        message: 'Would you like to use Swagger?',
        default: false
      },
      {
        type: 'confirm',
        name: 'useSamples',
        message: 'Would you like to generate sample code?',
        default: false
      }
      // TODO: robots.txt?
    ]

    return this.prompt(prompts).then(props => {
      props.name = props.name.replace(/\s/g, '-')
      this.props = props
    })
  }

  writing () {
    if (this.props.useAuth) {
      this.fs.copy(
      this.templatePath('server/authentication.js'),
      this.destinationPath('server/authentication.js')
   )
    }

    if (this.props.useMongo) {
      this.fs.copy(
      this.templatePath('server/database.js'),
      this.destinationPath('server/database.js')
   )

   // TODO: models
    }

    if (this.props.useSwagger) {
      this.fs.copy(
      this.templatePath('swagger.json'),
      this.destinationPath('swagger.json')
   )
    }

    if (this.props.useSamples) {
      this.fs.copy(
        this.templatePath('server/controllers/sampleCtrl.js'),
        this.destinationPath('server/controllers/sampleCtrl.js')
      )
      this.fs.copy(
        this.templatePath('server/models/sampleController.js'),
        this.destinationPath('server/models/sample.js')
      )
    }

   // Copy every other file
    this.fs.copyTpl(
     this.templatePath('**/*'),
     this.destinationPath('./'),
      this.props,
      {},
      {globOptions: {
        debug: false,
        ignore: ['**/authentication.js', '**/swagger.json', '**/database.js', '**/models/*', '**/*sample*']}})
  }

  install () {
    if (this.props.useMongo) {
      this.log('installing dependencies for MongoDB')
      this.npmInstall(['kth-node-mongo'], { 'save': true })
      this.npmInstall(['mongoose'], { 'save': true })
    }

    if (this.props.useSwagger) {
      this.log('installing dependencies for Swagger')
      this.npmInstall(['swagger-ui'], { 'save': true })
    }

    if (this.props.useAuth) {
      this.npmInstall(['passport'], { 'save': true })
    }

    // Install dev dependencies to make sure an up to date version is used
    this.npmInstall(['standard'], { 'save-dev': true })
    this.npmInstall(['nodemon'], { 'save-dev': true })
    this.npmInstall(['cross-env'], { 'save-dev': true })

    this.log('Running npm install for you')
    this.npmInstall()
  }
}
