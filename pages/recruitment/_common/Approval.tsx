//create approval component
import React, {useState} from 'react';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';       
import showNotification from '../../../components/extras/showNotification';
import Button from '../../../components/bootstrap/Button';
import Select from '../../../components/bootstrap/forms/Select';
import useQueryStatusRec from '../hooks/useQueryStatusRec';
//import useMutateUpdateStatusRec from '../hooks/useMutateUpdateStatusRec';
import useMutateApproveRecruitment from '../hooks/useMutateApprovedRecruitment'
import useMutateUpdateApprovedRecruitment from '../hooks/useMutateUpdateApprovedRecruitment';
import useQueryApprover from '../hooks/useQueryApprover';
import { useRouter } from 'next/router';    
import Page from '../../../layout/Page/Page'
import Card, { CardBody, CardTitle, CardHeader, CardLabel } from '../../../components/bootstrap/Card'
import Icon from '../../../components/icon/Icon';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown'
import { stat } from 'fs';

interface IApprovalProps {
    id: number;
    status: number
    isOpen: boolean;
    setIsOpen(...args: unknown[]): unknown;
    //dataRecruitmenSelected: any[];
}
const Approval: React.FC<IApprovalProps> = ({
    id,
    status,
    isOpen, 
    setIsOpen,
    //dataRecruitmenSelected,
}) => {
    const router = useRouter();    
    const [activeModal, setActiveModal] = useState<"approved" | "not_approved" | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
    const [submitButton, setSubmitButton] = useState(false);
    let dataStatusRef = [];
    const dataApprover = useQueryApprover();
    //map dataApprover to dataStatusRef
    if (dataApprover !== undefined) {
            dataStatusRef = dataApprover?.data
    }

    const selectStatus = [                                        
        { value: 1, label: "Approved" },
        { value: 0, label: "Not Approved" }
    ]
    // console.log('id', id);
    // console.log('status', status);
    
    
    const {mutateAsync: approvalRecruitmen} = useMutateApproveRecruitment();
    const {mutateAsync: updateApprovalRecruitment} = useMutateUpdateApprovedRecruitment();

    const formik = useFormik({
        initialValues: {
            idapprover: 0, //id of user candidate
            approval_status: '', //status approved or not approved                                            
            approval_type: status, //status update by datalist
            user_candidat_id: id, //id of user candidate
            approval_desc: '', //description of approval
        },
        validate: (values) => {
			const errors: {
				approval_status?: string
				approval_desc?: string				
				searchInput?: string
			} = {}

            if (!values.approval_status) {
				errors.approval_status = 'Wajib Diisi'
			}
            if (!values.approval_desc) {
                errors.approval_desc = 'Wajib Diisi'
            }
            return errors
        },
        validateOnBlur: true,        
        enableReinitialize: true, // to reinitialize formik values when props change
        onSubmit: (values) => {
            try {
                //check if ubah approval status 
                if(values.idapprover === 0) {                    
                    approvalRecruitmen({
                        user_candidat_id: id, //id of user candidate
                        approval_status: values.approval_status, //status approved or not approved   
                        approval_type: status, //status update by datalist
                        approval_desc: values.approval_desc, //description of approval
                    })
                    showNotification('success', 'Approval updated successfully');
                    //setIsOpen(false);
                    //router.reload();
                    //reset formik values
                } else {                    
                    updateApprovalRecruitment({
                        id: values.idapprover, //id of user candidate
                        approval_status: values.approval_status, //status approved or not approved                        
                        approval_desc: values.approval_desc, //description of approval
                    })
                    showNotification('success', 'Approval updated successfully');
                    //setIsOpen(false);
                    //router.reload();
                }
                formik.setFieldValue('idapprover', 0); // reset id of user candidate
                setSubmitButton(false);
                formik.resetForm();
            } catch (error) {
                showNotification('danger', 'Failed to update approval');
            }
        },
    });

    const handleOnclickChangeStatus = (idapprover: number, desc: string, status: number) => {        
        formik.setFieldValue('approval_status', status);
        formik.setFieldValue('approval_desc', desc);        
        formik.setFieldValue('idapprover', idapprover); // set id of user candidate
        //enable the submit button
        setSubmitButton(true);
    }

    return (
        <Modal id='approval'
        titleId='approval-recruitment'
        isOpen={isOpen} // Example: state
        setIsOpen={setIsOpen} // Example: setState
        size='lg' // 'sm' || 'lg' || 'xl'
        isAnimation={true}>
            <ModalHeader setIsOpen={setIsOpen} className='p-4'>
                <ModalTitle id='approval'>Approval</ModalTitle>
            </ModalHeader>
            <ModalBody>
                Lakukan Approval Kandidat
                <Page>
                    <div className='row h-100'>
                        <div className='col-12'>
                            <Card stretch>
                                <CardBody isScrollable className='table-responsive h-100'>
                                    <table className='table table-modern table-hover'>                                        
                                        <thead>
                                            <tr>
                                                <th className='text-center'>No</th>
                                                <th className='text-center'>Nama</th>
                                                <th className='text-center'>jabatan</th>
                                                <th className='text-center'>Status</th>
                                                <th className='text-center'>Ket</th>
                                                <th className='text-center'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* if data length 0, create row "no data" information, when data length > 0, show data john doe */}
                                            { dataStatusRef.length === 0 ? 
                                            <tr>
                                                <td className='text-center' colSpan={4}>Data Kosong</td>
                                            </tr>                                            
                                            :
                                            dataStatusRef.filter((itemdata: any) => itemdata.kandidatId === id && itemdata.type === status).map((item: any, index: any) => (
                                                <tr key={index}>
                                                    <td className='text-center'>{index + 1}</td>
                                                    <td className='text-center'>{item.nama}</td>
                                                    <td className='text-center'>{item.jabatan}</td>                                                    
                                                    <td className='text-center'>
                                                        {item.status === 0 ? (
                                                            <Icon icon='HighlightOff' size='2x' color='danger' />
                                                        ) : (
                                                            <Icon icon='Verified' size='2x' color='primary' />
                                                        )}
                                                    </td>
                                                    <td className='text-center'>{item.desc}</td>
                                                    <td className='text-center'>
                                                        {/* if session login userId === iduser show the edit icon */}
                                                        {(item.iduser === Number(localStorage.getItem('login_id')) && item.type === status) ? (
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
                                                                        icon='Edit'
                                                                        tag='a'                                                                        
                                                                        onClick={() => {                                                                            
                                                                            handleOnclickChangeStatus(item.id, item.desc, item.status);
                                                                        }}
                                                                        href='#'>
                                                                        Ubah
                                                                    </Button>
                                                                </DropdownItem>
                                                                </DropdownMenu>
                                                           </Dropdown>
                                                        ) : (
                                                            <span className='text-muted'>&nbsp;</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}                                                                                      
                                            {/* Map through dataStatusRef to display each item */}
                                            </tbody>
                                    </table>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Page>
                    
            <div className='p-4 row g-4'>
                <div className='col-md-12'>
                    <Card className='rounded-1 mb-0'>                        
                        <CardBody>
                            <div className='row g-3'>
                                <label htmlFor='approval_status'>Approval Status</label>
                                <Select
                                    id='approval_status'
                                    name='approval_status'
                                    value={formik.values.approval_status}
                                    onChange={formik.handleChange}                                    
                                    list={selectStatus}
                                    className={`form-control ${formik.touched.approval_status && formik.errors.approval_status ? 'is-invalid' : ''}`}
                                    placeholder='Pilih Approval Status'
                                    ariaLabel='Approval Status'                                    
                                    isTouched={formik.touched.approval_status}
                                />                                     
                                {formik.touched.approval_status && formik.errors.approval_status ? (
                                    <div className='invalid-feedback'>
                                        {formik.errors.approval_status}
                                    </div>
                                ) : null}                           
                                <label htmlFor='approval_status'>Keterangan</label>
                                <div className='form-group'>
                                    <textarea
                                        id='approval_desc'
                                        name='approval_desc'
                                        rows={3}
                                        className={`form-control ${formik.touched.approval_desc && formik.errors.approval_desc ? 'is-invalid' : ''}`}
                                        onChange={formik.handleChange}
                                        value={formik.values.approval_desc} // Assuming you want to set an empty string initially
                                        placeholder='Masukkan keterangan...'
                                    />
                                    {formik.touched.approval_desc && formik.errors.approval_desc ? (
                                        <div className='invalid-feedback'>
                                            {formik.errors.approval_desc}
                                        </div>
                                    ) : null}
                                </div>                                    

                            </div>
                        </CardBody>
                    </Card> 
                </div>
            </div>
            </ModalBody>    
            <ModalFooter>
                {/* create button left=0 */}
                {/* <Button color="secondary" onClick={() => setIsOpen(false)} className=''>Close</Button> */}
                {/* create select status */}

                <Button color="primary" className={ dataStatusRef.filter((itemdata: any) => !submitButton && itemdata.type === status && itemdata.kandidatId === id && itemdata.iduser === Number(localStorage.getItem('login_id'))).length > 0 ? 'disabled': ''} onClick={() => {
                    //formik.setFieldValue('approval_status', 1) // Set approval status to 1 for approved
                    formik.handleSubmit()
                }}>Submit</Button>
                {/* <Button color="danger" onClick={() => {
                    formik.setFieldValue('approval_status', 0) // Set approval status to 0 for not approved
                    formik.handleSubmit
                }}>Not Approved</Button> */}
            </ModalFooter>
        </Modal>
    );
}
export default Approval;