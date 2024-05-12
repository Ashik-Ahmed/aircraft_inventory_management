"use client"

import React, { useEffect, useState } from 'react';
import { getStockDetailsById } from '../../../../../lib/Aircraft';
import Image from 'next/image';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';

const page = ({ params: { stockId } }) => {

    const [stock, setStock] = useState(null);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        date: { value: null, matchMode: FilterMatchMode.CONTAINS },
        quantity: { value: null, matchMode: FilterMatchMode.CONTAINS },
        voucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        actionStatus: { value: null, matchMode: FilterMatchMode.CONTAINS },
        expiryDate: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getStockDetails = async (id) => {
        const data = await getStockDetailsById(id);
        console.log(data);
        setStock(data?.data);
    }

    useEffect(() => {
        getStockDetails(stockId)
    }, [stockId])

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
            <div className='flex justify-between p-4 border shadow-md bg-white rounded-md'>
                <div className='text-lg'>
                    <p>Aircraft Name: {stock?.aircraftId?.aircraftName || 'N/A'}</p>
                    <p>Stock Name: {stock?.nomenclature || 'N/A'}</p>
                    <p>Card No.: {stock?.cardNo || 'N/A'}</p>
                    <p>Stock/Part No.: {stock?.stockNo || 'N/A'}</p>
                    <p>Unit: {stock?.unit || 'N/A'}</p>
                    <p>Location: {stock?.location || 'N/A'}</p>
                </div>
                <div className='border bg-white rounded-md'>
                    <Image src={stock?.image} alt={stock?.imageAlt || 'Stock Image'} width={300} height={300} className='rounded-md' />
                </div>
            </div>

            <div className='bg-white mt-4 shadow-md p-2'>
                <div className='m-2'>
                    <h3 className='text-lg uppercase text-gray-700'>Stock History</h3>
                </div>
                <DataTable value={stock?.stockHistory} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['date', 'quantity', 'voucherNo', 'actionStatus', 'expiryDate']} emptyMessage="No available stocks">
                    <Column field="date" header="Date" sortable></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column field="voucherNo" header="Voucher No" sortable></Column>
                    <Column field="actionStatus" header="Action" sortable></Column>
                    <Column field='expiryDate' header="Expiry Date" sortable></Column>
                    {/* <Column field="uploadStatus" header="Upload Status"></Column> */}
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default page;