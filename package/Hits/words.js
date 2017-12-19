const Words = new Map()

//exports
module.exports = get_words
module.exports.find = find

//shared actions
function find(result,inputs,words,parent,data_name){
	for(let name in inputs){
		let data = find_input(name,words,parent,data_name)
		if(data.hits) result.push(data)
		find(result,inputs[name],words,parent ? `${parent}.${name}`:name,data_name)
		
	}
	return result
}

function find_input(name,words,parent,data_name){
	let input_words = Words.has(name) ? Words.get(name):Words.set(name,get_words(name)).get(name)
	return {name,hits:match(input_words,words),parent,data_name}
}

function get_words(text){
	return text.split(' ')
	           .map(word=>word.trim().toLowerCase())
	           .filter(word=>word.length)
}

function match(a,b){
	let main = a.length > b.length ? a:b
	let min = main === a ? b:a
	let matches = (main.filter(word=>min.includes(word)).length * 0.1)
	let phrase = a.join(' ')
	let query = b.join(' ')
	matches += (phrase.includes(query) ? 2:0)
	matches += (query.includes(phrase) ? 2:0)
	matches += (b.filter(word=>phrase.includes(word))).length * 0.2
	matches += (a.filter(word=>query.includes(word))).length * 0.2
	return matches
}