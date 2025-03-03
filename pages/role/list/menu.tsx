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
import Page from '../../../layout/Page/Page'
import Card, { CardBody } from '../../../components/bootstrap/Card'
import { getColorNameWithIndex } from '../../../common/data/enumColors'
import { getFirstLetter, priceFormat } from '../../../helpers/helpers'
//import CustomerEditModal from '../_common/CustomerEditModal'
import useQueryRoleMenu from '../hooks/useQueryRoleMenu'
import useQueryRoles from '../hooks/useQueryRoles'
import useQueryAllMenu from '../hooks/useQueryAllMenu'
import useMutateDeleteRoleMenu from '../hooks/useMutateDeleteRoleMenu'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import showNotification from '../../../components/extras/showNotification'
import FormRoleMenu from '../components/FormRoleMenu'

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const [inActiveModal, setInactiveModal] = useState(false)
	//console.log('datarole', JSON.stringify(dataRoleFinal))
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])
	const [idSelected, setIdSelected] = useState(0)
	const [roleMenuSelected, setRoleMenuSelected] = useState('')
	const { mutate, isSuccess, isError } = useMutateDeleteRoleMenu()
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false)

	//ini untuk data pada datatables
	const dataRoleMenu = useQueryRoleMenu()
	let dataRoleMenuFinal = []
	if (dataRoleMenu !== undefined) {
		dataRoleMenuFinal = dataRoleMenu.data
	}
	//console.log('-----<<<><><>', JSON.stringify(dataRoleMenuFinal))

	//ini untuk data pada select role
	const dataRoleType = useQueryRoles()
	let dataRoleTypeFinal = []
	if (dataRoleType !== undefined) {
		dataRoleTypeFinal = dataRoleType.data
	}

	//ini untuk data pada select menu
	const dataMenuAll = useQueryAllMenu()
	let dataAllMenuFinal = []
	if (dataMenuAll !== undefined) {
		dataAllMenuFinal = dataMenuAll.data
	}

	const inactiveModalOpen = (id) => {
		setInactiveModal(true)
		setIdSelected(id)
	}

	const handleViewData = (idRoleMenu: any) => {
		console.log(
			'On Click',
			dataRoleMenuFinal.filter((item: any) => item.id == idRoleMenu),
		)
		setIdSelected(idRoleMenu)
		setRoleMenuSelected(dataRoleMenuFinal.filter((item: any) => item.id == idRoleMenu))
		//console.log('-----<<<><><>', idRole)
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

	const filteredData = dataRoleMenuFinal.filter(
		(f: any) =>
			// Name
			f.name.toLowerCase().includes(formik.values.searchInput.toLowerCase()) &&
			f.path.toLowerCase().includes(formik.values.searchInput.toLowerCase()), //&&

		// // Price
		// (formik.values.minPrice === '' || f.balance > Number(formik.values.minPrice)) &&
		// (formik.values.maxPrice === '' || f.balance < Number(formik.values.maxPrice)) &&
		// // Payment Type
		// formik.values.payment.includes(f.payout),
	)

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)

	const handleActioneMutate = () => {
		mutate(
			{
				id: idSelected,
			},
			{
				onSuccess: data => {
					if (data) {
						showNotification(
							<span className='d-flex align-items-center'>
								<Icon icon='Info' size='lg' className='me-1' />
								<span>Berhasil</span>
							</span>,
							'Berhasil Hapus User',
						)
					}
					setInactiveModal(false)
				},
				onError: error => {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='danger' size='lg' className='me-1' />
							<span>{error.message}</span>
						</span>,
						`Gagal Proses ${error.message}`,
						'danger',
					)
				},
			},
		)
	}

	return (
		<PageWrapper>
			<Head>
				<title>{odSystAdminPagesMenu.menuPages.subMenu.userMenu.text}</title>
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
						placeholder='Cari Role...'
						onChange={formik.handleChange}
						value={formik.values.searchInput}
					/>
				</SubHeaderLeft>
				{/* <SubHeaderRight>
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setEditModalStatus(true)}>
						Role Menu Baru
					</Button>
				</SubHeaderRight> */}
			</SubHeader>
			<Page container='fluid'>
				<div className='row h-100'>
					<div className='col-7'>
						<Card stretch>
							<CardBody className='table-responsive'>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th
												onClick={() => requestSort('type_name')}
												className='cursor-pointer text-decoration-underline'>
												Nama Role{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('type_name')}
													icon='FilterList'
												/>
											</th>
											<th>Parent Menu</th>
											<th>Menu Text</th>
											<th>Path</th>
											<th>Icon</th>
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map((i) => (
											<tr key={i.id}>
												<td>{i.role}</td>
												<td>{i.parent}</td>
												<td>{i.name}</td>
												<td>{i.path}</td>
												<td>{i.icon}</td>
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
																	icon='Edit'
																	tag='a'
																	//to={`../${demoPagesMenu.crm.subMenu.customerID.path}/${i.id}`}
																	onClick={() =>
																		handleViewData(i.id)
																	}>
																	Ubah
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button
																	icon='DeleteForever'
																	tag='a'
																	//to={`../${demoPagesMenu.crm.subMenu.customerID.path}/${i.id}`}
																	onClick={() =>
																		inactiveModalOpen(i.id)
																	}>
																	Hapus
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
								label='User'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
					<div className='col-xxl-5'>
						<FormRoleMenu
							idRoleMenu={idSelected}
							roleMenuSelected={roleMenuSelected}
							selectDataRole={dataRoleTypeFinal}
							selectDataMenu={dataAllMenuFinal}
						/>
					</div>
				</div>
			</Page>
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
					<Button color='info' icon='Remove' onClick={() => handleActioneMutate()}>
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
