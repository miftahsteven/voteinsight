import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const deleteVacancy = async ({ id }) => {
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
			queryClient.invalidateQueries('vacancy-remove')

			return data
		},
		onError: (error) => {
			console.log(' ERROR ', error)
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateActionVacancy
