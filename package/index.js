const Interpolator = require('./Interpolator')

//exports
module.exports = (...x)=>new Interpolator(...x)
module.exports.Search = require('./Search')