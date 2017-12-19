const JsSearch = require('js-search')
const fxy = require('fxy')

class Search{
	constructor(main_index='name'){
		this.controller = get_controller(main_index)
	}
	add(file,on_data){
		let data = fxy.json.read_sync(file)
		if(on_data) on_data(data,this)
		this.add_documents(...data)
		return this
	}
	add_index(index){
		this.controller.addIndex(index)
		return this
	}
	add_documents(...documents){
		this.controller.addDocuments(documents)
		return this
	}
	text(input){ return this.controller.search(input) }
}

//exports
module.exports = Search

//shared actions
function get_controller(main_index='name'){
	const search = new JsSearch.Search(main_index)
	
	let stemmer = new JsSearch.StemmingTokenizer(require('stemmer'),new JsSearch.SimpleTokenizer())
	search.tokenizer = new JsSearch.StopWordsTokenizer(stemmer)
	return search
}