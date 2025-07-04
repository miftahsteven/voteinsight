import React, { FC, useCallback } from 'react'
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
import { useRouter } from 'next/router'

interface ICustomerEditModalProps {
	id: string
	isOpen: boolean	
	setIsOpen(...args: unknown[]): unknown
	dataPos: []
	//dataUserById: []
}
const CustomerEditModal: FC<ICustomerEditModalProps> = ({
	id,
	isOpen,
	setIsOpen,
	dataPos,
	//dataUserById,
}) => {

	const router = useRouter()

	const dataDept = useQueryRefDepartments()
	let dataDeptRef = []
	if (dataDept !== undefined) {
		dataDeptRef = dataDept.data.map((item) => ({
			value: item.id,
			text: `${item.dept_name} - ${item.divisions.division_name} - ${item.divisions.groups.group_name}`,
		}))
	}

	const itemData = {}
	//const item = id && Array.isArray(itemData) ? itemData : {};
	const item = id ? itemData : {}
	console.table(' ---> OK DEPT', dataDeptRef)
	const { mutate, isSuccess, isError } = useMutateCreatePosition()
	const handleOnError = useCallback(() => router.push('/recruitment/list/vacancy'), [router])

	const formik = useFormik({
		initialValues: {
			id: Number(id) > 0 ? item?.id : 0,
			position_name: Number(id) > 0 ? item?.position_name : '',
			position_code: Number(id) > 0 ? item?.position_code : '',
			position_grade: Number(id) > 0 ? item?.position_grade : '',
			position_deskripsi: Number(id) > 0 ? item?.position_deskripsi : '',
			dept_id: Number(id) > 0 ? item?.dept_id : '',
			status: 0,
			position_head: Number(id) > 0 ? item?.position_head : '',
		},
		validate: (values) => {
			const errors: {
				position_name?: string
				position_code?: string
				position_grade?: string
				position_deskripsi?: string
			} = {}

			if (!values.position_name) {
				errors.position_name = 'Wajib Diisi'
			}

			if (!values.position_code) {
				errors.position_code = 'Wajib Diisi'
			}

			if (!values.position_grade) {
				errors.position_grade = 'Wajib Diisi'
			}

			if (!values.position_deskripsi) {
				errors.position_deskripsi = 'Wajib Diisi'
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
					position_head: values.position_head || '',
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

	if (id || id === '0') {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id.toString()}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{item?.position_name || 'Posisi Baru'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<div className='col-md-6'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Form Posisi</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<FormGroup
											id='position_name'
											label='Nama Posisi'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.position_name}
												invalidFeedback={formik.errors.position_name}
												isTouched={formik.touched.position_name}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='position_code'
											label='Kode Posisi'
											className='col-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												name='position_code'
												value={formik.values.position_code}
												invalidFeedback={formik.errors.position_code}
												isTouched={formik.touched.position_code}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='position_grade'
											label='Grade'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.position_grade}
												name='position_grade'
												invalidFeedback={formik.errors.position_grade}
												isTouched={formik.touched.position_grade}
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
										<FormGroup
											id='dept_id'
											label='Departement'
											className='col-12'>
											<Select
												id='dept_id'
												ariaLabel='Pilih Department'
												name='dept_id'
												onChange={formik.handleChange}
												value={formik.values.dept_id}
												placeholder='Pilih...'
												list={dataDeptRef}
											/>
										</FormGroup>
										<FormGroup
											id='position_head'
											label='Posisi Atasan'
											className='col-12'>
											<Select
												id='position_head'
												ariaLabel='Pilih Posisi Atasan'
												name='position_head'
												onChange={formik.handleChange}
												value={formik.values.position_head}
												placeholder='Pilih...'
												list={dataPos.map((item) => ({
													value: item.id,
													text: item.position_name,
												}))}
											/>
										</FormGroup>
										<FormGroup
											id='position_deskripsi'
											label='Deskripsi'
											className='col-12'>
											<Textarea
												size='lg'
												placeholder='Deskripsi Posisi'
												onChange={formik.handleChange}
												value={formik.values.position_deskripsi}
												isTouched={formik.touched.position_deskripsi}
												name='position_deskripsi'
												invalidFeedback={formik.errors.position_deskripsi}
												onFocus={() => {
													formik.setErrors({})
												}}
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
