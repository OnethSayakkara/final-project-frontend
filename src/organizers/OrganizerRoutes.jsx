import { Routes,Route } from "react-router-dom"
import OrganizerLayout from "./OrganizerLayout"
import Dashboard from "./Dashboard"
import EventsManagement from "./EventsManagement"
import DonationManagement from "./DonationManagement"
import EmailCampaign from "./EmailCampaign"
import CreateEventForm from "./CreateEventForm"
import BankSlipManagement from "./BankSlipManagement"



const OrganizerRoutes = () => {
  return (
    <div>
       <Routes>
       <Route path="/" element={<OrganizerLayout/>}>
       <Route index element={<Dashboard />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/events" element={<EventsManagement />} />
       <Route path="/donations" element={<DonationManagement />} />
       <Route path="/emailupdates" element={<EmailCampaign />} />
       <Route path="/registerevents" element={<CreateEventForm />} />
       <Route path="/bank-slip-approval" element={<BankSlipManagement />} />

      

       
       </Route>
       </Routes>
    </div>
  )
}

export default OrganizerRoutes
