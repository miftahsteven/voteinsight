import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'

import api from '../utilities/libs/axios'

type Params = {
	page?: number;
	[key: string]: any;
};

const request = async (params: Params = {}) => {
	const { page = 1 } = params || {}
	const { data } = await api.request({
		method: 'GET',
		url: '/role/menuAdmin',
		params: {
			page,
			...params,
		},
	})

	return data
}

const useQueryMenuStructure = (params = {}) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['data-menus-structure', request(params)],
		queryFn: () => request(params),
	})
	//console.log('0000', JSON.stringify(error));
	//if error is 500, redirect to login	
	if (error && (error as any)?.response?.status === 502) {
		//alert((error as any)?.response?.data?.message ?? error?.message)
		window.location.href = '/auth/login?sessionNull=true'
	}
	//if error not 502 just return alert
	if (error && (error as any)?.response?.status !== 502) {
		alert((error as any)?.response?.data?.message ?? error?.message)
	}
	
	return data
}

export default useQueryMenuStructure
