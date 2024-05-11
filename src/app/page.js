'use client'

import { Dialog } from "primereact/dialog";
import AircraftCard from "./components/AircraftCard/AircraftCard";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";


export default function Home() {

  const toast = useRef(null);

  const [addNew, setAddNew] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, control, formState: { errors }, handleSubmit, reset } = useForm();


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


  const handlePhotoChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAddNewAircraft = async (aircraftData) => {
    setLoading(true);
    // console.log("Add New Aircraft", aircraftData);
    // console.log(image);

    const aircraftPhoto = new FormData();
    aircraftPhoto.append('image', image);

    await fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
      method: 'POST',
      body: aircraftPhoto
    })
      .then(res => res.json())
      .then(data => {
        console.log("inside imgbb api: ", data);

        if (data?.data?.url) {
          aircraftData.image = data.data.url
          fetch('http://localhost:5000/api/v1/aircraft', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              // 'Authorization': `Bearer ${cookie.get('TOKEN')}`
            },
            body: JSON.stringify(aircraftData)
          })
            .then(res => res.json())
            .then(data => {
              if (data.status == 'Success') {
                console.log(data);
                // toast.current.show({ severity: 'success', summary: 'Success', detail: 'Employee profile created', life: 3000 });
              }
              else {
                console.log(data);
                // toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Please try again.', life: 3000 });
              }
            })
        }
      })

    setLoading(false);
    setAddNew(false);
    setImage(null)
    reset();
  }


  return (
    <main>
      <Toast ref={toast} />
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
        <form onSubmit={handleSubmit(handleAddNewAircraft)} className="flex flex-col gap-2 mt-4">

          {/* <InputText placeholder="Aircraft Name" className="border-2" />
          <InputText placeholder="Aircraft ID" className="border-2" /> */}
          <div className='w-full'>
            <InputText
              {...register("aircraftName", { required: "Aircraft Name is required" })}
              placeholder="Aircraft Name*" className='w-full border p-1' />
            {errors.aircraftName?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraftName.message}</span>}
          </div>
          <div className='w-full'>
            <InputText
              {...register("aircraftId", { required: "Aircraft ID is required" })}
              placeholder="Aircraft ID*" className='w-full border p-1' />
            {errors.aircraftId?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraftId.message}</span>}
          </div>
          {/* 
          <div className='w-full'>
            <FileUpload
              {...register("aircraftPhoto", { required: "Photo is required" })}
              mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Browse Photo" />
            {errors.aircraftPhoto?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraftPhoto.message}</span>}
          </div> */}
          <div className='mt-2'>
            <input
              {...register("aircraftPhoto", { required: "Photo is required" })}
              onChange={handlePhotoChange} name='file' type="file" className='w-full border border-violet-600' />
            {errors.aircraftPhoto?.type === 'required' && <span className='text-xs text-red-500' role="alert">{errors.aircraftPhoto.message}</span>}
          </div>

          <div>
            <Button type="submit" label="Submit" className="bg-blue-400 text-white w-fit p-1"></Button>
          </div>
        </form>
      </Dialog>
    </main>
  );
}
