import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({ id, statusUser, action }) => {
	console.log('act :', action)
	const { data } = await api.request({
		method: action == 'remove' ? 'DELETE' : 'POST',
		url: action == 'remove' ? `/auth/remove` : `/auth/inactivated`,
		data: {
			id,
			statusUser,
		},
	})

	return data
}

const useMutateActionUser = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('user-inactivated-remove')

			return data
		},
		onError: (error) => {
			console.log(' ERROR ', error)
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateActionUser
