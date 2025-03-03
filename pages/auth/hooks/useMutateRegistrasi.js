import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({ username, user_nama, user_email, user_phone, user_type }) => {
	const { data } = await api.request({
		method: 'POST',
		url: '/auth/register',
		data: {
			username,
			user_nama,
			user_email,
			user_phone,
			user_type: Number(user_type),
		},
	})

	return data
}

const useMutateRegistrasi = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('user-register')

			return data
		},
		onError: (error) => {
			console.log(error)
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateRegistrasi
