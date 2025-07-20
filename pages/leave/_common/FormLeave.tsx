//create leave form component
import { useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '../../../components/bootstrap/Modal';
import dayjs from 'dayjs'
import Button from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import showNotification from '../../../components/extras/showNotification';
import  useMutateCreateLeave  from '../hooks/useMutateCreateLeave'; 
import Select from '../../../components/bootstrap/forms/Select'

interface IFormLeaveProps {  
    id: string;  
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
const FormLeave: React.FC<IFormLeaveProps> = ({ id, isOpen, setIsOpen }) => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { mutateAsync: createLeave } = useMutateCreateLeave();
    

    const status_label = [
		{
			label: 'Cuti Tahunan',
			value: 0,
		},
		{
			label: 'Cuti Sakit',
			value: 1,
		},
		{
			label: 'Cuti Melahirkan',
			value: 2,
		},
		{
			label: 'Cuti Haid',
			value: 3,
		},
		{
			label: 'Cuti Besar',
			value: 4,
		},
		{
			label: 'Cuti Nikah',
			value: 5,
		},
		{
			label: 'Cuti Ibadah',
			value: 6,
		},
		{
			label: 'Cuti Duka',
			value: 7,
		},
		{
			label: 'Cuti Khusus',
			value: 8,
		},
		{
			label: 'Cuti Tidak Berbayar',
			value: 9,
		},
		{
			label: 'Cuti Lainnya',
			value: 10,
		},
	]

    const formik = useFormik({
		initialValues: {			
			leave_start_date: '',
			leave_end_date: '',	
			leave_reason: '',
			leave_status: '',
			searchInput: '',
		},
		validate: (values) => {
			const errors: {
				leave_start_date?: string				
				leave_end_date?: string				
				leave_reason?: string
				leave_status?: string				
				searchInput?: string
			} = {}

			if (!values.leave_reason) {
				errors.leave_reason = 'Wajib Diisi'
			}
			if (!values.leave_start_date) {
				errors.leave_start_date = 'Wajib Diisi'
			} else if (dayjs(values.leave_start_date).isAfter(dayjs())) {
				errors.leave_start_date = 'Tanggal Mulai Cuti Tidak Valid'
			}

			if (!values.leave_end_date) {
				errors.leave_end_date = 'Wajib Diisi'
			} else if (dayjs(values.leave_end_date).isAfter(values.leave_start_date)) {
				errors.leave_end_date = 'Tanggal Akhir Cuti Tidak Valid'
			}
			if (!values.leave_status) {
				errors.leave_status = 'Wajib Diisi'
			}

			return errors
		},
		validateOnChange: false,
		onSubmit: (values) => {
			// alert(JSON.stringify(values, null, 2));
			console.log(' ---> submit', JSON.stringify(values))
            createLeave({
                leave_start_date: values.leave_start_date,
                leave_end_date: values.leave_end_date,
                leave_reason: values.leave_reason,
                leave_status: values.leave_status,
            })
                .then(() => {
                    showNotification('success', 'Cuti berhasil diajukan');
                    setIsOpen(false);
                    //router.push('/leave/list');
                })
                .catch((error) => {
                    console.error('Error creating leave:', error);
                    setError('Gagal mengajukan cuti. Silakan coba lagi.');
                });
			
		},
	})
        
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} size='sm' titleId={'create-leave-modal'}>
            <ModalHeader setIsOpen={setIsOpen}>
                <ModalTitle id={id} className='p-4'>Ajukan Cuti</ModalTitle>
            </ModalHeader>
            <ModalBody>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={formik.handleSubmit}>
                    <FormGroup
                        id='leave_status'
                        label='Jenis Cuti'
                        className='col-12'>
                        <Select
                            id='leave_status'
                            ariaLabel='Pilih Jenis Cuti'
                            name='leave_status'
                            onChange={formik.handleChange}
                            value={formik.values.leave_status}
                            placeholder='Pilih...'
                            list={status_label}
                        />
                    </FormGroup>
                    <FormGroup
                        id='leave_start_date'
                        label='Tanggal Mulai Cuti'
                        className='col-12'>
                        <Input
                            type='date'                            
                            onChange={formik.handleChange}                                                                                                       
                            name='leave_start_date'                                                        
                            value={formik.values.leave_start_date}
                            invalidFeedback={formik.errors.leave_start_date}
                            isTouched={formik.touched.leave_start_date}
                            onFocus={() => {
                                formik.setErrors({})
                            }}
                        />
                    </FormGroup>
                    <FormGroup
                        id='leave_end_date'
                        label='Tanggal Akhir Cuti'
                        className='col-12'>
                        <Input
                            type='date'
                            onChange={formik.handleChange}
                            name='leave_end_date'
                            //leave_end_date 
                            value={formik.values.leave_end_date}
                            invalidFeedback={formik.errors.leave_end_date}
                            isTouched={formik.touched.leave_end_date}
                            onFocus={() => {
                                formik.setErrors({})
                            }}
                        />
                    </FormGroup>
                    <FormGroup id='address' label='Alamat' className='col-12'>
                        <Textarea
                            size='lg'
                            placeholder='Alasan Cuti'
                            onChange={formik.handleChange}
                            value={formik.values.leave_reason}
                            isTouched={formik.touched.leave_reason}
                            name='address'
                            invalidFeedback={formik.errors.leave_reason}
                            onFocus={() => {
                                formik.setErrors({})
                            }}
                        />
                    </FormGroup>
                    <Button type="submit" color="primary">
                        Submit
                    </Button>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => setIsOpen(false)}>
                    Close
                </Button>
            </ModalFooter>
        </Modal>
    );    
}
export default FormLeave;