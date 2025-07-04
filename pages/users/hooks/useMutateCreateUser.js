import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({
	user_id,
	username,
	user_nama,
	user_email,
	user_phone,
	user_type,
	user_gender,
	id,
}) => {
	const { data } = await api.request({
		method: id == 0 ? 'POST' : 'PUT',
		url: id == 0 ? '/emp/register' : `/auth/updateuser/${id}`,
		data: {
			user_id,
			username,
			user_nama,
			user_email,
			user_phone: String(user_phone),
			user_type,
			user_gender,
		},
	})

	return data
}

const useMutateCreateUser = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('user-created-update')

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

export default useMutateCreateUser
