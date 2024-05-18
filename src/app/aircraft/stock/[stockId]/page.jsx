"use client"

import React, { useEffect, useRef, useState } from 'react';
import { getStockDetailsById } from '../../../../../lib/Aircraft';
import Image from 'next/image';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import StockHistoryTable from '@/app/components/StockHistoryTable/StockHistoryTable';

const page = ({ params: { stockId } }) => {

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [stock, setStock] = useState(null);
    const [addStockHistory, setAddStockHistory] = useState(false);
    const [actionStatus, setActionStatus] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [loading, setLoading] = useState(false);


    const getStockDetails = async (id) => {
        const data = await getStockDetailsById(id);
        console.log(data);
        setStock(data?.data);
    }

    const handleAddStockHistory = (stockHistory) => {
        setLoading(true);
        stockHistory.stockId = stockId;
        console.log(stockHistory);

        fetch(`http://localhost:5000/api/v1/stockHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stockHistory)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status == 'Success') {
                    getStockDetails(stockId);
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock History Added', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
                }
            })

        setLoading(false);
        setActionStatus(null);
        setExpiryDate(null);
        setAddStockHistory(false);
        reset();
    }


    useEffect(() => {
        getStockDetails(stockId)
    }, [stockId])

    function formatDate(dateString) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(dateString);
        const day = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return `${day + 1}-${month}-${year}`;
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='flex justify-between p-4 border shadow-md bg-white rounded-md'>
                <div>
                    <h3 className='text-lg uppercase text-gray-700'>Stock Details</h3>
                    <div className='mt-4 flex flex-col gap-2'>
                        <p>Stock: {stock?.nomenclature || 'N/A'}</p>
                        <p>Aircraft Name: {stock?.aircraftId?.aircraftName || 'N/A'}</p>
                        <p>Card No.: {stock?.cardNo || 'N/A'}</p>
                        <p>Stock/Part No.: {stock?.stockNo || 'N/A'}</p>
                        <p>Unit: {stock?.unit || 'N/A'}</p>
                        <p>Issued At: {stock?.issuedAt ? formatDate(stock?.issuedAt) : 'N/A'}</p>
                        <p>Location: {stock?.location || 'N/A'}</p>
                    </div>
                </div>
                <div className='rounded-md'>
                    <Image src={stock?.image} alt={stock?.imageAlt || 'Stock Image'} width={300} height={300} className='rounded-md border' />
                </div>
            </div>

            <StockHistoryTable stock={stock} setAddStockHistory={setAddStockHistory} getStockDetails={getStockDetails} />


            {/* Add Stoc History  */}
            <Dialog header="Add to Stock" visible={addStockHistory} onHide={() => { setAddStockHistory(false); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleAddStockHistory)} className="flex flex-col gap-2 mt-4">

                    {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
                    <div className='w-full'>
                        <InputText
                            {...register("voucherNo", { required: "Voucher No. is required" })}
                            placeholder="Voucher No.*" className='w-full border p-1' />
                        {errors.voucherNo?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.voucherNo.message}</span>}
                    </div>
                    <div className='w-full'>
                        <Dropdown
                            {...register("actionStatus", { required: "Action Status is required" })}
                            value={actionStatus} onChange={(e) => setActionStatus(e.value)} options={[{ label: 'Received', value: 'Received' }, { label: 'Expenditure', value: 'Expenditure' }]} optionLabel="label"
                            placeholder={"Select action status"} size="small" className="w-full p-dropdown-sm" />
                        {errors.actionStatus?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.actionStatus.message}</span>}
                    </div>

                    {
                        actionStatus == 'Received' &&
                        <div>
                            <Controller
                                name="expiryDate"
                                control={control}
                                render={({ field }) => (
                                    <Calendar
                                        // value={date}
                                        // {...register("expiryDate", { required: "Expiry Date is required" })}
                                        onChange={(e) => { setExpiryDate(e.value); field.onChange(e.value) }}
                                        placeholder={'Expiry Date*'}
                                        className='w-full p-inputtext-sm'
                                    />
                                )}
                            />
                            {/* {errors.expiryDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.expiryDate.message}</span>} */}
                        </div>
                    }
                    <div className='w-full'>
                        <InputText
                            {...register("quantity", { required: "Quantity is required" })}
                            placeholder="Quantity*" type='number' className='w-full border p-1' />
                        {errors.quantity?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.quantity.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("remarks")}
                            placeholder="Remarks" className='w-full border p-1' />
                    </div>

                    <div>
                        <Button type="submit" label="Submit" loading={loading} className="text-white w-fit p-1"></Button>
                    </div>
                </form>
            </Dialog>


        </div>
    );
};

export default page;