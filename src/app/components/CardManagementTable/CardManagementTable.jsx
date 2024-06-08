"use client"
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'universal-cookie';

const CardManagementTable = ({ cardData, filters, aircraft, getAllCardInfo }) => {

    const cookie = new Cookies();
    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [updateCard, setUpdateCard] = useState(false);
    const [deleteCard, setDeleteCard] = useState(false);
    const [selectedAircraft, setSelectedAircraft] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpdateCard = (data) => {
        console.log(data);
        setLoading(true);
        const updatedCardData = Object.entries(data).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});

        console.log(updatedCardData);

        fetch(`http://localhost:5000/api/v1/cardInfo/${updateCard?._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.get('TOKEN')}`
            },
            body: JSON.stringify(updatedCardData)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('card update:', data);
                if (data.status === 'Success') {
                    getAllCardInfo();
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Card updated successfully', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
                }
            })

        setLoading(false);
        setUpdateCard(false);
        setSelectedAircraft(null);
        reset();
        setLoading(false);
    }

    const handleDeleteCard = () => {
        console.log(deleteCard);
        setLoading(true);
        fetch(`http://localhost:5000/api/v1/cardInfo/${deleteCard?._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie.get('TOKEN')}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.status === 'Success') {
                    getAllCardInfo();
                    toast.current.show({ severity: 'success', summary: 'Card Deleted', detail: 'Card deleted successfully', life: 3000 });
                }
                else {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: data?.error, life: 3000 });
                }
            })

        setLoading(false);
        setDeleteCard(false);

    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setUpdateCard(rowData)} label='Edit' icon="pi pi-pencil" size='small' severity='success' />
                <Button onClick={() => setDeleteCard(rowData)} label='Delete' icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <div>
                <DataTable value={cardData} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filterDisplay="menu" filters={filters} globalFilterFields={['aircraft', 'cardNo', 'stockNo', 'nomenclature']} emptyMessage="No card found">
                    <Column field="serial" header="Ser. No."></Column>
                    <Column body={(rowData) => rowData?.aircraft?.aircraftName} header="Aircraft Name" ></Column>
                    <Column field="cardNo" header="Card No." sortable></Column>
                    <Column field="stockNo" header="Part No" sortable></Column>
                    <Column field="nomenclature" header="Nomenclature" sortable></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            {/* Edit Card dialog  */}
            <Dialog header="Edit Card Data" visible={updateCard} onHide={() => { setUpdateCard(false); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleUpdateCard)} className="flex flex-col gap-2 mt-4">
                    <div className='w-full'>
                        <Dropdown
                            {...register("aircraft")}
                            value={selectedAircraft} onChange={(e) => setSelectedAircraft(e.value)} options={aircraft} optionLabel="aircraftName"
                            placeholder={updateCard?.aircraft?.aircraftName || "Select Aircraft"} size="small" className="w-full p-dropdown-sm"
                            disabled
                        />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("cardNo")}
                            placeholder={updateCard?.cardNo || "Card No."} className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("nomenclature")}
                            placeholder={updateCard?.nomenclature || "Nomenclature"} className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("stockNo")}
                            placeholder={updateCard?.stockNo || "Stock No."} className='w-full border p-1' />
                    </div>
                    <div>
                        <Button type="submit" label="Submit" className="text-white w-fit p-1" loading={loading}></Button>
                    </div>
                </form>
            </Dialog>

            {/* Delete Card Dialog  */}
            <Dialog header="Delete Card" visible={deleteCard} onHide={() => setDeleteCard(false)}>
                <div className="flex flex-col gap-2">
                    <i className="pi pi-trash rounded-full mx-auto text-red-500 p-2 shadow-lg shadow-red-300" style={{ fontSize: '3rem' }}></i>
                    <p className='text-lg text-gray-700'>Are you sure you want to delete?</p>
                    <div className='flex justify-end gap-2 mt-4'>
                        <Button label="Delete" severity='danger' size='small' onClick={() => handleDeleteCard()} loading={loading} />
                        {/* <Button label="No" icon="pi pi-times" severity='secondary' size='small' onClick={() => setDeleteStock(false)} /> */}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default CardManagementTable;