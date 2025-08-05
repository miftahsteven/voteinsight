import React, { FC } from 'react'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal'

import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card'
import Button from '../../../components/bootstrap/Button'
import Label from '../../../components/bootstrap/forms/Label'
import useMutateCreateUser from '../../../hooks/useMutateCreateUser'
import * as yup from 'yup'
import Icon from '../../../components/icon/Icon'
export const SELECT_STATUS_OPTIONS = [
	{ value: 0, text: 'Laki-Laki' },
	{ value: 1, text: 'Wanita' },
]

interface DetailProps {
	id: any
	isOpen: boolean
	setIsOpen(...args: unknown[]): unknown
	dataContent:  string | any[]
}
const Detail: FC<DetailProps> = ({
	id,
	isOpen,
	setIsOpen,
	dataContent,

}) => {
	interface ItemData {
		Date?: string
		Facebook?: string		
		Instagram?: string
		X?: string	
	}		
	const item: ItemData = dataContent as ItemData
	//change DataContent to 
	//console.log(' ---> Detail dataContent', dataContent[0]?.Facebook)

	const { mutate, isSuccess, isError } = useMutateCreateUser()	

	const formik = useFormik({
		initialValues: {
			Facebook: Number(id) > 0 ? item?.Facebook : '',		
			Instagram: Number(id) > 0 ? item?.Instagram : '',
			X: Number(id) > 0 ? item?.X : '',			
			Date: Number(id) > 0 ? dayjs(item?.Date).format('YYYY-MM-DD') : '',
			
		},
		//validationSchema: SignupSchema,
		onSubmit: (values) => {
			console.log(' ---> submit', JSON.stringify(values))
			
		},
	})

	if (id || id === '0') {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='lg' titleId={id.toString()}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{'Detail Caption'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-12'>
					<div className='row g-8'>
						<div className='col-md-12'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Informasi Generate Caption</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='content'>Caption Facebook													
														<Button className='ms-2' icon='ContentCopy' onClick={() => {
															navigator.clipboard.writeText(dataContent[0]?.Facebook || '')
														}}>			
														Copy												
														</Button>													
												</Label>
											</FormGroup>
											{/** Data Konten Is Text not input */}
											<div className='form-control'>
												{dataContent[0]?.Facebook}
											</div>
										</div>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='content'>Caption Instagram
													<Button className='ms-2' icon='ContentCopy' onClick={() => {
														navigator.clipboard.writeText(dataContent[0]?.Instagram || '')
													}}>			
													Copy												
													</Button>
												</Label>
											</FormGroup>
											{/** Data Konten Is Text not input */}
											<div className='form-control'>
												{dataContent[0]?.Instagram}
											</div>
										</div>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='content'>Caption X
														<Button className='ms-2' icon='ContentCopy' onClick={() => {
															navigator.clipboard.writeText(dataContent[0]?.X || '')
														}}>			
														Copy												
														</Button>
												</Label>
											</FormGroup>
											{/** Data Konten Is Text not input */}
											<div className='form-control'>
												{dataContent[0]?.X}
											</div>
										</div>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='date'>Tanggal Generate</Label>
											</FormGroup>
											<div className='form-control h-50 scrollable'>
												{dataContent[0]?.Date
													? dayjs(dataContent[0]?.Date).format('DD MMMM YYYY')
													: ''}
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>						
					</div>
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button color='info' onClick={() => setIsOpen(false)}>
						Tutup
					</Button>
				</ModalFooter>
			</Modal>
		)
	}
	return null
}

export default Detail
