import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CreateNews from "./pages/CreateNews";
import { Provider } from "react-redux";
import store from "./redux/store";
import { journalistLoader } from "./loaders/roleLoaders";
import authLoader from './loaders/authLoader';
import Login from "./pages/Login";
import { userLoader } from "./loaders/roleLoaders";
import UserDashboard from "./pages/UserDashboard";
import NewsDetails from "./pages/NewsDetails";
import JournalistDashboard from "./pages/JournalistDashboard";
import EditNews from "./pages/EditNews";
import AdminDashboard from "./pages/AdminDashboard";
import { adminLoader } from "./loaders/roleLoaders";
import { useEffect , useRef} from "react";
import { listenForMessages } from "./firebaseForeground";
import { getFCMToken } from "./utils/getFCMToken";
import { getMessagingInstance } from "./firebase";
import NotificationSettings from "./pages/NotificationSettings";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: authLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
  path: "/settings/notifications",
  element: <NotificationSettings />,
  loader: authLoader,
  hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
  </div>
},
   {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    loader: adminLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/dashboard",
    element: <UserDashboard />,
    loader: userLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path:"/news/:id",
     element:<NewsDetails />,
      loader: authLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
     
  },
  {
    path: "/journalist/dashboard",
    element: <JournalistDashboard />,
    loader: journalistLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/journalist/createnews",
    element: <CreateNews />,
    
  },
  {
    path: "/journalist/editnews/:id",
    element: <EditNews />,
    
  }

 
]);

const App = () => {
const initialized = useRef(false);

  useEffect(() => {
    const initFCM = async () => {
      if (initialized.current) return; 
      initialized.current = true;

      if (!("serviceWorker" in navigator)) return;

      try {
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("Service Worker registered");

        const messaging = await getMessagingInstance();
        if (!messaging) return;

        await getFCMToken(messaging);
        listenForMessages(messaging);

      } catch (err) {
        console.error("SW registration failed:", err);
      }
    };

    initFCM();
  }, []);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Provider>
  )
}

export default App;