import { Buffer } from 'buffer'

export default function decodeJWT(token) {
	if (typeof token !== 'string') {
		console.error('Invalid token:', token);
		return null; // Return null or handle the error appropriately
	}
	const base64Url = token?.split('.')[1] ?? ''
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
	const jsonPayload = decodeURIComponent(
		Buffer.from(base64, 'base64')
			.toString()
			.split('')
			.map(function (c) {
				return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
			})
			.join(''),
	)

	return JSON.parse(jsonPayload)
}
