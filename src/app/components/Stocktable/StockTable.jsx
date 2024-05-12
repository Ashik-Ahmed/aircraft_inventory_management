"use client"

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { deleteStockById } from '../../../../lib/Aircraft';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import Link from 'next/link';
import { FilterMatchMode } from 'primereact/api';

const StockTable = ({ aircraft, id, getAircraftData }) => {

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [editStock, setEditStock] = useState(false);
    const [deleteStock, setDeleteStock] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cardNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nomenclature: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stockNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const handleUpdateStock = (updatedStockData) => {
        console.log("Update Stock", updatedStockData);
        setEditStock(false);
        setSelectedUnit(null);
        reset();
    }

    const handleDeleteStock = async (data) => {
        console.log("Delete Stock", data?._id);
        const deleteStock = await deleteStockById(data?._id);
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

    const statusBodyTemplate = (rowData) => {
        return (
            <span className={`text-white p-1 rounded ${rowData.status === 'Sufficient' ? 'bg-green-400' : 'bg-red-400'}`}>{rowData.status}</span>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setEditStock(rowData)} icon="pi pi-pencil" size='small' severity='success' />
                <Button onClick={() => setDeleteStock(rowData)} icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }

    return (
        <div>

            <div className='border shadow-md bg-white rounded-md mt-2 w-ful min-h-[90vh]'>
                <div className="flex justify-between m-2 items-center">
                    <div>
                        <p className='text-lg text-gray-700 uppercase'>Available Stocks</p>
                    </div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                    </IconField>
                </div>
                <DataTable value={aircraft?.stocks} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['cardNo', 'nomenclature', 'stockNo', 'uploadStatus']} emptyMessage="No available stocks">
                    <Column field="cardNo" header="Card No"></Column>
                    <Column body={nomenclatureBodyTemplate} header="Nomenclature" sortable sortField='nomenclature'></Column>
                    <Column field="stockNo" header="Stock/Parts No"></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column field="expiredDate" header="Latest Expire" sortable></Column>
                    <Column body={statusBodyTemplate} header="Status"></Column>
                    {/* <Column field="uploadStatus" header="Upload Status"></Column> */}
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            {/* Edit Stock Dialog  */}
            <Dialog header="Update Stock" visible={editStock} onHide={() => { setEditStock(false); setSelectedUnit(null); }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleUpdateStock)} className="flex flex-col gap-2 mt-4">

                    {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
                    <div className='w-full'>
                        <p className='text-lg text-gray-700'>Aircraft Name: <span>{aircraft?.aircraftName}</span></p>
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("cardNo")}
                            placeholder={editStock?.cardNo || "Card No.*"} className='w-full p-inputtext-sm' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("stockNo")}
                            placeholder={editStock?.stockNo || "Stock/Parts No.*"} className='w-full p-inputtext-sm' />
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("unit")}
                            value={selectedUnit} onChange={(e) => setSelectedUnit(e.value)} options={units} optionLabel="name"
                            placeholder={editStock?.unit || "Select a Unit"} size="small" className="w-full p-dropdown-sm" />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("nomenclature")}
                            placeholder={editStock?.nomenclature || "Nomenclature*"} className='w-full p-inputtext-sm' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("location")}
                            placeholder={editStock?.location || "Location"} className='w-full p-inputtext-sm' />
                    </div>
                    <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                            <Calendar
                                // value={date}
                                onChange={(e) => { setDate(e.value); field.onChange(e.value) }}
                                placeholder={editStock?.date || 'Date'}
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