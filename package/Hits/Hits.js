const fxy = require('fxy')
const uuid = require('uuid')
const Utility = require('./Utility')
const Converter = require('./Converter')
const Hits = Base => class extends Base{
	hits(text){
		if(!this.loaded) this.load()
		let words = Utility.words(text)
		let results = []
		for(let name in this.data){
			let data = this.data[name]
			Utility.words.find(results,data,words,null,name)
		}
		return this.update(text,Utility.result(this,results))
	}
	get loaded(){ return  'converter' in this && 'data' in this && 'identity' in this }
	
	update(text,result){
		for(let name in this.identity){
			let file = fxy.join(this.folder,this.settings.identity || 'identity',`${name}.json`)
			let document = Array.from(this.identity[name])
			fxy.json.writeSync(file,document)
		}
		return {
			text,
			get file(){ return `${fxy.id.dash(this.text)}.json` },
			save(...parts) {
				let file = fxy.join(...parts)
				if (file.includes('.json') === false) file += '.json'
				return fxy.json.write(file,result.data())
			},
			toString(){ return result+'' }
		}
	}
}