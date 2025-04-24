import React, { useState, useCallback } from 'react'
import type { NextPage } from 'next'
import classNames from 'classnames'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useFormik } from 'formik'
import useDarkMode from '../../../hooks/useDarkMode'
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons'
import Modal, {
	ModalHeader,
	ModalBody,
	ModalFooter,
	ModalTitle,
} from '../../../components/bootstrap/Modal'
import PAYMENTS from '../../../common/data/enumPaymentMethod'
//import data from '../../../common/data/dummyCustomerData';
import data from '../../../common/data/usersDummyAllData'
import useSortableData from '../../../hooks/useSortableData'
import { demoPagesMenu, odSystAdminPagesMenu } from '../../../menu'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader'
import Icon from '../../../components/icon/Icon'
import Input from '../../../components/bootstrap/forms/Input'
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown'
import Button from '../../../components/bootstrap/Button'
import Select from '../../../components/bootstrap/forms/Select'
import Popovers from '../../../components/bootstrap/Popovers'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup'
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks'
import Page from '../../../layout/Page/Page'
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card'
import Textarea from '../../../components/bootstrap/forms/Textarea'
import { getColorNameWithIndex } from '../../../common/data/enumColors'
import { getFirstLetter, priceFormat } from '../../../helpers/helpers'
import EditModal from '../_common/EditModal'
import useQueryUserAll from '../hooks/useQueryUserAll'
//import useMutateActionUser from '../hooks/useMutateActionUser'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import useQueryPositions from '../hooks/useQueryPositions'
import useQueryRefDepartments from '../hooks/useQueryRefDepartments'
import showNotification from '../../../components/extras/showNotification'
import useMutateCreatePosition from '../hooks/useMutateCreatePosition'
import useMutateActionVacancy from '../hooks/useMutateActionVacancy'
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas'

