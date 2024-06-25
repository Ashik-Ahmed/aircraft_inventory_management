import Image from 'next/image';
import React from 'react';
import { formatDate } from '../../../../utils/dateFunctionality';

const StockDetails = ({ stock }) => {
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

    return (
        <div className='flex justify-between p-4 border shadow bg-white rounded-md'>
            <div>
                <h3 className='text-lg uppercase text-gray-700'>Stock Details</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Nomenclature :</td>
                            <td className='pl-4'>{stock?.nomenclature || '--'}</td>
                        </tr>
                        <tr>
                            <td>Aircraft Name :</td>
                            <td className='pl-4'>{stock?.aircraftId?.aircraftName || '--'}</td>
                        </tr>
                        <tr>
                            <td>Available Qty. :</td>
                            <td className='pl-4'>{availableQuantity ? (availableQuantity % 1 === 0 ? availableQuantity : availableQuantity.toFixed(2)) + `${' (' + stock?.unit + ')'}` : '--'} {availableQuantity < stock?.minimumQuantity && <span className='text-white text-xs bg-red-500 p-[1px]'>Low Stock</span>}</td>
                        </tr>
                        <tr>
                            <td>Card No. :</td>
                            <td className='pl-4'>{stock?.cardNo || '--'}</td>
                        </tr>
                        <tr>
                            <td>Stock/Part No. :</td>
                            <td className='pl-4'>{stock?.stockNo || '--'}</td>
                        </tr>
                        <tr>
                            <td>Unit :</td>
                            <td className='pl-4'>{stock?.unit || '--'}</td>
                        </tr>
                        <tr>
                            <td>Issued At :</td>
                            <td className='pl-4'>{stock?.issuedAt ? formatDate(stock?.issuedAt) : '--'}</td>
                        </tr>
                        <tr>
                            <td>Location :</td>
                            <td className='pl-4'>{stock?.location || '--'}</td>
                        </tr>
                    </tbody>
                </table>

                {/* <div className='mt-4 flex flex-col gap-2'>
                    <p>Nomenclature: {stock?.nomenclature || '--'}</p>
                    <p>Aircraft Name: {stock?.aircraftId?.aircraftName || '--'}</p>
                    <p>Available Qty: {availableQuantity ? (availableQuantity % 1 === 0 ? availableQuantity : availableQuantity.toFixed(2)) + `${' (' + stock?.unit + ')'}` : '--'} {availableQuantity < stock?.minimumQuantity && <span className='text-white text-xs bg-red-500 p-[1px]'>Low Stock</span>}</p>
                    <p>Card No.: {stock?.cardNo || '--'}</p>
                    <p>Stock/Part No.: {stock?.stockNo || '--'}</p>
                    <p>Unit: {stock?.unit || '--'}</p>
                    <p>Issued At: {stock?.issuedAt ? formatDate(stock?.issuedAt) : '--'}</p>
                    <p>Location: {stock?.location || '--'}</p>
                </div> */}
            </div>
            <div className='rounded-md'>
                <Image src={stock?.imageUrl} alt={stock?.nomenclature || 'Stock Image'} width={300} height={300} className='rounded-md border' />
            </div>
        </div>
    );
};

export default StockDetails;