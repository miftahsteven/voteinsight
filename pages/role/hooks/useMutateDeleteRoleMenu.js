import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({ id }) => {
	//console.log('act :', action)
	const { data } = await api.request({
		method: 'DELETE',
		url: '/role/delete-role-menu',
		data: {
			id,
		},
	})

	return data
}

const useMutateDeleteRoleMenu = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('role-menu-remove')

			return data
		},
		onError: (error) => {
			console.log(' ERROR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if (error.response && error.response.status === 502) {
				window.location = '/auth/login?sessionNull=true'
				return
			}
			//if error not 502 just return alert
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateDeleteRoleMenu
