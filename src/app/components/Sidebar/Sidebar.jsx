'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import army_logo from '../../../assets/images/army_logo.png';
import Image from 'next/image';
import { FaHome, FaUsersCog } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import Cookies from 'universal-cookie';
import userPhoto from '../../../assets/images/user.png';
import { getLoggedInUser } from '../../../../lib/User';



const Sidebar = () => {

    const cookie = new Cookies();
    const router = useRouter()

    const currentPath = usePathname();

    const [user, setUser] = useState({});

    const menus = [
        { title: 'Dashboard', link: '/', icon: <FaHome /> },
        { title: 'Report', link: '/report', icon: <TbReport /> },
        { title: 'Manage Users', link: '/manage-users', icon: <FaUsersCog /> },
        { title: 'Profile Settings', link: '/profile', icon: <FaUserGear /> },
    ]

    const getUser = async (token) => {
        const data = await getLoggedInUser(token);
        setUser(data);
    }

    useEffect(() => {
        if (cookie.get('TOKEN')) {
            getUser(cookie.get('TOKEN'));
        }
    }, [])

    const handleLogout = () => {
        console.log('Logout');
        cookie.remove('TOKEN')
        // window.location.reload();
        router.replace('/')
    }

    if (!cookie.get('TOKEN')) {
        return (
            <div></div>
        )
    }

    return (
        <div className='sticky top-0 min-w-[300px] max-w-[300px] h-screen bg-sky-600 text-gray-700 '>
            <Image src={army_logo} alt='logo' width={100} height={100} className='p-2 mx-auto' />

            <ul className='text-white font-semibold text-lg ml-2 mt-6'>
                {
                    menus.map((menu, index) => (

                        <Link key={index} href={menu.link} style={{ fontFamily: 'revert' }} className={`${currentPath.includes(menu.link) && 'font-bold bg-white text-sky-600 rounded-l-3xl'} py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4 items-center px-4`}>
                            {menu.icon}
                            {menu.title}
                        </Link>
                    ))
                }

            </ul >
            <div className='text-white font-semibold flex items-center gap-x-2 mt-44 ml-4'>
                <Image src={user?.photo || userPhoto} alt='user' width={30} height={30} className='rounded-full border' />
                <div>
                    <p>{user?.name}</p>
                    <p className='text-gray-300 text-xs italic'>{user?.email}</p>
                </div>
                <p onClick={() => handleLogout()} className='text-white font-semibold text-3xl ml-4 hover:cursor-pointer'>
                    <FaSignOutAlt />
                </p>
            </div>
        </div >
    );
};

export default Sidebar;