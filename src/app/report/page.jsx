"use client"
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../utils/dateFunctionality';

const Report = () => {


    const [selectedAircraft, setSelectedAircraft] = useState(null);
    const [stockReport, setStockReport] = useState(null);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nomenclature: { value: null, matchMode: FilterMatchMode.CONTAINS },
        quantity: { value: null, matchMode: FilterMatchMode.CONTAINS },
        stockNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        cardNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        unit: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const getStockDetailsReport = (aircraftId) => {
        console.log('Selected Aircraft', aircraftId);

        fetch(`http://localhost:5000/api/v1/stock?aircraftId=${aircraftId}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setStockReport(data?.data);
            })

    }

    useEffect(() => {
        getStockDetailsReport(selectedAircraft?._id);
    }, [selectedAircraft]);

    const latestExpiryBodyTemplate = (rowData) => {
        return (
            rowData?.latestExpiry ? <p>{formatDate(rowData?.latestExpiry)}</p> : 'N/A'
        )
    }
    const receivedBodyTemplate = (rowData) => {
        return (
            rowData?.stockHistory?.map((stock) => stock?.actionStatus == 'Received' ? <p key={stock?._id}>{stock?.quantity}X{formatDate(stock?.createdAt)}</p> : null)
        )
    }
    const expenditureBodyTemplate = (rowData) => {
        return (
            rowData?.stockHistory?.map((stock) => stock?.actionStatus == 'Expenditure' ? <p key={stock?._id}>{stock?.quantity}X{formatDate(stock?.createdAt)}</p> : null)
        )
    }

    return (
        <div>
            <div className='bg-white shadow-md p-2 rounded-md'>
                <div className='flex justify-between items-center'>
                    <div className='m-2 flex items-center gap-x-2'>
                        <h3 className='text-lg uppercase text-gray-700'>Stock Report</h3>
                        {/* <Button onClick={() => setAddStockHistory(true)} icon="pi pi-plus" size='small' text aria-label='Add' /> */}
                    </div>

                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                    </IconField>
                </div>
                <DataTable value={stockReport} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['nomenclature', 'stockNo', 'unit', 'cardNo', 'quantity']} emptyMessage="No stock report">
                    <Column field="nomenclature" header="Nomenclature" sortable></Column>
                    <Column field="stockNo" header="Part No" sortable></Column>
                    <Column field="unit" header="A/U" sortable></Column>
                    <Column field="cardNo" header="Card No." sortable></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column body={latestExpiryBodyTemplate} header="Latest Expiry" sortField='latestExpiry' sortable></Column>
                    <Column body={receivedBodyTemplate} header="Received"></Column>
                    <Column body={expenditureBodyTemplate} header="Expenditure"></Column>
                    {/* <Column body={expiryDateBodyTemplate} header="Expiry Date" sortField='expiryDate' sortable></Column>
                    <Column body={expiryStatusBodyTemplate} header="Expiry Status"></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column> */}
                </DataTable>
            </div>
        </div>
    );
};

export default Report;