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
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { getLoggedInUser } from '../../../../lib/User';

const Aircraft = ({ params: { id } }) => {

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

    const [aircraft, setAircraft] = useState(null);
    const [addStock, setAddStock] = useState(false);
    const [editStock, setEditStock] = useState(false);
    const [date, setDate] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [deleteStock, setDeleteStock] = useState(false);
    const [image, setImage] = useState(null);
    const [cards, setCards] = useState([])
    const [selectedCard, setSelectedCard] = useState(null)

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

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
        console.log(data);
        setAircraft(data?.data[0]);
    }

    const getAllCards = async () => {
        fetch(`http://localhost:5000/api/v1/cardInfo?aircraftId=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                if (data.status === 'Success') {
                    setCards(data?.data);
                }
            })
    }

    useEffect(() => {
        if (id) {
            getAircraftData(id)
        }
        getAllCards()
        getUser()
    }, [id])


    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleAddNewStock = async (stockData) => {
        stockData.aircraftId = aircraft?._id
        stockData.stockNo = selectedCard?.stockNo[0][0];
        stockData.nomenclature = selectedCard?.nomenclature

        const stockPhoto = new FormData();
        stockPhoto.append('image', image);

        // Upload the image first
        const uploadResponse = await fetch('http://localhost:5000/api/v1/upload', {
            method: 'POST',
            body: stockPhoto
        });

        const uploadData = await uploadResponse.json();


        if (uploadData.status === 'Success') {
            console.log("image uploaded and db inserting");
            // Add the uploaded image path to the stock data
            stockData.image = uploadData.filePath;

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

        // console.log("Add New Stock", stockData);
        // console.log(selectedCard);
        // await fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
        //     method: 'POST',
        //     body: stockPhoto
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log("inside imgbb api: ", data);

        //         if (data?.data?.url) {
        //             stockData.image = data.data.url
        //             fetch('http://localhost:5000/api/v1/stock', {
        //                 method: 'POST',
        //                 headers: {
        //                     'content-type': 'application/json',
        //                     // 'Authorization': `Bearer ${cookie.get('TOKEN')}`
        //                 },
        //                 body: JSON.stringify(stockData)
        //             })
        //                 .then(res => res.json())
        //                 .then(data => {
        //                     console.log(data);
        //                     if (data.status == 'Success') {
        //                         getAircraftData(id);
        //                         toast.current.show({ severity: 'success', summary: 'Success', detail: 'New Stock Added Successfully', life: 3000 });
        //                     }
        //                     else {
        //                         toast.current.show({ severity: 'error', summary: 'Failed!', detail: data?.error, life: 3000 });
        //                     }
        //                 })
        //         }
        //         else {
        //             toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Image Upload Failed', life: 3000 });
        //         }

        //     })
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
            <Dialog header="Add New Stock" visible={addStock} onHide={() => { setAddStock(false); setSelectedUnit(null); setSelectedCard(null); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleAddNewStock)} className="flex flex-col gap-2 mt-4">

                    {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
                    <div className='w-full'>
                        <p className='text-lg text-gray-700'>Aircraft Name: <span>{aircraft?.aircraftName}</span></p>
                    </div>
                    {/* <div className='w-full'>
                        <InputText
                            {...register("cardNo", { required: "Card No. is required" })}
                            placeholder="Card No.*" className='w-full p-inputtext-sm' />
                        {errors.cardNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.cardNo.message}</span>}
                    </div> */}
                    <div className='w-full'>
                        <Dropdown
                            {...register("cardNo", { required: "Card No. is required" })}
                            value={selectedCard} onChange={(e) => setSelectedCard(e.value)} options={aircraft?.cardInfo} optionLabel="cardNo"
                            placeholder="Select a Card" size="small" className="w-full p-dropdown-sm" />
                        {errors.cardNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.cardNo.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("stockNo")}
                            placeholder="Stock/Parts No.*" value={selectedCard?.stockNo} className='w-full p-inputtext-sm' />
                        {/* {errors.stockNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.stockNo.message}</span>} */}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("nomenclature")}
                            placeholder="Nomenclature*" value={selectedCard?.nomenclature} className='w-full p-inputtext-sm' />
                        {/* {errors.nomenclature?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.nomenclature.message}</span>} */}
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
                            {...register("minimumQuantity", { required: "Minimum Qty. is required" })}
                            placeholder="Minimum Qty.*" type='number' className='w-full p-inputtext-sm' />
                        {errors.minimumQuantity?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.minimumQuantity.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("location")}
                            placeholder="Location" className='w-full p-inputtext-sm' />
                    </div>
                    <Controller
                        name="issuedAt"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                // value={date}
                                dateFormat='dd-mm-yy'
                                onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                placeholder='Issue date'
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

export default Aircraft;