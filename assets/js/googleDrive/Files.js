/* eslint-disable */
// import RNFS from "react-native-fs";
import utf8 from 'utf8'
import GDrive from './GDrive'

const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files'

class StaticUtils {
	static colorNames = {
		aliceblue: 0xf0f8ffff,
		antiquewhite: 0xfaebd7ff,
		aqua: 0x00ffffff,
		aquamarine: 0x7fffd4ff,
		azure: 0xf0ffffff,
		beige: 0xf5f5dcff,
		bisque: 0xffe4c4ff,
		black: 0x000000ff,
		blanchedalmond: 0xffebcdff,
		blue: 0x0000ffff,
		blueviolet: 0x8a2be2ff,
		brown: 0xa52a2aff,
		burlywood: 0xdeb887ff,
		cadetblue: 0x5f9ea0ff,
		chartreuse: 0x7fff00ff,
		chocolate: 0xd2691eff,
		coral: 0xff7f50ff,
		cornflowerblue: 0x6495edff,
		cornsilk: 0xfff8dcff,
		crimson: 0xdc143cff,
		cyan: 0x00ffffff,
		darkblue: 0x00008bff,
		darkcyan: 0x008b8bff,
		darkgoldenrod: 0xb8860bff,
		darkgray: 0xa9a9a9ff,
		darkgreen: 0x006400ff,
		darkgrey: 0xa9a9a9ff,
		darkkhaki: 0xbdb76bff,
		darkmagenta: 0x8b008bff,
		darkolivegreen: 0x556b2fff,
		darkorange: 0xff8c00ff,
		darkorchid: 0x9932ccff,
		darkred: 0x8b0000ff,
		darksalmon: 0xe9967aff,
		darkseagreen: 0x8fbc8fff,
		darkslateblue: 0x483d8bff,
		darkslategrey: 0x2f4f4fff,
		darkturquoise: 0x00ced1ff,
		darkviolet: 0x9400d3ff,
		deeppink: 0xff1493ff,
		deepskyblue: 0x00bfffff,
		dimgray: 0x696969ff,
		dimgrey: 0x696969ff,
		dodgerblue: 0x1e90ffff,
		firebrick: 0xb22222ff,
		floralwhite: 0xfffaf0ff,
		forestgreen: 0x228b22ff,
		fuchsia: 0xff00ffff,
		gainsboro: 0xdcdcdcff,
		ghostwhite: 0xf8f8ffff,
		gold: 0xffd700ff,
		goldenrod: 0xdaa520ff,
		gray: 0x808080ff,
		green: 0x008000ff,
		greenyellow: 0xadff2fff,
		grey: 0x808080ff,
		honeydew: 0xf0fff0ff,
		hotpink: 0xff69b4ff,
		indianred: 0xcd5c5cff,
		indigo: 0x4b0082ff,
		ivory: 0xfffff0ff,
		khaki: 0xf0e68cff,
		lavender: 0xe6e6faff,
		lavenderblush: 0xfff0f5ff,
		lawngreen: 0x7cfc00ff,
		lemonchiffon: 0xfffacdff,
		lightblue: 0xadd8e6ff,
		lightcoral: 0xf08080ff,
		lightcyan: 0xe0ffffff,
		lightgoldenrodyellow: 0xfafad2ff,
		lightgray: 0xd3d3d3ff,
		lightgreen: 0x90ee90ff,
		lightgrey: 0xd3d3d3ff,
		lightpink: 0xffb6c1ff,
		lightsalmon: 0xffa07aff,
		lightseagreen: 0x20b2aaff,
		lightskyblue: 0x87cefaff,
		lightslategrey: 0x778899ff,
		lightsteelblue: 0xb0c4deff,
		lightyellow: 0xffffe0ff,
		lime: 0x00ff00ff,
		limegreen: 0x32cd32ff,
		linen: 0xfaf0e6ff,
		magenta: 0xff00ffff,
		maroon: 0x800000ff,
		mediumaquamarine: 0x66cdaaff,
		mediumblue: 0x0000cdff,
		mediumorchid: 0xba55d3ff,
		mediumpurple: 0x9370dbff,
		mediumseagreen: 0x3cb371ff,
		mediumslateblue: 0x7b68eeff,
		mediumspringgreen: 0x00fa9aff,
		mediumturquoise: 0x48d1ccff,
		mediumvioletred: 0xc71585ff,
		midnightblue: 0x191970ff,
		mintcream: 0xf5fffaff,
		mistyrose: 0xffe4e1ff,
		moccasin: 0xffe4b5ff,
		navajowhite: 0xffdeadff,
		navy: 0x000080ff,
		oldlace: 0xfdf5e6ff,
		olive: 0x808000ff,
		olivedrab: 0x6b8e23ff,
		orange: 0xffa500ff,
		orangered: 0xff4500ff,
		orchid: 0xda70d6ff,
		palegoldenrod: 0xeee8aaff,
		palegreen: 0x98fb98ff,
		paleturquoise: 0xafeeeeff,
		palevioletred: 0xdb7093ff,
		papayawhip: 0xffefd5ff,
		peachpuff: 0xffdab9ff,
		peru: 0xcd853fff,
		pink: 0xffc0cbff,
		plum: 0xdda0ddff,
		powderblue: 0xb0e0e6ff,
		purple: 0x800080ff,
		rebeccapurple: 0x663399ff,
		red: 0xff0000ff,
		rosybrown: 0xbc8f8fff,
		royalblue: 0x4169e1ff,
		saddlebrown: 0x8b4513ff,
		salmon: 0xfa8072ff,
		sandybrown: 0xf4a460ff,
		seagreen: 0x2e8b57ff,
		seashell: 0xfff5eeff,
		sienna: 0xa0522dff,
		silver: 0xc0c0c0ff,
		skyblue: 0x87ceebff,
		slateblue: 0x6a5acdff,
		slategray: 0x708090ff,
		snow: 0xfffafaff,
		springgreen: 0x00ff7fff,
		steelblue: 0x4682b4ff,
		tan: 0xd2b48cff,
		teal: 0x008080ff,
		thistle: 0xd8bfd8ff,
		tomato: 0xff6347ff,
		turquoise: 0x40e0d0ff,
		violet: 0xee82eeff,
		wheat: 0xf5deb3ff,
		white: 0xffffffff,
		whitesmoke: 0xf5f5f5ff,
		yellow: 0xffff00ff,
		yellowgreen: 0x9acd32ff
	}

	static round(value, decimals, symmetric) {
		// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
		// MarkG's answer.

		let result = value

		if (decimals != undefined) {
			const multiplier = !symmetric ? undefined : result < 0 ? -1 : 1

			result =
				Number(
					Math.round(
						(multiplier ? Math.abs(result) : result) + 'e' + decimals
					) +
					'e-' +
					decimals
				) * (multiplier || 1)
		}

		return result
	}

	static encodedUtf8ToByteArray(encoded) {
		const ar = []

		for (let i = 0; i < encoded.length; i++) {
			ar.push(encoded.charCodeAt(i))
		}

		return ar
	}

	static ensureBounds(value, min, max) {
		if (max < min) {
			throw new Error("'min' must not exceed 'max'")
		}

		return Math.max(Math.min(value, max), min)
	}

	static pushAndReturnElement(array, element) {
		array.push(element)

		return element
	}

	static quoteIfString(value, quotingSymbol = '"') {
		return value.constructor == String ?
			`${quotingSymbol}${value}${quotingSymbol}` :
			value
	}

	static safeQuoteIfString(value, quoteIfString, quotingSymbol) {
		return quoteIfString ?
			StaticUtils.quoteIfString(value, quotingSymbol) :
			value
	}

	static objectToArray(object) {
		return Object.keys(object).reduce((p, c) => {
			p.push(object[c])

			return p
		}, [])
	}

	static escapeRegExp(string) {
		// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	static replaceAll(string, find, replace) {
		// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript

		return string.replace(
			new RegExp(StaticUtils.escapeRegExp(find), 'g'),
			replace
		)
	}

	static deg2Rad(degrees) {
		return (degrees * Math.PI) / 180
	}

	static color(color) {
		return typeof color == 'string' ? StaticUtils.colorNames[color] : color
	}

	static random(min, max, round, maxInclusive) {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

		const mn = round ? Math.ceil(min) : min
		const mx = round ? Math.floor(max) : max
		const rnd = Math.random() * (mx - mn + (round && maxInclusive ? 1 : 0))

		return (round ? Math.floor(rnd) : rnd) + mn
	}

	static verify(condition, errorMessage) {
		if (!condition) {
			throw new Error(errorMessage)
		}
	}
}

function setPrefixOrPostfix(obj, prefix, string, addIfArrayLength) {
	obj[prefix ? 'prefix' : 'postfix'] = {
		string,
		addIfArrayLength
	}

	return obj
}

class ArrayStringifier {
	constructor(array) {
		this.setArray(array).setSeparator(', ')
	}

	setPrefix(prefix, addIfArrayLength = true) {
		return setPrefixOrPostfix(this, true, prefix, addIfArrayLength)
	}

	setArray(array) {
		this.array = array

		return this
	}

	setSeparator(separator) {
		this.separator = separator

		return this
	}

	setElementProcessor(elementProcessor) {
		this.elementProcessor = elementProcessor

		return this
	}

	setPostfix(postfix, addIfArrayLength = true) {
		return setPrefixOrPostfix(this, false, postfix, addIfArrayLength)
	}

