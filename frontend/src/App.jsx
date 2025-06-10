import { BrowserRouter,Route,Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import {Toaster} from "sonner"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage.jsx";
import ProductsDetail from "./components/Products/ProductsDetail";
import CheckOut from "./components/Cart/CheckOut.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from "./components/Admin/OrderManagement.jsx";


import {Provider} from "react-redux"
import store from "./redux/store"
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";
  
export default function App() {
  return (
    <Provider store={store}>
    <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath:true}}>
    {
      /*www.rabbit.com/home
      www.rabbit.com/products
      www.rabbit.com/cart */}

    <Toaster position="top-right" />


    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        
  
      <Route path="/login" element={<Login />} /> {/* ✅ Fixed Here */}
      <Route path="/register" element={<Register />}/>
      <Route path="/profile" element={<Profile />}/>
       <Route path="collections/:collection" element={<CollectionPage />}/>
      <Route path="product/:id" element={<ProductsDetail />}/> 
      <Route path="checkOut" element={<CheckOut/>} />
      <Route path="order-confirmation" element={<OrderConfirmation/>}/>
      <Route path="my-orders" element={<MyOrdersPage/> }/>

      <Route path="order/:id" element={<OrderDetailsPage/>}/>

     </Route>
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout/></ProtectedRoute>}>
      {/* Admin Layout */}
      <Route index element={<AdminHomePage />}/>
      <Route path="users" element={<UserManagement />}/>
      <Route path="products" element={<ProductManagement />}/>
      <Route path="products/:id/edit" element={<EditProductPage />}/>
      <Route path="orders" element={<OrderManagement />}/>

      </Route>
      


    </Routes>
    </BrowserRouter>
    </Provider>
  )
}