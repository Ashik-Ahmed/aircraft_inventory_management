"use client"
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css";
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import { PrimeReactProvider } from 'primereact/api';

const CustomLayout = ({ children }) => {


    return (
        <div>

            <PrimeReactProvider>
                <div className='flex'>
                    <div className="">
                        <Sidebar />
                    </div>
                    <div className="p-4 bg-gray-100 w-full overflow-y-auto">
                        {children}
                    </div>
                </div>
            </PrimeReactProvider>
        </div>
    );
};

export default CustomLayout;