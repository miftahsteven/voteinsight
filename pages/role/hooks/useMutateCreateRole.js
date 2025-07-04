import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const roleCreate = async ({ id, type_name }) => {
	const { data } = await api.request({
		method: id == 0 ? 'POST' : 'PUT',
		url: id == 0 ? '/role/tambah' : `/role/update`,
		data: {
			id,
			type_name,
		},
	})

	return data
}

const useMutateCreateRole = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: roleCreate,
		onSuccess: (data) => {
			queryClient.invalidateQueries('role-created-update')
			return data
		},
		onError: (error) => {
			//console.log(' REORRR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if (error.response && error.response.status === 502) {
				window.location = '/auth/login?sessionNull=true'
				return
			}
			alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
		},
	})
}

export default useMutateCreateRole