	process() {
		let str =
			this.prefix && (!this.prefix.addIfArrayLength || this.array.length) ?
			this.prefix.string :
			''

		for (let i = 0; i < this.array.length; i++) {
			const rawElement = this.elementProcessor ?
				this.elementProcessor(this.array[i]) :
				this.array[i]

			const element = rawElement.hasOwnProperty('getElement') ?
				rawElement.getElement() :
				rawElement

			const separator =
				i == this.array.length - 1 ?
				'' :
				element == rawElement ?
				this.separator :
				rawElement.getSeparator()

			str += `${element}${separator}`
		}

		if (this.postfix && (!this.postfix.addIfArrayLength || this.array.length)) {
			str += this.postfix.string
		}

		return str
	}

	toString() {
		return this.process()
	}
}

function _stringifyQueryParams(
	queryParams,
	prefix = '?',
	separator = '&',
	quoteIfString
) {
	const array = []

	Object.keys(queryParams).forEach(key =>
		array.push(
			`${key}=${StaticUtils.safeQuoteIfString(queryParams[key], quoteIfString)}`
		)
	)

	return new ArrayStringifier(array)
		.setPrefix(prefix)
		.setSeparator(separator)
		.process()
}

export default class Files {
	static mimeFolder = 'application/vnd.google-apps.folder'

	constructor(params = {}) {
		this.params = params

		;
		[
			['boundary', 'foo_bar_baz']
		].forEach(
			nameValue =>
			(this.params[nameValue[0]] = this.params[nameValue[0]] || nameValue[1])
		)
	}

	createFileMultipart(media, mediaType, metadata) {
		const ddb = `--${this.params.boundary}`
		const ending = `\n${ddb}--`

		let body =
			`\n${ddb}\n` +
			`Content-Type: ${GDrive._contentTypeJson}\n\n` +
			`${JSON.stringify(metadata)}\n\n${ddb}\n` +
			`Content-Type: ${mediaType}\n\n`

		if (media.constructor == String) {
			body += `${media}${ending}`
		} else {
			body = new Uint8Array(
				StaticUtils.encodedUtf8ToByteArray(utf8.encode(body))
				.concat(media)
				.concat(StaticUtils.encodedUtf8ToByteArray(utf8.encode(ending)))
			)
		}

		return fetch(`${uploadUrl}?uploadType=multipart`, {
			method: 'POST',
			headers: GDrive._createHeaders(
				`multipart/related; boundary=${this.params.boundary}`,
				body.length
			),
			body
		})
	}

	delete(fileId) {
		return fetch(`${GDrive._urlFiles}/${fileId}`, {
			method: 'DELETE',
			headers: GDrive._createHeaders()
		})
	}

	async safeCreateFolder(metadata) {
		let id = await this.getId(metadata.name, metadata.parents, Files.mimeFolder)

		if (!id) {
			metadata.mimeType = Files.mimeFolder

			const body = JSON.stringify(metadata)

			let result = await fetch(GDrive._urlFiles, {
				method: 'POST',
				headers: GDrive._createHeaders(GDrive._contentTypeJson, body.length),
				body
			})

			if (!result.ok) {
				throw result
			}

			id = (await result.json()).id
		}
		return id
	}

	async getId(name, parents, mimeType, trashed = false) {
		const queryParams = {
			name,
			trashed
		}

		if (mimeType) {
			queryParams.mimeType = mimeType
		}

		let result = await this.list({
			q: _stringifyQueryParams(queryParams, '', ' and ', true) +
				` and '${parents[0]}' in parents`
		})

		if (!result.ok) {
			throw result
		}

		const file = (await result.json()).files[0]

		return file ? file.id : file
	}

	get(fileId, queryParams) {
		const parameters = _stringifyQueryParams(queryParams)

		return fetch(`${GDrive._urlFiles}/${fileId}${parameters}`, {
			headers: GDrive._createHeaders()
		})
	}

	// download(fileId, downloadFileOptions, queryParams = {}) {
	//   queryParams.alt = "media";

	//   const parameters = _stringifyQueryParams(queryParams);

	//   downloadFileOptions.fromUrl = `${GDrive._urlFiles}/${fileId}${parameters}`;

	//   downloadFileOptions.headers = Object.assign({
	//     "Authorization": `Bearer ${GDrive.accessToken}`
	//   }, downloadFileOptions.headers);

	//   return RNFS.downloadFile(downloadFileOptions);
	// }

	list(queryParams) {
		return fetch(`${GDrive._urlFiles}${_stringifyQueryParams(queryParams)}`, {
			headers: GDrive._createHeaders()
		})
	}

	export (fileId, mimeType) {
		return fetch(`${GDrive._urlFiles}/${fileId}/export?mimeType=${mimeType}`, {
			headers: GDrive._createHeaders()
		})
	}
}