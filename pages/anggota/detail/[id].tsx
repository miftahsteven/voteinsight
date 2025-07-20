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
import CustomerEditModal from '../_common/CustomerEditModal'
//import FollowersPerformance from '../../../common/partial/CRMDashboard/FollowersPerformance'
//import FollowersPerformance from '../../../common/partial/CRMDashboard/FollowersPerformance'

const Id: NextPage = () => {
	const router = useRouter()
	const { id } = router.query

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
				<title>Detail Anggota</title>
			</Head>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						color='primary'
						isLink
						icon='ArrowBack'
						tag='a'
						to={`../../${demoPagesMenu.crm.subMenu.customersList.path}`}>
						Back to List
					</Button>
					<SubheaderSeparator />
					<span className='text-muted fst-italic me-2'>Last update:</span>
					<span className='fw-bold'>13 hours ago</span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button icon='GraphicEq' color='primary' isLight onClick={handleClickEdit}>
						Update Data
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='pt-3 pb-5 d-flex align-items-center'>
					<span className='display-4 fw-bold me-3'>{item?.name}</span>
					<span className='border border-success border-2 text-success fw-bold px-3 py-2 rounded'>
						{item?.type}
					</span>
				</div>
				<div className='row'>
					<div className='col-lg-4'>
						<Card className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5 py-3'>
									<div className='col-12 d-flex justify-content-center'>
										<Avatar
											src={item?.src}
											color={getColorNameWithIndex(item?.id)}
											isOnline={item?.isOnline}			
											size={200}			
											rounded={'pill'}					
										/>
									</div>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<i className={`bi bi-instagram px-2`} style={{ fontSize: "20px" }}></i>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{item?.email}
														</div>
														<div className='text-muted'>
															Instagram
														</div>
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='Star'
															size='3x'
															color='primary'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{item?.type}
														</div>
														<div className='text-muted'>
															Status
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardHeader>
								<CardLabel icon='StackedLineChart'>
									<CardTitle>Data dan Informasi</CardTitle>
								</CardLabel>
								<CardActions>
									Hanya bulan <strong>{dayjs().format('MMM')}</strong>.
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
												<i className={`bi bi-instagram px-2`} style={{ fontSize: "3rem" }}></i>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>1200</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Followers
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
												<Icon icon='Visibility' size='3x' color='info' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>
													1320
												</div>
												<div className='text-muted mt-n2 truncate-line-1'>
													Total Views
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
												<i className={`bi bi-graph-up px-2`} style={{ fontSize: "3rem" }}></i>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>128</div>
												<div className='text-muted mt-n2'>Reach</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-lg-8'>		
						{/* create card with height more high */}				
						<Card className='shadow-3d-primary h-50'>
							<CardHeader>
								<CardLabel icon='GraphicEq'>
									<CardTitle>Insight & Rekomendasi</CardTitle>									
								</CardLabel>
								{/** generate button in right cardlabel */}									
								<CardActions>
									<Button
										color='primary'
										isLight
										icon='Refresh'
										hoverShadow='sm'
										onClick={handleClickEdit}>
										Update Insight
									</Button>
								</CardActions>
							</CardHeader>
							<CardBody>
								{/** create scroller div */}
								<div className='row g-3 overflow-auto' style={{ maxHeight: '400px' }}>
									<div className='col-12'>
										<p className='text-muted mb-0'>
											Hasil analisis dan rekomendasi untuk akun Instagram
											&nbsp;<strong>{item?.name}</strong> berdasarkan data dan performa
											terkini.
										</p>
									</div>
									<div className='col-12'>
										<p className='text-muted mb-0'>
												<li>
													Strategi 3A (Aman, Asyik, Adem) : Konten dibangun konsisten: mengedepankan analisis tajam namun tetap membawa nuansa menyenangkan dan tenang, sejalan dengan prinsip PKS
												</li>
												<li>
													Penggunaan fitur maksimal: Kombinasi antara Reels, Live, story, DM, dan iklan efektif meningkatkan interaksi, terutama dengan Gen Z
												</li>
												<li>
													Analisis data: Memanfaatkan insight untuk memahami audiens, mengoptimalkan waktu posting, dan meningkatkan engagement	
												</li>
										</p>
									</div>
									<div className='col-12'>
										<p className='text-muted mb-0'>
											Rekomendasi Optimalisasi :
											<ul>
												<li>
													Konten edukatif dan inspiratif: Fokus pada isu-isu sosial, politik, dan ekonomi yang relevan dengan audiens
												</li>
												<li>
													Penggunaan hashtag strategis: Memanfaatkan hashtag populer untuk meningkatkan visibilitas konten
												</li>
												<li>
													Kolaborasi dengan influencer: Membangun kemitraan dengan influencer yang memiliki audiens serupa untuk memperluas jangkauan
												</li>
											</ul>
										</p>
									</div>
								</div>
							</CardBody>
						</Card>
						{/* <Card>							
							<CardBody>
								<FollowersPerformance />
							</CardBody>							
						</Card> */}
					</div>
				</div>
			</Page>
			<CustomerEditModal
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				id={String(id) || 'loading'}
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
			'/anggota/detail/2',
			// Object variant:
			{ params: { id: '2' } },
		],
		fallback: true,
	}
}

export default Id
