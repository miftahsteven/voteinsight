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
import Nav, { NavItem, NavLinkDropdown } from '../../../components/bootstrap/Nav'
import Button from '../../../components/bootstrap/Button'
import Textarea from '../../../components/bootstrap/forms/Textarea'
import Select from '../../../components/bootstrap/forms/Select'
import Popovers from '../../../components/bootstrap/Popovers'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup'
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks'
import Page from '../../../layout/Page/Page'
import Card, { CardBody } from '../../../components/bootstrap/Card'
import { getColorNameWithIndex } from '../../../common/data/enumColors'
import { getFirstLetter, priceFormat } from '../../../helpers/helpers'
//import EditModal from '../_common/EditModalRecruitment'
// import UpdateRecruitment from '../_common/UpdateRecruitment'
import useQueryProv from '../../recruitment/hooks/useQueryProv'
import useQueryCities from '../../recruitment/hooks/useQueryCities'
import useQueryDistricts from '../../recruitment/hooks/useQueryDistricts'
import useQueryLocs from '../../recruitment/hooks/useQueryLocs'
import useQueryPositionsSelect from '../../recruitment/hooks/useQueryPositionsSelect'
import useQueryProbation from '../hooks/useQueryProbation'

// import useMutateCreatePromote from '../hooks/useMutateCreatePromote'
import ViewDetail from '../_common/ViewDetail'
//import useMutateUpdateRecruitment from '../hooks/useMutateUpdateRecruitment'
import { on } from 'events'
import useQueryContract from '../hooks/useQueryContract'

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const dataUser = useQueryProbation()
	let dataFinal = []
	if (dataUser !== undefined) {
		dataFinal = dataUser.data
	}

	const dataContracts = useQueryContract()
	let dataContractsFinal = []
	if (dataContracts !== undefined) {
		dataContractsFinal = dataContracts.data
	}
	//console.table(' ----< Dtu', dataFinal)
	//console.log(' ----< Dt', data);
	const router = useRouter()
	const [inActiveModal, setInactiveModal] = useState(false)
	const [idSelected, setIdSelected] = useState(0)
	const [activeModal, setActiveModal] = useState<"remove" | "promote" | null>(null);
	const [action, setAction] = useState('')
	const [statusSelected, setStatusSelected] = useState("")
	const [dataRecruitmenSelected, setDataRecruitmenSelected] = useState([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])
	//const { mutate, isSuccess, isError } = useMutateUpdateRecruitment()	
	const [dataCity, setDataCity] = React.useState([])
	const [dataDistrict, setDataDistrict] = React.useState([])
	const [viewDetailDataModal, setViewDetailDataModal] = useState<boolean>(false)
	const [dataEmployeeSelected, setDataEmployeeSelected] = useState<any>([])
	const [dataLoc, setDataLoc] = React.useState([])
	const dataCities = useQueryCities()
	const dataDistricts = useQueryDistricts()	
	const dataProvince = useQueryProv()
	const dataLocs = useQueryLocs()
	const jenisKelamin = [
		{ value: '0', text: 'Laki-laki' },
		{ value: '1', text: 'Perempuan' },
	]
	const pendidikan = [
		{ value: '0', text: 'SD' },
		{ value: '1', text: 'SMP' },
		{ value: '2', text: 'SMA' },
		{ value: '3', text: 'D3' },
		{ value: '4', text: 'S1' },
		{ value: '5', text: 'S2' },
		{ value: '6', text: 'S3' },
	]

	const dataPosition = useQueryPositionsSelect()
	let dataPositionRef = []
	if (dataPosition !== undefined) {
		dataPositionRef = dataPosition.data.map((items) => ({
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

	const detailModalOpen = (id: any) => {
		setIdSelected(id)
		setViewDetailDataModal(true)
		const dataSelected = dataFinal.filter((item: any) => item.id == id)
		setDataEmployeeSelected(dataSelected)
	}

	let dataProvRef = []
	if (dataProvince !== undefined) {
		dataProvRef = dataProvince.data.map((items) => ({
			value: items.prov_id,
			text: `${items.prov_name}`,
		}))
	}
	const dataKota = (prov_id: any) => {
		setDataCity(
			dataCities.data
				?.filter((item: any) => item.prov_id === Number(prov_id))
				.map((items: any) => ({
					value: items.city_id,
					text: `${items.city_name}`,
				})),
		)
	}
	const dataKecamatan = (city_id: any) => {
		setDataDistrict(
			dataDistricts.data
				?.filter((item: any) => item.city_id === Number(city_id))
				.map((items: any) => ({
					value: items.dis_id,
					text: `${items.dis_name}`,
				})),
		)
	}
	const dataKelurahan = (dis_id: any) => {
		setDataLoc(
			dataLocs.data
				?.filter((item: any) => item.dis_id === Number(dis_id))
				.map((items: any) => ({
					value: items.subdis_id,
					text: `${items.subdis_name}`,
				})),
		)
	}

	const getSelectLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		//console.log(' ---> getSelectData', JSON.stringify(name))
		formik.setFieldValue(name, value)
		if (name === 'prov_id') {
			dataKota(value)
		} else if (name === 'city_id') {
			dataKecamatan(value)
		} else if (name === 'district_id') {
			dataKelurahan(value)
		}
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
			contract_status: '',
			contract_id: '',
			onboarding_date: '',
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
			// mutate(
			// 	{ ...Object.fromEntries(formData) },
			// 	{
			// 		onSuccess: (data) => {
			// 			if (data) {
			// 				//setIsOpen(false)
			// 				showNotification(
			// 					<span className='d-flex align-items-center'>
			// 						<Icon icon='Info' size='lg' className='me-1' />
			// 						<span>Berhasil</span>
			// 					</span>,
			// 					'Berhasil Menambah Posisi',
			// 				)
			// 			}
			// 			setUpcomingEventsEditOffcanvas(false)
			// 			// /handleOnClick();
			// 		},
			// 		onError: (error:any) => {
			// 			formik.setFieldError('createPositionGagal', 'Gagal Membuat Posisi.')

			// 			showNotification(
			// 				<span className='d-flex align-items-center'>
			// 					<Icon icon='danger' size='lg' className='me-1' />
			// 					<span>{error.message}</span>
			// 				</span>,
			// 				'Gagal Menambah Data Posisi',
			// 			)
			// 			handleOnError()
			// 		},
			// 	},
			// )
		},
	})

	const filteredData = dataFinal.filter(
		(f: any) =>
			// Name
			(f.permanent_status === 1) &&
			f.name?.toLowerCase().includes(formik.values.searchInput.toLowerCase()), //&&
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

	const handleOnError = useCallback(() => router.push('/employee/list/probation'), [router])
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false)
	const handleUpcomingEdit = (id) => {
		setIdSelected(id)
		const dataEditRekrutment = dataFinal.filter((item) => item.id == id)
		//console.log(' ----< Dtu', dataEditRekrutment)
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

	const handleOnClickPromote = (id: number) => {
		setActiveModal('promote')
		setIdSelected(id)
	}

	//const { mutate: mutatePromote, isSuccess: isSuccessAction } = useMutateCreatePromote()

	const handleActioneMutate = () => {
		// mutatePromote(
		// 	{
		// 		recruitment_id: idSelected,
		// 		contract_id: formik.values.contract_id,
		// 		onboarding_date: formik.values.onboarding_date,
		// 	},
		// 	{
		// 		onSuccess: (data) => {
		// 			if (data) {
		// 				showNotification(
		// 					<span className='d-flex align-items-center'>
		// 						<Icon icon='Info' size='lg' className='me-1' />
		// 						<span>Berhasil</span>
		// 					</span>,							
		// 					'Berhasil Proses Promote Probation',
		// 				)
		// 			}
		// 			// /handleOnClick();
		// 			setActiveModal(null)
		// 		},
		// 		onError: (error) => {
		// 			showNotification(
		// 				<span className='d-flex align-items-center'>
		// 					<Icon icon='danger' size='lg' className='me-1' />
		// 					<span>{error.message}</span>
		// 				</span>,
		// 				`Gagal Proses ${error.message}`,
		// 			)
		// 		},
		// 	},
		// )
	}

	return (
		<PageWrapper>
			<Head>
				<title>List Probation</title>
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
						placeholder='Cari Karyawan...'
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
					{/* <Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setEditModalStatus(true)}>
						Tambah Rekrutan
					</Button> */}
				</SubHeaderRight>
			</SubHeader>
			<Page container={'fluid'}>
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
											<th>NIK</th>
											{/* <th>Umur</th> */}
											<th>Email</th>											
											<th>Posisi</th>
											<th>Div/Group</th>
											<th>Nama Atasan</th>
											<th>OnBoard</th>											
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
																	{getFirstLetter(i.name)}
																</span>
															</div>
														</div>
														<div className='flex-grow-1'>
															<div className='fs-6 fw-bold'>
																{i.name}
															</div>
														</div>
													</div>
												</td>
												<td>{i.employee_number}</td>
												{/* <td>{i.age == null ? 'n/a' : i.age}</td> */}
												<td className='text-start'>
													{i.email}
												</td>												
												<td>{i.position_name}</td>
												<td>{i.group}/{i.division}</td>
												<td>{i.nama_atasan == '' ? 'Komisaris' : i.nama_atasan}</td>
												<td>
													{i.onboarding_date_text == null
														? 'n/a'
														: i.onboarding_date_text}
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
																	onClick={() => {
																		//setIdSelected(i.id)
																		//setViewDetailDataModal(true)
																		detailModalOpen(i.id)
																	}
																	}>
																	Lihat Detail
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button
																	icon='NavigateNext'
																	tag='a'
																	onClick={() => handleOnClickPromote(i.id)}																	
																>
																	Promosi
																</Button>
															</DropdownItem>
															{/* <DropdownItem>
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
				</div>
			</Page>				
			<ViewDetail setIsOpen={setViewDetailDataModal} isOpen={viewDetailDataModal} id={idSelected} dataEmployeeSelected={dataEmployeeSelected} />
			<OffCanvas
				setOpen={setUpcomingEventsEditOffcanvas}
				isOpen={upcomingEventsEditOffcanvas}
				titleId='upcomingEdit'
				isBodyScroll
				placement='end'>
				<OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
					<OffCanvasTitle id='upcomingEdit'>Update Data Rekrutmen</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<div className='row g-4'>
						<div className='col-12'>
							<FormGroup id='position_id' label='Posisi' className='col-12'>
								<Select
									id='position_id'
									ariaLabel='Pilih Posisi'
									name='position_id'
									onChange={formik.handleChange}
									//onChange={getSelectData}
									value={formik.values.position_id}
									placeholder='Pilih...'
									list={dataPositionRef}
								/>
							</FormGroup>
							<FormGroup id='position_name' label='Nama Posisi'>
								<Input
									onChange={formik.handleChange}
									value={formik.values.fullname}
								/>
							</FormGroup>
							<FormGroup id='gender' label='Jenis Kelamin' className='col-12'>
								<Select
									id='gender'
									ariaLabel='Pilih Jenis Kelamin'
									name='gender'
									onChange={formik.handleChange}
									value={formik.values.gender}
									placeholder='Pilih...'
									list={jenisKelamin}
								/>
							</FormGroup>
							<FormGroup id='birthdate' label='Tanggal Lahir' className='col-12'>
								<Input
									type='date'
									onChange={formik.handleChange}
									name='birthdate'
									value={formik.values.birthdate}
									invalidFeedback={formik.errors.birthdate}
									isTouched={formik.touched.birthdate}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
							<FormGroup
								id='experience'
								label='Pengalaman Kerja (Tahun)'
								className='col-12'>
								<Input
									type='text'
									onChange={formik.handleChange}
									name='experience'
									value={formik.values.experience}
									invalidFeedback={formik.errors.experience}
									isTouched={formik.touched.experience}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
							<FormGroup
								id='education'
								label='Pendidikan Terakhir'
								className='col-12'>
								<Select
									id='education'
									ariaLabel='Pilih Pendidikan'
									name='education'
									onChange={formik.handleChange}
									value={formik.values.education}
									placeholder='Pilih...'
									list={pendidikan}
								/>
							</FormGroup>
							<FormGroup id='email' label='Email' className='col-12'>
								<Input
									type='email'
									onChange={formik.handleChange}
									name='email'
									value={formik.values.email}
									invalidFeedback={formik.errors.email}
									isTouched={formik.touched.email}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
							<FormGroup id='phone' label='Telepon' className='col-12'>
								<Input
									type='tel'
									onChange={formik.handleChange}
									name='phone'
									placeholder='0818xxxxxx'
									value={formik.values.phone}
									invalidFeedback={formik.errors.phone}
									isTouched={formik.touched.phone}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
							<FormGroup id='nik' label='NIK' className='col-12'>
								<Input
									type='number'
									onChange={formik.handleChange}
									name='nik'
									value={formik.values.nik}
									invalidFeedback={formik.errors.nik}
									isTouched={formik.touched.nik}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
							<FormGroup id='address' label='Alamat' className='col-12'>
								<Input
									type='text'
									onChange={formik.handleChange}
									name='address'
									value={formik.values.address}
									isTouched={formik.touched.address}
									invalidFeedback={formik.errors.address}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
							<FormGroup id='prov_id' label='Provinsi' className='col-12'>
								<Select
									id='prov_id'
									ariaLabel='Pilih Provinsi'
									name='prov_id'
									//onChange={formik.handleChange}
									onChange={getSelectLocation}
									value={formik.values.prov_id}
									placeholder='Pilih...'
									list={dataProvRef}
								/>
							</FormGroup>
							<FormGroup id='city_id' label='Kota/Kabupaten' className='col-12'>
								<Select
									id='city_id'
									ariaLabel='Pilih Kota/Kabupaten'
									name='city_id'
									//onChange={formik.handleChange}
									onChange={getSelectLocation}
									value={formik.values.city_id}
									placeholder='Pilih...'
									list={dataCity}
								/>
							</FormGroup>
							<FormGroup id='district_id' label='Kecamatan' className='col-12'>
								<Select
									id='district_id'
									ariaLabel='Pilih Kecamatan'
									name='district_id'
									//onChange={formik.handleChange}
									onChange={getSelectLocation}
									value={formik.values.district_id}
									placeholder='Pilih...'
									list={dataDistrict}
								/>
							</FormGroup>
							<FormGroup id='subdistrict_id' label='Kelurahan' className='col-12'>
								<Select
									id='subdistrict_id'
									ariaLabel='Pilih Kelurahan'
									name='subdistrict_id'
									//onChange={formik.handleChange}
									onChange={getSelectLocation}
									value={formik.values.subdistrict_id}
									placeholder='Pilih...'
									list={dataLoc}
								/>
							</FormGroup>
							<FormGroup id='npwp' label='NPWP' className='col-12'>
								<Input
									type='number'
									onChange={formik.handleChange}
									name='npwp'
									value={formik.values.npwp}
									invalidFeedback={formik.errors.npwp}
									isTouched={formik.touched.npwp}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
							<FormGroup id='filecv' label='File CV' className='col-12'>
								<Input
									type='file'
									//onChange={formik.handleChange}
									onChange={(event: any) => {
										formik.setFieldValue(
											'cv_uploaded',
											event.currentTarget.files[0],
										)
									}}
									name='cv_uploaded'
									//value={formik.values.cv_uploaded}
									invalidFeedback={formik.errors.cv_uploaded}
									isTouched={formik.touched.cv_uploaded}
									accept='application/pdf'
									onFocus={() => {
										formik.setErrors({})
									}}
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
							Simpan
						</Button>
					</div>
				</div>
			</OffCanvas>
			<Modal
				id='promote'
				titleId='promote-modal'
				isOpen={activeModal === "promote"} // Example: state
				setIsOpen={() => setActiveModal(null)} // Example: setState
				size='lg' // 'sm' || 'lg' || 'xl'
				isAnimation={true}>
				<ModalHeader>
					<ModalTitle id='nonactive-user-title'>Promosikan Kandidat</ModalTitle>
				</ModalHeader>				
				<Card className='rounded-1 mb-0'>					
					<CardBody>
						<div className='row g-3'>
							<FormGroup
								id='contract_id'
								label='No.Kontrak'
								className='col-12'>
								<Select
									id='contract_id'
									ariaLabel='Pilih Kontrak'
									name='contract_id'
									onChange={formik.handleChange}
									value={formik.values.contract_id}
									placeholder='Pilih...'
									list={dataContractsFinal}
								/>
							</FormGroup>
							<FormGroup id='onboarding_date' label='Tanggal Onboarding' className='col-12'>
								<Input
									type='date'
									onChange={formik.handleChange}
									name='onboarding_date'
									value={formik.values.onboarding_date}
									invalidFeedback={formik.errors.onboarding_date}
									isTouched={formik.touched.onboarding_date}
									onFocus={() => {
										formik.setErrors({})
									}}
								/>
							</FormGroup>
						</div>
					</CardBody>
				</Card>
				<ModalFooter className=''>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setActiveModal(null)}>
						Tutup
					</Button>
					<Button color='info' icon='Save' onClick={() => handleActioneMutate()}>
						Promote
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
