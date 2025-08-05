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
		Judul?: string
		Content?: string		
		Sumber?: string
	}		
	const item: ItemData = dataContent as ItemData
	//change DataContent to 
	console.log('dataContent', dataContent);
	

	const { mutate, isSuccess, isError } = useMutateCreateUser()	

	const formik = useFormik({
		initialValues: {			
			Judul: Number(id) > 0 ? item?.Judul : '',
			Content: Number(id) > 0 ? item?.Content : '',		
			Sumber: Number(id) > 0 ? item?.Sumber : '',	
			Date: Number(id) > 0 ? item?.Date : '',
			
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
					<ModalTitle id={id}>{'Detail Berita'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-12'>
					<div className='row g-8'>
						<div className='col-md-12'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Informasi Generate Berita</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='content'>Sumber</Label>
											</FormGroup>
											{/** Data Konten Is Text not input */}
											<div className='form-control'>
												{dataContent[0]?.Sumber}
											</div>
										</div>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='content'>Judul</Label>
											</FormGroup>
											{/** Data Konten Is Text not input */}
											<div className='form-control'>
												{dataContent[0]?.Judul}
											</div>
										</div>
										<div className='col-md-12 h-50 scrollable'>
											<FormGroup>
												<Label htmlFor='content'>Ringkasan</Label>
											</FormGroup>
											{/** make this content have scroll with more height */}
											<div className='form-control h-50 scrollable'>
												{dataContent[0]?.Content}
											</div>											
										</div>
										
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='date'>Tanggal Generate</Label>
											</FormGroup>
											<div className='form-control h-50 scrollable'>
												{dataContent[0]?.Date}
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
