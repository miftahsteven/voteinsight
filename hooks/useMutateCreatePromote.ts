import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

const register = async ({
	id = 0,
	contract_id,	
	permanent_date,
}: {
	id?: number;
	contract_id: string;
	permanent_date: string;
}) => {
	const { data } = await api.request({
		method: 'PUT',
		url: `/emp/promote-user/${id}`,
		data: {
			contract_id,
			permanent_date
		},
	})

	return data
}

const useMutateCreatePromote = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['promoted-update'] })

			return data
		},
		onError: (error) => {
			//console.log(' REORRR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if ((error as any)?.response?.status === 502) {
				window.location.href = '/auth/login?sessionNull=true'
				return
			}
			alert((error as any)?.response?.data?.message ?? error?.message)
		},
	})
}

export default useMutateCreatePromote
