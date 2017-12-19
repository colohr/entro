const dati = require('dati')
const search_value = Symbol.for('search')

class Interpolator extends dati.Project{
	constructor(source){
		super(source.folder)
		this.source = source
	}
	get converter(){ return get_converter(this) }
	get data_source(){ return get_data_source(this) }
	load(...conversion_inputs){
		const converter = this.converter
		const data_source = this.data_source
		const data = {}
		for(let [name,item] of data_source){
			const convert = converter[name]
			if(convert) {
				conversion_inputs.push(this.utility)
				data[name] = convert({item,name,source:data_source},...conversion_inputs)
			}
			else data[name] = item
		}
		this.data=data
		//console.log(data)
		return this
	}
	get search(){ return get_search(this) }
	
}

//exports
module.exports = Interpolator

//shared actions
function get_converter(interpolator){
	const source = interpolator.source.items.interpolator
	if(source) return source.converter
	return null
}

function get_data_source(interpolator){
	const data = interpolator.source.items.interpolator
	if(data) return data.source
	return null
}

function get_search(interpolator){
	if(search_value in interpolator) return interpolator[search_value]
	const Search = require('../Search')
	return interpolator[search_value] = new Search()
}

//const fxy = require('fxy')
//const identity = require('./identity')