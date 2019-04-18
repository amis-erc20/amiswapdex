/* eslint-disable */
import GDrive from './GDrive'

const permissions = './Permissions'

export default class Permissions {
	create(fileId, params) {
		const body = JSON.stringify(params)

		return fetch(`${GDrive._urlFiles}/${fileId}${permissions}`, {
			method: 'POST',
			headers: GDrive._createHeaders(GDrive._contentTypeJson, body.length),
			body
		})
	}
}
