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
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card'
import Form from '../_common/Form'
import EditForm from '../_common/EditForm'	
import useQueryContract from '../../../hooks/useQueryContract'
import showNotification from '../../../components/extras/showNotification'
import useMutateActionContract from '../../../hooks/useMutateActionContract'
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import Select from '../../../components/bootstrap/forms/Select'
const SELECT_STATUS_OPTIONS = [
	{ value: 0, text: 'TIDAK AKTIF' },
	{ value: 1, text: 'AKTIF' },
	{ value: 2, text: 'SELESAI' },
	{ value: 3, text: 'DIBEKUKAN' },
	{ value: 4, text: 'DIBATALKAN' },
  ]

const Index: NextPage = () => {
	const { darkModeStatus } = useDarkMode()
	const dataContract = useQueryContract()
	let dataFinal = []
	if (dataContract !== undefined) {
		dataFinal = dataContract.data
	}
	
	const router = useRouter()
	const [removeModal, setRemoveModal] = useState(false)
	const [inActiveModal, setInactiveModal] = useState(false)
	const [activeModal, setActiveModal] = useState<"remove" | "change_status" | null>(null);
	const [idSelected, setIdSelected] = useState(0)
	const [action, setAction] = useState('')
	const [statusSelected, setStatusSelected] = useState(0)
	const [dataRecruitmenSelected, setDataRecruitmenSelected] = useState([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])	
	
	
	const formik = useFormik({
		initialValues: {
			searchInput: '',			
			contract_status: '',
		},
		onSubmit: (values) => {
			// alert(JSON.stringify(values, null, 2));
			console.log(' ---> submit', JSON.stringify(values))			
		},
	})

	const filteredData = dataFinal.filter(
		(f: any) =>
			// Name
			//(f.contract_number?.id === 1 || f.recruitment_status?.id === 2) &&
			f.contract_number?.toLowerCase().includes(formik.values.searchInput.toLowerCase()), //&&
		
	)
	
	const handleOnError = useCallback(() => router.push('/employee/list/contract'), [router])
	const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false)
	
	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)

	const [tambahModal, setTambahModal] = useState<boolean>(false)
	const [editModal, setEditModal] = useState<boolean>(false)
	const [updateStatusRec, setUpdateStatusRec] = useState<boolean>(false)

	const handleOnClickModal = (id: number) => {
		const statusTerpilih = dataFinal.filter((item : any) => item.id == id)		
		setAction(action)			
		//setInactiveModal(true)
		//setRemoveModal(false)
		setActiveModal('change_status')
		setIdSelected(id)					
	}

	const handleOnClickRemoveModal = (id: number) => {
		const statusTerpilih = dataFinal.filter((item : any) => item.id == id)		
		setAction(action)			
		//setRemoveModal(true)
		//setInactiveModal(false)
		setActiveModal('remove')
		setStatusSelected(statusTerpilih[0].contract_status)
		setIdSelected(id)					
	}

	const handleUpcomingEdit = (id: number) => {
		const dataTerpilih = dataFinal.filter((item : any) => item.id == id)			
		setIdSelected(id)
		setAction('change_status')
		setEditModal(true)
	}
	

	const { mutate, isSuccess, isError } = useMutateActionContract()

	const handleActioneMutate = (actionParams: string) => {
		mutate(
			{
				id: String(idSelected),
				contract_status: formik.values.contract_status,
				action: actionParams as 'remove' | 'update',
			},
			{
				onSuccess: data => {
					if (data) {
						if (action == 'change_status') {
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='Info' size='lg' className='me-1' />
									<span>Berhasil</span>
								</span>,
								'Berhasil Mengubah Status Kontrak',
							)
						} else if (action == 'remove') {
							showNotification(
								<span className='d-flex align-items-center'>
									<Icon icon='Info' size='lg' className='me-1' />
									<span>Berhasil</span>
								</span>,
								'Berhasil Hapus Kontrak',
							)
						}
					}
					// /handleOnClick();
					setActiveModal(null)
				},
				onError: error => {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='danger' size='lg' className='me-1' />
							<span>{error.message}</span>
						</span>,
						`Gagal Proses ${error.message}`,
					)
				},
			},
		)
	}
	
	return (
		<PageWrapper>
			<Head>
				<title>List Contract</title>
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
						placeholder='Cari Kontrak...'
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
						onClick={() => setTambahModal(true)}>
						Tambah Kontrak
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
											<th>No. Kontrak</th>
											<th>Type</th>
											<th>Tanggal Berakhir</th>
											<th>Status</th>											
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map((i) => (
											<tr key={i.id}>												
												<td>{i.contract_number}</td>
												<td>{i.contract_type_text}</td>												
												<td>{i.contract_end_date_text == null ? 'n/a' : i.contract_end_date_text}</td>																								
												<td>{i.contract_status_text}</td>
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
																	icon='Edit'
																	onClick={() =>
																		handleUpcomingEdit(i.id)
																		
																	}>
																	Edit
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button
																	icon='NavigateNext'
																	tag='a'
																	onClick={() => handleOnClickRemoveModal(i.id)}																	
																>
																	Hapus
																</Button>
															</DropdownItem>			
															<DropdownItem>
																<Button
																	icon='NavigateNext'
																	tag='a'
																	onClick={() => handleOnClickModal(i.id)}																	
																>
																	Ubah Status
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
			<Form
				setIsOpen={setTambahModal}
				isOpen={tambahModal}
				id='0'
				//dataContractSelected={[]}
				//dataRole={dataPosFinal}
				//dataUserById={[]}
			/>	
			<EditForm
				setIsOpen={setEditModal}
				isOpen={editModal}
				id={String(idSelected)}
				dataContractSelected={dataFinal.filter((item : any) => item.id == idSelected)}
				//dataRole={dataPosFinal}
				//dataUserById={[]}
			/>		
			<Modal
				id='removed'
				titleId='removed-contract'
				isOpen={activeModal === "remove"} // Example: state
				setIsOpen={() => setActiveModal(null)} // Example: setState
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
						onClick={() => setActiveModal(null)}>
						Tutup
					</Button>
					<Button color='info' icon='Save' onClick={() => handleActioneMutate('remove')}>
						Hapus
					</Button>
				</ModalFooter>
			</Modal>
			<Modal
				id='inactive'
				titleId='inactive-person'
				isOpen={activeModal === "change_status"} // Example: state
				setIsOpen={() => setActiveModal(null)} // Example: setState
				size='sm' // 'sm' || 'lg' || 'xl'
				isAnimation={true}>
				<ModalHeader>
					<ModalTitle id='nonactive-user-title'>Ubah Status</ModalTitle>
				</ModalHeader>				
				<Card className='rounded-1 mb-0'>					
					<CardBody>
						<div className='row g-3'>
							<FormGroup
								id='contract_status'
								label='Status Kontrak'
								className='col-12'>
								<Select
									id='contract_status'
									ariaLabel='Pilih Status Kontrak'
									name='contract_status'
									onChange={formik.handleChange}
									value={formik.values.contract_status}
									placeholder='Pilih...'
									list={SELECT_STATUS_OPTIONS}
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
					<Button color='info' icon='Save' onClick={() => handleActioneMutate('change_status')}>
						Ubah Status
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
