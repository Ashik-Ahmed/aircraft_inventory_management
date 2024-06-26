"use client"

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { deleteStockById } from '../../../../lib/Aircraft';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import Link from 'next/link';
import { FilterMatchMode } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { formatDate } from '../../../../utils/dateFunctionality';
import Cookies from 'universal-cookie';

const StockTable = ({ aircraft, id, getAircraftData }) => {
    console.log(aircraft);
    const cookie = new Cookies();

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [editStock, setEditStock] = useState(false);
    const [image, setImage] = useState(null);
    const [deleteStock, setDeleteStock] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null)
    const [date, setDate] = useState(null);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cardNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nomenclature: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stockNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        quantity: { value: null, matchMode: FilterMatchMode.CONTAINS },
        uploadStatus: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

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

    const stocksData = aircraft?.stocks?.map((item, index) => {
        return {
            serial: index + 1, // Add serial number property starting from 1
            ...item
        };
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handlePhotoChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleUpdateStock = async (data) => {

        if (selectedCard) {
            data.nomenclature = selectedCard?.nomenclature;
            data.stockNo = selectedCard?.stockNo[0][0];
        }

        const updatedStockData = Object.entries(data).reduce((acc, [key, value]) => {
            // Check for FileList instance and if it is not empty
            if (value instanceof FileList && value.length > 0) {
                acc[key] = value;
            }
            // Check for other non-empty, non-negative, non-null, non-undefined values
            else if (!(value instanceof FileList) && value !== undefined && value !== null && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});


        if (!image && (Object.keys(updatedStockData).length === 0 || !updatedStockData)) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No data to update', life: 3000 });
            return
        }

        console.log(updatedStockData);

        if (image) {
            const stockPhoto = new FormData();
            stockPhoto.append('image', image);

            // Upload the image first
            const uploadResponse = await fetch('http://localhost:5000/api/v1/upload', {
                method: 'POST',
                body: stockPhoto
            });
            console.log(uploadResponse);
            const uploadData = await uploadResponse.json();

            if (uploadData?.status === 'Success') {
                updatedStockData.image = uploadData.filePath;

                fetch(`http://localhost:5000/api/v1/stock/${editStock?._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookie.get('TOKEN')}`
                    },
                    body: JSON.stringify(updatedStockData),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status == 'Success') {
                            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock Updated Successfully', life: 3000 });
                        }
                        else {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
                        }
                        console.log(data);
                        getAircraftData(id);
                    })
            }
        }

        else {
            fetch(`http://localhost:5000/api/v1/stock/${editStock?._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookie.get('TOKEN')}`
                },
                body: JSON.stringify(updatedStockData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status == 'Success') {
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock Updated Successfully', life: 3000 });
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
                    }
                    console.log(data);
                    getAircraftData(id);
                })
        }
        setEditStock(false);
        setSelectedUnit(null);
        setSelectedCard(null);
        setImage(null);
        reset();
    }

    const handleDeleteStock = async (data) => {
        console.log("Delete Stock", data?._id);
        const deleteStock = await deleteStockById(data?._id, cookie.get('TOKEN'));
        if (deleteStock.status == 'Success') {
            getAircraftData(id);
            setDeleteStock(false);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock Deleted Successfully', life: 3000 });
        }
    }


    const nomenclatureBodyTemplate = (rowData) => {
        return (
            <Link href={`/aircraft/stock/${rowData?._id}`} className='hover:underline'>{rowData.nomenclature}</Link>
        );
    }

    const quantityBodyTemplate = (rowData) => {
        return (
            <p className={`${rowData?.quantity < rowData?.minimumQuantity && 'text-white bg-red-400 w-fit px-2 rounded-md'}`}>{rowData.quantity}</p>
        );
    }

    const latestExpiryBodyTemplate = (rowData) => {
        return (
            <p>{rowData?.latestExpiry ? formatDate(rowData?.latestExpiry) : '--'}</p>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <p>{rowData?.quantity >= rowData?.minimumQuantity ? <span className='text-white p-1 rounded bg-green-400'>Sufficient</span> : <span className='text-white p-1 rounded bg-red-400'>Low</span>}</p>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setEditStock(rowData)} label='Edit' icon="pi pi-pencil" size='small' severity='success' />
                <Button onClick={() => setDeleteStock(rowData)} label='Delete' icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='border shadow bg-white rounded-md mt-2 w-ful min-h-[90vh]'>
                <div className="flex justify-between m-2 items-center">
                    <div>
                        <p className='text-lg text-gray-700 uppercase'>Available Stocks</p>
                    </div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                    </IconField>
                </div>
                <DataTable value={stocksData} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['cardNo', 'nomenclature', 'stockNo', 'uploadStatus', 'quantity']} emptyMessage="No available stocks">
                    <Column field="serial" header="Ser. No."></Column>
                    <Column field="cardNo" header="Card No" sortable></Column>
                    <Column body={nomenclatureBodyTemplate} header="Nomenclature" sortable sortField='nomenclature'></Column>
                    <Column field="stockNo" header="Stock/Parts No"></Column>
                    <Column body={quantityBodyTemplate} header="Quantity" sortable sortField='quantity'></Column>
                    <Column body={latestExpiryBodyTemplate} header="Latest Expire" sortField='latestExpiry' sortable></Column>
                    <Column body={statusBodyTemplate} header="Status"></Column>
                    {/* <Column field="uploadStatus" header="Upload Status"></Column> */}
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            {/* Edit Stock Dialog  */}
            <Dialog header="Update Stock" visible={editStock} onHide={() => { setEditStock(false); setSelectedUnit(null); setSelectedCard(null); setImage(null); reset(); }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleUpdateStock)} className="flex flex-col gap-2 mt-4">

                    {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
                    <div className='w-full'>
                        <p className='text-lg text-gray-700'>Aircraft Name: <span>{aircraft?.aircraftName}</span></p>
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("cardNo")}
                            value={selectedCard} onChange={(e) => setSelectedCard(e.value)} options={aircraft?.cardInfo} optionLabel="cardNo"
                            placeholder={editStock?.cardNo || "Select a Card"} size="small" className="w-full p-dropdown-sm" />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("stockNo")}
                            value={selectedCard?.stockNo}
                            placeholder={editStock?.stockNo || "Stock/Parts No.*"}
                            className='w-full p-inputtext-sm'
                            disabled />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("nomenclature")}
                            value={selectedCard?.nomenclature}
                            placeholder={editStock?.nomenclature || "Nomenclature*"}
                            className='w-full p-inputtext-sm'
                            disabled />
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("unit")}
                            value={selectedUnit} onChange={(e) => setSelectedUnit(e.value)} options={units} optionLabel="name"
                            placeholder={editStock?.unit || "Select a Unit"} size="small" className="w-full p-dropdown-sm" />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("minimumQuantity")}
                            placeholder={editStock?.minimumQuantity || "Minimum Qty.*"} type='number' className='w-full p-inputtext-sm' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("location")}
                            placeholder={editStock?.location || "Location"} className='w-full p-inputtext-sm' />
                    </div>
                    <Controller
                        name="issuedAt"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                // value={date}
                                dateFormat='dd-mm-yy'
                                onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                placeholder={editStock?.issuedAt ? formatDate(editStock?.issuedAt) : 'Issue date'}
                                className='w-full p-inputtext-sm'
                            />
                        )}
                    />
                    <div className='mt-2'>
                        <input
                            {...register("image")}
                            onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                    </div>

                    <div>
                        <Button type="submit" label="Submit" size='small'></Button>
                    </div>
                </form>
            </Dialog>

            {/* Delete Stock Dialog  */}
            <Dialog header="Delete Stock" visible={deleteStock} onHide={() => setDeleteStock(false)}>
                <div className="flex flex-col gap-2">
                    <i className="pi pi-trash rounded-full mx-auto text-red-500 p-2 shadow-lg shadow-red-300" style={{ fontSize: '3rem' }}></i>
                    <p className='text-lg text-gray-700'>Are you sure you want to delete <span className='text-lg font-semibold'>{deleteStock?.nomenclature}</span>?</p>
                    <div className='flex justify-end gap-2 mt-4'>
                        <Button label="Delete" severity='danger' size='small' onClick={() => handleDeleteStock(deleteStock)} />
                        {/* <Button label="No" icon="pi pi-times" severity='secondary' size='small' onClick={() => setDeleteStock(false)} /> */}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default StockTable;