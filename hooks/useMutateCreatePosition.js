import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({
	id,
	position_name,
	position_code,
	position_deskripsi,
	position_grade,
	dept_id,
	status,
	position_head
}) => {
	const { data } = await api.request({
		method: id == 0 ? 'POST' : 'PUT',
		url: id == 0 ? '/recruitment/tambah' : `/recruitment/update/${id}`,
		data: {
			id,
			position_name,
			position_code,
			position_deskripsi,
			position_grade,
			dept_id,
			status,
			position_head,
		},
	})

	return data
}

const useMutateCreatePosition = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('position-created-update')

			return data
		},
		onError: (error) => {
			//console.log(' REORRR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if (error.response && error.response.status === 502) {
				window.location = '/auth/login?sessionNull=true'
				return
			}
			alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'			
		},
	})
}

export default useMutateCreatePosition
