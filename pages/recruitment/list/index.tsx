import React, { useState } from 'react'
import type { NextPage } from 'next'
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
import Popovers from '../../../components/bootstrap/Popovers'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup'
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks'
import Page from '../../../layout/Page/Page'
import Card, { CardBody } from '../../../components/bootstrap/Card'
import { getColorNameWithIndex } from '../../../common/data/enumColors'
import { getFirstLetter, priceFormat } from '../../../helpers/helpers'
import EditModal from '../_common/EditModalRecruitment'
// import useQueryUserInactive from '../hooks/useQueryUserInactive'
// import useMutateActionUser from '../hooks/useMutateActionUser'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useQueryRecruitment from '../hooks/useQueryRecruitment'
import showNotification from '../../../components/extras/showNotification'

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const dataUser = useQueryRecruitment()
	let dataFinal = []
	if (dataUser !== undefined) {
		dataFinal = dataUser.data
	}

	// const dataType = useQueryType()
	// let dataTypeFinal = []
	// if (dataType !== undefined) {
	// 	dataTypeFinal = dataType.data
	// }
	//console.table(' ----< Dtu', dataFinal)
	//console.log(' ----< Dt', data);
	const [inActiveModal, setInactiveModal] = useState(false)
	const [idSelected, setIdSelected] = useState()
	const [action, setAction] = useState('')
	const [statusSelected, setStatusSelected] = useState(0)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])

	const inactiveModalOpen = (user_id: any, status: any, action: string) => {
		setInactiveModal(true)
		setIdSelected(user_id)
		setStatusSelected(status)
		setAction(action)
	}

	const formik = useFormik({
		initialValues: {
			searchInput: '',
			payment: Object.keys(PAYMENTS).map(i => PAYMENTS[i].name),
			minPrice: '',
			maxPrice: '',
		},
		onSubmit: () => {
			// alert(JSON.stringify(values, null, 2));
		},
	})

	const filteredData = dataFinal.filter(
		(f: any) =>
			// Name
			f.fullname.toLowerCase().includes(formik.values.searchInput.toLowerCase()), //&&
		// // Price
		// (formik.values.minPrice === '' || f.balance > Number(formik.values.minPrice)) &&
		// (formik.values.maxPrice === '' || f.balance < Number(formik.values.maxPrice)) &&
		// // Payment Type
		// formik.values.payment.includes(f.payout),
	)

	const status_label = [
		{
			label: 'Dalam Proses',
			value: 0,
		},
		{
			label: 'Interview',
			value: 1,
		},
		{
			label: 'Offer Letter',
			value: 2,
		},
		{
			label: 'Onboarding',
			value: 3,
		},
		{
			label: 'Aktif',
			value: 4,
		},
		{
			label: 'Gagal',
			value: 5,
		},
	]

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)

	const [editModalStatus, setEditModalStatus] = useState<boolean>(false)

	//const { mutate, isSuccess, isError } = useMutateActionUser()

	// const handleActioneMutate = () => {
	// 	mutate(
	// 		{
	// 			id: idSelected,
	// 			statusUser: statusSelected == 0 ? 1 : 0,
	// 			action: action,
	// 		},
	// 		{
	// 			onSuccess: data => {
	// 				if (data) {
	// 					if (action == 'inactive') {
	// 						showNotification(
	// 							<span className='d-flex align-items-center'>
	// 								<Icon icon='Info' size='lg' className='me-1' />
	// 								<span>Berhasil</span>
	// 							</span>,
	// 							statusSelected == 0
	// 								? 'Berhasil Mengaktifkan User'
	// 								: 'Berhasil Me-Non Aktifkan User',
	// 						)
	// 					} else if (action == 'remove') {
	// 						showNotification(
	// 							<span className='d-flex align-items-center'>
	// 								<Icon icon='Info' size='lg' className='me-1' />
	// 								<span>Berhasil</span>
	// 							</span>,
	// 							'Berhasil Hapus User',
	// 						)
	// 					}
	// 				}
	// 				// /handleOnClick();
	// 				setInactiveModal(false)
	// 			},
	// 			onError: error => {
	// 				showNotification(
	// 					<span className='d-flex align-items-center'>
	// 						<Icon icon='danger' size='lg' className='me-1' />
	// 						<span>{error.message}</span>
	// 					</span>,
	// 					`Gagal Proses ${error.message}`,
	// 				)
	// 			},
	// 		},
	// 	)
	// }

	return (
		<PageWrapper>
			<Head>
				<title>{odSystAdminPagesMenu.userPages.subMenu.listUser.text}</title>
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
					{/* <Dropdown>
						<DropdownToggle hasIcon={false}>
							<Button
								icon='FilterAlt'
								color='dark'
								isLight
								className='btn-only-icon position-relative'>
								{data.length !== filteredData.length && (
									<Popovers desc='Filtering applied' trigger='hover'>
										<span className='position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2'>
											<span className='visually-hidden'>
												there is filtering
											</span>
										</span>
									</Popovers>
								)}
							</Button>
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg'>
							<div className='container py-2'>
								<div className='row g-3'>
									<FormGroup label='Balance' className='col-12'>
										<InputGroup>
											<Input
												id='minPrice'
												ariaLabel='Minimum price'
												placeholder='Min.'
												onChange={formik.handleChange}
												value={formik.values.minPrice}
											/>
											<InputGroupText>to</InputGroupText>
											<Input
												id='maxPrice'
												ariaLabel='Maximum price'
												placeholder='Max.'
												onChange={formik.handleChange}
												value={formik.values.maxPrice}
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup label='Payments' className='col-12'>
										<ChecksGroup>
											{Object.keys(PAYMENTS).map((payment) => (
												<Checks
													key={PAYMENTS[payment].name}
													id={PAYMENTS[payment].name}
													label={PAYMENTS[payment].name}
													name='payment'
													value={PAYMENTS[payment].name}
													onChange={formik.handleChange}
													checked={formik.values.payment.includes(
														PAYMENTS[payment].name,
													)}
												/>
											))}
										</ChecksGroup>
									</FormGroup>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown> */}
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setEditModalStatus(true)}>
						Tambah Rekrutan
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
												onClick={() => requestSort('fullname')}
												className='cursor-pointer text-decoration-underline'>
												Nama{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('fullname')}
													icon='FilterList'
												/>
											</th>
											<th>Jenis Kelamin</th>
											<th>Tgl Lahir</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Posisi</th>
											<th>Tanggal Terdaftar</th>
											<th>Status</th>
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map(i => (
											<tr key={i.id}>
												<td>
													<div className='d-flex align-items-center'>
														<div className='flex-shrink-0'>
															<div
																className='ratio ratio-1x1 me-3'
																style={{ width: 48 }}>
																<div
																	className={`bg-l${
																		darkModeStatus
																			? 'o25'
																			: '25'
																	}-${getColorNameWithIndex(
																		i.id,
																	)} text-${getColorNameWithIndex(
																		i.id,
																	)} rounded-2 d-flex align-items-center justify-content-center`}>
																	<span className='fw-bold'>
																		{getFirstLetter(i.fullname)}
																	</span>
																</div>
															</div>
														</div>
														<div className='flex-grow-1'>
															<div className='fs-6 fw-bold'>
																{i.fullname}
															</div>
														</div>
													</div>
												</td>
												<td>{i.gender == 0 ? 'Laki-laki' : 'Wanita'}</td>
												<td>{i.birthdate == null ? 'n/a' : i.birthdate}</td>
												<td>
													<Button
														isLink
														color='light'
														icon='Email'
														className='text-lowercase'
														tag='a'
														href={`mailto:${i.email}`}>
														{i.email}
													</Button>
												</td>
												<td>{i.phone}</td>
												<td>{i.position.position_name}</td>
												<td>
													{i.date_register == null
														? 'n/a'
														: i.date_register}
												</td>
												<td>
													{
														status_label.filter(
															(f: any) => f.value == i.status,
														)[0].label
													}
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
														{/* <DropdownMenu isAlignmentEnd> */}
														{/* <DropdownItem>
																<Button
																	icon='Visibility'
																	tag='a'
																	//to={`../${demoPagesMenu.crm.subMenu.customerID.path}/${i.id}`}
																	to={`../${demoPagesMenu.userPages.subMenu.userID.path}/${i.id}`}>
																	View
																</Button>
															</DropdownItem> */}
														{/* <DropdownItem>
																<Button
																	icon='PersonRemove'
																	tag='a'
																	//to={`../${demoPagesMenu.crm.subMenu.customerID.path}/${i.id}`}
																	onClick={() =>
																		//setInactiveModal(true)
																		inactiveModalOpen(
																			i.user_id,
																			i.status,
																			'inactive',
																		)
																	}>
																	{i.status == 1
																		? 'Non-Aktifkan'
																		: 'Aktifkan'}
																</Button>
															</DropdownItem> */}
														{/* {i.status == 0 ? (
																<DropdownItem>
																	<Button
																		icon='DeleteForever'
																		tag='a'
																		//to={`../${demoPagesMenu.crm.subMenu.customerID.path}/${i.id}`}
																		onClick={() =>
																			//setInactiveModal(true)
																			inactiveModalOpen(
																				i.user_id,
																				i.status,
																				'remove',
																			)
																		}>
																		Hapus
																	</Button>
																</DropdownItem>
															) : null} */}
														{/* </DropdownMenu> */}
													</Dropdown>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={filteredData}
								label='User'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
			<EditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id='0' />
			{/* <Modal
				id='inactive'
				titleId='inactive-person'
				isOpen={inActiveModal} // Example: state
				setIsOpen={() => setInactiveModal(true)} // Example: setState
				size='sm' // 'sm' || 'lg' || 'xl'
				isAnimation={true}>
				<ModalHeader>
					{action == 'inactive' ? (
						<ModalTitle id='nonactive-user-title'>
							{statusSelected == 0 ? 'Aktifkan User' : 'Non-Aktifkan User'}
						</ModalTitle>
					) : (
						<ModalTitle id='nonactive-user-title'>Hapus</ModalTitle>
					)}
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
						{action == 'inactive' ? 'Ubah Status' : 'Hapus'}
					</Button>
				</ModalFooter>
			</Modal> */}
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
