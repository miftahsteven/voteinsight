import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'

import api from '../../utilities/libs/axios'
//import { useRouter } from 'next/router'

const request = async (params = {}) => {
	const { page = 1 } = params || {}
	const { data } = await api.request({
		method: 'GET',
		url: '/reference/dept-all',
		params: {
			page,
			...params,
		},
	})
	return data
}

const useQueryPosition = (params = {}) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['all-depts', request(params)],
		queryFn: () => request(params),
	})
	console.log('0000', JSON.stringify(data));

	return data
}

export default useQueryPosition
