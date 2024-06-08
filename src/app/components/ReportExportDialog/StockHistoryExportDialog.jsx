"use client"

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { exportStockHistory, exportStockReport } from '../../../../utils/ExportPDF';
import { Checkbox } from 'primereact/checkbox';

const StockHistoryExportDialog = ({ exportDialog, setExportDialog, stock, stockHistory, availableQuantity }) => {


    const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

    const tableColumns = [
        { field: 'voucherNo', header: 'Voucher No.' },
        { field: 'actionStatus', header: 'Action Status' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'itemType', header: 'Type' },
        { field: 'issueDate', header: 'Issue Date' },
        { field: 'aircraftUnit', header: 'Aircraft' },
        { field: 'expiryDate', header: 'Latest Expiry' },
        { field: 'remarks', header: 'Remarks' },
    ]

    const [selectedColumns, setSelectedColumns] = useState([tableColumns[0]]);

    const onColumnChange = (e) => {
        let _selectedColumns = [...selectedColumns];

        if (e.checked)
            _selectedColumns.push(e.value);
        else
            _selectedColumns = _selectedColumns.filter(category => category.field !== e.value.field);

        setSelectedColumns(_selectedColumns);
    };

    const handleExportStockHistory = (data) => {
        // console.log(data);
        // console.log(stockReport);
        const stockHistoryData = {
            ...data,
            selectedColumns,
            stockHistory: stockHistory
        }
        // console.log(stockDetailsReportData);
        // console.log(selectedColumns);
        exportStockHistory(stock, availableQuantity, stockHistoryData);

        setExportDialog(false);
        reset();
    }


    return (
        <div>
            {/* Export report  dialog*/}
            <Dialog header="Edit User Data" visible={exportDialog} onHide={() => { setExportDialog(false); reset() }}
                style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <form onSubmit={handleSubmit(handleExportStockHistory)} className="flex flex-col gap-2 mt-4">
                    <div className='w-full'>
                        <InputText
                            {...register("heading", { required: "Heading is required." })}
                            placeholder="Heading*" className='w-full border p-1' />
                        {errors.heading?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.heading.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("reportName", { required: "Serial No. is required." })}
                            placeholder="Report Name*" className='w-full border p-1' />
                        {errors.reportName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.reportName.message}</span>}
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("optional1")}
                            placeholder="Optional text" className='w-full border p-1' />
                    </div>
                    <div className='w-full'>
                        <InputText
                            {...register("optional2")}
                            placeholder="Optional text" className='w-full border p-1' />
                    </div>

                    <div className='mt-4 mb-2 text-lg font-semibold'>
                        <p>Select columns to export in report</p>
                    </div>

                    <div className='grid grid-cols-3 gap-2 text-sm items-center'>
                        {tableColumns.map((column) => {
                            return (
                                <div key={column.field} className='flex items-center w-fit'>
                                    <Checkbox inputId={column.field} name="column" value={column} onChange={onColumnChange} checked={selectedColumns.some((item) => item.field === column.field)} />
                                    <label htmlFor={column.field} className="ml-2">{column.header}</label>
                                </div>
                            );
                        })}
                    </div>

                    <div className='mt-4'>
                        <Button type="submit" label="Submit" className="text-white w-fit p-1"></Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default StockHistoryExportDialog;