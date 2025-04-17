import React, { FC, useCallback, useMemo } from 'react'
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
import useQueryRefDepartments from '../hooks/useQueryRefDepartments'
import { stat } from 'fs'
import useMutateCreatePosition from '../hooks/useMutateCreatePosition'
import useQueryPositionsSelect from '../hooks/useQueryPositionsSelect'
import useQueryProv from '../hooks/useQueryProv'
import useQueryLocs from '../hooks/useQueryLocs'
import { useRouter } from 'next/router'
import { Value } from 'sass'

interface ICustomerEditModalProps {
	id: string
	isOpen: boolean
	setIsOpen(...args: unknown[]): unknown
	//dataRole: []
	//dataUserById: []
}
const CustomerEditModal: FC<ICustomerEditModalProps> = ({
	id,
	isOpen,
	setIsOpen,
	//dataRole,
	//dataUserById,
}) => {
	const router = useRouter()
	const [dataCity, setDataCity] = React.useState([])
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
		dataPositionRef = dataPosition.data.map((items) => ({
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

	const dataProvince = useQueryProv()
	let dataProvRef = []
	if (dataProvince !== undefined) {
		dataProvRef = dataProvince.data.map((items) => ({
			value: items.prov_id,
			text: `${items.prov_name}`,
		}))
	}

	const dataLocs = useQueryLocs()
	const dataLocations = useMemo(() => {
		return dataLocs?.data?.map((items) => ({
			Value: items.subdis_id,
			text: `${items.subdis_name}`,
			city_id: items.districts?.cities?.city_id,
			city_name: `${items.districts?.cities?.city_name}`,
			prov_id: items.districts?.cities?.prov_id,
			district_id: items.districts?.district_id,
			district_name: `${items.districts?.district_name}`,
		}))
	}, [dataLocs])
	//console.log(' ---> dataProvRef', JSON.stringify(dataLocations))

	//console.log(' ---> OK INI POSITION', JSON.stringify(dataPosition))

	const itemData = {}
	//const item = id && Array.isArray(itemData) ? itemData : {};
	const item = id ? itemData : {}
	//const { mutate, isSuccess, isError } = useMutateCreatePosition()
	const handleOnError = useCallback(() => router.push('/recruitment/list'), [router])

	const formik = useFormik({
		initialValues: {
			id: Number(id) > 0 ? item?.id : 0,
			fullname: Number(id) > 0 ? item?.fullname : '',
			gender: Number(id) > 0 ? item?.gender : '',
			birthdate: Number(id) > 0 ? item?.birthdate : '',
			experience: Number(id) > 0 ? item?.experience : '',
			position_id: Number(id) > 0 ? item?.position_id : '',
			education: Number(id) > 0 ? item?.education : '',
			email: Number(id) > 0 ? item?.email : '',
			phone: Number(id) > 0 ? item?.phone : '',
			address: Number(id) > 0 ? item?.address : '',
			prov_id: Number(id) > 0 ? item?.prov_id : '',
			city_id: Number(id) > 0 ? item?.city_id : '',
			district_id: Number(id) > 0 ? item?.district_id : '',
			subdistrict_id: Number(id) > 0 ? item?.subdistrict_id : '',
			cv_uploaded: Number(id) > 0 ? item?.cv_uploaded : '',
			npwp: Number(id) > 0 ? item?.npwp : '',
			nik: Number(id) > 0 ? item?.nik : '',
			status: Number(id) > 0 ? item?.status : 0,
		},
		validate: (values) => {
			const errors: {
				fullname?: string
				birthdate?: string
				email?: string
				phone?: string
				address?: string
				npwp?: string
				nik?: string
			} = {}

			if (!values.fullname) {
				errors.fullname = 'Wajib Diisi'
			}
			if (!values.birthdate) {
				errors.birthdate = 'Wajib Diisi'
			} else if (dayjs(values.birthdate).isAfter(dayjs())) {
				errors.birthdate = 'Tanggal Lahir Tidak Valid'
			}
			if (!values.email) {
				errors.email = 'Wajib Diisi'
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Email Tidak Valid'
			}
			if (!values.phone) {
				errors.phone = 'Wajib Diisi'
			} else if (values.phone.length < 10) {
				errors.phone = 'Nomor Telepon Tidak Valid'
			}
			if (!values.npwp) {
				errors.npwp = 'Wajib Diisi'
			}
			if (!values.nik) {
				errors.nik = 'Wajib Diisi'
			} else if (values.nik.length < 16) {
				errors.nik = 'NIK Tidak Valid'
			}
			if (!values.address) {
				errors.address = 'Wajib Diisi'
			} else if (values.address.length < 6) {
				errors.address = 'Alamat Tidak Valid'
			}

			return errors
		},
		validateOnChange: false,
		onSubmit: (values) => {
			console.log(' ---> submit', JSON.stringify(values))
			mutate(
				{
					id: values.id,
					position_name: values.position_name,
					position_code: values.position_code,
					position_grade: values.position_grade,
					position_deskripsi: values.position_deskripsi,
					dept_id: values.dept_id,
					status: 0,
				},
				{
					onSuccess: (data) => {
						if (data) {
							//console.log(JSON.stringify(data));
							//setUser(data);
							//localStorage.setItem('dataLogin', JSON.stringify(data));
							setIsOpen(false)
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='Info' size='lg' className='me-1' />
									<span>Berhasil</span>
								</span>,
								'Berhasil Menambah Posisi',
							)
						}
						// /handleOnClick();
					},
					onError: (error) => {
						formik.setFieldError('createPositionGagal', 'Gagal Membuat Posisi.')

						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='danger' size='lg' className='me-1' />
								<span>Gagal</span>
							</span>,
							'Gagal Menambah Data Posisi',
						)
						handleOnError()
					},
				},
			)
		},
	})

	const getSelectData = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		//console.log(' ---> getSelectData', JSON.stringify(value))
		formik.setFieldValue(name, value)
		const selectedItem = dataPositionRef.find((item) => item.value == Number(value))
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

	const getSelectLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, id } = e.target
		//console.log(' ---> getSelectData', JSON.stringify(id))
		formik.setFieldValue(name, value)
		let selectedItem = []
		if (id === 'prov_id') {
			selectedItem = dataLocs?.data?.map((items) => ({
				Value: items.distritcs?.cities?.city_id,
				text: `${items.distritcs?.cities?.city_name}`,
			}))
			setDataCity(selectedItem)
		}
	}

	if (id || id === '0') {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id.toString()}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{item?.position_name || 'Posisi Baru'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<div className='col-md-12'>
							<div className='col-md-12'>
								<Card className='rounded-1 mb-3'>
									<CardHeader>
										<CardLabel icon='People'>
											<CardTitle>Form Rekrut</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row'>
											<div className='col-md-2'>
												<FormGroup
													id='position_id'
													label='Posisi'
													className='col-12'>
													<Select
														id='position_id'
														ariaLabel='Pilih Posisi'
														name='position_id'
														//onChange={formik.handleChange}
														onChange={getSelectData}
														value={formik.values.position_id}
														placeholder='Pilih...'
														list={dataPositionRef}
													/>
												</FormGroup>
											</div>
											<div className='col-md-2'>
												<FormGroup
													id='position_code'
													label='Kode Posisi'
													className='col-10'>
													<Input
														type='text'
														//onChange={formik.handleChange}
														name='position_code'
														disabled={true}
														value={formik.values.position_code}
													/>
												</FormGroup>
											</div>
											<div className='col-md-2'>
												<FormGroup
													id='position_grade'
													label='Grade'
													className='col-10'>
													<Input
														onChange={formik.handleChange}
														value={formik.values.position_grade}
														name='position_grade'
														disabled={true}
													/>
												</FormGroup>
											</div>
											<div className='col-md-2'>
												<FormGroup
													id='dept_id'
													label='Departemen'
													className='col-12'>
													<Input
														//onChange={formik.handleChange}
														id='dept_id'
														value={formik.values.dept_id}
														name='dept_id'
														disabled={true}
													/>
												</FormGroup>
											</div>
											<div className='col-md-2'>
												<FormGroup
													id='division_id'
													label='Divisi'
													className='col-12'>
													<Input
														//onChange={formik.handleChange}
														id='division_id'
														value={formik.values.division_id}
														name='division_id'
														disabled={true}
													/>
												</FormGroup>
											</div>
											<div className='col-md-2'>
												<FormGroup
													id='group_id'
													label='Group'
													className='col-12'>
													<Input
														//onChange={formik.handleChange}
														id='group_id'
														value={formik.values.group_id}
														name='group_id'
														disabled={true}
													/>
												</FormGroup>
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
						</div>
					</div>
					<div className='row g-4'>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Form Rekrut</CardTitle>
									</CardLabel>
								</CardHeader>
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
												value={formik.values.fullname}
												invalidFeedback={formik.errors.fullname}
												isTouched={formik.touched.fullname}
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
												name='birthdate'
												value={formik.values.birthdate}
												invalidFeedback={formik.errors.birthdate}
												isTouched={formik.touched.birthdate}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='experience'
											label='Pengalaman Kerja (Tahun)'
											className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='experience'
												value={formik.values.experience}
												invalidFeedback={formik.errors.experience}
												isTouched={formik.touched.experience}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
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
										</FormGroup>
										<FormGroup id='email' label='Email' className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='email'
												value={formik.values.email}
												invalidFeedback={formik.errors.email}
												isTouched={formik.touched.email}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='phone' label='Telepon' className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='phone'
												value={formik.values.phone}
												invalidFeedback={formik.errors.phone}
												isTouched={formik.touched.phone}
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
												size='lg'
												placeholder='Alamat'
												onChange={formik.handleChange}
												value={formik.values.address}
												isTouched={formik.touched.address}
												name='address'
												invalidFeedback={formik.errors.address}
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
												onChange={formik.handleChange}
												value={formik.values.city_id}
												placeholder='Pilih...'
												list={dataCity}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button color='info' onClick={formik.handleSubmit}>
						{Number(id) > 0 ? 'Edit' : 'Simpan'}
					</Button>
				</ModalFooter>
			</Modal>
		)
	}
	return null
}

export default CustomerEditModal
