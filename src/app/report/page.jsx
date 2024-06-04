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
import { Dialog } from 'primereact/dialog';
import ReportExportDialog from '../components/ReportExportDialog/ReportExportDialog';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { getLoggedInUser } from '../../../lib/User';

const Report = () => {




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

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [allAircraft, setAllAircraft] = useState([]);
    const [selectedAircraft, setSelectedAircraft] = useState(null);
    const [stockReport, setStockReport] = useState(null);
    // const [expiryFilter, setExpiryFilter] = useState(null);
    const [expiryStartDate, setExpiryStartDate] = useState(null);
    const [expiryEndDate, setExpiryEndDate] = useState(null);
    const [stockStatus, setStockStatus] = useState(null);
    const [exportDialog, setExportDialog] = useState(false);

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
        // console.log('Selected Aircraft', aircraftId);
        // console.log('Expiry Filter', expiryFilter);
        const expiryFilter = {
            expiryStartDate: expiryStartDate,
            expiryEndDate: expiryEndDate,
            stockStatus: stockStatus
        }
        console.log(expiryFilter);
        fetch(`http://localhost:5000/api/v1/stock?aircraftId=${aircraftId}&expiryFilter=${JSON.stringify(expiryFilter)}`)
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



    // const handleExpiryFilter = (data) => {
    //     console.log('Expiry Filter', data);
    //     setExpiryFilter(data);
    // }

    useEffect(() => {
        getAllAircraftData();
        getStockDetailsReport(selectedAircraft?._id);
        getUser()
    }, [selectedAircraft]);

    const stockReportData = stockReport?.map((item, index) => {
        return {
            serial: index + 1, // Add serial number property starting from 1
            ...item
        };
    });

    const latestExpiryBodyTemplate = (rowData) => {
        return (
            rowData?.latestExpiry ? <p>{formatDate(rowData?.latestExpiry)}</p> : '--'
        )
    }
    const receivedBodyTemplate = (rowData) => {
        return (
            rowData?.stockHistory?.map((stock) => stock?.actionStatus == 'Received' ? <p key={stock?._id} className={getDateDifference(new Date(), new Date(stock?.expiryDate)) > - 30 && (getDateDifference(new Date(), new Date(stock?.expiryDate)) > 1 ? 'text-white rounded bg-red-400 mb-1' : 'text-white rounded bg-yellow-400 mb-1')} > {stock?.quantity}X{stock?.issueDate ? formatDate(stock?.issueDate) : ' --'}</ p > : null)
        )
    }
    const expenditureBodyTemplate = (rowData) => {
        return (
            rowData?.stockHistory?.map((stock) => stock?.actionStatus == 'Expenditure' ? <p key={stock?._id}>{stock?.quantity}X{stock?.issueDate ? formatDate(stock?.issueDate) : ' --'}</p> : null)
        )
    }

    return (
        <div>
            {/* <div>
                <div className='w-1/3 mb-2'>
                    <Dropdown value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.value)} options={allAircraft} optionLabel="aircraftName" placeholder="Select Aircraft" size="small" className="w-full p-dropdown-sm" />
                </div>
            </div> */}
            <div className='bg-white shadow-md p-2 rounded-md'>
                <div className='flex justify-between items-center'>
                    <div className='m-2 flex items-center gap-x-2'>
                        <h3 className='text-lg uppercase text-gray-700'>Stock Report</h3>
                        <Button onClick={() => setExportDialog(true)} icon="pi pi-file-pdf" severity='danger' size='small' text aria-label='Export' />
                    </div>

                    <div className='flex gap-x-2 items-center'>

                        <form onSubmit={handleSubmit(getStockDetailsReport)} className='flex gap-x-2 mr-8'>
                            <div className='flex gap-x-2'>
                                <Controller
                                    name="expiryStartDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar
                                            // value={date}
                                            dateFormat='dd-mm-yy'
                                            onChange={(e) => { setExpiryStartDate(e.value); field.onChange(e.value) }}
                                            placeholder='Expiry Start Date'
                                            className='w-full p-inputtext-sm'
                                        />
                                    )}
                                />
                                <Controller
                                    name="expiryEndDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar
                                            // value={date}
                                            dateFormat='dd-mm-yy'
                                            onChange={(e) => { setExpiryEndDate(e.value); field.onChange(e.value) }}
                                            placeholder='Expiry End Date'
                                            className='w-full p-inputtext-sm'
                                        />
                                    )}
                                />
                            </div>

                            <div>
                                <Dropdown
                                    {...register('stockStatus')}
                                    value={stockStatus} onChange={(e) => setStockStatus(e.value)} options={[{ label: 'All', value: 'all' }, { label: 'Nill', value: 'nill' }, { label: 'Low', value: 'low' }, { label: 'Sufficient', value: 'sufficient' }]} optionLabel="label" placeholder="Filter" size="small" className="w-full p-dropdown-sm" />
                            </div>

                            <Button type='submit' icon="pi pi-send" severity='primary' size='small' />
                        </form>

                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                        </IconField>
                    </div>
                </div>
                <DataTable value={stockReportData} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['nomenclature', 'stockNo', 'unit', 'cardNo', 'quantity']} emptyMessage="No stock report" className='p-datatable-sm text-sm'>
                    <Column field="serial" header="Ser No."></Column>
                    <Column field="cardNo" header="Card No."></Column>
                    <Column field="stockNo" header="Part No"></Column>
                    <Column field="nomenclature" header="Nomenclature" sortable></Column>
                    <Column field="unit" header="A/U"></Column>
                    <Column field="quantity" header="Qty Balance" sortable></Column>
                    <Column body={receivedBodyTemplate} header="Received & Dt"></Column>
                    <Column body={expenditureBodyTemplate} header="Expenditure & Dt"></Column>
                    <Column body={latestExpiryBodyTemplate} header="Latest Expiry" sortField='latestExpiry' sortable></Column>
                    {/* <Column body={expiryDateBodyTemplate} header="Expiry Date" sortField='expiryDate' sortable></Column>
                    <Column body={expiryStatusBodyTemplate} header="Expiry Status"></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column> */}
                </DataTable>
            </div>
            {exportDialog && <ReportExportDialog stockReport={stockReport} exportDialog={exportDialog} setExportDialog={setExportDialog} />}

        </div>
    );
};

export default Report;