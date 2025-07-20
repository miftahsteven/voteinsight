import React, { useState } from 'react'
import type { NextPage } from 'next'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useDarkMode from '../../../hooks/useDarkMode'
import data from '../../../common/data/dummyCustomerData'

import latestSalesData from '../../../common/data/dummySalesData'
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons'
import useSortableData from '../../../hooks/useSortableData'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'
import { demoPagesMenu } from '../../../menu'
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader'
import Button from '../../../components/bootstrap/Button'
import Page from '../../../layout/Page/Page'
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card'
import Avatar from '../../../components/Avatar'
import { getColorNameWithIndex } from '../../../common/data/enumColors'
import Icon from '../../../components/icon/Icon'
import { priceFormat } from '../../../helpers/helpers'
import EditModal from '../_common/EditModal'
import useQueryPositions from '../hooks/useQueryPositions'
//import useQueryActivity from '../hooks/useQueryActivity'
//import useQueryType from '../hooks/useQueryType'

const Id: NextPage = () => {
	const router = useRouter()
	const { id } = router.query
	const dataPosition = useQueryPositions()
	//const dataLog = useQueryActivity(id)
	let dataItemPosition = []
	if (dataPosition !== undefined) {
		const dataQuery = dataPosition.data.filter((key: any) => key.id == id)
		dataItemPosition = dataQuery[0]
		console.log('---<><><>', JSON.stringify(dataItemPosition))
	}

	const { darkModeStatus } = useDarkMode()

	const itemData = data.filter((item) => item.id.toString() === id?.toString())
	const item = itemData[0]

	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['3'])

	const { items, requestSort, getClassNamesFor } = useSortableData(latestSalesData)

	const [editModalStatus, setEditModalStatus] = useState<boolean>(false)
	const handleClickEdit = () => {
		setEditModalStatus(true)
	}

	return (
		<PageWrapper>
			<Head>
				<title>Lihat Detail Posisi</title>
			</Head>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						color='primary'
						isLink
						icon='ArrowBack'
						tag='a'
						//to={`../../${demoPagesMenu.crm.subMenu.customersList.path}`}
						to='../../recruitment/list/vacancy'>
						Kembali
					</Button>
					<SubheaderSeparator />
					{/* <span className='text-muted fst-italic me-2'>Last update:</span>
					<span className='fw-bold'>13 hours ago</span> */}
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button icon='Edit' color='primary' isLight onClick={handleClickEdit}>
						Ubah Data
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='pt-3 pb-5 d-flex align-items-center'>
					<span className='display-4 fw-bold me-3'>
						{dataItemPosition?.position_name}
					</span>
					<span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
						{dataItemPosition?.position_code}
					</span>
				</div>
				<div className='row'>
					<div className='col-lg-4'>
						<Card className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5 py-3'>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Grade'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{
																dataItemPosition?.departments
																	?.dept_name
															}
														</div>
														<div className='text-muted'>Departemen</div>
													</div>
												</div>
											</div>
											{/* <div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Mail'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{dataItemUser?.email}
														</div>
														<div className='text-muted'>Email</div>
													</div>
												</div>
											</div> */}
											{/* <div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Group'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{dataItemUser?.phone == undefined
																? 'n/a'
																: dataItemUser.phone}
														</div>
														<div className='text-muted'>Phone</div>
													</div>
												</div>
											</div> */}
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						{/* <Card>
							<CardHeader>
								<CardLabel icon='StackedLineChart'>
									<CardTitle>Statics</CardTitle>
								</CardLabel>
								<CardActions>
									Only in <strong>{dayjs().format('MMM')}</strong>.
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 align-items-center'>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-warning rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='DoneAll' size='3x' color='warning' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>135</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Sales
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-info rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Savings' size='3x' color='info' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>
													{priceFormat(1260)}
												</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Earning
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-primary rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Star' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>4.96</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Rating
												</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={`d-flex align-items-center bg-l${
												darkModeStatus ? 'o25' : '10'
											}-success rounded-2 p-3`}>
											<div className='flex-shrink-0'>
												<Icon icon='Timer' size='3x' color='success' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>3 years</div>
												<div className='text-muted mt-n2'>Membership</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card> */}
					</div>
					<div className='col-lg-8'>
						{/* <Card> */}
						{/* <CardHeader>
								<CardLabel icon='Receipt'>
									<CardTitle>Aktifitas</CardTitle>
								</CardLabel>
							</CardHeader> */}
						{/* <CardBody>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th
												onClick={() => requestSort('name')}
												className='cursor-pointer text-decoration-underline'>
												Activity{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('name')}
													icon='FilterList'
												/>
											</th>
											<th
												onClick={() => requestSort('date')}
												className='cursor-pointer text-decoration-underline'>
												Tanggal{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('date')}
													icon='FilterList'
												/>
											</th>
											<th
												onClick={() => requestSort('price')}
												className='cursor-pointer text-decoration-underline'>
												Route{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('path')}
													icon='FilterList'
												/>
											</th>
										</tr>
									</thead>
									<tbody>
										{DataActivity.map((i: any) => (
											<tr key={i.id}>
												<td>{i.activity}</td>
												<td>{dayjs(i.datetime).format('lll')}</td>
												<td>{i.route}</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardBody> */}
						{/* <PaginationButtons
								data={items}
								label='items'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/> */}
						{/* </Card> */}
						{/* <Card>
							<CardHeader>
								<CardLabel icon='MapsHomeWork'>
									<CardTitle>Billing and Delivery Address</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='col-md-6'>
										<p className='lead fw-bold'>Billing address</p>
										<div>{item?.streetAddress}</div>
										<div>{item?.streetAddress2}</div>
										<div>{item?.city}</div>
										<div>{`${item?.state}, ${item?.stateFull}`}</div>
										<div>{item?.zip}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
												<Button
													icon='Edit'
													color='dark'
													isLight
													onClick={handleClickEdit}>
													Edit
												</Button>
											</div>
											<div className='col-auto'>
												<Button icon='Location On' color='primary' isLight>
													Make Primary
												</Button>
											</div>
										</div>
									</div>
									<div className='col-md-6'>
										<p className='lead fw-bold'>Delivery address</p>
										<div>{item?.streetAddressDelivery}</div>
										<div>{item?.streetAddress2Delivery}</div>
										<div>{item?.cityDelivery}</div>
										<div>{`${item?.stateDelivery}, ${item?.stateFullDelivery}`}</div>
										<div>{item?.zipDelivery}</div>
										<br />
										<div className='row g-2'>
											<div className='col-auto'>
												<Button
													icon='Edit'
													color='dark'
													isLight
													onClick={handleClickEdit}>
													Edit
												</Button>
											</div>
											<div className='col-auto'>
												<Button
													icon='LocationOn'
													color='primary'
													isLight
													isDisable>
													Primary
												</Button>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card> */}
					</div>
				</div>
			</Page>
			<EditModal
				dataPos={dataItemPosition}
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				id={String(id) || 'loading'}
				//dataRole={dataTypeFinal}
				//dataUserById={dataItemUser}
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

export async function getStaticPaths() {
	return {
		paths: [
			// String variant:
			'/recruitment/view/1',
			// Object variant:
			{ params: { id: '2' } },
		],
		fallback: true,
	}
}

export default Id
