import React, { useState } from 'react'
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
	CardActions,
	CardFooter,
} from '../../../components/bootstrap/Card'
import { useFormik } from 'formik'
import CommonStoryBtn from '../../../common/partial/other/CommonStoryBtn'
import CommonHowToUse from '../../../common/partial/other/CommonHowToUse'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import Button from '../../../components/bootstrap/Button'
import CommonDesc from '../../../common/partial/other/CommonDesc'
import Input from '../../../components/bootstrap/forms/Input'
import Timeline, { TimelineItem } from '../../../components/extras/Timeline'
import dayjs from 'dayjs'
import Popovers from '../../../components/bootstrap/Popovers'
import showNotification from '../../../components/extras/showNotification'
import Icon from '../../../components/icon/Icon'
import Link from 'next/link'
import useMutateCreateRole from '../hooks/useMutateCreateRole'
import * as yup from 'yup'

interface FormRoleProps {
	idRole: number;
	roleSelected?: any[];
}

const FormRole = ({ idRole, roleSelected }: FormRoleProps) => {
	const { mutate, isSuccess, isError } = useMutateCreateRole()

	//const dataIdRole = Object.values(idRole);
	let dataRole: any = []
	if (roleSelected !== undefined) {
		dataRole = roleSelected
	}
	console.log('id : ', idRole);
	console.log('name : ', dataRole[0]);

	const RoleNameSchema = yup.object().shape({
		name: yup
			.string()
			.min(3, 'Terlalu Pendek!')
			.max(20, 'Terlalu Panjang!')
			.required('Wajib Diisi!'),
	})

	const formik = useFormik({
		initialValues: {
			id: idRole > 0 ? idRole : 0,
			name: idRole > 0 ? dataRole[0].name : '',
		},
		validationSchema: RoleNameSchema,
		validateOnChange: true,
		validateOnBlur: true,
		onSubmit: (values) => {
			mutate(
				{
					id: idRole ? idRole : 0,
					type_name: values.name,
				},
				{
					onSuccess: (data) => {
						if (data) {
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='Info' size='lg' className='me-1' />
									<span>Berhasil</span>
								</span>,
								idRole > 0
									? 'Berhasil Update Data Role'
									: 'Berhasil Menambah Data Role',
							)
						}
						values.name = ''
						// /handleOnClick();
					},
					onError: (error) => {
						// formik.setFieldError('createUserGagal', 'Gagal Membuat User.')
						//console.log('Error', error);

						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='danger' size='lg' className='me-1' />
								<span>Gagal</span>
							</span>,
							'Gagal Menambah Data Role',
							'danger',
						)
					},
				},
			)
		},
		enableReinitialize: true,
	})

	return (
		<Card stretch>
			<CardHeader>
				<CardLabel icon='ViewArray' iconColor='info'>
					<CardTitle>Form Role</CardTitle>
					<CardSubTitle>Tambah Dan Ubah Role</CardSubTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<FormGroup className='mb-3' id='name' label='Nama Role' isFloating>
					<Input
						type='text'
						onChange={formik.handleChange}
						name='name'
						id='name'
						value={formik.values.name}
						isTouched={!!formik.touched.name}
						invalidFeedback={typeof formik.errors.name === 'string' ? formik.errors.name : undefined}
						onFocus={() => {
							formik.setErrors({})
						}}
					/>
				</FormGroup>
				<FormGroup>
					<Button color='info' onClick={formik.handleSubmit}>
						Simpan
					</Button>
				</FormGroup>
			</CardBody>
			<CardFooter>
				<CommonDesc>
					Role menu merupakan menu yang diberikan per masing-masing role
				</CommonDesc>
			</CardFooter>
		</Card>
	)
}

export default FormRole
