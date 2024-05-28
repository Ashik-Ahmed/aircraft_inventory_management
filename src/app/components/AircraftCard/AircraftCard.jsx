'use client'

import Image from "next/image";
import aircraft from '../../../assets/images/aircraft.jpg'

import Link from "next/link";

const AircraftCard = ({ aircraft }) => {
    const { _id, aircraftName, image, imageAlt = 'Aircraft Image' } = aircraft
    return (
        <Link href={`/aircraft/${_id}`} className="relative rounded-md border shadow-md hover:shadow-xl hover:shadow-blue-200 hover:scale-110 duration-100">
            <Image
                src={image}
                alt={imageAlt}
                width={220}
                height={220}
                className="object-contain rounded-md"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 rounded-b-md">
                <h2 className="text-xl font-bold text-white">{aircraftName}</h2>
            </div>
        </Link>
    );
}

export default AircraftCard;