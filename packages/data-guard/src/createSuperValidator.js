const assign = require('lodash/assign')
const mapValues = require('lodash/mapValues')
const Validators = require('./Validators')

function createSuperValidator (validators = []) {
  const superValidator = value => (
    validators.reduce((success, validator) => validator(value) && success, true)
  )

  assign(
    superValidator,
    mapValues(
      Validators,
      createValidator => (...args) => (
        createSuperValidator(validators.concat([createValidator(...args)]))
      )
    )
  )

  return superValidator
}

module.exports = createSuperValidator
