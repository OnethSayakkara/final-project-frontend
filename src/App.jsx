import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './customer/home page'
import AllEvents from './customer/otherpages/AllEvents'
import RegisterComponent from './authentication/RegisterComponent'
import OrganizerTypeSelector from './authentication/OrganizerTypeSelector'
import Login from './authentication/Login'
import DonationPage from './customer/otherpages/DonationPage'
import BankSlipPayment from './customer/payment/BankSlipPayment'
import CardPayment from './customer/payment/CardPayment'
import PaymentSuccess from './customer/payment/PaymentSuccess'
import MyProfile from './customer/profile/MyProfile'
import RegistrationSuccess from './authentication/RegistrationSuccess'
import BankSlipForm from './customer/payment/BankSlipForm'
import BankSlipSuccess from './customer/payment/BankSlipSuccess'
import OrganizerRoutes from './organizers/OrganizerRoutes'
import Categories from './customer/otherpages/Categories'
import OrganizerRegistratioComponent from './authentication/OrganizerRegistratioComponent'
import AdminRoutes from './admin/AdminRoutes'

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/allevents' element={<AllEvents/>}/>
      <Route path='/register' element={<RegisterComponent/>}/>
      <Route path='/organizerSelecter' element={<OrganizerTypeSelector/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/donation/:id' element={<DonationPage/>}/>
       <Route path="/bank-slip-payment" element={<BankSlipPayment/>} />
       <Route path="/card-payment" element={<CardPayment/>} />
       <Route path="/success" element={<PaymentSuccess/>} />
       <Route path="/my-profile" element={<MyProfile/>} />
       <Route path="/registration-success" element={<RegistrationSuccess/>} />
       <Route path="/bank-slip-success" element={<BankSlipSuccess/>} />
       <Route path="/Organizer/*" element={<OrganizerRoutes />} />
       <Route path="/Admin/*" element={<AdminRoutes />} />
       <Route path="/categories" element={<Categories />} />
      <Route path="/OrganizerRegistration" element={<OrganizerRegistratioComponent />} />




    </Routes>
    </>
  )
}

export default App
