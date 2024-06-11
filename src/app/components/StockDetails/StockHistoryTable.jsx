import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { formatDate, getDateDifference } from '../../../../utils/dateFunctionality';
import StockHistoryExportDialog from '../ReportExportDialog/StockHistoryExportDialog';
import Cookies from 'universal-cookie';

const StockHistoryTable = ({ stock, getStockDetails, setAddStockHistory, selectedAircraftUnitOptionTemplate, aircraftUnitOptionTemplate, allAircraftUnit, availableQuantity }) => {
    console.log(stock?._id);
    const cookie = new Cookies();
    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [stockHistory, setStockHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteStockHistory, setDeleteStockHistory] = useState(false);
    const [updateStockHistory, setUpdateStockHistory] = useState(false);
    const [actionStatus, setActionStatus] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [selectedAircraftUnit, setSelectedAircraftUnit] = useState(null);
    const [issueDate, setIssueDate] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [exportDialog, setExportDialog] = useState(false);
    const [issueStartDate, setIssueStartDate] = useState(null);
    const [issueEndDate, setIssueEndDate] = useState(null);

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        createdAt: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
    let stockHistoryData = []
    if (stockHistory) {
        stockHistoryData = stockHistory?.map((item, index) => {
            return {
                serial: index + 1, // Add serial number property starting from 1
                ...item
            };
        });
    }


    const getStockHistory = (stockId) => {
        console.log(stockId);
        const url = `http://localhost:5000/api/v1/stockHistory/detailsHistory/${stockId}?issueStartDateString=${issueStartDate}&issueEndDateString=${issueEndDate}`;
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.get('TOKEN')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data);
                console.log(data?.data?.stockHistory);
                setStockHistory(data?.data?.stockHistory);
            })
    }


    const handleDeleteStockHistory = async (id) => {
        setLoading(true);
        fetch(`http://localhost:5000/api/v1/stockHistory/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.get('TOKEN')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status == 'Success') {
                    getStockDetails(stock?._id);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock History Deleted', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
                }
            })

        setLoading(false);
        setDeleteStockHistory(false);
    }

    const handleUpdateStockHistory = (data) => {

        if (data?.actionStatus == 'Expenditure' || updateStockHistory?.actionStatus == 'Expenditure') {
            data.expiryDate = '';
            data.aircraftUnit = selectedAircraftUnit?._id
        }

        const updatedStockHistory = Object.entries(data).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});
        console.log(updatedStockHistory);

        if (updatedStockHistory?.quantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Quantity should be greater than 0', life: 3000 });
            return;
        }

        fetch(`http://localhost:5000/api/v1/stockHistory/${updateStockHistory?._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.get('TOKEN')}`
            },
            body: JSON.stringify(updatedStockHistory),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status == 'Success') {
                    getStockDetails(stock?._id);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock History Updated', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data.error, life: 3000 });
                }
                console.log(data);
            })

        setUpdateStockHistory(false);
        setItemType(null);
        setActionStatus(null);
        setSelectedAircraftUnit(null);
        reset();
    }

    const filterStockHistory = () => {
        getStockDetails(issueStartDate, issueEndDate)
        console.log(issueStartDate, issueEndDate);
    }


    useEffect(() => {
        if (stock) {
            getStockHistory(stock?._id);
        }
    }, [stock]);


    const dateBodyTemplate = (rowData) => {
        return (
            // <span className="p-column-title">{formatDate(rowData.createdAt)}</span>
            <p>{rowData?.issueDate ? formatDate(rowData?.issueDate?.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })) : '--'}</p>
        );
    }
    const aircraftUnitBodyTemplate = (rowData) => {
        return (
            <div>
                <p>{rowData?.aircraftUnit?.aircraft?.aircraftName ? rowData?.aircraftUnit?.aircraft?.aircraftName : "--"}</p>
                <p className='text-xs'>{rowData?.aircraftUnit?.regNo ? `Reg.: ${rowData?.aircraftUnit?.regNo}` : null}</p>
            </div>
        );
    }
    // const expiryDateBodyTemplate = (rowData) => {
    //     return (
    //         rowData?.expiryDate ? <p>{formatDate(rowData?.expiryDate)}</p> : '--'
    //     );
    // }

    const expiryDateBodyTemplate = (rowData) => {
        return (
            (rowData?.actionStatus == "Received" && rowData?.expiryDate) ? <p>{getDateDifference(new Date(rowData?.expiryDate), new Date()) > 0 ? <span className='text-white p-1 rounded bg-green-400'>{formatDate(rowData?.expiryDate)}</span> : <span className='text-white p-1 rounded bg-red-400'>{formatDate(rowData?.expiryDate)}</span>}</p>
                :
                <p>--</p>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setUpdateStockHistory(rowData)} label='Edit' icon="pi pi-pencil" size='small' severity='success' />
                <Button onClick={() => setDeleteStockHistory(rowData)} label='Delete' icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='bg-white mt-4 shadow p-2 rounded-md'>
                <div className='flex justify-between items-center'>
                    <div className='m-2 flex items-center gap-x-2'>
                        <h3 className='text-lg uppercase text-gray-700'>Stock History</h3>
                        <Button onClick={() => setAddStockHistory(true)} label='Add' icon="pi pi-plus" size='small' aria-label='Add' />
                        <Button onClick={() => setExportDialog(true)} icon="pi pi-file-pdf" severity='danger' size='small' text aria-label='Export' />
                    </div>
                    <div className='flex gap-x-2 items-center'>
                        <div className='flex gap-x-2 mr-8'>
                            <div className='flex gap-x-2'>
                                <Controller
                                    name="issueStartDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar
                                            // value={date}
                                            dateFormat='dd-mm-yy'
                                            onChange={(e) => { setIssueStartDate(e.value); field.onChange(e.value) }}
                                            placeholder='Issue Date From'
                                            className='w-full p-inputtext-sm'
                                        />
                                    )}
                                />
                                <Controller
                                    name="issueEndDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Calendar
                                            // value={date}
                                            dateFormat='dd-mm-yy'
                                            onChange={(e) => { setIssueEndDate(e.value); field.onChange(e.value) }}
                                            placeholder='Issue Date To'
                                            className='w-full p-inputtext-sm'
                                        />
                                    )}
                                />
                            </div>

                            {/* <div>
                                    <Dropdown
                                        {...register('stockStatus')}
                                        value={stockStatus} onChange={(e) => setStockStatus(e.value)} options={[{ label: 'All', value: 'all' }, { label: 'Nill', value: 'nill' }, { label: 'Low', value: 'low' }, { label: 'Sufficient', value: 'sufficient' }]} optionLabel="label" placeholder="Filter" size="small" className="w-full p-dropdown-sm" />
                                </div> */}

                            <Button type='submit' onClick={() => filterStockHistory()} icon="pi pi-send" severity='primary' size='small' />
                        </div>

                        <div>
                            <IconField iconPosition="left">
                                <InputIcon className="pi pi-search" />
                                <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                            </IconField>
                        </div>
                    </div>
                </div>
                <DataTable value={stockHistoryData} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['createdAt', 'quantity', 'voucherNo', 'actionStatus', 'expiryDate']} emptyMessage="No stock history">
                    <Column field="serial" header="Ser. No."></Column>
                    <Column field="voucherNo" header="Voucher No"></Column>
                    <Column field="actionStatus" header="Action Status"></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column field="itemType" header="Type"></Column>
                    <Column body={dateBodyTemplate} header="Issue Date" sortField='issueDate' sortable></Column>
                    <Column body={aircraftUnitBodyTemplate} header="Aircraft" ></Column>
                    <Column body={expiryDateBodyTemplate} header="Expiry Date" sortField='expiryDate' sortable></Column>
                    {/* <Column field="remarks" header="Remarks"></Column> */}
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            {
                exportDialog && <StockHistoryExportDialog exportDialog={exportDialog} setExportDialog={setExportDialog} stock={stock} stockHistory={stockHistoryData} availableQuantity={availableQuantity} />
            }

            {/* Edit Stock History  */}
            <Dialog header="Update Stock History" visible={updateStockHistory} onHide={() => { setUpdateStockHistory(false); setActionStatus(null); setItemType(null); setSelectedAircraftUnit(null); reset(); }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleUpdateStockHistory)} className="flex flex-col gap-2 mt-4">

                    {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
                    <div className='w-full'>
                        <InputText
                            {...register("voucherNo")}
                            placeholder={updateStockHistory?.voucherNo || "Voucher No."} className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("itemType")}
                            value={itemType} onChange={(e) => setItemType(e.value)} options={[{ label: 'New', value: 'New' }, { label: 'Used', value: 'Used' }]} optionLabel="label"
                            placeholder={updateStockHistory?.itemType || "Select item type"} size="small" className="w-full p-dropdown-sm" />
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("actionStatus")}
                            value={actionStatus} onChange={(e) => setActionStatus(e.value)} options={[{ label: 'Received', value: 'Received' }, { label: 'Expenditure', value: 'Expenditure' }]} optionLabel="label"
                            placeholder={updateStockHistory?.actionStatus || "Select action status"} size="small" className="w-full p-dropdown-sm" />
                    </div>
                    {
                        (updateStockHistory?.actionStatus === 'Expenditure' || actionStatus === 'Expenditure') &&
                        <div className='w-full'>
                            <Dropdown
                                {...register("aircraftUnit")}
                                value={selectedAircraftUnit} valueTemplate={selectedAircraftUnitOptionTemplate} itemTemplate={aircraftUnitOptionTemplate} onChange={(e) => setSelectedAircraftUnit(e.value)} options={allAircraftUnit} optionLabel="aircraftName"
                                placeholder={updateStockHistory?.aircraftUnit?.aircraft?.aircraftName || "Select aircraft unit"} size="small" className="w-full p-dropdown-sm" />
                        </div>
                    }
                    <div>
                        <Controller
                            name="issueDate"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    // value={date}
                                    // {...register("expiryDate", { required: "Expiry Date is required" })}
                                    dateFormat='dd-mm-yy'
                                    onChange={(e) => { setIssueDate(e.value); field.onChange(e.value) }}
                                    placeholder={updateStockHistory?.issueDate ? formatDate(updateStockHistory?.issueDate) : 'Issue Date'}
                                    className='w-full p-inputtext-sm'
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="expiryDate"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    // value={date}
                                    // {...register("expiryDate", { required: "Expiry Date is required" })}
                                    dateFormat='dd-mm-yy'
                                    onChange={(e) => { setExpiryDate(e.value); field.onChange(e.value) }}
                                    placeholder={updateStockHistory?.expiryDate ? formatDate(updateStockHistory?.expiryDate) : 'Expiry Date'}
                                    className='w-full p-inputtext-sm'
                                />
                            )}
                        />
                        {/* {errors.expiryDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.expiryDate.message}</span>} */}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("quantity")}
                            placeholder={updateStockHistory?.quantity || "Quantity"} type='number' className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("remarks")}
                            placeholder={updateStockHistory?.remarks || "Remarks"} className='w-full border p-1' />
                    </div>

                    <div>
                        <Button type="submit" label="Submit" loading={loading} className="text-white w-fit p-1"></Button>
                    </div>
                </form>
            </Dialog>

            {/* Delete Stock History Dialog  */}
            <Dialog header="Delete Stock History" visible={deleteStockHistory} onHide={() => setDeleteStockHistory(false)} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="flex flex-col gap-2">
                    <i className="pi pi-trash rounded-full mx-auto text-red-500 p-2 shadow-lg shadow-red-300" style={{ fontSize: '3rem' }}></i>
                    <p className='text-lg text-gray-700'>Are you sure to delete the history?</p>
                    <div className='flex justify-end gap-2 mt-4'>
                        <Button label="Delete" severity='danger' size='small' onClick={() => handleDeleteStockHistory(deleteStockHistory?._id)} loading={loading} />
                        {/* <Button label="No" icon="pi pi-times" severity='secondary' size='small' onClick={() => setDeleteStock(false)} /> */}
                    </div>
                </div>
            </Dialog>
        </div >
    );
};

export default StockHistoryTable;