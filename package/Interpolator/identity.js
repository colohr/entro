const fxy = require('fxy')
const uuid = require('uuid')
const folder_preset = 'identity'
const identity_value = Symbol('identity')
//exports
module.exports = get_id

//shared actions
function get_id(interpolator,data_name,name){
	if(!data_name) return null //console.log('invalid data name',data_name,name)
	let identities = get_identities(interpolator)
	let ids = identities[data_name]
	if(ids){
		if(!ids.has(name)) ids.set(name,uuid.v4())
		return ids.get(name)
	}
	return null
}

function get_identities(interpolator){
	if(identity_value in interpolator) return interpolator[identity_value]
	let data = interpolator.data
	let folder = get_folder(interpolator)
	let identity = {}
	for(let name of data.keys()){
		let file = fxy.join(folder,`${name}.map.json`)
		let value = null
		if(!fxy.exists(file)) {
			value = new Map()
			fxy.json.writeSync(file,Array.from(value))
		}
		else value = new Map(fxy.json.readSync(file))
		identity[name] = value
	}
	return interpolator[identity_value] = identity
}

function get_folder(interpolator){
	let source = interpolator.source.modules.get('interpolator').get_item('identity')
	let folder = null
	if(source) folder = source.folder
	else folder = folder_preset
	return interpolator.utility.required.folder(interpolator,folder)
}