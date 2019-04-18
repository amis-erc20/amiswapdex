import crypto from 'shardus-crypto-web'
import moment from 'moment'
import axios from 'axios'
axios.defaults.timeout = 100000
crypto.initialize(
	'69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc'
)

async function init() {
	await crypto.initialize(
		'69fa4195670576c0160d660c3be36556ff8d504725be8a59b5a96509e0c994bc'
	)
}

init()

function getRandomNumber(byte = 32) {
	return crypto.randomBytes(byte)
}
async function keyStretchPassword(password, times = 5) {
	if (!password) throw new Error('No password provide to key strech')
	return new Promise(resolve => {
		let keyStrechedPassword = password
		let start = Date.now()
		let current = start
		for (let i = 0; i < times; i += 1) {
			keyStrechedPassword = crypto.hash(keyStrechedPassword)
		}
		// while (current - start < 1000) {
		//     keyStrechedPassword = crypto.hash(keyStrechedPassword)
		//     current = Date.now()
		// }
		let end = Date.now()
		console.log(`Time elapsed: ${end - start}`)
		resolve(keyStrechedPassword)
	})
}
export default { init, getRandomNumber, keyStretchPassword: keyStretchPassword }
