import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import api from '../utilities/libs/axios'

interface recruitmentData {
	position_id? : number,
	fullname: string,
	gender: string,
	birthdate: string,
	//experience,
	//education,
	email: string,
	phone: string,
	nik: string,
	address: string,
	prov_id: number,
	city_id: number,
	district_id: number,
	subdistrict_id: number,
	//npwp,
	status: string,
}

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
}: recruitmentData) => {
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
			queryClient.invalidateQueries({queryKey: 'recruitment-created'})

			return data
		},
		onError: (error: any) => {
			//console.log(' REORRR ', error)
			//alert(error.response.data?.message ?? error?.message)
			//window.location = '/auth/login?sessionNull=true'
			if (error.response && error.response.status === 502) {
				window.location.href = '/auth/login?sessionNull=true'
				return
			}
			alert(error.response.data?.message ?? error?.message)
		},
	})
}

export default useMutateCreateRecruitmen
