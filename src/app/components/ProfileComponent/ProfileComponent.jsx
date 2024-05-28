"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';
import { getLoggedInUser } from '../../../../lib/User';
import { Toast } from 'primereact/toast';
import Image from 'next/image';
import userPhoto from '../../../assets/images/user.png';
import { Button } from 'primereact/button';
import { formatDate } from '../../../../utils/dateFunctionality';
import { Dialog } from 'primereact/dialog';
import { Password } from 'primereact/password';
import UpdateProfile from './UpdateProfile';
import { useRouter } from 'next/router';

const ProfileComponent = () => {
    const cookie = new Cookies();
    const router = useRouter();

    const toast = useRef()
    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [user, setUser] = useState({});
    const [updateForm, setUpdateForm] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [currentPassError, setCurrentPassError] = useState('')
    const [newPassError, setNewPassError] = useState('')


    const getUser = async (token) => {
        const userData = await getLoggedInUser(token);
        if (!userData) {
            router.push('/');
            router.replace('/');
        }
        setUser(userData)
    }

    useEffect(() => {
        if (cookie.get('TOKEN')) {
            getUser(cookie.get('TOKEN'))
        }
    }, [])

    const handleChangePassword = (data) => {

        // fetch(`http://localhost:5000/api/v1/employee/updatePassword/${employee?.email}`, {
        //     method: "PATCH",
        //     headers: {
        //         "content-type": "application/json",
        //         "Authorization": `Bearer ${accessToken}`
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(res => res.json())
        //     .then((data => {
        //         if (data.status == "Success") {
        //             setChangePassword(false)
        //             reset()
        //             toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password Updated', life: 3000 });
        //         }
        //         else {
        //             console.log("Failed to update password");
        //             console.log(data.error);
        //             toast.current.show({ severity: 'error', summary: 'Failed!', detail: `${data.error}`, life: 3000 });
        //         }
        //     }))

    }

    // if (!employee || !department) {
    //     return <Loading />
    // }

    return (
        <div className='flex'>
            <Toast ref={toast} />
            <div class="bg-white rounded w-1/3">
                <div className='p-2 mx-auto text-center border-b-4'>
                    <Image class="mx-auto rounded-md w-40 h-40 object-contain" width='120' height='120' src={user?.photo || userPhoto} alt='User Photo' priority />
                </div>
                <div className='mt-0 pl-4 w-full'>
                    <div className='text-left py-4 mt-4'>
                        <div className='flex items-baseline justify-between'>
                            <p className='font-semibold w-1/3'>Name</p>
                            <span className='w-2/3'>: {user?.name}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Email</p>
                            <span className='w-2/3'>: {user?.email || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>user Id</p>
                            <span className='w-2/3'>: {user?.userId || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Role</p>
                            <span className='w-2/3'>: {user?.role || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Designation</p>
                            <span className='w-2/3'>: {user?.designation || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Joining date</p>
                            <span className='w-2/3'>: {formatDate(user?.createdAt) || 'N/A'}</span>
                        </div>
                        <div className='flex items-baseline justify-between mt-1'>
                            <p className='font-semibold w-1/3'>Phone</p>
                            <span className='w-2/3'>: {user?.mobile || 'N/A'}</span>
                        </div>
                        <div className='mt-2'>
                            <p onClick={() => setChangePassword(true)} className='cursor-pointer link inline text-red-500'>Change Password</p>
                        </div>
                    </div>
                    <div className='text-center my-2'>
                        <Button onClick={() => setUpdateForm(true)} label='Edit Profile' icon='pi pi-user-edit' className='p-button-info p-button-sm normal-case' />
                    </div>
                </div>
            </div>

            {/* change password */}
            <Dialog header="Change Password" visible={changePassword} onHide={() => {
                setChangePassword(false);
                setCurrentPassError('');
                setNewPassError('');
                reset();
            }} breakpoints={{ '960px': '75vw' }} style={{ width: '25vw' }} >
                <form onSubmit={handleSubmit(handleChangePassword)} className='flex flex-col gap-2 justify-center items-center'>
                    <div className=''>
                        <div className='rounded-md mt-2 '>
                            <div className='flex flex-col'>
                                {/* <Password
                                    {...register('currentPassword', { required: "Current Password is required" })}
                                    toggleMask feedback={false} placeholder='Current Password' /> */}
                                <Controller
                                    name="currentPassword"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Current Password is required" }}
                                    render={({ field }) => (
                                        <Password
                                            {...field}
                                            toggleMask
                                            feedback={false}
                                            placeholder='Current Password'
                                        />
                                    )}
                                />
                                {errors.currentPassword?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.currentPassword.message}</span>}
                            </div>

                            {/* <InputText type={currentPassView ? "text" : "password"} name='currentPassword' placeholder='Current Password' className='input  bg-gray-200 text-gray-700 w-full' required />
                                <label onClick={() => setCurrentPassView(!currentPassView)} className='px-2 inline-block'>{currentPassView ? <HiEye /> : <HiEyeOff />}</label> */}
                        </div>
                        {
                            currentPassError &&
                            <div>
                                <p className='text-xs text-red-500 text-left'>Current password is wrong</p>
                            </div>
                        }
                    </div>
                    <div className='rounded-md mt-2'>
                        <div className='flex flex-col'>
                            <Controller
                                name="newPassword"
                                control={control}
                                defaultValue=""
                                rules={{ required: "New Password is required" }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        toggleMask
                                        feedback={false}
                                        placeholder='New Password'
                                    />
                                )}
                            />
                            {/* <Password
                                {...register('newPassword', { required: "New Password is required" })}
                                toggleMask placeholder='New Password' /> */}
                            {errors.newPassword?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.newPassword.message}</span>}
                        </div>
                        {/* <InputText type={newPassView ? "text" : "password"} name='newPassword' placeholder='New Password' className='input  bg-gray-200 text-gray-700 w-full' required />
                        <label onClick={() => setNewPassView(!newPassView)} className='px-2 inline-block'>{newPassView ? <HiEye /> : <HiEyeOff />}</label> */}
                    </div>
                    <div className='rounded-md mt-2'>
                        <div className='flex flex-col'>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Re-enter the new password" }}
                                render={({ field }) => (
                                    <Password
                                        {...field}
                                        toggleMask
                                        feedback={false}
                                        placeholder='Re-type New Password'
                                    />
                                )}
                            />
                            {/* <Password
                                {...register('confirmPassword', { required: "Re-enter the new password" })}
                                toggleMask placeholder='Re-type New Password' /> */}
                            {errors.confirmPassword?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.confirmPassword.message}</span>}
                        </div>
                        {/* <InputText type={confirmPassView ? "text" : "password"} name='confirmPassword' placeholder='Confirm New Password' className='input  bg-gray-200 text-gray-700 w-full' required />
                            <label onClick={() => setConfirmPassView(!confirmPassView)} className='px-2 inline-block'>{confirmPassView ? <HiEye /> : <HiEyeOff />}</label> */}
                    </div>
                    <div className='mt-4'>
                        <Button type='submit' label='Submit' className="p-button-info p-button-sm normal-case" />
                    </div>
                </form>
            </Dialog>

            {/* {
                updateForm && <UpdateProfile user={user} getUser={getUser} setUpdateForm={setUpdateForm} />
            } */}
        </div>
    );
};

export default ProfileComponent;