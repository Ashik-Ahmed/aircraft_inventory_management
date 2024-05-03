'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import army_logo from '../../../assets/images/army_logo.png';
import Image from 'next/image';
import { FaHome } from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { FaUserGear } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";



const Sidebar = () => {

    const currentPath = usePathname();

    const menus = [
        { title: 'Dashboard', link: '/', icon: <FaHome /> },
        { title: 'Report', link: '/report', icon: <TbReport /> },
        { title: 'Profile Settings', link: '/profile', icon: <FaUserGear /> },
    ]

    return (
        <div className='sticky top-0 min-w-[300px] h-screen bg-sky-600 text-gray-700 '>
            <Image src={army_logo} alt='logo' width={100} height={100} className='p-2 mx-auto' />


            <p className='text-white italic ml-4 mt-6 w-full text-wrap flex items-center gap-x-2'>
                {/* <FaUserAlt /> */}
                ashikahmed121@gmail.comasdasdasdasdasdasdasdasds
            </p>
            <ul className='text-white font-semibold text-lg ml-2 mt-6'>
                {
                    menus.map((menu, index) => (

                        <Link key={index} href={menu.link} style={{ fontFamily: 'revert' }} className={`${currentPath.includes(menu.link) && 'border-r-2 border-r-violet-500 font-bold bg-white text-sky-600 rounded-l-3xl'} py-2 hover:tracking-wider hover:border-r-2 hover:border-r-violet-500  duration-200 cursor-pointer flex gap-x-4 items-center`}> {currentPath.includes(menu.link) ? <i className='pi pi-arrow-right scale-75 font-bold' /> : <i className='pi pi-ellipsis-h scale-75 ' />}
                            {menu.icon}
                            {menu.title}
                        </Link>
                    ))
                }


                <li className='text-white font-semibold text-lg ml-4 mt-6 flex items-center gap-x-2'>
                    <FaSignOutAlt />
                    Logout
                </li>
            </ul >
        </div >
    );
};

export default Sidebar;