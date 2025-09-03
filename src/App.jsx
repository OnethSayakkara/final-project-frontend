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




    </Routes>
    </>
  )
}

export default App
