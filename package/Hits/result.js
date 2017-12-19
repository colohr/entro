const fxy = require('fxy')
const hits = Symbol.for('hits')
const data_name_value = Symbol('data name')
class Hits extends Map{
	constructor(interpolator,results){
		super()
		this.id = (...x)=>interpolator.id(...x)
		const map = this
		for(let name in results){
			let result = results[name]
			let category = get_category(map,name,result)
			if(category.id) this.set(category.id,category)
		}
	}
	data(){ return Array.from(this.values()).sort(sort_hits) }
	toString(){
		let values = this.data()
		return JSON.stringify(values,null,3)
	}
}

class Result{
	constructor(interpolator,result){
		this.value = combine(result)
		this.hits = new Hits(interpolator,this.value)
	}
	data(){
		return {
			value:this.value,
			hits:this.hits.data()
		}
	}
	toString(){
		return JSON.stringify(this.data(),null,3)
	}
}


//exports
module.exports = get_result
module.exports.combine = combine
module.exports.hits = hits

//shared actions
function combine(result){
	let data = {}
	for(let item of result){
		let notation = `${item.parent}.${item.name}`
		let data_name = item.data_name
		if(!fxy.dot.has(data,notation)) fxy.dot.set(data,notation,{[hits]:0})
		let target = fxy.dot.get(data,notation)
		if(fxy.is.nothing(target[hits])) target[hits] = 0
		if(fxy.is.nothing(target[data_name_value])) target[data_name_value] = data_name
		target[hits] += item.hits
	}
	return data
}

function get_category(map,name,data,belongs_to){
	if(fxy.is.text(belongs_to) && belongs_to.length <= 0) belongs_to = null
	let identity = !belongs_to ? name:`${belongs_to}/${name}`
	let id = map.id(data[data_name_value],identity)
	let category = {name}
	if(id) category.id = id
	if(!fxy.is.nothing(belongs_to)) category.belongs_to = belongs_to
	if(hits in data) category.hits = data[hits]
	for(let i in data){
		if(fxy.is.text(i)){
			let value = data[i]
			let sub_category = get_category(map,i,value,identity)
			if(sub_category.id) map.set(sub_category.id,sub_category)
		}
	}
	return category
}

function get_result(interpolator,result){ return new Result(interpolator,result) }

function sort_hits(a,b){
	if(a.hits > b.hits) return -1
	if(a.hits < b.hits) return 1
	if(a.name > b.name) return 1
	if(a.name < b.name) return -1
	return 0
}