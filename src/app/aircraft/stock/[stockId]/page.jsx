"use client"

import React, { useEffect, useRef, useState } from 'react';
import { getStockDetailsById } from '../../../../../lib/Aircraft';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import Cookies from 'universal-cookie';
import { useRouter } from 'next/navigation';
import { getLoggedInUser } from '../../../../../lib/User';
import StockHistoryTable from '@/app/components/StockDetails/StockHistoryTable';
import StockDetails from '@/app/components/StockDetails/StockDetails';

const Stock = ({ params: { stockId } }) => {

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

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [stock, setStock] = useState(null);
    const [addStockHistory, setAddStockHistory] = useState(false);
    const [actionStatus, setActionStatus] = useState(null);
    const [itemType, setItemType] = useState(null);
    const [expiryDate, setExpiryDate] = useState(null);
    const [issueDate, setIssueDate] = useState(null);
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

        const avlQuantity = receivedQty - expendedQty;
        if (avlQuantity > 0) {
            return avlQuantity;
        }
        return 0;
    };


    // Assuming `result` is the object containing the fetched data:
    const availableQuantity = calculateAvailableQuantity(stock?.stockHistory);


    const getStockDetails = async () => {
        const data = await getStockDetailsById(stockId);
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

        if (actionStatus == "Expenditure") {
            if (availableQuantity < stockHistory?.quantity) {
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
                            getStockDetails();
                            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock History Added', life: 3000 });
                        }
                        else {
                            toast.current.show({ severity: 'error', summary: 'Error', detail: data.error, life: 3000 });
                        }
                    })
            }
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
                        getStockDetails();
                        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Stock History Added', life: 3000 });
                    }
                    else {
                        toast.current.show({ severity: 'error', summary: 'Error', detail: data.error, life: 3000 });
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
        getStockDetails();
        getAllAircraftUnit();
        getUser()
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

            <StockDetails stock={stock} />
            <StockHistoryTable stock={stock} setAddStockHistory={setAddStockHistory} getStockDetails={getStockDetails} selectedAircraftUnitOptionTemplate={selectedAircraftUnitOptionTemplate} aircraftUnitOptionTemplate={aircraftUnitOptionTemplate} allAircraftUnit={allAircraftUnit} availableQuantity={availableQuantity} />


            {/* Add Stock History  */}
            < Dialog header="Add to Stock History" visible={addStockHistory} onHide={() => { setAddStockHistory(false); setSelectedAircraftUnit(null); setItemType(null); setActionStatus(null); reset() }}
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
                            value={itemType} onChange={(e) => setItemType(e.value)} options={[{ label: 'New', value: 'New' }, { label: 'Used', value: 'Used' }]} optionLabel="label"
                            placeholder={"Select item type*"} size="small" className="w-full p-dropdown-sm" />
                        {errors.itemType?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.itemType.message}</span>}
                    </div>

                    <div className='w-full'>
                        <Dropdown
                            {...register("actionStatus", { required: "Action Status is required" })}
                            value={actionStatus} onChange={(e) => setActionStatus(e.value)} options={[{ label: 'Received', value: 'Received' }, { label: 'Expenditure', value: 'Expenditure' }]} optionLabel="label"
                            placeholder={"Select action status*"} size="small" className="w-full p-dropdown-sm" />
                        {errors.actionStatus?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.actionStatus.message}</span>}
                    </div>
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
                            name="issueDate"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    // value={date}
                                    // {...register("expiryDate", { required: "Expiry Date is required" })}
                                    dateFormat='dd-mm-yy'
                                    onChange={(e) => { setIssueDate(e.value); field.onChange(e.value) }}
                                    placeholder={'Issue Date*'}
                                    className='w-full p-inputtext-sm'
                                    required
                                />
                            )}
                        />
                        {errors.issueDate?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.issueDate.message}</span>}
                    </div>
                    {
                        actionStatus === 'Received' &&
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
                                        placeholder={'Expiry Date'}
                                        className='w-full p-inputtext-sm'
                                    />
                                )}
                            />
                        </div>
                    }
                    <div className='w-full'>
                        <InputText
                            {...register("quantity", { required: "Quantity is required" })}
                            placeholder="Quantity*" className='w-full border p-1' />
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

export default Stock;