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
import { formatDate } from '../../../../../utils/dateFunctionality';

const page = ({ params: { stockId } }) => {

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [stock, setStock] = useState(null);
    const [addStockHistory, setAddStockHistory] = useState(false);
    const [actionStatus, setActionStatus] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allAircraftUnit, setAllAircraftUnit] = useState([]);
    const [selectedAircraftUnit, setSelectedAircraftUnit] = useState(null);

    const calculateAvailableQuantity = stockHistory => {
        let receivedQty = 0;
        let expendedQty = 0;

        stockHistory?.forEach(entry => {
            if (entry.actionStatus === "Received") {
                receivedQty += entry.quantity;
            } else if (entry.actionStatus === "Expenditure") {
                expendedQty += entry.quantity;
            }
        });

        return receivedQty - expendedQty;
    };

    // Assuming `result` is the object containing the fetched data:
    const availableQuantity = calculateAvailableQuantity(stock?.stockHistory);


    const getStockDetails = async (id) => {
        const data = await getStockDetailsById(id);
        console.log(data);
        setStock(data?.data);
    }

    const handleAddStockHistory = (stockHistory) => {
        setLoading(true);
        stockHistory.stockId = stockId;
        if (stockHistory?.actionStatus === "Expenditure") {
            stockHistory.aircraftUnit = selectedAircraftUnit?._id
        }
        // stockHistory?.aircraftUnit = selectedAircraftUnit?._id;
        console.log(stockHistory);

        if (stockHistory?.quantity <= 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Quantity should be greater than 0', life: 3000 });
        }

        else if (availableQuantity < stockHistory?.quantity) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Not enough quantity in stock', life: 3000 });
        }
        else {
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
        }

        setLoading(false);
        setActionStatus(null);
        setExpiryDate(null);
        setAddStockHistory(false);
        reset();
    }

    const getAllAircraftUnit = async () => {
        const data = await fetch('http://localhost:5000/api/v1/aircraftUnit');
        const res = await data.json();
        // console.log(res);
        setAllAircraftUnit(res.data);
    }


    useEffect(() => {
        getStockDetails(stockId);
        getAllAircraftUnit();
    }, [stockId])


    const aircraftUnitOptionTemplate = (option) => {
        return (
            <div>
                <p>{option?.aircraftName}</p>
                <p className='text-xs'>Reg:{option?.regNo}, Serial: {option?.serialNo}</p>
            </div>
        );
    };

    const selectedAircraftUnitOptionTemplate = (option, props) => {
        if (option) {
            return (
                <div>
                    <p>{option?.aircraftName}</p>
                    <p className='text-xs'>Reg:{option?.regNo}, Serial: {option?.serialNo}</p>
                </div>
            );
        }

        return <span>{props?.placeholder}</span>;
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className='flex justify-between p-4 border shadow-md bg-white rounded-md'>
                <div>
                    <h3 className='text-lg uppercase text-gray-700'>Stock Details</h3>
                    <div className='mt-4 flex flex-col gap-2'>
                        <p>Stock: {stock?.nomenclature || 'N/A'}</p>
                        <p>Aircraft Name: {stock?.aircraftId?.aircraftName || 'N/A'}</p>
                        <p>Available Qty: {availableQuantity || 'N/A'} {availableQuantity < stock?.minimumQuantity && <span className='text-white bg-red-500 rounded-md p-1'>Low Stock</span>}</p>
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
            <Dialog header="Add to Stock" visible={addStockHistory} onHide={() => { setAddStockHistory(false); setSelectedAircraftUnit(null); setItemType(null); setActionStatus(null); reset() }}
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
                            {...register("itemType", { required: "Item type is required" })}
                            value={itemType} onChange={(e) => setItemType(e.value)} options={[{ label: 'New', value: 'New' }, { label: 'Old', value: 'Old' }]} optionLabel="label"
                            placeholder={"Select item type*"} size="small" className="w-full p-dropdown-sm" />
                        {errors.itemType?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.itemType.message}</span>}
                    </div>
                    {
                        itemType === 'New' &&
                        <div className='w-full'>
                            <Dropdown
                                {...register("actionStatus", { required: "Action Status is required" })}
                                value={actionStatus} onChange={(e) => setActionStatus(e.value)} options={[{ label: 'Received', value: 'Received' }, { label: 'Expenditure', value: 'Expenditure' }]} optionLabel="label"
                                placeholder={"Select action status*"} size="small" className="w-full p-dropdown-sm" />
                            {errors.actionStatus?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.actionStatus.message}</span>}
                        </div>
                    }
                    {
                        actionStatus === 'Expenditure' &&
                        <div className='w-full'>
                            <Dropdown
                                {...register("aircraftUnit", { required: "Aircraft unit is required" })}
                                value={selectedAircraftUnit} valueTemplate={selectedAircraftUnitOptionTemplate} itemTemplate={aircraftUnitOptionTemplate} onChange={(e) => setSelectedAircraftUnit(e.value)} options={allAircraftUnit} optionLabel="aircraftName"
                                placeholder={"Select aircraft unit*"} size="small" className="w-full p-dropdown-sm" />
                            {errors.aircraftUnit?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraftUnit.message}</span>}
                        </div>
                    }
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
                                    required
                                />
                            )}
                        />
                        {errors.expiryDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.expiryDate.message}</span>}
                    </div>
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