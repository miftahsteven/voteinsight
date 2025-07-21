import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

const register = async ({
	id,
	approval_status,	
	approval_desc
}) => {
	const { data } = await api.request({
		method: 'PUT',
		url: `/recruitment/change-approval/${id}`,
		data: {
			approval_status,			
			approval_desc,
		},
	})

	return data
}

const useMutateUpdateApprovedRecruitment = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('update-approved-recruitment')

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

export default useMutateUpdateApprovedRecruitment
