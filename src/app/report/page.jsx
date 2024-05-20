"use client"
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import React, { useEffect, useState } from 'react';
import { formatDate, getDateDifference } from '../../../utils/dateFunctionality';
import { Dropdown } from 'primereact/dropdown';
import { getAllAircraft } from '../../../lib/Aircraft';
import { exportStockReport } from '../../../utils/ExportPDF';
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';

const Report = () => {


    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [allAircraft, setAllAircraft] = useState([]);
    const [selectedAircraft, setSelectedAircraft] = useState(null);
    const [stockReport, setStockReport] = useState(null);
    const [expiryFilter, setExpiryFilter] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

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
        console.log('Expiry Filter', expiryFilter);

        fetch(`http://localhost:5000/api/v1/stock?aircraftId=${aircraftId}&expiryFilter=${expiryFilter}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setStockReport(data?.data);
            })

    }

    const getAllAircraftData = async () => {
        const dummyAircraft = { aircraftName: "All", _id: "" }
        const allAircraft = await getAllAircraft()
        console.log(allAircraft?.data);
        if (allAircraft?.data) {
            allAircraft?.data.unshift(dummyAircraft);
        }
        setAllAircraft(allAircraft?.data);
    }

    const handleExportStockReport = (stockReport) => {

        const stockDetailsReportData = {
            aircraft: selectedAircraft?.aircraftName || "All Aircraft",
            expiryFilter: expiryFilter,
            stockReport: stockReport
        }

        exportStockReport(stockDetailsReportData);

    }

    useEffect(() => {
        getAllAircraftData();
        getStockDetailsReport(selectedAircraft?._id);
    }, [selectedAircraft, expiryFilter]);

    const latestExpiryBodyTemplate = (rowData) => {
        return (
            rowData?.latestExpiry ? <p>{formatDate(rowData?.latestExpiry)}</p> : 'N/A'
        )
    }
    const receivedBodyTemplate = (rowData) => {
        return (
            rowData?.stockHistory?.map((stock) => stock?.actionStatus == 'Received' ? <p key={stock?._id} className={getDateDifference(new Date(), new Date(stock?.expiryDate)) < 90 && 'text-white rounded bg-red-400'}> {stock?.quantity}X{formatDate(stock?.createdAt)}</ p > : null)
        )
    }
    const expenditureBodyTemplate = (rowData) => {
        return (
            rowData?.stockHistory?.map((stock) => stock?.actionStatus == 'Expenditure' ? <p key={stock?._id}>{stock?.quantity}X{formatDate(stock?.createdAt)}</p> : null)
        )
    }

    return (
        <div>
            <div>
                <div className='w-1/3 mb-2'>
                    <Dropdown value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.value)} options={allAircraft} optionLabel="aircraftName" placeholder="Select Aircraft" size="small" className="w-full p-dropdown-sm" />
                </div>
            </div>
            <div className='bg-white shadow-md p-2 rounded-md'>
                <div className='flex justify-between items-center'>
                    <div className='m-2 flex items-center gap-x-2'>
                        <h3 className='text-lg uppercase text-gray-700'>Stock Report</h3>
                        <Button onClick={() => handleExportStockReport(stockReport)} icon="pi pi-file-pdf" severity='danger' size='small' text aria-label='Export' />
                    </div>

                    <div className='flex gap-x-2 items-center'>

                        <div className='flex gap-x-2'>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        // value={date}
                                        onChange={(e) => { setStartDate(e.value); field.onChange(e.value) }}
                                        placeholder='Start date'
                                        className='w-full p-inputtext-sm'
                                    />
                                )}
                            />
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        // value={date}
                                        onChange={(e) => { setEndDate(e.value); field.onChange(e.value) }}
                                        placeholder='End date'
                                        className='w-full p-inputtext-sm'
                                    />
                                )}
                            />
                        </div>

                        <div>
                            <Dropdown value={expiryFilter} onChange={(e) => setExpiryFilter(e.value)} options={[{ label: 'All', value: '' }, { label: 'Expired', value: 'Expired' }, { label: 'Not Expired', value: 'Not Expired' }]} optionLabel="label" placeholder="Filter" size="small" className="w-full p-dropdown-sm" />
                        </div>

                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                        </IconField>
                    </div>
                </div>
                <DataTable value={stockReport} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['nomenclature', 'stockNo', 'unit', 'cardNo', 'quantity']} emptyMessage="No stock report">
                    {/* <Column field="" header="Ser No." sortable></Column> */}
                    <Column field="cardNo" header="Card No." sortable></Column>
                    <Column field="stockNo" header="Part No" sortable></Column>
                    <Column field="nomenclature" header="Nomenclature" sortable></Column>
                    <Column field="unit" header="A/U" sortable></Column>
                    <Column field="quantity" header="Qty Balance" sortable></Column>
                    <Column body={receivedBodyTemplate} header="Received & Dt"></Column>
                    <Column body={expenditureBodyTemplate} header="Expenditure & Dt"></Column>
                    <Column body={latestExpiryBodyTemplate} header="Latest Expiry" sortField='latestExpiry' sortable></Column>
                    {/* <Column body={expiryDateBodyTemplate} header="Expiry Date" sortField='expiryDate' sortable></Column>
                    <Column body={expiryStatusBodyTemplate} header="Expiry Status"></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column> */}
                </DataTable>
            </div>
        </div>
    );
};

export default Report;