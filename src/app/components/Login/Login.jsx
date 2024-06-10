"use client"

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import Cookies from 'universal-cookie';
import logo from '../../../assets/images/logo.jpg';
import Image from 'next/image';
import bgImage from '../../../assets/images/bg-image.jpg';

const Login = () => {

    const cookie = new Cookies();

    const toast = useRef(null);
    const [checked, setChecked] = useState(false)
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [passError, setPassError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        setLoading(true)
        e.preventDefault()
        setPassError('')

        const email = e.target.email.value;
        const password = e.target.password.value;
        console.log(email, password);

        await fetch('http://localhost:5000/api/v1/user/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.status !== 'Success') {
                    setPassError(data.error)
                    console.log(data.error)
                    setLoading(false)
                }
                else {
                    cookie.set('TOKEN', data.data.token)
                    setPassError('')
                    setLoading(false)
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Successfully Logged in', life: 3000 });
                    window.location.reload();
                }
            })
    }

    return (
        <div className='h-[93vh] flex items-center w-full'>
            <Toast ref={toast} />
            <div className=" mx-auto my-auto rounded-md bg-white opacity-90 shadow">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-96">
                    <div className="text-center mb-5">
                        <Image src={logo} alt="logo" height={50} className="mb-3 mx-auto" />
                        <h2 className="text-3xl font-medium mb-3">ARMY AVN MAINT WKSP</h2>
                        {/* <p className='text-2xl font-semibold'>Army Avn. Maint WKSP</p> */}
                        <span className="mt-4 font-medium text-sky-600 underline">Please Sign-in</span>
                    </div>

                    <form onSubmit={handleLogin}>
                        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                        <div className="p-inputgroup flex-1">
                            <InputText id="email" type="text" placeholder="Email address" className="w-full" />
                            <span size='small' className="p-inputgroup-addon"> <i className="pi pi-envelope"></i> </span>
                        </div>

                        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                        <div className="p-inputgroup flex-1 ">
                            <InputText id="password" type={passwordVisibility ? 'text' : 'password'} placeholder="Password" className="w-full" />
                            <span onClick={() => setPasswordVisibility(!passwordVisibility)} size='small' className="p-inputgroup-addon cursor-pointer">  {passwordVisibility ? <i className="pi pi-eye-slash"></i> : <i className="pi pi-eye"></i>}</span>
                        </div>
                        {
                            passError && <p className='text-red-500 text-xs italic'>{passError}</p>
                        }
                        {/* <div className="flex align-items-center justify-content-between mb-6">
                            <div className="flex align-items-center">
                                <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                                <label htmlFor="rememberme">Remember me</label>
                            </div>
                            <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                        </div> */}

                        <Button type='submit' label="Sign In" icon="pi pi-user" size='small' n loading={loading} className="w-full font-semibold mt-8" />
                    </form>
                </div>
            </div>


            {/* <div className='surface-ground border' style={{ borderRadius: "56px", padding: "0.3rem", background: "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)" }}>
                <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: "53px" }}>
                    <div className="text-center mb-5">

                        <div className="text-900 text-3xl font-medium mb-3">Hi, Welcome!</div>
                        <span className="text-600 font-medium">Sign in to continue</span>
                    </div>
                    <form onSubmit={handleLogin} >
                        <label for="email" className="block text-900 font-medium mb-2">Email</label>
                        <div className="p-inputwrapper p-input-icon-right w-full">
                            <InputText name='email' inputid="email" type="email" placeholder="Email address" className='w-full mb-3' />

                        </div>
                        <div className=' mb-5'>
                            <label for="password" className="block text-900 font-medium mb-2">Password</label>
                            <div className="p-password p-component p-inputwrapper p-input-icon-right w-full">
                                <InputText id="password" name='password' type={passwordVisibility ? 'text' : 'password'} placeholder="Password" className={`w-full ${passError}&& 'p-invalid'`} />

                            </div>
                            {
                                passError && <p className='text-red-500 text-xs italic'>{passError}</p>
                            }
                        </div>
                        <div className="flex align-items-center justify-content-between mb-6">
                            <div className="flex align-items-center">
                                <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                                <label htmlFor="rememberme" className='text-gray-700'>Remember me</label>
                            </div>
                            <a className="text-sm italic hover:underline ml-2 text-secondary text-right cursor-pointer">Forgot your password?</a>
                        </div>
                        <Button type='submit' label="Sign In" icon="pi pi-user" severity='primary' loading={loading} className="w-full" />
                    </form>
                </div>
            </div> */}
        </div >
    )
};

export default Login;