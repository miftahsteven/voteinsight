import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'

import api from '../../utilities/libs/axios'
const requestActivity = async (user_id) => {
	const { data } = await api.request({
		method: 'GET',
		url: `/emp/all-activity/${user_id}`,
		// data: {
		// 	username,
		// 	password,
		// },
	})

	return data
}

const useQueryActivity = (id) => {
	const { status, data, error, isFetching } = useQuery({
		queryKey: ['all-activity-peruser', requestActivity(id)],
		queryFn: () => requestActivity(id),
	})
	//console.log('0000', JSON.stringify(data));
	return data
}

export default useQueryActivity
