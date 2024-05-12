'use client'

import Link from 'next/link';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { deleteStockById, getStocksByAircraftId } from '../../../../lib/Aircraft';
import { Toast } from 'primereact/toast';
import StockTable from '@/app/components/Stocktable/StockTable';

const page = ({ params: { id } }) => {

    const toast = useRef(null);

    const [aircraft, setAircraft] = useState(null);
    const [addStock, setAddStock] = useState(false);
    const [editStock, setEditStock] = useState(false);
    const [date, setDate] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [deleteStock, setDeleteStock] = useState(false);
    const [image, setImage] = useState(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();


    const itemList = [
        { _id: '1', cardNo: 'LP/01', nomenclature: 'Aerocell liquid', stockNo: '20MMM2024', unit: 'Litre', quantity: 2000, expiredDate: '2024-12-22', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '2', cardNo: 'LP/02', nomenclature: 'Lubricant liquid', stockNo: '12XT2024', unit: 'Litre', quantity: 80, expiredDate: '2025-12-01', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '3', cardNo: 'LP/04', nomenclature: 'Bearing ', stockNo: '31MWMM2024', unit: 'Pcs', quantity: 150, expiredDate: '2026-04-18', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '4', cardNo: 'LP/05', nomenclature: 'Electric wire', stockNo: 'NN12M2024', unit: 'Meter', quantity: 500, expiredDate: '2023-05-26', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '5', cardNo: 'LP/06', nomenclature: 'Gear Box', stockNo: '20MMM2024', unit: 'Set', quantity: 30, expiredDate: '2025-01-15', status: 'Low', uploadStatus: 'Uploaded' },
        { _id: '6', cardNo: 'LP/07', nomenclature: 'Compression Gas Spring', stockNo: '923M2024', unit: 'No.', quantity: 60, expiredDate: '2024-12-22', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '7', cardNo: 'LP/08', nomenclature: 'Gas Spring for Diamond', stockNo: '2HYMM2024', unit: 'No.', quantity: 18, expiredDate: '2024-07-15', status: 'Low', uploadStatus: 'Uploaded' },
        { _id: '8', cardNo: 'LP/09', nomenclature: 'Screw', stockNo: '20MMM2024', unit: 'Pcs', quantity: 1000, expiredDate: '2024-03-14', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '9', cardNo: 'LP/10', nomenclature: 'Cup, Retainer', stockNo: '9Hb3M2024', unit: 'Pcs', quantity: 50, expiredDate: '2024-08-12', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '10', cardNo: 'LP/11', nomenclature: 'Antenna Guide', stockNo: '8TBH12024', unit: 'Pcs', quantity: 20, expiredDate: '2024-12-22', status: 'Low', uploadStatus: 'Uploaded' },
        { _id: '11', cardNo: 'LP/12', nomenclature: 'HEAD SET', stockNo: '86S9M2024', unit: 'Pcs', quantity: 120, expiredDate: '2024-05-30', status: 'Sufficient', uploadStatus: 'Uploaded' },
    ]

    const units = [
        { name: 'No.' },
        { name: 'Pcs' },
        { name: 'Kg' },
        { name: 'Box' },
        { name: 'Litre' },
        { name: 'Meter' },
        { name: 'Set' },
        { name: 'Ea' },
    ]

    const getAircraftData = async (id) => {
        const data = await getStocksByAircraftId(id);
        console.log(data?.data[0]);
        setAircraft(data?.data[0]);
    }

    useEffect(() => {
        if (id) {
            getAircraftData(id)
        }
    }, [id])


    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleAddNewStock = async (stockData) => {
        console.log("Add New Stock", stockData);
        stockData.aircraftId = aircraft?._id
        const stockPhoto = new FormData();
        stockPhoto.append('image', image);
        await fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
            method: 'POST',
            body: stockPhoto
        })
            .then(res => res.json())
            .then(data => {
                console.log("inside imgbb api: ", data);

                if (data?.data?.url) {
                    stockData.image = data.data.url
                    fetch('http://localhost:5000/api/v1/stock', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            // 'Authorization': `Bearer ${cookie.get('TOKEN')}`
                        },
                        body: JSON.stringify(stockData)
                    })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            if (data.status == 'Success') {
                                getAircraftData(id);
                                toast.current.show({ severity: 'success', summary: 'Success', detail: 'New Stock Added Successfully', life: 3000 });
                            }
                            else {
                                toast.current.show({ severity: 'error', summary: 'Failed!', detail: data?.error, life: 3000 });
                            }
                        })
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Image Upload Failed', life: 3000 });
                }

            })
        setAddStock(false);
        setSelectedUnit(null);
        reset();
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='flex justify-between items-center border shadow-md p-2 bg-white rounded-md'>
                <p className='text-xl font-bold'>Aircraft: {aircraft?.aircraftName}</p>
                <Button label="Add Stock" icon="pi pi-plus" size='small' onClick={() => setAddStock(true)} />
            </div>

            <StockTable aircraft={aircraft} id={id} getAircraftData={getAircraftData} />

            {/* Add New Stock Dialog  */}
            <Dialog header="Add New Stock" visible={addStock} onHide={() => { setAddStock(false); setSelectedUnit(null); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleAddNewStock)} className="flex flex-col gap-2 mt-4">

                    {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
                    <div className='w-full'>
                        <p className='text-lg text-gray-700'>Aircraft Name: <span>{aircraft?.aircraftName}</span></p>
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("cardNo", { required: "Card No. is required" })}
                            placeholder="Card No.*" className='w-full p-inputtext-sm' />
                        {errors.cardNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.cardNo.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("stockNo", { required: "Stock/Parts No. is required" })}
                            placeholder="Stock/Parts No.*" className='w-full p-inputtext-sm' />
                        {errors.stockNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.stockNo.message}</span>}
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("unit", { required: "Unit is required" })}
                            value={selectedUnit} onChange={(e) => setSelectedUnit(e.value)} options={units} optionLabel="name"
                            placeholder="Select a Unit" size="small" className="w-full p-dropdown-sm" />
                        {errors.unit?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.unit.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("nomenclature", { required: "Nomenclature is required" })}
                            placeholder="Nomenclature*" className='w-full p-inputtext-sm' />
                        {errors.nomenclature?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.nomenclature.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("location")}
                            placeholder="Location" className='w-full p-inputtext-sm' />
                    </div>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                // value={date}
                                onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                placeholder='Date'
                                className='w-full p-inputtext-sm'
                            />
                        )}
                    />
                    {/* <div className='mt-2'>
                        <input
                            {...register("aircraftPhoto", { required: "Photo is required" })}
                            onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                        {errors.aircraftPhoto?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraftPhoto.message}</span>}
                    </div> */}


                    <div className='mt-2'>
                        <input
                            {...register("image", { required: "Photo is required" })}
                            onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                        {errors.image?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.image.message}</span>}
                    </div>

                    <div>
                        <Button type="submit" label="Submit" size='small'></Button>
                    </div>
                </form>
            </Dialog>



        </div>
    );
};

export default page;