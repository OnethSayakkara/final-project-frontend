import { Routes,Route } from "react-router-dom"

import AdminLayout from "./AdminLayout"
import AdminDashboard from "./AdminDashBoard"
import EventsManagement from "./EventsManagement"
import EventDetails from "./EventDetails"
import AdminsList from "./AdminsList"
import OrganizersList from "./OrganizersList"
import OrganizerDetailsModel from "./OrganizerDetailsModal"



const AdminRoutes = () => {
  return (
    <div>
       <Routes>
       <Route path="/" element={<AdminLayout/>}>
       <Route index element={<AdminDashboard />} />
       <Route path="/admindashboard" element={<AdminDashboard />} />
       <Route path="/allevents" element={<EventsManagement />} />
       <Route path="events/:id" element={<EventDetails />} />
        <Route path="/admins" element={<AdminsList />} />
         <Route path="/organizers" element={<OrganizersList />} />
         <Route path="organizers/:id" element={<OrganizerDetailsModel />} />
       {/* <Route path="/emailupdates" element={<EmailCampaign />} />
       <Route path="/registerevents" element={<CreateEventForm />} />   */}

      

       
       </Route>
       </Routes>
    </div>
  )
}

export default AdminRoutes
