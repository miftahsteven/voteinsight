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
	dataContent: any
	dataBerita: any
}
const Detail: FC<DetailProps> = ({
	id,
	isOpen,
	setIsOpen,
	dataContent,
	dataBerita = '',
}) => {
	interface ItemData {
		Date?: string
		Content?: string		
	}	
	console.log(' ---> Detail dataContent', dataContent, dataBerita)
	const item = {
		Berita: dataBerita || '',
		Isi: dataContent || '',
	}
	//change DataContent to 

	const { mutate, isSuccess, isError } = useMutateCreateUser()	

	const formik = useFormik({
		initialValues: {
			Content: Number(id) > 0 ? item?.Isi : '',			
			Berita: Number(id) > 0 ? item?.Berita : '',			

			//Date: Number(id) > 0 ? dayjs(item?.Date).format('YYYY-MM-DD') : '',
			
		},
		//validationSchema: SignupSchema,
		onSubmit: (values) => {
			console.log(' ---> submit', JSON.stringify(values))
			
		},
	})

	if (id || id === '0') {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='md' titleId={id.toString()}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{'Detail Pidato'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-12'>
					<div className='row g-8'>
						<div className='col-md-12'>
							<Card className='rounded-1 mb-0'>
								<CardHeader>
									<CardLabel icon='People'>
										<CardTitle>Informasi Generate Pidato</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody>
									<div className='row g-3'>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='content'>Konten Pidato</Label>
											</FormGroup>
											{/** Data Konten Is Text not input */}
											<div className='form-control'>
												{item.Isi}
											</div>
										</div>
										<div className='col-md-12'>
											<FormGroup>
												<Label htmlFor='date'>Berita</Label>
											</FormGroup>
											<div className='form-control h-50 scrollable'>
												{item.Berita}
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
