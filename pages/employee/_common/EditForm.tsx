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
import { stat } from 'fs'
import useMutateCreateContract from '../../../hooks/useMutateCreateContract'
import { useRouter } from 'next/router'

export const SELECT_TYPE_OPTIONS = [
	{ value: 0, text: 'PKWT' },
	{ value: 1, text: 'PKWTT' },
	{ value: 2, text: 'OUTSOURCING' },
	{ value: 3, text: 'MAGANG' },
	{ value: 4, text: 'KONTRAK' },
]

interface IFormModalProps {
	id: string
	isOpen: boolean	
	setIsOpen(...args: unknown[]): unknown
	dataContractSelected: any[]
	//dataUserById: []
}
const FormModal: FC<IFormModalProps> = ({
	id,
	isOpen,
	setIsOpen,
	dataContractSelected,
	//dataUserById,
}) => {
	console.log(' ---> FormEditModal', JSON.stringify(dataContractSelected));
	const router = useRouter()
	const itemData = {}
	//const item = id && Array.isArray(itemData) ? itemData : {};
	const item = id ? dataContractSelected[0] : {} //itemData : {}
	//const itemDataProcess = id ? item?.recruitment_process?.filter((items: any) => items.process_status == item?.recruitment_status.id)[0] : {} //itemData : {}
	const { mutate, isSuccess, isError } = useMutateCreateContract()
	const handleOnError = useCallback(() => router.push('/employee/list/contract'), [router])

	const formik = useFormik({
		initialValues: {
			id: id,
			contract_number: item?.contract_number || '',
			contract_type: item?.contract_type ?? '',
			contract_end_date: item?.contract_end_date && dayjs(item?.contract_end_date).isValid()
				? dayjs(item?.contract_end_date).format('YYYY-MM-DD')
				: '', // Ensure valid date or empty string					
			contract_status: item?.contract_status || '',
			searchInput: '',
		},
		validate: (values) => {
			const errors: {
				contract_number?: string
				contract_type?: string
				contract_end_date?: string
				contract_status?: string
			} = {}

			if (!values.contract_number) {
				errors.contract_number = 'Wajib Diisi'
			}
			if (!values.contract_end_date) {
				errors.contract_end_date = 'Wajib Diisi'
			} 

			return errors
		},
		validateOnChange: false,
		enableReinitialize: true,
		onSubmit: (values) => {
			// alert(JSON.stringify(values, null, 2));
			console.log(' ---> submit', JSON.stringify(values))			
			mutate(
				{ 
					id: Number(id),
					contract_number: values.contract_number,
					contract_type: values.contract_type,
					contract_end_date: values.contract_end_date,
					contract_status: values.contract_status,
				},
				{
					onSuccess: (data) => {
						if (data) {
							setIsOpen(false)
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='Info' size='lg' className='me-1' />
									<span>Berhasil</span>
								</span>,
								'Berhasil Mengubah Data Kontrak',
							)
						}
						formik.resetForm()
						//setUpcomingEventsEditOffcanvas(false)
						// /handleOnClick();
					},
					onError: (error) => {
						formik.setFieldError('createPositionGagal', 'Gagal Mengubah Data Kontrak.')

						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='danger' size='lg' className='me-1' />
								<span>Gagal</span>
							</span>,
							'Gagal Mengubah Data Kontrak',
						)
						handleOnError()
					},
				},
			)
		},
	})

	if (id || id === '0') {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='md' titleId={id.toString()}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{'Ubah Data Kontrak'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<div className='col-md-12'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Form Ubah Kontrak</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<FormGroup
											id='contract_number'
											label='Nomor Kontrak'											
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.contract_number}
												invalidFeedback={typeof formik.errors?.contract_number === 'string' ? formik.errors.contract_number : undefined}
												isTouched={!!formik.touched?.contract_number}
												onFocus={() => {
													formik.setErrors({})
												}}
											/>
										</FormGroup>
										<FormGroup
											id='contract_type'
											label='Tipe Kontrak'
											className='col-12'>
											<Select
												id='contract_type'
												ariaLabel='Pilih Tipe Kontrak'
												name='contract_type'
												onChange={formik.handleChange}
												value={formik.values.contract_type}
												placeholder='Pilih...'
												list={SELECT_TYPE_OPTIONS}
											/>
										</FormGroup>
										<FormGroup
											id='contract_end_date'
											label='Tanggal Berakhir Kontrak'
											className='col-12'>
											<Input
												type='date'
												onChange={formik.handleChange}
												name='contract_end_date'
												value={formik.values.contract_end_date}
												invalidFeedback={formik.errors.contract_end_date}
												isTouched={formik.touched.contract_end_date}
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

export default FormModal
