import { Roboto } from "next/font/google";
import "./globals.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import "primereact/resources/primereact.min.css";
import { PrimeReactProvider } from "primereact/api";
import Sidebar from "./components/Sidebar/Sidebar";
import { redirect } from "next/navigation";
import Cookies from "universal-cookie";

// const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

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

  const cookie = new Cookies();

  fetch('http://localhost:5000/api/v1/user/getLoggedInUser', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${cookie.get('TOKEN')}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.status === 'Failed') {
        redirect('/');
      }
    })

  return (
    <html lang="en">
      <PrimeReactProvider>
        <main className={roboto.className}>
          <body className="flex">
            {/* <CustomLayout children={children} /> */}
            <div>
              <Sidebar />
            </div>
            <div className="p-4 bg-gray-100 w-full overflow-y-auto">
              {children}
            </div>
          </body>
        </main>
      </PrimeReactProvider>
    </html>
  );
}
