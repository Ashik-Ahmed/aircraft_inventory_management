'use client'

import Link from 'next/link';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import React, { useState } from 'react';

const page = ({ params: { id } }) => {

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cardNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        nomenclature: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        stockNo: { value: null, matchMode: FilterMatchMode.IN },
        uploadStatus: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

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

    return (
        <div>
            <div className='border shadow-md p-2 bg-white rounded-md'>
                <p className='text-xl font-bold'>Aircraft {id}</p>
            </div>
            <div className='border shadow-md p-2 bg-white rounded-md mt-2 w-ful'>
                <div className="flex justify-content-end m-2">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='pl-8' />
                    </IconField>
                </div>
                <DataTable value={itemList} size='small' paginator rows={10} rowsPerPageOptions={[5, 10, 20]} globalFilterFields={['cardNo', 'nomenclature', 'stockNo', 'uploadStatus']}>
                    <Column field="cardNo" header="Card No"></Column>
                    <Column body={nomenclatureBodyTemplate} header="Nomenclature"></Column>
                    <Column field="stockNo" header="Stock/Parts No"></Column>
                    <Column field="quantity" header="Quantity"></Column>
                    <Column field="expiredDate" header="Latest Expire"></Column>
                    <Column body={statusBodyTemplate} header="Status"></Column>
                    <Column field="uploadStatus" header="Upload Status"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default page;