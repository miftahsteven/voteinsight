import React, { useState, useCallback, useEffect } from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import classNames from 'classnames'
import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useFormik } from 'formik'
import useDarkMode from '../../../hooks/useDarkMode'
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons'
//import data from '../../../common/data/dummyCustomerData';
import data from '../../../common/data/usersDummyAllData'
import useSortableData from '../../../hooks/useSortableData'
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
import useQueryAllLeaving from '../hooks/useQueryAllLeaving'
import FormLeave from '../_common/FormLeave'

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const dataUser = useQueryAllLeaving()
	let dataFinal = []
	if (dataUser !== undefined) {
		dataFinal = dataUser.data
	}
	
	const router = useRouter()
	const [inActiveModal, setInactiveModal] = useState(false)
	const [idSelected, setIdSelected] = useState(0)
	const [action, setAction] = useState('')
	const [statusSelected, setStatusSelected] = useState(0)
	const [dataRecruitmenSelected, setDataRecruitmenSelected] = useState([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])
	
	const [activeModalApproval, setActiveModalApproval] = useState<boolean>(false)
	
	
	const formik = useFormik({
		initialValues: {			
			searchInput: '',
		},		
		onSubmit: (values) => {
			//console.log('values', values)
			//setSearchInput(values.searchInput)
			//showNotification('success', 'Search input updated')
		},
	})

	const filteredData = dataFinal.filter(
		(f: any) =>
			// Name
			//(f.recruitment_status?.id === 1 || f.recruitment_status?.id === 2) &&
			f.fullname?.toLowerCase().includes(formik.values.searchInput.toLowerCase()), //&&
		// // Price
		// (formik.values.minPrice === '' || f.balance > Number(formik.values.minPrice)) &&
		// (formik.values.maxPrice === '' || f.balance < Number(formik.values.maxPrice)) &&
		// // Payment Type
		// formik.values.payment.includes(f.payout),
	)
	

	const handleOnError = useCallback(() => router.push('/leave/list'), [router])
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false)
	const handleUpcomingEdit = (id: number) => {
		setIdSelected(id)
		const dataEditRekrutment = dataFinal.filter((item: any) => item.id == id)
		setDataRecruitmenSelected(dataEditRekrutment)		
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas)
	}

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)

	const [tambahModalStatus, setTambahModalStatus] = useState<boolean>(false)
	const [updateStatusRec, setUpdateStatusRec] = useState<boolean>(false)

	const handleOnClickModal = (id: number) => {
		const statusTerpilih = dataFinal.filter((item : any) => item.id == id)
		//console.log(' ---> handleOnClickModal', id);	
		setDataRecruitmenSelected(statusTerpilih)
		setIdSelected(id)
		//alert('id selected ' + id)
		setUpdateStatusRec(!updateStatusRec)				
	}


	//handling mutate approve recruitment
	//const { mutate: mutateApprove, isSuccess: isSuccessApprove, isError: isErrorApprove } = useMutateApproveRecruitment()
	const handleOnClickApprove = (id: number) => {
		setIdSelected(id)
		const statusTerpilih = dataFinal.filter((item : any) => item.id == id)
		//console.log(' ---> handleOnClickApprove', id);
		//console.log('statusTerpilih', statusTerpilih[0]?.recruitment_status?.id);
		//setDataRecruitmenSelected(statusTerpilih)		
		setStatusSelected(statusTerpilih[0]?.recruitment_status?.id) //set status approved
		setActiveModalApproval(!activeModalApproval)
	}
	

	return (
		<PageWrapper>
			<Head>
				<title>List Cuti</title>
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
						placeholder='Cari Kandidat...'
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
						onClick={() => setTambahModalStatus(true)}>
						Tambah Cuti
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
												Nama Lengkap{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('fullname')}
													icon='FilterList'
												/>
											</th>
											<th>Tanggal Mulai</th>											
											<th>Tanggal Selesai</th>
											<th>Alasan Cuti</th>
											<th>Status</th>
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map((i) => (
											<tr key={i.id}>
												<td>
													<div className='d-flex align-items-center'>
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
														<div className='flex-grow-1'>
															<div className='fs-6 fw-bold'>
																{i.fullname}
															</div>
														</div>
													</div>
												</td>
												<td>{i.leave_start_date}</td>
												<td>{i.leave_end_date}</td>
												<td>{i.leave_reason}</td>
												<td>{i.leave_status_text}</td>												
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
																	target='_blank'
																	href={`${process.env.NEXT_PUBLIC_BASEURL}public/uploads/cv/${i.cv_uploaded}`}>
																	Download CV
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
																	icon='Monitor'
																	onClick={() =>
																		handleUpcomingEdit(i.id)
																	}>
																	View Detail
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button
																	icon='CheckCircle'
																	color='warning'																	
																	isLight={darkModeStatus}
																	tag='a'
																	onClick={() => handleOnClickApprove(i.id)}																	
																>
																	Approval
																</Button>
															</DropdownItem>																
															<DropdownItem className={i.approval_process.filter((item: any) => item.approval_type === i.recruitment_status?.id).length >= 2 ? '' : 'd-none'}>																
																<Button
																	icon='NavigateNext'
																	tag='a'
																	onClick={() => handleOnClickModal(i.id)}																	
																>
																	Next Process
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
				</div>
			</Page>			
			<FormLeave				
				isOpen={tambahModalStatus}
				setIsOpen={setTambahModalStatus}				
			/>										
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
