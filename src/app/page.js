'use client'

import { Dialog } from "primereact/dialog";
import AircraftCard from "./components/AircraftCard/AircraftCard";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { getAllAircraft } from "../../lib/Aircraft";
import Cookies from "universal-cookie";
import Login from "./components/Login/Login";
import { getLoggedInUser } from "../../lib/User";
import { useRouter } from "next/navigation";
import bgImage from '../assets/images/bg-image.jpg'
import Image from "next/image";


export default function Home() {

  const cookie = new Cookies();
  const router = useRouter();

  const toast = useRef(null);

  const [user, setUser] = useState({});
  const [allAircraft, setAllAircraft] = useState([]);
  const [addNew, setAddNew] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, control, formState: { errors }, handleSubmit, reset } = useForm();

  const getAircraftData = async () => {
    const data = await getAllAircraft();
    console.log(data);
    setAllAircraft(data?.data);
  }
  const getUser = async (token) => {
    const user = await getLoggedInUser(token);
    if (!user) {
      router.push('/');
      router.replace('/');
    }
    setUser(user);
  }

  useEffect(() => {
    getAircraftData();
    getUser(cookie.get('TOKEN'));
  }, []);


  const handlePhotoChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleAddNewAircraft = async (aircraftData) => {
    setLoading(true);
    // console.log("Add New Aircraft", aircraftData);
    // console.log(image);

    const aircraftPhoto = new FormData();
    aircraftPhoto.append('image', image);

    const uploadResponse = await fetch('http://localhost:5000/api/v1/upload', {
      method: 'POST',
      body: aircraftPhoto
    });

    const uploadData = await uploadResponse.json();

    if (uploadData.status === 'Success') {
      console.log("image uploaded and db inserting");
      // Add the uploaded image path to the stock data
      aircraftData.image = uploadData.filePath;

      fetch('http://localhost:5000/api/v1/aircraft', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${cookie.get('TOKEN')}`
        },
        body: JSON.stringify(aircraftData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status == 'Success') {
            getAircraftData();
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'New Aircraft Added', life: 3000 });
          }
          else {
            toast.current.show({ severity: 'error', summary: 'Failed!', detail: data?.error, life: 3000 });
          }
        })
    }

    // await fetch('https://api.imgbb.com/1/upload?key=a0bd0c6e9b17f5f8fa7f35d20163bdf3', {
    //   method: 'POST',
    //   body: aircraftPhoto
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log("inside imgbb api: ", data);

    //     if (data?.data?.url) {
    //       aircraftData.image = data.data.url
    //       fetch('http://localhost:5000/api/v1/aircraft', {
    //         method: 'POST',
    //         headers: {
    //           'content-type': 'application/json',
    //           // 'Authorization': `Bearer ${cookie.get('TOKEN')}`
    //         },
    //         body: JSON.stringify(aircraftData)
    //       })
    //         .then(res => res.json())
    //         .then(data => {
    //           console.log(data);
    //           if (data.status == 'Success') {
    //             getAircraftData();
    //             toast.current.show({ severity: 'success', summary: 'Success', detail: 'New Aircraft Added', life: 3000 });
    //           }
    //           else {
    //             toast.current.show({ severity: 'error', summary: 'Failed!', detail: data?.error, life: 3000 });
    //           }
    //         })
    //     }

    //     else {
    //       toast.current.show({ severity: 'error', summary: 'Failed!', detail: 'Image Upload Failed', life: 3000 });
    //     }

    //   })

    setLoading(false);
    setAddNew(false);
    setImage(null)
    reset();
  }

  if (!user) {
    return <div className="relative h-[100vh] w-full">
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="relative z-10">
        <Login />
      </div>
    </div>
  }


  return (
    <main>
      <Toast ref={toast} />
      <div className="flex justify-between mx-4">
        <h1 className="text-3xl font-bold">All Aircrafts</h1>
        {user?.role == "Admin" && <Button onClick={() => setAddNew(true)} label="Add New" icon="pi pi-plus" className=" text-white p-1" />}
      </div>
      <div className='flex justify-around gap-8 flex-wrap mt-4'>
        {
          allAircraft?.map((aircraft) => (
            // <AircraftCard key={aircraft.id} id={aircraft.id} title={aircraft.title} imageSrc={aircraft.imageSrc} imageAlt={aircraft.imageAlt} />
            <AircraftCard key={aircraft._id} aircraft={aircraft} />
          ))
        }
      </div>

      <Dialog header="Add New Aircraft" visible={addNew} onHide={() => { setAddNew(false); reset() }}
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
            <Button type="submit" label="Submit" className="text-white w-fit p-1" loading={loading}></Button>
          </div>
        </form>
      </Dialog>
    </main>
  );
}
