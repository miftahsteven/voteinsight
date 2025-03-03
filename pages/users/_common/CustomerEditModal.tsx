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
	const itemData = id ? dataUserById : {}
	//const item = id && Array.isArray(itemData) ? itemData : {};
	const item = id ? itemData : {}
	console.log(' ---> OK', JSON.stringify(item))
	// const dataUser = useQueryUserAll();

	//const dataRoleUser = Array.isArray(dataRole) ? dataRole : {};

	//console.log('---lll', JSON.stringify(dataRole));

	const { mutate, isSuccess, isError } = useMutateCreateUser()

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
			user_type_id: Number(id) > 0 ? item?.type_id : '',
			check_type: false,
			username: Number(id) > 0 ? item?.username : '',
			user_id: Number(id) > 0 ? item?.user_id : '',
			//password: item?.password || '',
		},
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
						{/* <FormGroup id='name' label='Name' className='col-md-6'>
							<Input onChange={formik.handleChange} value={formik.values.name} />
						</FormGroup>
						<FormGroup id='email' label='Email' className='col-md-6'>
							<Input
								type='email'
								onChange={formik.handleChange}
								value={formik.values.email}
							/>
						</FormGroup>
						<FormGroup id='membershipDate' label='Membership' className='col-md-6'>
							<Input
								type='date'
								onChange={formik.handleChange}
								value={formik.values.membershipDate}
								disabled
							/>
						</FormGroup> */}
						{/* <FormGroup id='type' label='Type' className='col-md-6'>
							<Input
								onChange={formik.handleChange}
								value={formik.values.type}
								disabled
							/>
						</FormGroup> */}
						{/* <FormGroup>
							<Label htmlFor='ChecksGroup'>Payout Type</Label>
							<ChecksGroup isInline>
								{Object.keys(PAYMENTS).map((i) => (
									<Checks
										type='radio'
										key={PAYMENTS[i].name}
										id={PAYMENTS[i].name}
										label={PAYMENTS[i].name}
										name='payoutType'
										value={PAYMENTS[i].name}
										onChange={formik.handleChange}
										checked={formik.values.payoutType}
									/>
								))}
							</ChecksGroup>
						</FormGroup> */}
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
											/>
										</FormGroup>
										<FormGroup id='email' label='Email' className='col-12'>
											<Input
												type='email'
												onChange={formik.handleChange}
												name='email'
												value={formik.values.email}
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
											/>
										</FormGroup>
										{/* <FormGroup>
											<Label htmlFor='ChecksGroup'>Type User</Label>
											<ChecksGroup>
												{dataTypeFinal.map((i: any) => (
													<Checks
														type='radio'
														key={i.type_name}
														id={i.id}
														label={i.type_name}
														name='user_type'
														value={i.id}
														onChange={formik.handleChange}
														checked={Number(formik.values.user_type)}
													/>
												))}
											</ChecksGroup>
										</FormGroup> */}
										{/* <FormGroup
											id='streetAddress2'
											label='Address Line 2'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.streetAddress2}
											/>
										</FormGroup> */}
										{/* <FormGroup id='city' label='City' className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.city}
											/>
										</FormGroup> */}
										{/* <FormGroup
											id='stateFull'
											label='State'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.stateFull}
											/>
										</FormGroup> */}
										{/* <FormGroup id='zip' label='Zip' className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.zip}
											/>
										</FormGroup> */}
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
											/>
										</FormGroup>
										{/* <FormGroup
											id='password'
											label='Password'
											className='col-12'>
											<Input
												type='password'
												onChange={formik.handleChange}
												value={formik.values.password}
											/>
										</FormGroup> */}
										<FormGroup>
											<Label htmlFor='ChecksGroup'>Role User</Label>
											<ChecksGroup>
												{dataRole?.map((i: any) => (
													<Checks
														type='radio'
														key={i.type_name}
														id={i.id}
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
														checked={formik.values.user_type_id}
													/>
												))}
											</ChecksGroup>
										</FormGroup>
										{/* <FormGroup
											id='cityDelivery'
											label='City'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.cityDelivery}
											/>
										</FormGroup> */}
										{/* <FormGroup
											id='stateFullDelivery'
											label='State'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.stateFullDelivery}
											/>
										</FormGroup> */}
										{/* <FormGroup
											id='zipDelivery'
											label='Zip'
											className='col-md-4'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.zipDelivery}
											/>
										</FormGroup> */}
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
