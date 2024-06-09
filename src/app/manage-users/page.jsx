"use client"

import { Column } from 'jspdf-autotable';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import UserTable from '../components/ManageUsers/UserTable';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import { getLoggedInUser } from '../../../lib/User';

const ManageUsers = () => {

    const cookie = new Cookies();
    const router = useRouter();
    const getUser = async () => {
        const user = await getLoggedInUser(cookie.get('TOKEN'));
        if (!user) {
            console.log("From manage-aircraft");
            router.push('/');
            router.replace('/');
        }
    }

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [users, setUsers] = useState([]);
    const [addUser, setAddUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState([]);
    const [image, setImage] = useState(null);


    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
        quantity: { value: null, matchMode: FilterMatchMode.CONTAINS },
        voucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        actionStatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
        expiryDate: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    const getAllUser = () => {
        fetch('http://localhost:5000/api/v1/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.status == 'Success') {
                    setUsers(data?.data)
                }
            })
    }


    const usersData = users?.map((item, index) => {
        return {
            serial: index + 1, // Add serial number property starting from 1
            ...item
        };
    });

    useEffect(() => {
        getAllUser()
        getUser()
    }, []);

    const handleAddUser = async (userData) => {
        setLoading(true);

        const userPhoto = new FormData();
        userPhoto.append('image', image);

        const uploadResponse = await fetch('http://localhost:5000/api/v1/upload', {
            method: 'POST',
            body: userPhoto
        });

        const uploadData = await uploadResponse.json();

        if (uploadData.status === 'Success') {

            userData.photo = uploadData.filePath

            fetch('http://localhost:5000/api/v1/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookie.get('TOKEN')}`
                },
                body: JSON.stringify(userData)
            }).then(res => res.json())
                .then(data => {
                    console.log(data)
                    if (data.status == 'Success') {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'User Added Successfully', life: 3000 });
                        getAllUser()
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Failed!', detail: data?.error, life: 3000 });
                    }
                })
        }
        else {
            toast.current.show({ severity: 'error', summary: 'Failed!', detail: "Image Upload Failed", life: 3000 });
        }


        setLoading(false);
        setAddUser(false);
        reset();



        // await fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${cookie.get('TOKEN')}`
        //     },
        //     body: userPhoto
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         if (data?.data?.url) {
        //             userData.photo = data.data.url
        //             fetch('http://localhost:5000/api/v1/user', {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'Authorization': `Bearer ${cookie.get('TOKEN')}`
        //                 },
        //                 body: JSON.stringify(userData)
        //             }).then(res => res.json())
        //                 .then(data => {
        //                     console.log(data)
        //                     if (data.status == 'Success') {
        //                         toast.current.show({ severity: 'success', summary: 'Success', detail: 'User Added Successfully', life: 3000 });
        //                         getAllUser()
        //                     }
        //                     else {
        //                         toast.current.show({ severity: 'error', summary: 'Failed!', detail: data?.error, life: 3000 });
        //                     }
        //                 })

        //             setAddUser(false);
        //             setImage(null);
        //             setRole(null);
        //             reset();
        //         }

        //         else {
        //             toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Image Upload Failed', life: 3000 });
        //         }

        //     })
    }


    return (
        <div>
            <Toast ref={toast} />
            <div>
                <div className='bg-white shadow p-2 rounded-md'>
                    <div className='flex justify-between items-center'>
                        <div className='m-2 flex items-center gap-x-2'>
                            <h3 className='text-lg uppercase text-gray-700'>Manage Users</h3>
                            <Button onClick={() => setAddUser(true)} icon="pi pi-plus" size='small' text aria-label='Add' />
                        </div>

                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                        </IconField>
                    </div>
                    <UserTable users={usersData} filters={filters} getAllUser={getAllUser} />
                </div>

                {/* Create user dialog  */}
                <Dialog header="Add New User" visible={addUser} onHide={() => { setAddUser(false); setRole(null); reset() }}
                    style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <form onSubmit={handleSubmit(handleAddUser)} className="flex flex-col gap-2 mt-4">
                        <div className='w-full'>
                            <InputText
                                {...register("name", { required: "Name is required" })}
                                placeholder="Name*" className='w-full border p-1' />
                            {errors.name?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.name.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("email", { required: "Email is required" })}
                                placeholder="Email*" className='w-full border p-1' />
                            {errors.email?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.email.message}</span>}
                        </div>
                        <div className='w-full'>
                            <Dropdown
                                {...register("role")}
                                value={role} onChange={(e) => setRole(e.value)} options={[{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }]} optionLabel="label"
                                placeholder="Select User Role" size="small" className="w-full p-dropdown-sm" />
                        </div>
                        <div className='mt-2'>
                            <input
                                {...register("photo", { required: "Photo is required" })}
                                onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                            {errors.photo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.photo.message}</span>}
                        </div>

                        <div>
                            <Button type="submit" label="Submit" className="text-white w-fit p-1" loading={loading}></Button>
                        </div>
                    </form>
                </Dialog>
            </div>
        </div>
    );
};

export default ManageUsers;