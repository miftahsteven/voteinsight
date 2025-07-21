import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

const register = async ({
	user_candidat_id,
	approval_status,
	approval_type,
	approval_desc
}) => {
	const { data } = await api.request({
		method: 'POST',
		url: `/recruitment/approved/${user_candidat_id}`,
		data: {
			approval_status,
			approval_type,
			approval_desc,
		},
	})

	return data
}

const useMutateApprovedRecruitment = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('approved-recruitment')

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

export default useMutateApprovedRecruitment
