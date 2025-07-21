import React, { FC, use, useCallback, useMemo, useEffect } from 'react'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal'
import data from '../../../common/data/dummyCustomerData'
import showNotification from '../../../components/extras/showNotification'
import Icon from '../../../components/icon/Icon'
import Nav, { NavItem, NavLinkDropdown } from '../../../components/bootstrap/Nav'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import Input from '../../../components/bootstrap/forms/Input'
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card'
import Button from '../../../components/bootstrap/Button'
import Textarea from '../../../components/bootstrap/forms/Textarea'
import Select from '../../../components/bootstrap/forms/Select'
import Label from '../../../components/bootstrap/forms/Label'
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks'
//import PAYMENTS from '../../../common/data/enumPaymentMethod';
import { stat } from 'fs'
//import useQueryRefDepartments from '../../../hooks/useQueryRefDepartments'
import useQueryPositionsSelect from '../../../hooks/useQueryPositionsSelect'
import useQueryProv from '../../../hooks/useQueryProv'
import useQueryCities from '../../../hooks/useQueryCities'
import useQueryDistricts from '../../../hooks/useQueryDistricts'
import useQueryLocs from '../../../hooks/useQueryLocs'
import { useRouter } from 'next/router'
import { Value } from 'sass'

interface ICustomerEditModalProps {
	id: number | string
	isOpen: boolean
	setIsOpen(...args: unknown[]): unknown
	dataEmployeeSelected: any[]
	//dataUserById: []
}
const CustomerEditModal: FC<ICustomerEditModalProps> = ({
	id,
	isOpen,
	setIsOpen,
	dataEmployeeSelected,
	//dataUserById,
}) => {
	const router = useRouter()
	const [dataCity, setDataCity] = React.useState([])
	const [dataDistrict, setDataDistrict] = React.useState([])
	const [dataLoc, setDataLoc] = React.useState([])
	const jenisKelamin = [
		{ value: '0', text: 'Laki-laki' },
		{ value: '1', text: 'Perempuan' },
	]
	const pendidikan = [
		{ value: '0', text: 'SD' },
		{ value: '1', text: 'SMP' },
		{ value: '2', text: 'SMA' },
		{ value: '3', text: 'D3' },
		{ value: '4', text: 'S1' },
		{ value: '5', text: 'S2' },
		{ value: '6', text: 'S3' },
	]

	const dataPosition = useQueryPositionsSelect()
	let dataPositionRef = []
	if (dataPosition !== undefined) {
		dataPositionRef = dataPosition.data.map((items:any) => ({
			value: items.id,
			text: `${items.position_name}`,
			position_code: items.position_code,
			position_grade: items.position_grade,
			position_deskripsi: items.position_deskripsi,
			dept_id: items.departments?.dept_name,
			division_id: items.departments?.divisions?.division_name,
			group_id: items.departments?.divisions?.groups?.group_name,
		}))
	}
	const dataCities = useQueryCities()
	const dataDistricts = useQueryDistricts()
	const dataLocs = useQueryLocs()
	const dataProvince = useQueryProv()
	let dataProvRef = []
	if (dataProvince !== undefined) {
		dataProvRef = dataProvince.data.map((items:any) => ({
			value: items.prov_id,
			text: `${items.prov_name}`,
		}))
	}
	const dataKota = (prov_id: any) => {
		setDataCity(
			dataCities.data
				?.filter((item: any) => item.prov_id === Number(prov_id))
				.map((items: any) => ({
					value: items.city_id,
					text: `${items.city_name}`,
				})),
		)
	}
	const dataKecamatan = (city_id: any) => {
		setDataDistrict(
			dataDistricts.data
				?.filter((item: any) => item.city_id === Number(city_id))
				.map((items: any) => ({
					value: items.dis_id,
					text: `${items.dis_name}`,
				})),
		)
	}
	const dataKelurahan = (dis_id: any) => {
		setDataLoc(
			dataLocs.data
				?.filter((item: any) => item.dis_id === Number(dis_id))
				.map((items: any) => ({
					value: items.subdis_id,
					text: `${items.subdis_name}`,
				})),
		)
	}

	const itemData = useMemo(() => {
		if (dataEmployeeSelected && Array.isArray(dataEmployeeSelected) && dataEmployeeSelected.length > 0) {
			return dataEmployeeSelected[0]
		}
		return {}
	}, [dataEmployeeSelected])
	console.log('---> itemDatasss', JSON.stringify(itemData))
	//const item = id && Array.isArray(itemData) ? itemData : {};
	const item = id ? itemData : {}
	//const { mutate, isSuccess, isError } = useMutateCreateRecruitment()
	const handleOnError = useCallback(() => router.push('/employee/list'), [router])

	//create useeffect to inisialize data city, district, and loc when modal is open
	React.useEffect(() => {
		if (isOpen) {
			if (item.prov_id) {
				dataKota(item.prov_id)
			}
			if (item.city_id) {
				dataKecamatan(item.city_id)
			}
			if (item.district_id) {
				dataKelurahan(item.district_id)
			}			
		}
	}, [isOpen, item.prov_id, item.city_id, item.district_id]) 

	const formik = useFormik({
		initialValues: {
			id: Number(id) > 0 ? item?.id : 0,
			fullname: Number(id) > 0 ? item?.name : '',
			gender: Number(id) > 0 ? item?.gender : '',
			birthdate: Number(id) > 0 ? item?.birthdate_text : '',
			employee_number: Number(id) > 0 ? item?.employee_number : '',
			experience: Number(id) > 0 ? item?.experience : '',
			position_id: Number(id) > 0 ? item?.position_id : '',
			position_code: Number(id) > 0 ? item?.position_code : '',
			position_grade: Number(id) > 0 ? item?.position_grade : '',
			education: Number(id) > 0 ? item?.education : '',
			email: Number(id) > 0 ? item?.email : '',
			phone: Number(id) > 0 ? item?.phone : '',
			address: Number(id) > 0 ? item?.streetAddress : '',
			prov_id: Number(id) > 0 ? item?.prov_id : '',
			city_id: Number(id) > 0 ? item?.city_id : '',
			district_id: Number(id) > 0 ? item?.district_id : '',
			subdistrict_id: Number(id) > 0 ? item?.subdistrict_id : '',
			cv_uploaded: Number(id) > 0 ? item?.cv_uploaded : '',
			npwp: Number(id) > 0 ? item?.npwp : '',
			nik: Number(id) > 0 ? item?.nik : '',
			status: Number(id) > 0 ? item?.user_status : 0,
			onboarding_date_text: Number(id) > 0 ? item?.onboarding_date_text : '',
			position_deskripsi: Number(id) > 0 ? item?.position_deskripsi : '',
			dept_id: Number(id) > 0 ? item?.dept_id : '',
			division_id: Number(id) > 0 ? item?.division_id : '',
			group_id: Number(id) > 0 ? item?.group_id : '',
		},
		// validate: (values) => {
		// 	const errors: {
		// 		fullname?: string
		// 		birthdate?: string
		// 		email?: string
		// 		phone?: string
		// 		address?: string
		// 		npwp?: string
		// 		nik?: string
		// 	} = {}

		// 	if (!values.fullname) {
		// 		errors.fullname = 'Wajib Diisi'
		// 	}
		// 	if (!values.birthdate) {
		// 		errors.birthdate = 'Wajib Diisi'
		// 	} else if (dayjs(values.birthdate).isAfter(dayjs())) {
		// 		errors.birthdate = 'Tanggal Lahir Tidak Valid'
		// 	}
		// 	if (!values.email) {
		// 		errors.email = 'Wajib Diisi'
		// 	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
		// 		errors.email = 'Email Tidak Valid'
		// 	}
		// 	if (!values.phone) {
		// 		errors.phone = 'Wajib Diisi'
		// 	} else if (values.phone.length < 10) {
		// 		errors.phone = 'Nomor Telepon Tidak Valid'
		// 	}
		// 	if (!values.npwp) {
		// 		errors.npwp = 'Wajib Diisi'
		// 	}
		// 	if (!values.nik) {
		// 		errors.nik = 'Wajib Diisi'
		// 	} else if (values.nik.length < 16) {
		// 		errors.nik = 'NIK Tidak Valid'
		// 	}
		// 	if (!values.address) {
		// 		errors.address = 'Wajib Diisi'
		// 	} else if (values.address.length < 6) {
		// 		errors.address = 'Alamat Tidak Valid'
		// 	}

		// 	return errors
		// },
		validateOnChange: false,
		enableReinitialize: true,
		onSubmit: (values) => {
			const today = new Date(values.birthdate)

			const yyyy = today.getFullYear()
			const mm = String(today.getMonth() + 1).padStart(2, '0')
			const dd = String(today.getDate()).padStart(2, '0')

			const formattedDate = `${yyyy}-${mm}-${dd}`
			//console.log('Data Tanggal Lahir', formattedDate)
			const formData = new FormData()
			//console.log(' ---> submit', JSON.stringify(values))
			formData.append('position_id', values.position_id)
			formData.append('fullname', values.fullname)
			formData.append('gender', values.gender)
			formData.append('birthdate', formattedDate)
			formData.append('experience', values.experience)
			formData.append('education', values.education)
			formData.append('email', values.email)
			formData.append('phone', values.phone)
			formData.append('nik', values.nik)
			formData.append('address', values.address)
			formData.append('prov_id', values.prov_id)
			formData.append('city_id', values.city_id)
			formData.append('district_id', values.district_id)
			formData.append('subdistrict_id', values.subdistrict_id)
			formData.append('npwp', values.npwp)
			formData.append('status', values.status)
			formData.append('cv_uploaded', values.cv_uploaded)
			console.log('---> data append', Object.fromEntries(formData))
			// mutate(
			// 	{ ...Object.fromEntries(formData) },
			// 	{
			// 		onSuccess: (data) => {
			// 			if (data) {
			// 				//console.log(JSON.stringify(data));
			// 				//setUser(data);
			// 				//localStorage.setItem('dataLogin', JSON.stringify(data));
			// 				setIsOpen(false)
			// 				showNotification(
			// 					<span className='d-flex align-items-center'>
			// 						<Icon icon='Info' size='lg' className='me-1' />
			// 						<span>Berhasil</span>
			// 					</span>,
			// 					'Berhasil Menambah Posisi',
			// 				)
			// 			}
			// 			// /handleOnClick();
			// 		},
			// 		onError: (error) => {
			// 			formik.setFieldError('createPositionGagal', 'Gagal Membuat Posisi.')

			// 			showNotification(
			// 				<span className='d-flex align-items-center'>
			// 					<Icon icon='danger' size='lg' className='me-1' />
			// 					<span>Gagal</span>
			// 				</span>,
			// 				'Gagal Menambah Data Posisi',
			// 			)
			// 			handleOnError()
			// 		},
			// 	},
			// )
		},
	})

	const getSelectData = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		//console.log(' ---> getSelectData', JSON.stringify(value))
		formik.setFieldValue(name, value)
		const selectedItem = dataPositionRef.find((item: any) => item.value == Number(value))
		//console.log(' ---> selectedItem', JSON.stringify(selectedItem))
		if (selectedItem) {
			formik.setFieldValue('position_code', selectedItem.position_code)
			formik.setFieldValue('position_grade', selectedItem.position_grade)
			formik.setFieldValue('position_deskripsi', selectedItem.position_deskripsi)
			formik.setFieldValue('dept_id', selectedItem.dept_id)
			formik.setFieldValue('division_id', selectedItem.division_id)
			formik.setFieldValue('group_id', selectedItem.group_id)
		}
	}

	// const getSelectLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const { name, value, id } = e.target
	// 	console.log(' ---> getSelectData', JSON.stringify(name))
	// 	formik.setFieldValue(name, value)
	// 	let selectedItem = []
	// 	if (name === 'prov_id') {
	// 		dataKota(value)
	// 	} else if (name === 'city_id') {
	// 		dataKecamatan(value)
	// 	} else if (name === 'district_id') {
	// 		dataKelurahan(value)
	// 	}
	// }

	const getSelectLocation = (e:any) => {
		const { name, value, id } = e.target
		console.log(' ---> getSelectData', JSON.stringify(name))
		formik.setFieldValue(name, value)
		let selectedItem = []
		if (name === 'prov_id') {
			dataKota(value)
		} else if (name === 'city_id') {
			dataKecamatan(value)
		} else if (name === 'district_id') {
			dataKelurahan(value)
		}
	}

	console.log('---> get querytab', router.query.tab)

	//click tab function, setIsOpen and switch on body
	const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault()
		const targetTab = e.currentTarget.getAttribute('href')
		if (targetTab) {
			if(targetTab === 'jabatan'){
				if(item.position_id) {
					const selectedPosition = dataPositionRef.find((pos: any) => pos.value === item.position_id)
					if (selectedPosition) {
						formik.setFieldValue('position_code', selectedPosition.position_code)
						formik.setFieldValue('position_grade', selectedPosition.position_grade)
						formik.setFieldValue('position_deskripsi', selectedPosition.position_deskripsi)
						formik.setFieldValue('dept_id', selectedPosition.dept_id)
						formik.setFieldValue('division_id', selectedPosition.division_id)
						formik.setFieldValue('group_id', selectedPosition.group_id)
					}
				}
			}
			router.push(`/employee/list/?tab=${targetTab}`, undefined, {
				shallow: true,
			})
		}
	}		


	// const handleCVUploadedChange = (e: any) => {
	// 	// Extract the file object from the event
	// 	const cv_uploaded = e.target?.files?.[0]

	// 	formik.setFieldValue('cv_uploaded', cv_uploaded)
	//}

	if (id || id === '0') {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id.toString()}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={String(id)}>{'Detail Karyawan'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>		
				<Nav design='tabs' isVertical={ false}>
					<NavItem isActive ={router.query.tab === 'index' || router.query.tab === undefined }>
						<a href='index' onClick={handleTabClick}>Informasi Umum</a>
					</NavItem>
					<NavItem isActive ={router.query.tab === 'jabatan'}> 
						<a href='jabatan' onClick={handleTabClick}>Posisi/Jabatan</a>
					</NavItem>
					<NavItem isActive ={router.query.tab === 'kontrak'}>
						<a href='kontrak' onClick={handleTabClick}>Kontrak</a>
					</NavItem>
					<NavItem isActive ={router.query.tab === 'rekrut'}>
						<a href='rekrut' onClick={handleTabClick}>Proses Rekrut</a>
					</NavItem>
				</Nav>			
				{/* open when query tab is index and query tab is undined */}
				{router.query.tab === 'index' || router.query.tab === undefined ? (
					<div className='row g-4'>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardBody>
									<div className='row g-3'>
										<FormGroup
											id='fullname'
											label='Nama Lengkap'
											className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='fullname'
												disabled={Number(id) > 0 ? true : false}
												value={formik.values.fullname}
												invalidFeedback={typeof formik.errors.fullname === 'string' ? formik.errors.fullname : undefined}
												isTouched={!!formik.touched.fullname}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='gender'
											label='Jenis Kelamin'
											className='col-12'>
											<Select
												id='gender'
												ariaLabel='Pilih Jenis Kelamin'
												name='gender'
												disabled={Number(id) > 0 ? true : false}
												onChange={formik.handleChange}
												value={formik.values.gender}
												placeholder='Pilih...'
												list={jenisKelamin}
											/>
										</FormGroup>
										<FormGroup
											id='birthdate'
											label='Tanggal Lahir'
											className='col-12'>
											<Input
												type='date'
												onChange={formik.handleChange}
												disabled={Number(id) > 0 ? true : false}
												name='birthdate'
												value={formik.values.birthdate}
												invalidFeedback={typeof formik.errors.birthdate === 'string' ? formik.errors.birthdate : undefined}
												isTouched={!!formik.touched.birthdate}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='employee_number'
											label='NIK Karyawan'
											className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												disabled={Number(id) > 0 ? true : false}
												name='employee_number'
												value={formik.values.employee_number}
												invalidFeedback={typeof formik.errors.employee_number === 'string' ? formik.errors.employee_number : undefined}
												isTouched={typeof formik.touched.employee_number === 'boolean' ? formik.touched.employee_number : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										{/* <FormGroup
											id='education'
											label='Pendidikan Terakhir'
											className='col-12'>
											<Select
												id='education'
												ariaLabel='Pilih Pendidikan'
												name='education'
												onChange={formik.handleChange}
												value={formik.values.education}
												placeholder='Pilih...'
												list={pendidikan}
											/>
										</FormGroup> */}
										<FormGroup id='email' label='Email' className='col-12'>
											<Input
												type='email'
												onChange={formik.handleChange}
												disabled={Number(id) > 0 ? true : false}
												name='email'
												value={formik.values.email}
												invalidFeedback={typeof formik.errors.email === 'string' ? formik.errors.email : undefined}
												isTouched={typeof formik.touched.email === 'boolean' ? formik.touched.email : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='phone' label='Telepon' className='col-12'>
											<Input
												type='tel'
												onChange={formik.handleChange}
												disabled={Number(id) > 0 ? true : false}
												name='phone'
												placeholder='0818xxxxxx'
												value={formik.values.phone}
												invalidFeedback={typeof formik.errors.phone === 'string' ? formik.errors.phone : undefined}
												isTouched={typeof formik.touched.phone === 'boolean' ? formik.touched.phone : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='nik' label='NIK' className='col-12'>
											<Input
												type='number'
												onChange={formik.handleChange}
												disabled={Number(id) > 0 ? true : false}	
												name='nik'
												value={formik.values.nik}
												invalidFeedback={typeof formik.errors.nik === 'string' ? formik.errors.nik : undefined}
												isTouched={typeof formik.touched.nik === 'boolean' ? formik.touched.nik : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardBody>
									<div className='row g-3'>
										<FormGroup id='address' label='Alamat' className='col-12'>
											<Textarea
												size='sm'
												placeholder='Alamat'
												disabled={Number(id) > 0 ? true : false}
												onChange={formik.handleChange}
												value={formik.values.address}
												name='address'
												isTouched={typeof formik.touched.address === 'boolean' ? formik.touched.address : undefined}												
												invalidFeedback={typeof formik.errors.address === 'string' ? formik.errors.address : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='prov_id' label='Provinsi' className='col-12'>
											<Select
												id='prov_id'
												ariaLabel='Pilih Provinsi'
												name='prov_id'
												disabled={Number(id) > 0 ? true : false}
												//onChange={formik.handleChange}
												onChange={getSelectLocation}
												value={formik.values.prov_id}
												placeholder='Pilih...'
												list={dataProvRef}
											/>
										</FormGroup>
										<FormGroup
											id='city_id'
											label='Kota/Kabupaten'
											className='col-12'>
											<Select
												id='city_id'
												ariaLabel='Pilih Kota/Kabupaten'
												name='city_id'
												disabled={Number(id) > 0 ? true : false}
												//onChange={formik.handleChange}
												//onChange={getSelectLocation}
												value={formik.values.city_id}
												placeholder='Pilih...'
												list={dataCity}
											/>
										</FormGroup>
										<FormGroup
											id='district_id'
											label='Kecamatan'
											className='col-12'>
											<Select
												id='district_id'
												ariaLabel='Pilih Kecamatan'
												name='district_id'
												disabled={Number(id) > 0 ? true : false}
												//onChange={formik.handleChange}
												onChange={getSelectLocation}
												value={formik.values.district_id}
												placeholder='Pilih...'
												list={dataDistrict}
											/>
										</FormGroup>
										<FormGroup
											id='subdistrict_id'
											label='Kelurahan'
											className='col-12'>
											<Select
												id='subdistrict_id'
												ariaLabel='Pilih Kelurahan'
												name='subdistrict_id'
												disabled={Number(id) > 0 ? true : false}
												//onChange={formik.handleChange}
												onChange={getSelectLocation}
												value={formik.values.subdistrict_id}
												placeholder='Pilih...'
												list={dataLoc}
											/>
										</FormGroup>
										<FormGroup id='npwp' label='NPWP' className='col-12'>
											<Input
												type='number'
												onChange={formik.handleChange}
												name='npwp'
												disabled={Number(id) > 0 ? true : false}
												value={formik.values.npwp}
												invalidFeedback={typeof formik.errors.npwp === 'string' ? formik.errors.npwp : undefined}
												isTouched={typeof formik.touched.npwp === 'boolean' ? formik.touched.npwp : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='filecv' label='File CV' className='col-12'>
											{ formik.values.cv_uploaded ? (
											<a href={`${process.env.NEXT_PUBLIC_BASEURL}public/uploads/cv/${formik.values.cv_uploaded}`} target='_blank' className='btn btn-outline-primary btn-sm m-2'>
												<Icon icon='File' className='me-1' />
												{'Download'}
											</a>
											) : (
												<span className='text-muted'>Tidak Ada File CV</span>
											)}
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
				) : null }
				{/* open when tab= jabatan */}				
				{router.query.tab === 'jabatan' && (
					// <div>TAB JABATAN</div>
					// create form group for position
					<div className='row g-4'>
						<div className='col-md-6'>	
							<Card className='rounded-1 mb-0'>
								<CardBody>
									<div className='row g-3'>
										<FormGroup id='position_id' label='Posisi' className='col-12'>
											<Select
												id='position_id'
												ariaLabel='Pilih Posisi'
												name='position_id'
												disabled={Number(id) > 0 ? true : false}
												//onChange={getSelectData}
												value={formik.values.position_id}
												placeholder='Pilih...'
												list={dataPositionRef}
											/>
										</FormGroup>
										<FormGroup id='position_code' label='Kode Posisi' className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='position_code'
												value={formik.values.position_code}
												disabled={true}
											/>
										</FormGroup>
										<FormGroup id='position_grade' label='Grade Posisi' className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='position_grade'
												value={formik.values.position_grade}
												disabled={true}
											/>
										</FormGroup>
										<FormGroup id='position_deskripsi' label='Deskripsi Posisi' className='col-12'>
											<Textarea
												size='sm'
												onChange={formik.handleChange}
												name='position_deskripsi'
												value={formik.values.position_deskripsi}
												isTouched={typeof formik.touched.position_deskripsi === 'boolean' ? formik.touched.position_deskripsi : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='dept_id' label='Departemen' className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='dept_id'
												value={formik.values.dept_id}
												disabled={true}
											/>
										</FormGroup>
										<FormGroup id='division_id' label='Divisi' className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='division_id'
												value={formik.values.division_id}
												disabled={true}
											/>
										</FormGroup>
										<FormGroup id='group_id' label='Grup' className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='group_id'
												value={formik.values.group_id}
												disabled={true}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardBody>
									<div className='row g-3'>
										<FormGroup id='onboarding_date_text' label='Tgl. On Boarding' className='col-12'>
											<Input
												type='date'
												onChange={formik.handleChange}
												disabled={Number(id) > 0 ? true : false}
												name='experience'
												value={formik.values.onboarding_date_text}
												invalidFeedback={typeof formik.errors.onboarding_date_text === 'string' ? formik.errors.onboarding_date_text : undefined}
												isTouched={typeof formik.touched.onboarding_date_text === 'boolean' ? formik.touched.onboarding_date_text : undefined}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='status' label='Status Karyawan' className='col-12'>
											<ChecksGroup onChange={formik.handleChange}>
												<Checks
													id='status_aktif'
													label='Aktif'
													value={1}
													className='me-2'
													checked={formik.values.status === 1}
													disabled={Number(id) > 0 ? true : false}
													onChange={() => formik.setFieldValue('status', 1)}
												/>
												<Checks
													id='status_non_aktif'
													label='Non Aktif'
													value={0}
													checked={formik.values.status === 0}
													disabled={Number(id) > 0 ? true : false}
													onChange={() => formik.setFieldValue('status', 0)}
												/>
											</ChecksGroup>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
				)}
				{/* open when tab= kontrak */}
				{router.query.tab === 'kontrak' && (
					<div>TAB KONTRAK</div>
				)}
				{/* open when tab= rekrut */}
				{router.query.tab === 'rekrut' && (
					<div>TAB REKRUT</div>
				)}
				</ModalBody>
				{/* <ModalFooter className='px-4 pb-4'>
					<Button color='info' onClick={formik.handleSubmit} className='me-2 btn-xl'>
						{Number(id) > 0 ? 'Edit' : 'Simpan'}
					</Button>
				</ModalFooter> */}
			</Modal>
		)
	}
	return null
}

export default CustomerEditModal
