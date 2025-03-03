import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'

import api from '../../utilities/libs/axios'
//import { useRouter } from 'next/router'

const request = async (params = {}) => {
	const { page = 1 } = params || {}
	const { data } = await api.request({
		method: 'GET',
		url: '/auth/all-type',
		params: {
			page,
			...params,
		},
	})
	return data
}

const useQueryType = (params = {}) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['all-type', request(params)],
		queryFn: () => request(params),
	})
	console.log('0000', JSON.stringify(data));

	return data
}

export default useQueryType
