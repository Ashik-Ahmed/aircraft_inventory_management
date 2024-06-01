'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import logo from '../../../assets/images/logo.jpg';
import Image from 'next/image';
import { FaHelicopter, FaHome, FaUsersCog } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { BsPostcard } from "react-icons/bs";
import Cookies from 'universal-cookie';
import userPhoto from '../../../assets/images/user.png';
import { getLoggedInUser } from '../../../../lib/User';



const Sidebar = () => {

    const cookie = new Cookies();
    const router = useRouter()

    const currentPath = usePathname();

    const [user, setUser] = useState(null);

    const menus = [
        // { title: 'Dashboard', link: '/', icon: <FaHome /> },
        { title: 'Report', link: '/report', icon: <TbReport /> },
        { title: 'Manage Aircraft', link: '/manage-aircraft', icon: <FaHelicopter /> },
        { title: 'Card Management', link: '/card-management', icon: <BsPostcard /> },
        { title: 'Manage Users', link: '/manage-users', icon: <FaUsersCog /> },
        { title: 'Profile Settings', link: '/profile', icon: <FaUserGear /> },
    ]

    const getUser = async (token) => {
        console.log(token);
        const data = await getLoggedInUser(token);
        console.log(data);
        if (!data?.user) {
            console.log("No user found");
            router.replace('/')
            router.push('/')
            // window.location.reload();
        }
        setUser(data);
    }

    useEffect(() => {
        if (cookie.get('TOKEN')) {
            getUser(cookie.get('TOKEN'));
        }
    }, [])

    const handleLogout = () => {
        setUser(null);
        console.log('Logout');
        cookie.remove('TOKEN')
        router.replace('/')
        // router.push('/')
        window.location.reload();
    }
    console.log(user);
    if (!user) {
        return (
            <div></div>
        )
    }

    return (
        <div className='sticky top-0 min-w-[250px] max-w-[250px] h-screen bg-sky-600 text-gray-700 '>
            <Image src={logo} alt='logo' width={150} height={150} className='p-2 mx-auto' />

            <div className={`${currentPath === '/' && 'font-bold bg-white text-sky-600 rounded-l-3xl'} text-white font-semibold text-lg py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4 items-center px-4 ml-2 mt-4`}>
                <FaHome className={`${currentPath === '/' && 'font-bold bg-white text-sky-600 rounded-l-3xl'}`} />
                <Link href='/' className={`${currentPath === '/' && 'font-bold bg-white text-sky-600 rounded-l-3xl'}`}> Dashboard </Link>

            </div>
            <ul className='text-white font-semibold text-lg ml-2'>
                {
                    menus.map((menu, index) => (

                        <Link key={index} href={menu.link} style={{ fontFamily: 'revert' }} className={`${currentPath.includes(menu.link) && 'font-bold bg-white text-sky-600 rounded-l-3xl'} py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4 items-center px-4`}>
                            {menu.icon}
                            {menu.title}
                        </Link>
                    ))
                }

            </ul >
            <div className='text-white font-semibold flex items-center gap-x-2 mt-32 ml-4'>
                <Image src={user?.photo || userPhoto} alt='user' width={30} height={30} className='rounded-full border' />
                <div>
                    <p>{user?.name}</p>
                    <p className='text-gray-300 text-xs italic'>{user?.email}</p>
                </div>
            </div>
            <div onClick={() => handleLogout()} className='flex items-center gap-x-4 text-white ml-4 hover:cursor-pointer mt-4'>
                <FaSignOutAlt size={25} />
                <p className='text-lg font-semibold'>Signout</p>
            </div>
        </div >
    );
};

export default Sidebar;