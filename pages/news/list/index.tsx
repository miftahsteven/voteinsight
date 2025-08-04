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
import Card, {
    CardBody,
    CardHeader,
    CardLabel,
    CardTitle,
} from '../../../components/bootstrap/Card'

import { useRouter } from 'next/router'
import useQueryRefDepartments from '../../../hooks/useQueryRefDepartments'
import useMutateCreatePosition from '../../../hooks/useMutateCreatePosition'
import useMutateActionVacancy from '../../../hooks/useMutateActionVacancy'
import DetailNews from '../_common/DetailNews' // Adjust the import path as necessary
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import Content from '../../../layout/Content/Content'
import useSortableData from '../../../hooks/useSortableData'


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
    const handleOnError = useCallback(() => router.push('/news/list/caption'), [router])
    const [upcomingEventsEditOffcanvas, setUpcomingEventsEditOffcanvas] = useState(false)
    const [activeModal, setActiveModal] = useState<"remove" | "change_status" | null>(null);
    
    const [inActiveModal, setInactiveModal] = useState(false)	
    const [idSelected, setIdSelected] = useState(0) 
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

    const [dataAINews, setDataAINews] = useState<Record<string, any> | null>(null)

    useEffect(() => {
        const AINews = ref(database, 'issue/result');
        //fetch data from firebase in different path
        onValue(AINews, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log('Data from Firebase Realtime AINews: ', data);
                setDataAINews(data);
            }
        });
        return () => {
            // Cleanup if necessary
        }
    }, [database]);

    const { mutate, isSuccess, isError } = useMutateCreatePosition()
    const { mutate: mutateAction, isSuccess: isSuccessAction } = useMutateActionVacancy()
    const handleActioneMutate = () => {        
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
    if (dataAINews !== null) {
        dataFinal = Object.keys(dataAINews).map((key) => ({
            id: key,
            ...dataAINews[key],
        }))
    }

    const item = dataFinal
    const filteredData = item.filter(
        (f: any) =>
            f.Judul?.toLowerCase().includes(formik.values.searchInput.toLowerCase()) ||
            f.Date?.toLowerCase().includes(formik.values.searchInput.toLowerCase()),
    )

    const { items, requestSort, getClassNamesFor } = useSortableData(filteredData)
    const [editModalStatus, setEditModalStatus] = useState<boolean>(false)
    const [detail, setDetail] = useState<boolean>(false)
    const [dataContent, setDataContent] = useState<Array<any>>([])
    const [datadate, setDataDate] = useState('')

    const handleDetailModal = (id: number) => {
        setIdSelected(id)
        const item = items.find((item: any) => item.id === id);

        if (item) {
            const dataFinalNews = {
                Date: item.Waktu,
                Judul: item.Judul,
                Kategori: item.Kategori,
                Sumber: item.Sumber,
                Content: item.Ringkasan,
            };

            setDataContent([dataFinalNews]); // Set the found item as dataContent
            setDetail(true); // Open the detail modal
        } else {
            console.error(`Item with ID ${id} not found.`);
        }
    }

    return (
        <PageWrapper>
            <Head>
                <title>List Berita AI</title>
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
                        placeholder='Cari Berita...'
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
                        Berita Baru
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
                                            <th>Waktu</th>
                                            <th>Kategori</th>                                            
                                            <th>Judul</th>                                            
                                            <th>Ringkasan</th>
                                            <td />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataPagination(items, currentPage, perPage).map((i,index) => (
                                            <tr key={i.id}>
                                                {/** number of record increasing, and follow the pagination */}
                                                <td>{(currentPage - 1) * perPage + index + 1}</td>                                                
                                                <td>{i.Waktu}</td>
                                                <td>{i.Kategori}</td>                                                                                            
                                                <td>{i.Judul}</td>
                                                <td className='h-50'>{i.Ringkasan.length > 50 ? i.Ringkasan.substring(0, 100) + '...' : i.Ringkasan}</td>                                                
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
            <DetailNews
                setIsOpen={setDetail}
                isOpen={detail}
                id={idSelected || 0}
                dataContent={dataContent || []}				
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
