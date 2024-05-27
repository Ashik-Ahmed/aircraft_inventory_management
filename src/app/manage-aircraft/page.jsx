"use client"

import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAllAircraft } from '../../../lib/Aircraft';
import AircraftUnitTable from '../components/AircraftUnitTable/AircraftUnitTable';
import { Toast } from 'primereact/toast';
import Cookies from 'universal-cookie';
import { getLoggedInUser } from '../../../lib/User';
import { useRouter } from 'next/navigation';

const ManageAircraft = () => {

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

    const [allAircraft, setAllAircraft] = useState([]);
    const [allAircraftUnit, setAllAircraftUnit] = useState([]);
    const [addAircraft, setAddAircraft] = useState(false);
    const [selectedAircraft, setSelectedAircraft] = useState(null);
    const [loading, setLoading] = useState(false);


    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        regNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        serialNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getAllAircraftData = async () => {
        const allAircraft = await getAllAircraft();
        setAllAircraft(allAircraft?.data);
    }

    const getAllAircraftUnit = () => {
        fetch('http://localhost:5000/api/v1/aircraftUnit', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'Success') {
                    setAllAircraftUnit(data?.data);
                }
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }



    useEffect(() => {
        getAllAircraftData();
        getAllAircraftUnit()
        getUser();
    }, []);

    const handleAddAircraftUnit = (aircraftUnitData) => {

        aircraftUnitData.aircraft = selectedAircraft?._id
        console.log(aircraftUnitData);

        setLoading(true);
        fetch('http://localhost:5000/api/v1/aircraftUnit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aircraftUnitData),
        })
            .then((response) => response.json())
            .then((data) => {
                setLoading(false);
                if (data.status === 'Success') {
                    getAllAircraftUnit();
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Aircraft Unit Added', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
            })
        setAddAircraft(false);
    }

    return (
        <div>
            <Toast ref={toast} />
            <div>
                <div className='bg-white shadow-md p-2 rounded-md'>
                    <div className='flex justify-between items-center'>
                        <div className='m-2 flex items-center gap-x-2'>
                            <h3 className='text-lg uppercase text-gray-700'>Manage Aircraft Unit</h3>
                            <Button onClick={() => setAddAircraft(true)} icon="pi pi-plus" size='small' text aria-label='Add' />
                        </div>

                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                        </IconField>
                    </div>
                    {/* <UserTable users={users} filters={filters} getAllUser={getAllUser} /> */}
                    <AircraftUnitTable allAircraftUnit={allAircraftUnit} filters={filters} getAllAircraftUnit={getAllAircraftUnit} />
                </div>

                {/* Create aircraft unit dialog  */}
                <Dialog header="Add Aircraft Unit" visible={addAircraft} onHide={() => { setAddAircraft(false); setSelectedAircraft(null); reset() }}
                    style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <form onSubmit={handleSubmit(handleAddAircraftUnit)} className="flex flex-col gap-2 mt-4">
                        <div className='w-full'>
                            <Dropdown
                                {...register("aircraft", { required: "Aircraft model is required" })}
                                value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.value)} options={allAircraft} optionLabel="aircraftName"
                                placeholder="Select Aircraft Model" size="small" className="w-full p-dropdown-sm" />
                            {errors.aircraft?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraft.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("regNo", { required: "Registration No. required" })}
                                placeholder="Registration No.*" className='w-full border p-1' />
                            {errors.regNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.regNo.message}</span>}
                        </div>
                        <div className='w-full'>
                            <InputText
                                {...register("serialNo", { required: "Serial No. is required" })}
                                placeholder="Serial No*" className='w-full border p-1' />
                            {errors.serialNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.serialNo.message}</span>}
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

export default ManageAircraft;