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
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateCreateUser
