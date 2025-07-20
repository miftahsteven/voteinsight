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
import { useRouter } from 'next/navigation'
import useMutateCreateRoleMenu from '../hooks/useMutateCreateRoleMenu'
import Select from '../../../components/bootstrap/forms/Select'
import Option, { Options } from '../../../components/bootstrap/Option'

interface FormRoleProps {
	idRoleMenu: number;
	roleMenuSelected?: { id: number; menu_id: number; type_id: number }[];
	selectDataRole?: { id: number; name: string }[];
	selectDataMenu?: { id: number; parent: string; name: string }[];
}

const FormRole: React.FC<FormRoleProps> = ({ idRoleMenu, roleMenuSelected, selectDataRole, selectDataMenu }) => {
	const { mutate, isSuccess, isError } = useMutateCreateRoleMenu()
	const routes = useRouter()

	//const dataIdRole = Object.values(idRole);
	let dataRoleMenu: any = []
	if (roleMenuSelected !== undefined) {
		dataRoleMenu = roleMenuSelected
	}

	//untuk data select role / tipe user
	let dataSelectRole: any = []
	if (selectDataRole !== undefined) {
		dataSelectRole = selectDataRole
	}

	//untuk data select menu
	let dataSelectMenu: any = []
	if (selectDataMenu !== undefined) {
		dataSelectMenu = selectDataMenu
	}

	// console.log('id : ', idRole)
	// console.log('name : ', dataRole[0])
	// console.log('data Select : ', dataSelectRole)

	const formik = useFormik({
		initialValues: {
			id: idRoleMenu > 0 ? dataRoleMenu[0]?.id : 0,
			menu_id: idRoleMenu > 0 ? dataRoleMenu[0]?.menu_id : 0,
			role_id: idRoleMenu > 0 ? dataRoleMenu[0]?.type_id : 0,
		},
		onSubmit: (values) => {
			mutate(
				{
					id: idRoleMenu ? idRoleMenu : 0,
					menu_id: values.menu_id,
					role_id: values.role_id,
				},
				{
					onSuccess: (data) => {
						if (data) {
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='Info' size='lg' className='me-1' />
									<span>Berhasil</span>
								</span>,
								idRoleMenu > 0
									? 'Berhasil Update Data Role Menu'
									: 'Berhasil Menambah Data Role Menu',
							)
						}
						// values.role_id = 0
						// values.menu_id = 0
						// /handleOnClick();
						routes.push('/role/list/menu')
					},
					onError: (error) => {
						// formik.setFieldError('createUserGagal', 'Gagal Membuat User.')
						//console.log('Error', JSON.stringify(error.response.status));

						if ((error as any)?.response?.status === 405) {
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='danger' size='lg' className='me-1' />
									<span>Gagal</span>
								</span>,
								'Gagal Karena Data Sudah Ada',
								'danger',
							)
						} else {
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='danger' size='lg' className='me-1' />
									<span>Gagal</span>
								</span>,
								'Gagal Menambah Data Role Menu',
								'danger',
							)
						}
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
					<CardTitle>Form Role Menu</CardTitle>
					<CardSubTitle>Tambah dan Ubah Role Menu</CardSubTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<FormGroup className='mb-3' id='name' label='Nama Role'>
					<Select
						id='largeSelect'
						ariaLabel='Role/Type User'
						onChange={formik.handleChange}
						name='role_id'
						value={formik.values.role_id}
						placeholder='Pilih Role'>
						<option value={0}>-- Pilih Role --</option>
						{dataSelectRole.map((i:any) => (
							<Option key={i.id} value={i.id}>
								{i.name}
							</Option>
						))}
					</Select>
				</FormGroup>
				<FormGroup className='mb-3' id='name' label='Nama Menu'>
					<Select
						id='largeSelect'
						ariaLabel='Nama Menu'
						placeholder='Pilih Menu'
						name='menu_id'
						value={formik.values.menu_id}
						onChange={formik.handleChange}>
						<option value={0}>-- Pilih Menu --</option>
						{dataSelectMenu.map((i:any) => (
							<Option key={i.id} value={i.id}>
								{`${i.parent} : ${i.name}`}
							</Option>
						))}
					</Select>
				</FormGroup>
				<FormGroup>
					<Button
						color='info'
						onClick={formik.handleSubmit}
						className='w-25'
						isDisable={
							formik.values.menu_id !== 0 && formik.values.role_id !== 0
								? false
								: true
						}>
						{idRoleMenu > 0 ? 'Update' : 'Simpan'}
					</Button>
					<Button
						color='warning'
						className='w-25 mx-2'
						type='reset'
						onClick={() => {
							routes.refresh()
						}}>
						Batal
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
