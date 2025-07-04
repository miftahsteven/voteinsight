import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({ id, contract_status, action }) => {
	console.log('act :', action)
	const { data } = await api.request({
		method: action == 'remove' ? 'DELETE' : 'PUT',
		url: action == 'remove' ? `/emp/delete-contract` : `/emp/update-status/${id}`,
		data: {
			id,
			contract_status,
		},
	})

	return data
}

const useMutateActionContract = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('contract-update-status-remove')

			return data
		},
		onError: (error) => {
			console.log(' ERROR ', error)
			//if error is 502, redirect to login
			if (error.response && error.response.status === 502) {
				window.location = '/auth/login?sessionNull=true'
				return	
			}
			//if error not 502 just return alert
			alert(error.response.data?.message ?? error?.message)	
			
			//window.location = '/auth/login?sessionNull=true'
		},
	})
}

export default useMutateActionContract
