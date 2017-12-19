//module
module.exports = {
	get hits(){ return this.result.hits },
	get result(){ return require('./result') },
	get words(){ return require('./words') }
}