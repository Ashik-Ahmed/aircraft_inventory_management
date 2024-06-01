"use client"

import { Column } from 'jspdf-autotable';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const UserTable = ({ users, filters, getAllUser }) => {

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [deleteUser, setDeleteUser] = useState(null);
    const [updateUser, setUpdateUser] = useState(null);
    const [image, setImage] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleDeleteUser = (rowData) => {
        setLoading(true);
        fetch(`http://localhost:5000/api/v1/user/${rowData._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Successfully Deleted', life: 3000 });
                    getAllUser();
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
                }
            })

        setLoading(false);
        setDeleteUser(null);
    }

    const handleUpdateUser = (updatedData) => {
        console.log(updatedData);

        // if (image) {
        //     const userPhoto = new FormData();
        //     userPhoto.append('image', image);
        // }

        const updatedUserData = Object.entries(updatedData).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});
        console.log(updatedUserData);

        // if (updatedData?.image) {
        //     fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
        //         method: 'POST',
        //         body: userPhoto
        //     })
        //         .then(res => res.json())
        //         .then(data => {
        //             if (data?.data?.url) {
        //                 updatedUserData.image = data.data.url;
        //                 fetch(`http://localhost:5000/api/v1/user/${updateUser._id}`, {
        //                     method: 'PATCH',
        //                     headers: {
        //                         'Content-Type': 'application/json'
        //                     },
        //                     body: JSON.stringify(updatedUserData)
        //                 })
        //                     .then(res => res.json())
        //                     .then(data => {
        //                         if (data.status === 'Success') {
        //                             toast.current.show({ severity: 'success', summary: 'Success', detail: 'Successfully Updated', life: 3000 });
        //                             getAllUser();
        //                         }
        //                         else {
        //                             toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
        //                         }
        //                     })
        //             }
        //             else {
        //                 toast.current.show({ severity: 'error', summary: 'Error', detail: 'Image upload failed', life: 3000 });
        //             }
        //         })
        // }

        fetch(`http://localhost:5000/api/v1/user/${updateUser._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUserData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Successfully Updated', life: 3000 });
                    getAllUser();
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
                }
            })

        setUpdateUser(false);
        reset()
        setImage(null);
        setRole(null);
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setUpdateUser(rowData)} label='Edit' icon="pi pi-pencil" size='small' severity='success' />
                <Button onClick={() => setDeleteUser(rowData)} label='Delete' icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }


    return (
        <div>
            <Toast ref={toast} />
            <div>
                <DataTable value={users} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['name', 'email', 'role']} emptyMessage="No user found">
                    <Column field="serial" header="Ser. No." sortable></Column>
                    <Column field="name" header="Name" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="role" header="User Role" sortable></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            {/* Edit user dialog  */}
            <Dialog header="Edit User Data" visible={updateUser} onHide={() => { setUpdateUser(false); setRole(null); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleUpdateUser)} className="flex flex-col gap-2 mt-4">
                    <div className='w-full'>
                        <InputText
                            {...register("name")}
                            placeholder={updateUser?.name || "Name"} className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("email")}
                            placeholder={updateUser?.email || "Email"} className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("role")}
                            value={role} onChange={(e) => setRole(e.value)} options={[{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }]} optionLabel="label"
                            placeholder={updateUser?.role || "Select User Role"} size="small" className="w-full p-dropdown-sm" />
                    </div>
                    {/* <div className='mt-2'>
                        <input
                            {...register("photo")}
                            onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                    </div> */}

                    <div>
                        <Button type="submit" label="Submit" className="text-white w-fit p-1" loading={loading}></Button>
                    </div>
                </form>
            </Dialog>

            {/* Delete User Dialog  */}
            <Dialog header="Delete User" visible={deleteUser} onHide={() => setDeleteUser(false)}>
                <div className="flex flex-col gap-2">
                    <i className="pi pi-trash rounded-full mx-auto text-red-500 p-2 shadow-lg shadow-red-300" style={{ fontSize: '3rem' }}></i>
                    <p className='text-lg text-gray-700'>Are you sure you want to delete <span className='text-lg font-semibold'>{deleteUser?.name}</span>?</p>
                    <div className='flex justify-end gap-2 mt-4'>
                        <Button label="Delete" severity='danger' size='small' onClick={() => handleDeleteUser(deleteUser)} />
                        {/* <Button label="No" icon="pi pi-times" severity='secondary' size='small' onClick={() => setDeleteStock(false)} /> */}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default UserTable;