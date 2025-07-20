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
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas'
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
import EditModal from '../_common/EditModalRecruitment'
import UpdateRecruitment from '../_common/UpdateRecruitment'
import useQueryProv from '../../../hooks/useQueryProv'
import useQueryCities from '../../../hooks/useQueryCities'
import useQueryDistricts from '../../../hooks/useQueryDistricts'
import useQueryPositionsSelect from '../../../hooks/useQueryPositionsSelect'
import useQueryLocs from '../../../hooks/useQueryLocs'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useQueryRecruitment from '../../../hooks/useQueryRecruitment'
import showNotification from '../../../components/extras/showNotification'
import useMutateUpdateRecruitment from '../../../hooks/useMutateUpdateRecruitment'

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const dataUser = useQueryRecruitment()
	let dataFinal = []
	if (dataUser !== undefined) {
		dataFinal = dataUser.data
	}

	
	const router = useRouter()
	const [inActiveModal, setInactiveModal] = useState(false)
	const [idSelected, setIdSelected] = useState(0)
	const [action, setAction] = useState('')
	const [statusSelected, setStatusSelected] = useState("")
	const [dataRecruitmenSelected, setDataRecruitmenSelected] = useState([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])
	const { mutate, isSuccess, isError } = useMutateUpdateRecruitment()
	const [dataCity, setDataCity] = React.useState([])
	const [dataDistrict, setDataDistrict] = React.useState([])
	const [dataLoc, setDataLoc] = React.useState([])
	const dataCities = useQueryCities()
	const dataDistricts = useQueryDistricts()
	const dataLocs = useQueryLocs()
	const dataProvince = useQueryProv()
	

	const dataPosition = useQueryPositionsSelect()
	let dataPositionRef = []
	if (dataPosition !== undefined) {
		dataPositionRef = dataPosition.data.map((items: any) => ({
			value: items.id,
			text: `${items.position_name}`,
			position_code: items.position_code,
			position_grade: items.position_grade,
			position_deskripsi: items.position_deskripsi,
			dept_id: items.departments?.dept_name,
			division_id: items.departments?.divisions?.division_name,
			group_id: items.departments?.divisions?.groups?.group_name,
		}))
	}



	let dataProvRef = []
	if (dataProvince !== undefined) {
		dataProvRef = dataProvince.data.map((items: any) => ({
			value: items.prov_id,
			text: `${items.prov_name}`,
		}))
	}	
	
	const formik = useFormik({
		initialValues: {
			id: '',
			fullname: '',
			gender: '',
			birthdate: '',
			experience: '',
			position_id: '',
			education: '',
			email: '',
			phone: '',
			address: '',
			prov_id: '',
			city_id: '',
			district_id: '',
			subdistrict_id: '',
			cv_uploaded: '',
			npwp: '',
			nik: '',
			status: '',
			searchInput: '',
		},
		validate: (values) => {
			const errors: {
				fullname?: string
				birthdate?: string
				email?: string
				phone?: string
				address?: string
				npwp?: string
				nik?: string
				searchInput?: string
			} = {}

			if (!values.fullname) {
				errors.fullname = 'Wajib Diisi'
			}
			if (!values.birthdate) {
				errors.birthdate = 'Wajib Diisi'
			} else if (dayjs(values.birthdate).isAfter(dayjs())) {
				errors.birthdate = 'Tanggal Lahir Tidak Valid'
			}
			if (!values.email) {
				errors.email = 'Wajib Diisi'
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Email Tidak Valid'
			}
			if (!values.phone) {
				errors.phone = 'Wajib Diisi'
			} else if (values.phone.length < 10) {
				errors.phone = 'Nomor Telepon Tidak Valid'
			}
			if (!values.npwp) {
				errors.npwp = 'Wajib Diisi'
			}
			if (!values.nik) {
				errors.nik = 'Wajib Diisi'
			} else if (values.nik.length < 16) {
				errors.nik = 'NIK Tidak Valid'
			}
			if (!values.address) {
				errors.address = 'Wajib Diisi'
			} else if (values.address.length < 6) {
				errors.address = 'Alamat Tidak Valid'
			}

			return errors
		},
		validateOnChange: false,
		onSubmit: (values) => {
			// alert(JSON.stringify(values, null, 2));
			console.log(' ---> submit', JSON.stringify(values))
			const today = new Date(values.birthdate)

			const yyyy = today.getFullYear()
			const mm = String(today.getMonth() + 1).padStart(2, '0')
			const dd = String(today.getDate()).padStart(2, '0')

			const formattedDate = `${yyyy}-${mm}-${dd}`
			//console.log('Data Tanggal Lahir', formattedDate)
			const formData = new FormData()
			//console.log(' ---> submit', JSON.stringify(values))
			formData.append('id', values.id)
			formData.append('position_id', values.position_id)
			formData.append('fullname', values.fullname)
			formData.append('gender', values.gender)
			formData.append('birthdate', formattedDate)
			formData.append('experience', values.experience)
			formData.append('education', values.education)
			formData.append('email', values.email)
			formData.append('phone', values.phone)
			formData.append('nik', values.nik)
			formData.append('address', values.address)
			formData.append('prov_id', values.prov_id)
			formData.append('city_id', values.city_id)
			formData.append('district_id', values.district_id)
			formData.append('subdistrict_id', values.subdistrict_id)
			formData.append('npwp', values.npwp)
			formData.append('cv_uploaded', values.cv_uploaded)
			console.log('---> data append', Object.fromEntries(formData))
			mutate(
				{ ...(Object.fromEntries(formData) as { 
					id: any; 
					position_id: any; 
					fullname: any; 
					gender: any; 
					birthdate: any; 
					email: any; 
					phone: any; 
					nik: any; 
					address: any; 
					prov_id: any; 
					city_id: any; 
					district_id: any; 
					subdistrict_id: any; 
				}) },
				{
					onSuccess: (data) => {
						if (data) {
							//setIsOpen(false)
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='Info' size='lg' className='me-1' />
									<span>Berhasil</span>
								</span>,
								'Berhasil Menambah Posisi',
							)
						}
						setUpcomingEventsEditOffcanvas(false)
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

	const filteredData = dataFinal.filter(
		(f: any) =>
			// Name
			(f.recruitment_status?.id === 7) &&
			f.fullname?.toLowerCase().includes(formik.values.searchInput.toLowerCase()), //&&
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

	const handleOnError = useCallback(() => router.push('/recruitment/list'), [router])
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false)
	const handleUpcomingEdit = (id :any) => {
		setIdSelected(id)
		const dataEditRekrutment = dataFinal.filter((item : any) => item.id == id)
		console.log(' ----< Dtu', dataEditRekrutment)
		if (dataEditRekrutment.length > 0) {
			setDataCity(
				dataCities.data
					?.filter(
						(item: any) => item.prov_id === dataEditRekrutment[0].provinces.prov_id,
					)
					.map((items: any) => ({
						value: items.city_id,
						text: `${items.city_name}`,
					})),
			)
			setDataDistrict(
				dataDistricts.data
					?.filter((item: any) => item.city_id === dataEditRekrutment[0].cities.city_id)
					.map((items: any) => ({
						value: items.dis_id,
						text: `${items.dis_name}`,
					})),
			)
			setDataLoc(
				dataLocs.data
					?.filter((item: any) => item.dis_id === dataEditRekrutment[0].districts.dis_id)
					.map((items: any) => ({
						value: items.subdis_id,
						text: `${items.subdis_name}`,
					})),
			)
			formik.setFieldValue('position_id', dataEditRekrutment[0]?.position?.id)
			formik.setFieldValue('fullname', dataEditRekrutment[0]?.fullname)
			formik.setFieldValue('gender', dataEditRekrutment[0]?.gender)
			formik.setFieldValue('birthdate', dataEditRekrutment[0]?.birthdate)
			formik.setFieldValue('experience', dataEditRekrutment[0]?.experience)
			formik.setFieldValue('education', dataEditRekrutment[0]?.education)
			formik.setFieldValue('email', dataEditRekrutment[0]?.email)
			formik.setFieldValue('phone', dataEditRekrutment[0]?.phone)
			formik.setFieldValue('nik', dataEditRekrutment[0]?.nik)
			formik.setFieldValue('address', dataEditRekrutment[0]?.address)
			formik.setFieldValue('prov_id', dataEditRekrutment[0]?.provinces?.prov_id)
			formik.setFieldValue('city_id', dataEditRekrutment[0]?.cities?.city_id)
			formik.setFieldValue('district_id', dataEditRekrutment[0]?.districts?.dis_id)
			formik.setFieldValue('subdistrict_id', dataEditRekrutment[0]?.subdistricts?.subdis_id)
			formik.setFieldValue('npwp', dataEditRekrutment[0]?.npwp)
			formik.setFieldValue('id', dataEditRekrutment[0]?.id)
		}	
		setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas)
	}

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)

	const [editModalStatus, setEditModalStatus] = useState<boolean>(false)
	const [updateStatusRec, setUpdateStatusRec] = useState<boolean>(false)

	const handleOnClickModal = (id: number) => {
		//console.log(' ---> handleOnClickModal', id);	
		const statusTerpilih = dataFinal.filter((item : any) => item.id == id)
		//setStatusSelected(statusTerpilih)
		console.log(' ---> handleOnClickModal', JSON.stringify(statusTerpilih));		
		setDataRecruitmenSelected(statusTerpilih)
		setIdSelected(id)
		//alert('id selected ' + id)
		setUpdateStatusRec(!updateStatusRec)				
	}

	return (
		<PageWrapper>
			<Head>
				<title>List Rekrutmen</title>
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
												Nama Lengkap{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('fullname')}
													icon='FilterList'
												/>
											</th>
											<th>Gender</th>
											<th>Tgl Lahir</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Posisi</th>
											<th>Terdaftar</th>
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
												<td>{i.genderText}</td>
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
												<td>{i.position?.position_name}</td>
												<td>
													{i.date_register == null
														? 'n/a'
														: i.date_register}
												</td>
												<td>
													{
														i.status
														//i.recruitment_status.name == null ? 'n/a' : i.recruitment_status.name
														// status_label.filter(
														// 	(f: any) => f.value == i.status,
														// )[0].label
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
			<EditModal setIsOpen={setEditModalStatus} isOpen={editModalStatus} id='0' />
			<UpdateRecruitment setIsOpen={setUpdateStatusRec} isOpen={updateStatusRec} id={idSelected} dataRecruitmenSelected={dataRecruitmenSelected} />
						
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
