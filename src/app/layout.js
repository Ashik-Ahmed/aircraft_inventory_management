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

  // const cookie = new Cookies();

  // const [user, setUser] = useState({})

  // useEffect(() => {
  //   if (cookie.get('TOKEN')) {
  //     fetch('http://localhost:5000/api/v1/users/getLoggedInUser', {
  //       method: 'GET',
  //       headers: {
  //         authorization: `Bearer ${cookie.get('TOKEN')}`
  //       }
  //     })
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data.user) {
  //           setUser(data.user)
  //         }
  //       })
  //   }
  // }, [])

  return (
    <html lang="en">
      <PrimeReactProvider>
        <body className='flex'>
          <div className="">
            <Sidebar />
          </div>
          <div className="p-4 bg-gray-100 w-full overflow-y-auto">
            {children}
          </div>
        </body>
      </PrimeReactProvider>
    </html>
  );
}
