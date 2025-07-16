import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({
	position_id,
	fullname,
	gender,
	birthdate,
	//experience,
	//education,
	email,
	phone,
	nik,
	address,
	prov_id,
	city_id,
	district_id,
	subdistrict_id,
	//npwp,
	status,
	//cv_uploaded,
}) => {
	const { data } = await api.request({
		method: 'POST',
		url: '/recruitment/add',
		data: {
			position_id,
			fullname,
			gender,
			birthdate: new Date(birthdate),
			//experience,
			//education,
			email,
			phone,
			nik,
			address,
			prov_id,
			city_id,
			district_id,
			subdistrict_id,
			//npwp,
			status,
			//cv_uploaded,
		},
		headers: {
			//'Content-Type': 'multipart/form-data',
		},
	})
	//console.log('---> after appendix', JSON.stringify(data))
	return data
}

const useMutateCreateRecruitmen = () => {
	//const navigate = useNavigate();
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: register,
		onSuccess: (data) => {
			queryClient.invalidateQueries('recruitment-created')

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

export default useMutateCreateRecruitmen
