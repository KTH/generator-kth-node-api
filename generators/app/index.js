'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')

module.exports = class extends Generator {
  prompting () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the dandy ' + chalk.red('generator-kth-node-api') + ' generator!'
    ))

    const prompts = [
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
    }
    ]

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props
    })
  }

  writing () {
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json')
    )
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

    if(this.props.useAuth){
      this.npmInstall(['passport'], { 'save': true })
    }

    // this.log('Running npm install for you')
    // this.npmInstall()
  }

  method1oeu () {
    this.log('method 1 just ran')
  }
}
