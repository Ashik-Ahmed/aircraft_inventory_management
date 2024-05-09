'use client'

import Link from 'next/link';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const page = ({ params: { id } }) => {

    const [addStock, setAddStock] = useState(false);
    const [editStock, setEditStock] = useState(false);
    const [date, setDate] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState(null);


    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cardNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nomenclature: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stockNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        uploadStatus: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });


    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const itemList = [
        { _id: '1', cardNo: 'LP/01', nomenclature: 'Aerocell liquid', stockNo: '20MMM2024', quantity: 2000, expiredDate: '2024-12-22', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '2', cardNo: 'LP/02', nomenclature: 'Lubricant liquid', stockNo: '12XT2024', quantity: 80, expiredDate: '2025-12-01', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '3', cardNo: 'LP/04', nomenclature: 'Bearing ', stockNo: '31MWMM2024', quantity: 150, expiredDate: '2026-04-18', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '4', cardNo: 'LP/05', nomenclature: 'Electric wire', stockNo: 'NN12M2024', quantity: 500, expiredDate: '2023-05-26', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '5', cardNo: 'LP/06', nomenclature: 'Gear Box', stockNo: '20MMM2024', quantity: 30, expiredDate: '2025-01-15', status: 'Low', uploadStatus: 'Uploaded' },
        { _id: '6', cardNo: 'LP/07', nomenclature: 'Compression Gas Spring', stockNo: '923M2024', quantity: 60, expiredDate: '2024-12-22', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '7', cardNo: 'LP/08', nomenclature: 'Gas Spring for Diamond', stockNo: '2HYMM2024', quantity: 18, expiredDate: '2024-07-15', status: 'Low', uploadStatus: 'Uploaded' },
        { _id: '8', cardNo: 'LP/09', nomenclature: 'Screw', stockNo: '20MMM2024', quantity: 1000, expiredDate: '2024-03-14', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '9', cardNo: 'LP/10', nomenclature: 'Cup, Retainer', stockNo: '9Hb3M2024', quantity: 50, expiredDate: '2024-08-12', status: 'Sufficient', uploadStatus: 'Uploaded' },
        { _id: '10', cardNo: 'LP/11', nomenclature: 'Antenna Guide', stockNo: '8TBH12024', quantity: 20, expiredDate: '2024-12-22', status: 'Low', uploadStatus: 'Uploaded' },
        { _id: '11', cardNo: 'LP/12', nomenclature: 'HEAD SET', stockNo: '86S9M2024', quantity: 120, expiredDate: '2024-05-30', status: 'Sufficient', uploadStatus: 'Uploaded' },
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

    const nomenclatureBodyTemplate = (rowData) => {
        return (
            <Link href={`/aircraft/${id}/stock/${rowData?._id}`} className='hover:underline'>{rowData.nomenclature}</Link>
        );
    }

    const statusBodyTemplate = (rowData) => {
        return (
            <span className={`text-white p-1 rounded ${rowData.status === 'Sufficient' ? 'bg-green-400' : 'bg-red-400'}`}>{rowData.status}</span>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button icon="pi pi-pencil" size='small' severity='success' />
                <Button icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }

    const handleAddNewStock = (data) => {
        console.log("Add New Stock", data);
        setAddStock(false);
        setSelectedUnit(null);
        reset();
    }

    return (
        <div>
            <div className='flex justify-between items-center border shadow-md p-2 bg-white rounded-md'>
                <p className='text-xl font-bold'>Aircraft {id}</p>
                <Button label="Add Stock" icon="pi pi-plus" size='small' onClick={() => setAddStock(true)} />
            </div>
            <div className='border shadow-md bg-white rounded-md mt-2 w-ful min-h-[90vh]'>
                <div className="flex justify-between m-2 items-center">
                    <div>
                        <p className='text-lg text-gray-700 uppercase'>Available Stocks</p>
                    </div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                    </IconField>
                </div>
                <DataTable value={itemList} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['cardNo', 'nomenclature', 'stockNo', 'uploadStatus']} responsiveLayout="scroll">
                    <Column field="cardNo" header="Card No"></Column>
                    <Column body={nomenclatureBodyTemplate} header="Nomenclature" sortable sortField='nomenclature'></Column>
                    <Column field="stockNo" header="Stock/Parts No"></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column field="expiredDate" header="Latest Expire" sortable></Column>
                    <Column body={statusBodyTemplate} header="Status"></Column>
                    <Column field="uploadStatus" header="Upload Status"></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            <Dialog header="Add New Stock" visible={addStock} onHide={() => { setAddStock(false); setSelectedUnit(null); }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleAddNewStock)} className="flex flex-col gap-2 mt-4">

                    {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
                    <div className='w-full'>
                        <p className='text-lg text-gray-700'>Aircraft Name: <span>{id}</span></p>
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("cardNo", { required: "Card No. is required" })}
                            placeholder="Card No.*" className='w-full border p-1' />
                        {errors.cardNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.cardNo.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("stockNo", { required: "Stock/Parts No. is required" })}
                            placeholder="Stock/Parts No.*" className='w-full border p-1' />
                        {errors.stockNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.stockNo.message}</span>}
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("unit", { required: "Unit is required" })}
                            value={selectedUnit} onChange={(e) => setSelectedUnit(e.value)} options={units} optionLabel="name"
                            placeholder="Select a Unit" className="w-full border" />
                        {errors.unit?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.unit.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("nomenclature", { required: "Nomenclature is required" })}
                            placeholder="Nomenclature*" className='w-full border p-1' />
                        {errors.nomenclature?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.nomenclature.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("location")}
                            placeholder="Location" className='w-full border p-1' />
                    </div>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                // value={date}
                                onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                placeholder='Date'
                                className='w-full border p-1'
                            />
                        )}
                    />
                    {/* <div className='mt-2'>
                        <input
                            {...register("aircraftPhoto", { required: "Photo is required" })}
                            onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
                        {errors.aircraftPhoto?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraftPhoto.message}</span>}
                    </div> */}

                    <div>
                        <Button type="submit" label="Submit" className="bg-blue-400 text-white w-fit p-1"></Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default page;