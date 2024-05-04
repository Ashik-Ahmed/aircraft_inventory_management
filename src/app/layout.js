import { Inter } from "next/font/google";
import "./globals.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css";
import { PrimeReactProvider } from "primereact/api";
import Sidebar from "./components/Sidebar/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aircraft Inventory anagement",
  description: "Aircraft Parts Inventory",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <PrimeReactProvider>
        <body className='flex'>
          <div className="">
            <Sidebar />
          </div>
          <div className="p-4 bg-gray-100 flex-grow overflow-y-auto">
            {children}
          </div>
        </body>
      </PrimeReactProvider>
    </html>
  );
}
