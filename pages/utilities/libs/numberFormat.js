export const numberFormat = (number) => {
	if (Intl.NumberFormat.supportedLocalesOf(['id-ID']).length > 0) {
		const formatter = new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		})

		const formattedNumber = formatter.format(number)
		return formattedNumber
	} else {
		return `Rp${number}`
	}
}
