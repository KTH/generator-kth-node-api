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
        default: true
      },
      {
        type: 'confirm',
        name: 'useSwagger',
        message: 'Would you like to use Swagger?',
        default: false
      }
    ]

    return this.prompt(prompts).then(props => {
      props.name = props.name.replace(/\s/g, '-')
      this.props = props
    })
  }

  writing () {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
     { name: this.props.name }
   )

   this.fs.copyTpl(
     this.templatePath('server/server.js'),
     this.destinationPath('server/server.js'),
    { useAuth: this.props.useAuth,
      useMongo: this.props.useMongo,
      useSwagger: this.props.useSwagger }
  )

   if(this.props.useAuth){
     this.fs.copy(
       this.templatePath('server/authentication.js'),
       this.destinationPath('server/authentication.js')
    )
   }


   // Copy every other file
   this.fs.copy(
     this.templatePath('*/!(swagger.json|package.json|server.js)'),
     this.destinationPath('.'),
     {skip: true}
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

    if (this.props.useAuth) {
      this.npmInstall(['passport'], { 'save': true })
    }

    // this.log('Running npm install for you')
    // this.npmInstall()
  }
}
