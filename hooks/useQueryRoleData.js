import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'

import api from '../utilities/libs/axios'

const request = async (params = {}) => {
	const { page = 1 } = params || {}
	const { data } = await api.request({
		method: 'GET',
		url: '/role/all',
		params: {
			page,
			...params,
		},
	})

	return data
}

const useQueryRoleData = (params = {}) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['all-role', request(params)],
		queryFn: () => request(params),
	})
	if (error && error.response && error.response.status === 502) {
		//alert(error.response.data?.message ?? error?.message)
		window.location = '/auth/login?sessionNull=true'
	}
	//if error not 502 just return alert
	if (error && error.response && error.response.status !== 502) {
		alert(error.response.data?.message ?? error?.message)
	}
	
	//console.log('0000', JSON.stringify(data));
	return data
}

export default useQueryRoleData
