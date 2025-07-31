import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

const deleteVacancy = async ({ id } : {id: string}) => {
	//console.log('act :', action)
	const { data } = await api.request({
		method: 'DELETE',
		url: `/recruitment/delete`,
		data: {
			id,
		},
	})

	return data
}

const useMutateActionVacancy = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteVacancy,
		onSuccess: (data) => {
			queryClient.invalidateQueries({queryKey: 'vacancy-remove'})

			return data
		},
		onError: (error: any) => {
			console.log(' ERROR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if (error.response && error.response.status === 502) {
				window.location.href = '/auth/login?sessionNull=true'
				return
			}
			//if error not 502 just return alert
			alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'		
		},
	})
}

export default useMutateActionVacancy
