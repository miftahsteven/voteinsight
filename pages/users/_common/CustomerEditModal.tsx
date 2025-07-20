import React, { FC } from 'react'
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
import Label from '../../../components/bootstrap/forms/Label'
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks'
//import PAYMENTS from '../../../common/data/enumPaymentMethod';
import useQueryUserAll from '../hooks/useQueryUserAll'
import useMutateCreateUser from '../hooks/useMutateCreateUser'
import Select from '../../../components/bootstrap/forms/Select'
import * as yup from 'yup'
export const SELECT_STATUS_OPTIONS = [
	{ value: 0, text: 'Laki-Laki' },
	{ value: 1, text: 'Wanita' },
]

interface ICustomerEditModalProps {
	id: string
	isOpen: boolean
	setIsOpen(...args: unknown[]): unknown
	dataRole: []
	dataUserById: []
}
const CustomerEditModal: FC<ICustomerEditModalProps> = ({
	id,
	isOpen,
	setIsOpen,
	dataRole,
	dataUserById,
}) => {
	interface ItemData {
		name?: string
		email?: string
		membershipDate?: string
		type?: string
		phone?: string
		username?: string
		user_id?: string
		user_gender?: string
		type_id?: number
	}

	const itemData: ItemData = id ? (dataUserById as ItemData) : {}
	const item: ItemData = id ? itemData : {}
	console.log(' ---> OK', JSON.stringify(item))
	const phoneRegExp = /^(?:\+62|62|0)[2-9][0-9]{7,11}$/ // Regex for Indonesian phone numbers

	const { mutate, isSuccess, isError } = useMutateCreateUser()

	const SignupSchema = yup.object().shape({
		name: yup
			.string()
			.min(3, 'Terlalu Pendek!')
			.max(25, 'Terlalu Panjang!')
			.required('Wajib Diisi!'),
		username: yup
			.string()
			.min(5, 'Terlalu Pendek!')
			.max(8, 'Terlalu Panjang!')
			.required('Wajib Diisi!'),
		phone: yup.string().matches(phoneRegExp, 'No. Telp Tidak Valid!'),
		email: yup.string().email('Email Format Salah').required('Wajib Diisi!'),
	})

	const formik = useFormik({
		initialValues: {
			name: Number(id) > 0 ? item?.name : '',
			email: Number(id) > 0 ? item?.email : '',
			membershipDate: Number(id) > 0 ? dayjs(item?.membershipDate).format('YYYY-MM-DD') : '',
			type: item?.type || 'Author',
			streetAddress: 0,
			streetAddress2: 0,
			city: 0,
			stateFull: 0,
			zip: 0,
			streetAddressDelivery: 0,
			streetAddress2Delivery: 0,
			cityDelivery: 0,
			stateFullDelivery: 0,
			zipDelivery: 0,
			payoutType: 1,
			phone: Number(id) > 0 ? String(item?.phone) : '',
			user_type: Number(id) > 0 ? item?.type : '',
			user_type_id: Number(id) > 0 ? item?.type_id : 1,
			check_type: false,
			username: Number(id) > 0 ? item?.username : '',
			user_id: Number(id) > 0 ? item?.user_id : '',
			user_gender: Number(id) > 0 ? item?.user_gender : '',
			//password: item?.password || '',
		},
		validationSchema: SignupSchema,
		onSubmit: (values) => {
			console.log(' ---> submit', JSON.stringify(values))
			mutate(
				{
					user_id: values.user_id,
					username: values.username,
					user_nama: values.name,
					user_email: values.email,
					user_phone: String(values.phone),
					user_type: values.user_type_id,
					user_gender: values.user_gender,
					id: id ? id : 0,
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
								'Berhasil Menambah Data User',
							)
						}
						// /handleOnClick();
					},
					onError: (error) => {
						formik.setFieldError('createUserGagal', 'Gagal Membuat User.')

						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='danger' size='lg' className='me-1' />
								<span>Gagal</span>
							</span>,
							'Gagal Menambah Data User',
						)
					},
				},
			)
		},
	})

	if (id || id === '0') {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id.toString()}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{item?.name || 'User Baru'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Informasi Karyawan</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<FormGroup id='name' label='Nama' className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.name}
												isTouched={formik.touched.name}
												invalidFeedback={formik.errors.name}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup id='email' label='Email' className='col-12'>
											<Input
												type='email'
												onChange={formik.handleChange}
												name='email'
												value={formik.values.email}
												isTouched={formik.touched.email}
												invalidFeedback={formik.errors.email}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='phone'
											label='No.Handphone'
											className='col-12'>
											<Input
												type='tel'
												onChange={formik.handleChange}
												value={formik.values.phone}
												isTouched={formik.touched.phone}
												invalidFeedback={formik.errors.phone}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='user_gender'
											label='Jenis Kelamin'
											className='col-12'>
											<Select
												id='user_gender'
												ariaLabel='Pilih Status'
												name='user_gender'
												onChange={formik.handleChange}
												value={formik.values.user_gender}
												placeholder='Pilih...'
												list={SELECT_STATUS_OPTIONS}
											/>
										</FormGroup>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='ManageAccounts'>
										<CardTitle>Informasi Akun</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<FormGroup
											id='username'
											label='Username/NIP'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												disabled={Number(id) > 0 ? true : false}
												value={formik.values.username}
												isTouched={formik.touched.username}
												invalidFeedback={formik.errors.username}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup>
											<Label htmlFor='ChecksGroup'>Role User</Label>
											<ChecksGroup>
												{dataRole?.map((i: any) => (
													<Checks
														type='radio'
														key={i.type_name}
														id={`user_type_id${i.id}`}
														label={i.type_name}
														name='user_type_id'
														value={i.id}
														//onChange={formik.handleChange}
														onChange={() => {
															console.log(' ---9999 ', i.id)
															formik.setFieldValue(
																'user_type_id',
																i.id,
															)
														}}
														isTouched={formik.touched.user_type_id}
														invalidFeedback={formik.errors.user_type_id}
														onFocus={() => {
															formik.setErrors({})
														}}
														checked={String(formik.values.user_type_id)}
													/>
												))}
											</ChecksGroup>
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
