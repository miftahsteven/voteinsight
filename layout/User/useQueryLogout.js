import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../pages/utilities/libs/axios'

const logout = async ({ user_id }) => {
	const { data } = await api.request({
		method: 'POST',
		url: '/auth/logout',
		data: {
			user_id,
		},
	})

	return data
}

const useQueryLogout = () => {
	//const navigate = useNavigate();
	// const queryClient = useQueryClient();
	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			localStorage.setItem('token', '')
			localStorage.setItem('type', '')
			localStorage.setItem('name', '')
			localStorage.setItem('login_id', '')

			return true
		},
		onError: (error) => {
			console.log(error)
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useQueryLogout
