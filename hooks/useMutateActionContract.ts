import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

type RegisterParams = {
	id: string;
	contract_status: string;
	action: 'remove' | 'update';
};

const register = async ({ id, contract_status, action }: RegisterParams) => {
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
			queryClient.invalidateQueries({ queryKey: ['contract-update-status-remove'] })

			return data
		},
		onError: (error: any) => {
			console.log(' ERROR ', error)
			//if error is 502, redirect to login
			if (error.response && error.response.status === 502) {
				window.location.href = '/auth/login?sessionNull=true'
				return	
			}
			//if error not 502 just return alert
			alert(error.response?.data?.message ?? error?.message)	
		},
	})
}

export default useMutateActionContract
