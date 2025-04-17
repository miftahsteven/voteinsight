import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'

import api from '../../utilities/libs/axios'
//import { useRouter } from 'next/router'

const request = async (params = {}) => {
	const { page = 1 } = params || {}
	const { data } = await api.request({
		method: 'GET',
		url: '/recruitment/all-vacant-position',
		params: {
			page,
			...params,
		},
	})
	return data
}

const useQueryPositionSelect = (params = {}) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['all-positions-select', request(params)],
		queryFn: () => request(params),
	})
	console.log('111111', JSON.stringify(data));

	return data
}

export default useQueryPositionSelect
