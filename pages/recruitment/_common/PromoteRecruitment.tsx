import React, { FC, useCallback, useEffect } from 'react'
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
import useQueryStatusRec from '../hooks/useQueryStatusRec'
import useQueryInterviewer from '../hooks/useQueryInterviewer'
import { stat } from 'fs'
import useMutateUpdateStatusRec from '../hooks/useMutateUpdateStatusRec'
import { useRouter } from 'next/router'

interface ICustomerEditModalProps {
	id: number
	//idStatus: string
	isOpen: boolean	
	setIsOpen(...args: unknown[]): unknown
	dataRecruitmenSelected: any[]
	//dataUserById: []
}
const CustomerEditModal: FC<ICustomerEditModalProps> = ({
	id,
	//idStatus,
	isOpen,
	setIsOpen,
	dataRecruitmenSelected,
	//dataRole,
	//dataUserById,
}) => {
	//console.log(' ---> CustomerEditModasl', JSON.stringify(dataRecruitmenSelected[0]));	
	const router = useRouter()
	const dataInterviewer = useQueryInterviewer()
	const dataStatus = useQueryStatusRec()	
	let dataStatusRef = []
	if (dataStatus !== undefined) {
		dataStatusRef = dataStatus.data.filter((f:any) => f.id > 7).map((item: any) => ({
			value: item.id,
			text: `${item.name}`,
		}))
	}

	useEffect(() => {
		if (isOpen) {
		  // Only run when the modal is opened
		  if (dataInterviewer?.data) {
			const picData = dataInterviewer.data.map((pic: any) => ({
			  value: pic.id,
			  text: `${pic.user_profile[0]?.user_nama} - ${pic.user_profile[0]?.position?.position_name}`,
			}));
			setDataPIC(picData);
		  }
		  if(dataRecruitmenSelected[0]?.recruitment_status?.id === 3 || dataRecruitmenSelected[0]?.recruitment_status?.id === 4){
				setInterviewId(true) 
		  }
		}
	  }, [isOpen, dataInterviewer?.data]); // Dependencies: isOpen and dataInterviewer.data

	const [dataPIC, setDataPIC] = React.useState([])
	const [interviewId, setInterviewId] = React.useState(false)
	const getDataInterviewer = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, id } = e.target
		console.log(' ---> getSelectData', dataStatusRef.filter((item: any) => item.value === Number(value))[0].text)
		formik.setFieldValue(name, value)
		const selectedStatus = dataStatusRef.filter((item: any) => item.value === Number(value))[0].text
		let selectedItem = []
		//process_set()
		if (selectedStatus.includes("Interview")) {
			// process_set()		
			setDataPIC(
				dataInterviewer.data
					.map((pic: any) => ({
						value: pic.id,
						text: `${pic.user_profile[0]?.user_nama} - ${pic.user_profile[0]?.position?.position_name}`,
					})),
			)	
			setInterviewId(true)
			
		} else {
			setDataPIC([])
		}
	}

	const itemData = {}
	//const item = id && Array.isArray(dataRecruitmenSelected[0]) ? dataRecruitmenSelected[0] : {};
	const item = id ? dataRecruitmenSelected[0] : {} //itemData : {}
	const itemDataProcess = id ? item?.recruitment_process?.filter((items: any) => items.process_status == item?.recruitment_status.id)[0] : {} //itemData : {}
	//console.table('CHECKDATAPROC', itemDataProcess?.status_pic_id )
	const { mutate, isSuccess, isError } = useMutateUpdateStatusRec()
	const handleOnError = useCallback(() => router.push('/recruitment/list'), [router]) 

	const formik = useFormik({
		initialValues: {
			id: Number(id) > 0 ? id : 0,			
			process_status: Number(id) > 0 ? itemDataProcess?.process_status: '',
			status_pic_id: Number(id) > 0 ? itemDataProcess?.status_pic_id : '',
			process_description: Number(id) > 0 ? itemDataProcess?.process_description : '',
		},
		validate: (values) => {
			const errors: {				
				process_description?: string
			} = {}
			if (!values.process_description) {
				errors.process_description = 'Wajib Diisi'
			}						
			return errors
		},
		validateOnChange: false,
		enableReinitialize: true,
		onSubmit: (values) => {
			//console.log(' ---> submit', JSON.stringify(values))
			mutate(
				{
					id: id,					
					process_status: values.process_status,
					status_pic_id: values.status_pic_id,
					process_description: values.process_description,
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
								'Berhasil Mengubah Data Status Recruitment',
							)
						}
						// /handleOnClick();
					},
					onError: (error) => {
						formik.setFieldError('createPositionGagal', 'Gagal Mengubah Data Recruitment.')

						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='danger' size='lg' className='me-1' />
								<span>Gagal</span>
							</span>,
							'Gagal Mengubah Data Status Recruitment',
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
					<ModalTitle id={id}>{item?.position_name || 'Update Status'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<div className='col-sm-12'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Next Process</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<FormGroup
											id='process_status'
											label='Proses Selanjutnya'
											className='col-12'>
											<Select
												id='process_status'
												ariaLabel='Pilih Proses Berikutnya'
												name='process_status'
												//onChange={formik.handleChange}
												onChange={(e) => {
													getDataInterviewer(e)
													//formik.handleChange(e)
												}}
												value={formik.values.process_status}
												placeholder='Pilih...'
												list={dataStatusRef}
											/>
										</FormGroup>									
										<FormGroup
											id='process_description'
											label='Deskripsi Proses'
											className='col-12'>
											<Input
												onChange={formik.handleChange}
												value={formik.values.process_description}
												name='process_description'
												invalidFeedback={formik.errors.process_description}
												isTouched={formik.touched.process_description}
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
