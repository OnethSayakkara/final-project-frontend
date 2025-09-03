import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './customer/home page'
import AllEvents from './customer/otherpages/AllEvents'
import RegisterComponent from './authentication/RegisterComponent'
import OrganizerTypeSelector from './authentication/OrganizerTypeSelector'
import Login from './authentication/Login'
import DonationPage from './customer/otherpages/DonationPage'

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




    </Routes>
    </>
  )
}

export default App
