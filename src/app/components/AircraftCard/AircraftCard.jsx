'use client'

import Image from "next/image";

import Link from "next/link";

const AircraftCard = ({ title, imageSrc, imageAlt, id }) => {
    return (
        <Link href={`/aircraft/${id}`} className="rounded-md">
            <div className="flex cursor-pointer">
                <div className="relative">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={300}
                        height={200}
                        className="object-cover rounded-md"
                    />
                    <div className="absolute top-20 left-0 w-full bg-black bg-opacity-50 p-4">
                        <h2 className="text-4xl font-bold text-white">{title}</h2>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default AircraftCard;