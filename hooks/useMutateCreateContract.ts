import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

interface ContractData {
	id?: number;
	contract_number: string;
	contract_type: string;
	contract_end_date: string;
	contract_status: string;
}

const register = async ({
	id = 0,
	contract_number,
	contract_type,
	contract_end_date,
	contract_status,
}: ContractData) => {
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
			queryClient.invalidateQueries({ queryKey: ['contract-created-update'] })

			return data
		},
		onError: (error) => {
			//console.log(' REORRR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if ((error as any)?.response && (error as any).response.status === 502) {
				window.location.href = '/auth/login?sessionNull=true'
				return	
			}
			//if error not 502 just return alert
			alert((error as any)?.response?.data?.message ?? error?.message)	

		},
	})
}

export default useMutateCreateContract
