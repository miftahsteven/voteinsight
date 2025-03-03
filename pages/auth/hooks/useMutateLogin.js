import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const login = async ({ username, password }) => {
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

			localStorage.setItem('token', token)
			localStorage.setItem('type', data.data.user_type)
			localStorage.setItem('name', data.data.username)
			localStorage.setItem('login_id', data.data.id)

			queryClient.invalidateQueries('login-user')

			return data
		},
		onError: (error) => {
			console.log(error)
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateLogin
