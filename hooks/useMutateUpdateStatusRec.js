import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

const register = async ({
	id,	
	process_status,	
	status_pic_id,
	process_description,
}) => {
	const { data } = await api.request({
		method: 'PUT',
		url: `/recruitment/changestatus/${id}`,
		data: {			
			process_status,
			status_pic_id,
			process_description,
		},		
	})
	
	return data
}

const useMutateCreateRecruitment = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('recruitment-updated')

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
		},
	})
}

export default useMutateCreateRecruitment
