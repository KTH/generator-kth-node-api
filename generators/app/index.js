'use strict'
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const path = require('path')

module.exports = class extends Generator {
  prompting () {
    // Have Yeoman greet the user.
    this.log(yosay(
      "Dags att skapa ett nytt api!"
    ))

    this.log(this.sourceRoot(), )
    this.log('hi!')
    const prompts = [
      {
        type: 'text',
        name: 'name',
        message: "What's the name of the app?",
        default: process.cwd().split(path.sep).pop()
      },
      // {
      //   type: 'confirm',
      //   name: 'useMongo',
      //   message: 'Would you like to use a Mongo database?',
      //   default: true
      // },
      // {
      //   type: 'confirm',
      //   name: 'useSwagger',
      //   message: 'Would you like to use Swagger?',
      //   default: true
      // },
      // {
      //   type: 'confirm',
      //   name: 'useAuth',
      //   message: 'Would you like to use authentication?',
      //   default: true
      // }
      // TODO: robots.txt?
    ]

    return this.prompt(prompts).then(props => {
      props.name = props.name.replace(/\s/g, '-') // No whitespce in name
      this.props = props
    })
  }

  writing () {

    this.fs.copy(
      this.templatePath('.env'),
      this.destinationPath('.env')
   )

   this.fs.copy(
     this.templatePath('.gitignore'),
     this.destinationPath('.gitignore')
  )

  this.fs.copy(
    this.templatePath('.dockerignore'),
    this.destinationPath('.dockerignore')
 )

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

      this.fs.copy(
       this.templatePath('server/models/index.js'),
       this.destinationPath('server/models/index.js')
     )

     this.fs.copy(
       this.templatePath('server/controllers/sampleCtrl.js'),
       this.destinationPath('server/controllers/sampleCtrl.js')
     )
     this.fs.copy(
       this.templatePath('server/models/sample.js'),
       this.destinationPath('server/models/sample.js')
     )
    }

    if (this.props.useSwagger) {
      this.fs.copy(
      this.templatePath('swagger.json'),
      this.destinationPath('swagger.json')
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
