import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const StockHistoryTable = ({ stock, getStockDetails, setAddStockHistory }) => {

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [loading, setLoading] = useState(false);
    const [deleteStockHistory, setDeleteStockHistory] = useState(false);
    const [updateStockHistory, setUpdateStockHistory] = useState(false);


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
                <Button icon="pi pi-pencil" size='small' severity='success' />
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