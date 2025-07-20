import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

interface RegisterParams {
	username: string;
	user_nama: string;
	user_email: string;
	user_phone: string;
	user_type: string | number;
}

const register = async ({ username, user_nama, user_email, user_phone, user_type }: RegisterParams) => {
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
			queryClient.invalidateQueries({ queryKey: ['user-register'] })

			return data
		},
		onError: (error) => {
			console.log(error)
			const err = error as any;
			alert(err.response?.data?.message ?? err?.message)
		},
	})
}

export default useMutateRegistrasi
