import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

const register = async ({	
	leave_start_date,
	leave_end_date,
	leave_reason,
	leave_status,
	
}: { leave_start_date: string, leave_end_date: string, leave_reason: string, leave_status: number }) => {
	const { data } = await api.request({
		method: 'POST',
		url:  '/leaving/request',
		data: {
			leave_start_date,
			leave_end_date,
			leave_reason,
			leave_status,
		},
	})

	return data
}

const useMutateCreateLeave = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries({queryKey: 'leave-created'})

			return data
		},
		onError: (error: any) => {
			//console.log(' REORRR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if (error.response && error.response.status === 502) {
				window.location.href = '/auth/login?sessionNull=true'
				return
			}
			alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'			
		},
	})
}

export default useMutateCreateLeave
