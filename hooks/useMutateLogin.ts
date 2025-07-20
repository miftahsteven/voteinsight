import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

interface LoginArgs {
	username: string;
	password: string;
}

const login = async ({ username, password }: LoginArgs) => {
	const { data } = await api.request({
		method: 'POST',
		url: '/auth/login',
		data: {
			username,
			password,
		},
	})

	return data
}

const useMutateLogin = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			const token = data.token

			if (typeof window !== 'undefined') {
				localStorage.setItem('token', token)
				localStorage.setItem('type', data.data.user_type)
				localStorage.setItem('name', data.data.username)
				localStorage.setItem('login_id', data.data.id)
			}

			queryClient.invalidateQueries({ queryKey: ['login-user'] })

			return data
		},
		onError: (error) => {
			console.log(error)
			const errorMessage = (error as any)?.response?.data?.message ?? error?.message;
			alert(errorMessage);
		},
	})
}

export default useMutateLogin
