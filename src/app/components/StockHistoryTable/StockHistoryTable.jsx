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
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const StockHistoryTable = ({ stock, getStockDetails, setAddStockHistory }) => {

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false);
    const [deleteStockHistory, setDeleteStockHistory] = useState(false);
    const [updateStockHistory, setUpdateStockHistory] = useState(false);
    const [actionStatus, setActionStatus] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);


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

    function formatDate(dateString) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return `${day + 1}-${month}-${year}`;
    }


    const dateBodyTemplate = (rowData) => {
        return (
            // <span className="p-column-title">{formatDate(rowData.createdAt)}</span>
            <p>{formatDate(rowData?.createdAt)}</p>
        );
    }

    const expiryDateBodyTemplate = (rowData) => {
        return (
            rowData?.expiryDate ? <p>{formatDate(rowData?.expiryDate)}</p> : 'N/A'
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setUpdateStockHistory(rowData)} icon="pi pi-pencil" size='small' severity='success' />
                <Button onClick={() => setDeleteStockHistory(rowData)} icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }


    const handleDeleteStockHistory = async (id) => {
        setLoading(true);
        fetch(`http://localhost:5000/api/v1/stockHistory/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
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

        if (data?.actionStatus == 'Expenditure') {
            data.expiryDate = '';
        }

        const updatedStockHistory = Object.entries(data).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});

        fetch(`http://localhost:5000/api/v1/stockHistory/${updateStockHistory?._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
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
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
                }
                console.log(data);
            })

        setUpdateStockHistory(false);
        reset();
    }


    return (
        <div>
            <Toast ref={toast} />
            <div className='bg-white mt-4 shadow-md p-2 rounded-md'>
                <div className='flex justify-between items-center'>
                    <div className='m-2 flex items-center gap-x-2'>
                        <h3 className='text-lg uppercase text-gray-700'>Stock History</h3>
                        <Button onClick={() => setAddStockHistory(true)} icon="pi pi-plus" size='small' text aria-label='Add' />
                    </div>

                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText size="small" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" className='p-inputtext-sm' />
                    </IconField>
                </div>
                <DataTable value={stock?.stockHistory} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['createdAt', 'quantity', 'voucherNo', 'actionStatus', 'expiryDate']} emptyMessage="No stock history">
                    <Column body={dateBodyTemplate} header="Date" sortField='createdAt' sortable></Column>
                    <Column field="quantity" header="Quantity" sortable></Column>
                    <Column field="voucherNo" header="Voucher No" sortable></Column>
                    <Column field="actionStatus" header="Action Status" sortable></Column>
                    <Column body={expiryDateBodyTemplate} header="Expiry Date" sortField='expiryDate' sortable></Column>
                    {/* <Column field="uploadStatus" header="Upload Status"></Column> */}
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            {/* Edit Stock History  */}
            <Dialog header="Update Stock History" visible={updateStockHistory} onHide={() => { setUpdateStockHistory(false); setActionStatus(null); reset() }}
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
                            {...register("actionStatus")}
                            value={actionStatus} onChange={(e) => setActionStatus(e.value)} options={[{ label: 'Received', value: 'Received' }, { label: 'Expenditure', value: 'Expenditure' }]} optionLabel="label"
                            placeholder={updateStockHistory?.actionStatus || "Select action status"} size="small" className="w-full p-dropdown-sm" />
                    </div>

                    {
                        (actionStatus || updateStockHistory?.actionStatus) == 'Received' &&
                        <div>
                            <Controller
                                name="expiryDate"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        // value={date}
                                        // {...register("expiryDate", { required: "Expiry Date is required" })}
                                        onChange={(e) => { setExpiryDate(e.value); field.onChange(e.value) }}
                                        placeholder={formatDate(updateStockHistory?.expiryDate) || 'Expiry Date'}
                                        className='w-full p-inputtext-sm'
                                    />
                                )}
                            />
                            {/* {errors.expiryDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.expiryDate.message}</span>} */}
                        </div>
                    }
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
        </div>
    );
};

export default StockHistoryTable;