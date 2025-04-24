import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../../utilities/libs/axios'

const register = async ({
	id,
	position_id,
	fullname,
	gender,
	birthdate,
	experience,
	education,
	email,
	phone,
	nik,
	address,
	prov_id,
	city_id,
	district_id,
	subdistrict_id,
	npwp,
	cv_uploaded,
}) => {
	const { data } = await api.request({
		method: 'PUT',
		url: `/recruitment/applyupdate/${id}`,
		data: {
			position_id,
			fullname,
			gender,
			birthdate: new Date(birthdate),
			experience,
			education,
			email,
			phone,
			nik,
			address,
			prov_id,
			city_id,
			district_id,
			subdistrict_id,
			npwp,
			cv_uploaded,
		},
		headers: {
			'Content-Type': 'multipart/form-data',
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
			queryClient.invalidateQueries('recruitment-updated')

			return data
		},
		onError: (error) => {
			//console.log(' REORRR ', error)
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateCreateRecruitmen
