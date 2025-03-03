import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'

import api from '../../utilities/libs/axios'

const request = async (params = {}) => {
	const { page = 1 } = params || {}
	const { data } = await api.request({
		method: 'GET',
		url: '/role/menus',
		params: {
			page,
			...params,
		},
	})

	return data
}

const useQueryAllMenus = (params = {}) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['data-menus-all', request(params)],
		queryFn: () => request(params),
	})
	//console.log('0000', JSON.stringify(data));
	return data
}

export default useQueryAllMenus
