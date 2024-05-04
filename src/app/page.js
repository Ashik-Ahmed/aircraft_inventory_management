import AircraftCard from "./components/AircraftCard/AircraftCard";
import { Button } from "primereact/button";


export default function Home() {

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

  return (
    <main>
      <div className="flex justify-between mx-4">
        <h1 className="text-3xl font-bold">All Aircrafts</h1>
        <Button label="Submit" />
        <Button label="Hello Button" />
      </div>
      <div className='flex justify-around gap-4 flex-wrap mt-4'>
        {
          aircrafts.map((aircraft) => (
            <AircraftCard key={aircraft.id} id={aircraft.id} title={aircraft.title} imageSrc={aircraft.imageSrc} imageAlt={aircraft.imageAlt} />
          ))
        }
      </div>
    </main>
  );
}
