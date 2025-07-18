import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({
	id = 0,
	contract_number,
	contract_type,
	contract_end_date,
	contract_status,
}) => {
	const { data } = await api.request({
		method: id == 0 ? 'POST' : 'PUT',
		url: id == 0 ? '/emp/create-contract' : `/emp/update-contract/${id}`,
		data: {
			id,
			contract_number,
			contract_type,
			contract_end_date,
			contract_status,
		},
	})

	return data
}

const useMutateCreateContract = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('contract-created-update')

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

export default useMutateCreateContract
