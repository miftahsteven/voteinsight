//create component for editing canvas
import React, { useEffect, useState, useCallback } from 'react';
//import { Button, Modal, Form } from 'react-bootstrap';
// import { useTranslation } from 'react-i18next';
// import { useDispatch } from 'react-redux';
// //import { updateCanvas } from '../../../redux/actions/canvasActions';
// import { toast } from 'react-toastify';
import useQueryPositionsSelect from '../hooks/useQueryPositionsSelect'
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas'
import Button from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup'
import Input from '../../../components/bootstrap/forms/Input';
import Icon from '../../../components/icon/Icon'
import Select from '../../../components/bootstrap/forms/Select';
import useQueryProv from '../hooks/useQueryProv'
import useQueryCities from '../hooks/useQueryCities'
import useQueryDistricts from '../hooks/useQueryDistricts'
//import useQueryPositionsSelect from '../hooks/useQueryPositionsSelect'
import useMutateUpdateRecruitment from '../hooks/useMutateUpdateRecruitment'
import useQueryLocs from '../hooks/useQueryLocs'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import showNotification from '../../../components/extras/showNotification'
import { useFormik } from 'formik';
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


interface ICustomerEditCanvas {
	id: number | string
	isOpen: boolean	
	setIsOpen(...args: unknown[]): unknown
	dataEdit: any []
    errorUrl?: string
	//dataUserById: []
}

const CanvasEdit: React.FC<ICustomerEditCanvas> = ({
    id = 0,
    isOpen,
    setIsOpen,
    dataEdit,
    errorUrl = '/recruitment/list',
}) => {
    const canvas = dataEdit.find((item) => item.id === id);
    const [dataCity, setDataCity] = React.useState([])
	const [dataDistrict, setDataDistrict] = React.useState([])
	const [dataLoc, setDataLoc] = React.useState([])
	const dataCities = useQueryCities()
	const dataDistricts = useQueryDistricts()
	const dataLocs = useQueryLocs()
	const dataProvince = useQueryProv()	
    const { mutate, isSuccess, isError } = useMutateUpdateRecruitment()
    const router = useRouter()
    const handleOnError = useCallback(() => router.push(errorUrl), [router])    
    //console.log('CanvasEdit dataEdit:', JSON.stringify(dataEdit));

    let dataProvRef = []
    let dataCityRef = []
    if (dataProvince !== undefined) {
        dataProvRef = dataProvince.data.map((items) => ({
            value: items.prov_id,
            text: `${items.prov_name}`,
        }))        
    }

    useEffect(() => {
        // Set initial city, district, and subdistrict based on selected province
        if (canvas?.provinces?.prov_id) {
            dataKota(canvas.provinces.prov_id);
        }
        if (canvas?.cities?.city_id) {
            dataKecamatan(canvas.cities.city_id);
        }
        if (canvas?.districts?.dis_id) {
            dataKelurahan(canvas?.districts?.dis_id);
        }
    }, [canvas, dataCities, dataDistricts, dataLocs]);
    
    const dataKota = (prov_id: any) => {
        setDataCity(
            dataCities.data
                ?.filter((item: any) => item.prov_id === Number(prov_id))
                .map((items: any) => ({
                    value: items.city_id,
                    text: `${items.city_name}`,
                })),
        )
        setDataDistrict([]) // Reset districts when province changes
        setDataLoc([]) // Reset subdistricts when province changes
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
            dataLocs?.data
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
    
    const formik = useFormik({
        initialValues: {
            id: canvas?.id || '',
            position_id: canvas?.position?.id || '',
            fullname: canvas?.fullname || '',
            gender: canvas?.gender || 0,
            birthdate: canvas?.birthdate || '',
            //experience: canvas?.experience || '',   
            //education: canvas?.education || '',
            email: canvas?.email || '',
            phone: canvas?.phone || '',
            nik: canvas?.nik || '',
            address: canvas?.address || '',
            prov_id: canvas?.provinces?.prov_id || '',
            city_id: canvas?.cities?.city_id || '',
            district_id: canvas?.districts?.dis_id || '',
            subdistrict_id: canvas?.subdistricts?.subdis_id || '',
            //npwp: canvas?.npwp || '',
            //cv_uploaded: canvas?.cv_uploaded || '',
            // position_name: canvas?.position_name || '',
        },
        validate: (values) => {
            const errors: {
                fullname?: string
                birthdate?: string
                email?: string
                phone?: string
                address?: string
                //npwp?: string
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
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log('Form submitted with values:', values);
            const today = new Date(values.birthdate)            
            const yyyy = today.getFullYear()
            const mm = String(today.getMonth() + 1).padStart(2, '0')
            const dd = String(today.getDate()).padStart(2, '0')

            const formattedDate = `${yyyy}-${mm}-${dd}`
            //console.log('Data Tanggal Lahir', formattedDate)
            const formData = new FormData()
            //console.log(' ---> submit', JSON.stringify(values))
            const positionId = 1 // Default position ID, can be changed as needed
            formData.append('id', values.id)
            formData.append('position_id', String(values.position_id || positionId))
            formData.append('fullname', values.fullname)
            formData.append('gender', values.gender)
            formData.append('birthdate', formattedDate)            
            formData.append('email', values.email)
            formData.append('phone', values.phone)
            formData.append('nik', values.nik)
            formData.append('address', values.address)
            formData.append('prov_id', values.prov_id)
            formData.append('city_id', values.city_id)
            formData.append('district_id', values.district_id)
            formData.append('subdistrict_id', values.subdistrict_id)            
            //console.log('---> data append', Object.fromEntries(formData))
            mutate(
                { ...Object.fromEntries(formData) },
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
                        setIsOpen(false)
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
    
    return (    
       <OffCanvas
        setOpen={setIsOpen}
        isOpen={isOpen}
        titleId='upcomingEdit'
        isBodyScroll
        placement='end'>
        <OffCanvasHeader setOpen={setIsOpen}>
            <OffCanvasTitle id='upcomingEdit'>Update Data Rekrutmen</OffCanvasTitle>
        </OffCanvasHeader>
        <OffCanvasBody>            
            <div className='row g-4'>
                <div className='col-12'>                    
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
                            // invalidFeedback={formik.errors.birthdate}
                            // isTouched={formik.touched.birthdate}
                            onFocus={() => {
                                formik.setErrors({})
                            }}
                        />
                    </FormGroup>                    
                    <FormGroup id='email' label='Email' className='col-12'>
                        <Input
                            type='email'
                            onChange={formik.handleChange}
                            name='email'
                            value={formik.values.email}
                            // invalidFeedback={formik.errors.email}
                            // isTouched={formik.touched.email}
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
                            // invalidFeedback={formik.errors.phone}
                            // isTouched={formik.touched.phone}
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
                            // invalidFeedback={formik.errors.nik}
                            // isTouched={formik.touched.nik}
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
                            // isTouched={formik.touched.address}
                            // invalidFeedback={formik.errors.address}
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
    );
}
export default CanvasEdit;