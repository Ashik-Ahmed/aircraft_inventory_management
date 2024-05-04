'use client'

import { Dialog } from "primereact/dialog";
import AircraftCard from "./components/AircraftCard/AircraftCard";
import { Button } from "primereact/button";
import { useState } from "react";
import { InputText } from "primereact/inputtext";


export default function Home() {

  const [addNew, setAddNew] = useState(false);

  const aircrafts = [
    { id: 1, title: 'Aircraft 1', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 2, title: 'Aircraft 2', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 3, title: 'Aircraft 3', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 4, title: 'Aircraft 4', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 5, title: 'Aircraft 5', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 6, title: 'Aircraft 6', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 7, title: 'Aircraft 7', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 8, title: 'Aircraft 8', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 9, title: 'Aircraft 9', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
    { id: 10, title: 'Aircraft 10', imageSrc: 'https://cdn.jetphotos.com/full/6/73985_1579885991.jpg', imageAlt: 'Some image' },
  ]

  const handleAddNewAircraft = () => {
    console.log("Add New Aircraft");
  }

  return (
    <main>
      <div className="flex justify-between mx-4">
        <h1 className="text-3xl font-bold">All Aircrafts</h1>
        <Button onClick={() => setAddNew(true)} label="Add New" icon="pi pi-plus" className="bg-blue-400 text-white p-1" />
      </div>
      <div className='flex justify-around gap-4 flex-wrap mt-4'>
        {
          aircrafts.map((aircraft) => (
            <AircraftCard key={aircraft.id} id={aircraft.id} title={aircraft.title} imageSrc={aircraft.imageSrc} imageAlt={aircraft.imageAlt} />
          ))
        }
      </div>

      <Dialog header="Add New Aircraft" visible={addNew} onHide={() => setAddNew(false)}
        style={{ width: '35vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
        <form className="flex flex-col gap-2 mt-4">

          <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" />

          <Button type="submit" label="Submit" className="bg-blue-400 text-white w-fit p-1"></Button>
        </form>
      </Dialog>
    </main>
  );
}
