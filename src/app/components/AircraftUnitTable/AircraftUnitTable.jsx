"use client"

import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const AircraftUnitTable = ({ allAirraft, allAircraftUnit, filters }) => {

    const toast = useRef(null);

    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const [selectedAircraftUnit, setSelectedAircraftUnit] = useState(null);
    const [updateAircraftUnit, setUpdateAircraftUnit] = useState(false);
    const [deleteAircraftUnit, setDeleteAircraftUnit] = useState(false);
    const [loading, setLoading] = useState(false);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex gap-x-2'>
                <Button onClick={() => setUpdateAircraftUnit(rowData)} label='Edit' icon="pi pi-pencil" size='small' severity='success' />
                <Button onClick={() => setDeleteAircraftUnit(rowData)} label='Delete' icon="pi pi-trash" size='small' severity='danger' />
            </div>
        )
    }


    const handleUpdateAircraftUnit = (data) => {
        console.log(data);
    }

    const handleDeleteAircraftUnit = () => {
        console.log(deleteAircraftUnit);
    }

    return (
        <div>
            <div>
                <DataTable value={allAircraftUnit} size='small' removableSort paginator rows={10} rowsPerPageOptions={[5, 10, 20]} filters={filters} filterDisplay="menu" globalFilterFields={['aircraftName', 'regNo', 'serialNo']} emptyMessage="No aircraft unit available">
                    <Column field='serial' header="Ser. No."></Column>
                    <Column field='aircraftName' header="Model"></Column>
                    <Column field="regNo" header="Reg. No."></Column>
                    <Column field="serialNo" header="Serial No."></Column>
                    <Column body={actionBodyTemplate} header="Actions"></Column>
                </DataTable>
            </div>

            {/* Edit user dialog  */}
            <Dialog header="Edit User Data" visible={updateAircraftUnit} onHide={() => { setUpdateAircraftUnit(false); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleUpdateAircraftUnit)} className="flex flex-col gap-2 mt-4">
                    <div className='w-full'>
                        <Dropdown
                            {...register("aircraft")}
                            value={selectedAircraftUnit} onChange={(e) => setSelectedAircraftUnit(e.value)} options={allAirraft} optionLabel="aircraftName"
                            placeholder={updateAircraftUnit?.aircraft || "Select Aircraft Model"} size="small" className="w-full p-dropdown-sm" />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("regNo")}
                            placeholder={updateAircraftUnit?.regNo || "Registration No."} className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("serialNo")}
                            placeholder={updateAircraftUnit?.serialNo || "Serial No."} className='w-full border p-1' />
                    </div>

                    <div>
                        <Button type="submit" label="Submit" className="text-white w-fit p-1" loading={loading}></Button>
                    </div>
                </form>
            </Dialog>

            {/* Delete User Dialog  */}
            <Dialog header="Delete Aircraft Unit" visible={deleteAircraftUnit} onHide={() => setDeleteAircraftUnit(false)}>
                <div className="flex flex-col gap-2">
                    <i className="pi pi-trash rounded-full mx-auto text-red-500 p-2 shadow-lg shadow-red-300" style={{ fontSize: '3rem' }}></i>
                    <p className='text-lg text-gray-700'>Are you sure you want to delete?</p>
                    <div className='flex justify-end gap-2 mt-4'>
                        <Button label="Delete" severity='danger' size='small' onClick={() => handleDeleteAircraftUnit()} />
                        {/* <Button label="No" icon="pi pi-times" severity='secondary' size='small' onClick={() => setDeleteStock(false)} /> */}
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default AircraftUnitTable;