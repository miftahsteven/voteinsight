import React, { useState, useCallback, useEffect } from 'react'
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
import { useRouter } from 'next/router'
import useQueryPositions from '../../../hooks/useQueryPositions'
import useQueryRefDepartments from '../../../hooks/useQueryRefDepartments'
import showNotification from '../../../components/extras/showNotification'
import useMutateCreatePosition from '../../../hooks/useMutateCreatePosition'
import useMutateActionVacancy from '../../../hooks/useMutateActionVacancy'
import OffCanvas, {
    OffCanvasBody,
    OffCanvasHeader,
    OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas'
import Detail from '../_common/Detail'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";


const firebaseConfig = {				
	databaseURL: "https://voteinsight-default-rtdb.asia-southeast1.firebasedatabase.app",										
	apiKey: "AIzaSyC9GEHBhxfYqtGTr9IHicNglYu1AMgOsq8",
	authDomain: "voteinsight.firebaseapp.com",
	projectId: "voteinsight",
	storageBucket: "voteinsight.firebasestorage.app",
	messagingSenderId: "300693203648",
	appId: "1:300693203648:web:6864fcc982cb45583d1b25",
	measurementId: "G-T87QL15VRH"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const SELECT_STATUS_OPTIONS = [
    { value: 0, text: 'Vacant' },
    { value: 1, text: 'Filled' },
]

const Index: NextPage = () => {
    const { darkModeStatus } = useDarkMode()
    const router = useRouter()
    const dataDept = useQueryRefDepartments()
    let dataDeptRef = []
    const handleOnError = useCallback(() => router.push('/speech/list'), [router])
    const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false)
    const [activeModal, setActiveModal] = useState<"remove" | "change_status" | null>(null);
    
    const [inActiveModal, setInactiveModal] = useState(false)	
    const [idSelected, setIdSelected] = useState(0)
    const [action, setAction] = useState('')
    const [statusSelected, setStatusSelected] = useState(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [perPage, setPerPage] = useState<number>(PER_COUNT['10'])

    const inactiveModalOpen = (id: any) => {
        setInactiveModal(true)
        setActiveModal('remove')
        setIdSelected(id)
    }


    if (dataDept !== undefined) {
        dataDeptRef = dataDept.data.map((item: any) => ({
            value: item.id,
            text: `${item.dept_name} - ${item.divisions.division_name} - ${item.divisions.groups.group_name}`,
        }))
    }

    const [dataAISpeech, setDataAISpeech] = useState<Record<string, any> | null>(null)

    useEffect(() => {
        const AISpeech = ref(database, '/AIRecommendation/NewData/Speech');
        //fetch data from firebase in different path
        onValue(AISpeech, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                //console.log('Data from Firebase Realtime AISpeech: ', data);
                setDataAISpeech(data);
            }
        });
        return () => {
			// Cleanup if necessary
		}
    }, [database]);

    const { mutate, isSuccess, isError } = useMutateCreatePosition()
    const { mutate: mutateAction, isSuccess: isSuccessAction } = useMutateActionVacancy()
    const handleActioneMutate = () => {
        // mutateAction(
        //     {
        //         id: Number(idSelected) || 0,
        //     },
        //     {
        //         onSuccess: (data) => {
        //             if (data) {
        //                 setInactiveModal(false)
        //                 showNotification(
        //                     <span className='d-flex align-items-center'>
        //                         <Icon icon='Info' size='lg' className='me-1' />
        //                         <span>Berhasil</span>
        //                     </span>,
        //                     'Berhasil Menghapus Posisi',
        //                 )
        //             }
        //         },
        //         onError: (error) => {
        //             showNotification(
        //                 <span className='d-flex align-items-center'>
        //                     <Icon icon='danger' size='lg' className='me-1' />
        //                     <span>Gagal</span>
        //                 </span>,
        //                 'Gagal Menghapus Posisi',
        //             )
        //             handleOnError()
        //         },
        //     },
        // )
        //setInactiveModal(false)
        setActiveModal(null)
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
            atasan: '',
        },
        onSubmit: (values) => {
                        
        },
    })

    //data AI speech convert to dataFinal for table
    let dataFinal = []
    if (dataAISpeech) {
        dataFinal = Object.keys(dataAISpeech).map((key) => ({
            id: key,
            ...dataAISpeech[key],
        }))
    }

    const items = dataFinal
    const filteredData = items.filter(
        (f: any) =>
            f.Content?.toLowerCase().includes(formik.values.searchInput.toLowerCase()) ||
            f.Date?.toLowerCase().includes(formik.values.searchInput.toLowerCase()),
    )


    const [editModalStatus, setEditModalStatus] = useState<boolean>(false)
    const [detail, setDetail] = useState<boolean>(false)
    const [dataContent, setDataContent] = useState('')
    const [datadate, setDataDate] = useState('')
    const [dataBerita, setDataBerita] = useState('')

    const handleDetailModal = (id: number) => {
        setIdSelected(id)
        setDataContent(items.find((item: any) => item.id === id)?.Isi || '')
        //setDataDate(items.find((item: any) => item.id === id)?.Date || '')
        setDataBerita(items.find((item: any) => item.id === id)?.Berita || '')
        setDetail(true)
    }

    return (
        <PageWrapper>
            <Head>
                <title>List Pidato AI</title>
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
                        placeholder='Cari Pidato...'
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
                        Pidato Baru
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
                                            <th>No</th>                                
                                            <th className='w-25'>Berita</th>
                                            <th>Konten</th>   
                                            <th>Sumber</th>                                            
                                            <td />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPagination(items, currentPage, perPage).map((i,index) => (
                                            <tr key={i.id}>
                                                 <td>{(currentPage - 1) * perPage + index + 1}</td>   
                                                <td>{i.Berita}</td>
                                                { i.Isi && i.Isi.length > 100 ? (
                                                    <td>{i.Isi.substring(0, 100)}...</td>
                                                ) : (
                                                    <td>{i.Isi}</td>
                                                )}
                                                <td>{i.Sumber}</td>                                         
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
                                                                    icon='Monitor'
                                                                    tag='a'                                                                    
                                                                    onClick={() => {       
                                                                        handleDetailModal(i.id)
                                                                        }}
                                                                    >
                                                                    Tampilkan
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
            <Detail
				setIsOpen={setDetail}
				isOpen={detail}
				id={idSelected || 0}
				dataContent={dataContent || ''}
				dataBerita={dataBerita || ''}
			/>
            <Modal
                id='inactive'
                titleId='inactive-person'
                //isOpen={inActiveModal} // Example: state
                isOpen={activeModal === "remove"} 
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
