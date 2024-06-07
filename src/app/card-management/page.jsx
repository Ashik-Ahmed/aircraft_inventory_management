"use client"

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getAllAircraft } from '../../../lib/Aircraft';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { getLoggedInUser } from '../../../lib/User';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FilterMatchMode } from 'primereact/api';
import CardManagementTable from '../components/CardManagementTable/CardManagementTable';

const CardManagement = () => {

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

    const [cards, setCards] = useState([]);
    const [addCard, setAddCard] = useState(false);
    const [aircraft, setAircraft] = useState(null)
    const [selectedAircraft, setSelectedAircraft] = useState(null);
    const [filterAircraftOptions, setFilterAircraftOptions] = useState([]);
    const [filterAircraft, setFilterAircraft] = useState(null);
    const [loading, setLoading] = useState(false);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        aircraft: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cardNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stockNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nomenclature: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getAllAircraftData = async () => {
        console.log("inside all aircraft");
        const aircraftData = await getAllAircraft();
        // console.log(aircraftData);
        setAircraft(aircraftData?.data)

        if (aircraftData?.data) {
            aircraftData?.data.unshift({ _id: "", aircraftName: "All" })
            setFilterAircraftOptions(aircraftData?.data)
        }
    }

    const getAllCardInfo = async () => {
        fetch(`http://localhost:5000/api/v1/cardInfo?aircraftId=${filterAircraft?._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'Success') {
                    setCards(data?.data);
                }
            })
    }

    useEffect(() => {
        getAllCardInfo();
        getAllAircraftData();
        getUser()
    }, [filterAircraft]);

    const cardData = cards?.map((item, index) => {
        return {
            serial: index + 1, // Add serial number property starting from 1
            ...item
        };
    });

    const handleAddCard = (data) => {
        console.log(data);
        data.aircraft = selectedAircraft?._id
        console.log(data);
        setLoading(true);
        fetch('http://localhost:5000/api/v1/cardInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status === 'Success') {
                    getAllCardInfo();
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Card Added', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
                }
            })

        setLoading(false);
        setAddCard(false);
        setSelectedAircraft(null);
        reset();
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='p-1 bg-white rounded-md shadow-md'>
                <div className='flex items-center justify-between'>
                    <div className='m-2 flex items-center gap-x-2'>
                        <h3 className='text-lg uppercase text-gray-700'>Manage Cards</h3>
                        <Button onClick={() => setAddCard(true)} icon="pi pi-plus" severity='Success' size='small' text />
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <div>
                            <Dropdown value={filterAircraft} onChange={(e) => setFilterAircraft(e.value)} options={filterAircraftOptions} optionLabel="aircraftName" placeholder=" Select Aircraft" size="small" className="w-full p-dropdown-sm" />
                        </div>
                        <div>
                            <IconField iconPosition="left">
                                <InputIcon className="pi pi-search" />
                                <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                            </IconField>
                        </div>
                    </div>
                </div>
                <CardManagementTable cardData={cardData} filters={filters} aircraft={aircraft} getAllCardInfo={getAllCardInfo} />
            </div>

            {/* Create Card dialog  */}
            <Dialog header="Add New Card" visible={addCard} onHide={() => { setAddCard(false); setSelectedAircraft(null); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleAddCard)} className="flex flex-col gap-2 mt-4">
                    <div className='w-full'>
                        <Dropdown
                            {...register("aircraft")}
                            value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.value)} options={aircraft} optionLabel="aircraftName"
                            placeholder="Select Aircraft" size="small" className="w-full p-dropdown-sm" />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("cardNo", { required: "Card No. is required" })}
                            placeholder="Card No.*" className='w-full border p-1' />
                        {errors.cardNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.cardNo.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("nomenclature", { required: "Nomenclature is required" })}
                            placeholder="Nomenclature*" className='w-full border p-1' />
                        {errors.nomenclature?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.nomenclature.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("stockNo", { required: "Stock No. is required" })}
                            placeholder="Stock No.*" className='w-full border p-1' />
                        {errors.stockNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.stockNo.message}</span>}
                    </div>
                    <div>
                        <Button type="submit" label="Submit" className="text-white w-fit p-1" loading={loading}></Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default CardManagement;