export const SELECT_STATUS_OPTIONS = [
	{ value: 0, text: 'Vacant' },
	{ value: 1, text: 'Filled' },
]

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const router = useRouter()
	const dataDept = useQueryRefDepartments()
	let dataDeptRef = []
	if (dataDept !== undefined) {
		dataDeptRef = dataDept.data.map((item) => ({
			value: item.id,
			text: `${item.dept_name} - ${item.divisions.division_name} - ${item.divisions.groups.group_name}`,
		}))
	}

	const dataPositions = useQueryPositions()
	let dataPosFinal = []
	if (dataPositions !== undefined) {
		dataPosFinal = dataPositions.data
	}
	const handleOnError = useCallback(() => router.push('/recruitment/list/vacancy'), [router])
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false)
	const handleUpcomingEdit = (id) => {
		setIdSelected(id)
		const dataEditPosition = dataPosFinal.filter((item) => item.id == id)
		console.log(' ----< Dtu', dataEditPosition)
		if (dataEditPosition.length > 0) {
			formik.setFieldValue('position_name', dataEditPosition[0].position_name)
			formik.setFieldValue('position_code', dataEditPosition[0].position_code)
			formik.setFieldValue('position_grade', dataEditPosition[0].position_grade)
			formik.setFieldValue('position_deskripsi', dataEditPosition[0].position_deskripsi)
			formik.setFieldValue('dept_id', dataEditPosition[0].departments.id)
			formik.setFieldValue('status', dataEditPosition[0].status)
		}
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas)
	}
	//console.log(' ----< Dtu', dataTypeFinal);
	//console.log(' ----< Dt', data);
	const [inActiveModal, setInactiveModal] = useState(false)
	const [idSelected, setIdSelected] = useState()
	const [action, setAction] = useState('')
	const [statusSelected, setStatusSelected] = useState(0)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])

	const inactiveModalOpen = (id: any) => {
		setInactiveModal(true)
		setIdSelected(id)
	}

	const { mutate, isSuccess, isError } = useMutateCreatePosition()
	const { mutate: mutateAction, isSuccess: isSuccessAction } = useMutateActionVacancy()
	const handleActioneMutate = () => {
		mutateAction(
			{
				id: idSelected,
			},
			{
				onSuccess: (data) => {
					if (data) {
						setInactiveModal(false)
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Berhasil</span>
							</span>,
							'Berhasil Menghapus Posisi',
						)
					}
				},
				onError: (error) => {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='danger' size='lg' className='me-1' />
							<span>Gagal</span>
						</span>,
						'Gagal Menghapus Posisi',
					)
					handleOnError()
				},
			},
		)
		setInactiveModal(false)
	}

	const formik = useFormik({
		initialValues: {
			searchInput: '',
			position_name: '',
			position_code: '',
			position_grade: '',
			position_deskripsi: '',
			dept_id: '',
			status: '',
		},
		onSubmit: (values) => {
			// alert(JSON.stringify(values, null, 2));
			console.log(' ---> submit', JSON.stringify(values))
			mutate(
				{
					id: idSelected,
					position_name: values.position_name,
					position_code: values.position_code,
					position_grade: values.position_grade,
					position_deskripsi: values.position_deskripsi,
					dept_id: values.dept_id,
					status: Number(values.status),
				},
				{
					onSuccess: (data) => {
						if (data) {
							setUpcomingEventsEditOffcanvas(false)
							//formik.resetForm()
							//setIdSelected(0)
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

	const filteredData = dataPosFinal.filter(
		(f: any) =>
			// Name
			f.position_code?.toLowerCase().includes(formik.values.searchInput.toLowerCase()) ||
			f.position_name?.toLowerCase().includes(formik.values.searchInput.toLowerCase()),
	)

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)

	const [editModalStatus, setEditModalStatus] = useState<boolean>(false)

	return (
		<PageWrapper>
			<Head>
				<title>List Posisi</title>
			</Head>
			<SubHeader>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Cari User...'
						onChange={formik.handleChange}
						value={formik.values.searchInput}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setEditModalStatus(true)}>
						Posisi Baru
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th
												onClick={() => requestSort('name')}
												className='cursor-pointer text-decoration-underline'>
												Nama Posisi{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('name')}
													icon='FilterList'
												/>
											</th>
											<th>Kode Posisi</th>
											<th>Nama Department</th>
											<th>Position Grade</th>
											<th>Status</th>
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map(i => (
											<tr key={i.id}>
												<td>{i.position_name}</td>
												<td>{i.position_code}</td>
												<td>{i.departments.dept_name}</td>
												<td>{i.position_grade}</td>
												<td
													className={
														i.status == 0
															? 'text-danger'
															: 'text-primary bold'
													}>
													{i.status == 0 ? 'Vacant' : 'Filled'}
												</td>
												<td>
													<Dropdown>
														<DropdownToggle hasIcon={false}>
															<Button
																icon='MoreHoriz'
																color='dark'
																isLight
																shadow='sm'
															/>
														</DropdownToggle>
														<DropdownMenu isAlignmentEnd>
															<DropdownItem>
																<Button
																	icon='DeleteForever'
																	tag='a'
																	onClick={() =>
																		inactiveModalOpen(i.id)
																	}>
																	Hapus
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button
																	isOutline={!darkModeStatus}
																	color='dark'
																	isLight={darkModeStatus}
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light':
																				!darkModeStatus,
																		},
																	)}
																	icon='Edit'
																	onClick={() =>
																		handleUpcomingEdit(i.id)
																	}>
																	Edit
																</Button>
															</DropdownItem>
														</DropdownMenu>
													</Dropdown>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={filteredData}
								label='Posisi'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
			<EditModal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				id='0'
				//dataRole={dataPosFinal}
				//dataUserById={[]}
			/>
			<OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle id='upcomingEdit'>Update Data Posisi</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-4'>
						<div className='col-12'>
							<FormGroup id='position_name' label='Nama Posisi'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.position_name}
								/>
							</FormGroup>
						</div>
						<div className='col-12'>
							<FormGroup id='position_code' label='Kode Posisi'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.position_code}
								/>
							</FormGroup>
						</div>
						<div className='col-12'>
							<FormGroup id='position_grade' label='Grade'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.position_grade}
								/>
							</FormGroup>
						</div>
						<div className='col-12'>
							<FormGroup id='dept_id' label='Departemen' className='col-12'>
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
						</div>
						<div className='col-12'>
							<FormGroup id='position_deskripsi' label='Deskripsi Posisi'>
								<Textarea
									onChange={formik.handleChange}
									value={formik.values.position_deskripsi}
								/>
							</FormGroup>
						</div>
						<div className='col-12'>
							<FormGroup id='status' label='Status' className='col-12'>
								<Select
									id='status'
									ariaLabel='Pilih Status'
									name='status'
									onChange={formik.handleChange}
									value={formik.values.status}
									placeholder='Pilih...'
									list={SELECT_STATUS_OPTIONS}
								/>
							</FormGroup>
						</div>
					</div>
				</OffCanvasBody>
				<div className='row m-0'>
					<div className='col-12 p-3'>
						<Button
							color='info'
							className='w-100'
							onClick={() => formik.handleSubmit()}>
							Save
						</Button>
					</div>
				</div>
			</OffCanvas>
			<Modal
				id='inactive'
				titleId='inactive-person'
				isOpen={inActiveModal} // Example: state
				setIsOpen={() => setInactiveModal(true)} // Example: setState
				size='sm' // 'sm' || 'lg' || 'xl'
				isAnimation={true}>
				<ModalHeader>
					<ModalTitle id='nonactive-user-title'>Hapus</ModalTitle>
				</ModalHeader>
				<ModalBody className=''>Apakah Anda Yakin</ModalBody>
				<ModalFooter className=''>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setInactiveModal(false)}>
						Tutup
					</Button>
					<Button color='info' icon='Save' onClick={() => handleActioneMutate()}>
						Hapus
					</Button>
				</ModalFooter>
			</Modal>
		</PageWrapper>
	)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		...(await serverSideTranslations(locale, ['common', 'menu'])),
	},
})

export default Index
