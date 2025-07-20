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
import useQueryRoles from '../../../hooks/useQueryRoles'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import showNotification from '../../../components/extras/showNotification'
import FormRole from '../components/FormRole'

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const dataRole = useQueryRoles()
	let dataRoleFinal = []
	if (dataRole !== undefined) {
		dataRoleFinal = dataRole.data
	}

	//console.log('datarole', JSON.stringify(dataRoleFinal))
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])
	const [idSelected, setIdSelected] = useState(0)
	const [roleSelected, setRoleSelected] = useState<any[]>([])

	const handleViewData = (idRole: any) => {
		// console.log(
		// 	'On Click',
		// 	dataRoleFinal.filter((item: any) => item.id == idRole),
		// )
		setIdSelected(idRole)
		setRoleSelected(dataRoleFinal.filter((item: any) => item.id === idRole) || [])
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

	const filteredData = dataRoleFinal.filter(
		(f: any) =>
			// Name
			f.name.toLowerCase().includes(formik.values.searchInput.toLowerCase()), //&&
		// // Price
		// (formik.values.minPrice === '' || f.balance > Number(formik.values.minPrice)) &&
		// (formik.values.maxPrice === '' || f.balance < Number(formik.values.maxPrice)) &&
		// // Payment Type
		// formik.values.payment.includes(f.payout),
	)

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)
	const [editModalStatus, setEditModalStatus] = useState<boolean>(false)

	return (
		<PageWrapper>
			<Head>
				<title>Role User</title>
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
				<SubHeaderRight>
					<SubheaderSeparator />
					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setEditModalStatus(true)}>
						Role Baru
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<div className='row h-100'>
					<div className='col-5'>
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
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map(i => (
											<tr key={i.id}>
												<td>{i.name}</td>
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
															{/* <DropdownItem>
																<Button
																	icon='DeleteForever'
																	tag='a'
																	//to={`../${demoPagesMenu.crm.subMenu.customerID.path}/${i.id}`}
																	onClick={() =>
																		alert('deleted')
																	}>
																	Hapus
																</Button>
															</DropdownItem> */}
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
					<div className='col-xxl-7'>
						<FormRole idRole={idSelected} roleSelected={roleSelected} />
					</div>
				</div>
			</Page>
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
