import React from 'react'
import Header from '../../common/Header'
import Hero from './Hero'
import Banner from './Banner'
import FundraisingCampaigns from './FundraisingCampaigns'
import Banner2 from './Banner2'
import Footer from '../../common/Footer'
import CausesSection from './CausesSection'
import VolunteerCampaigns from './VolunteerCampaigns'

const HomePage = () => {
  return (
    <>
    <Header/>
    <Hero/>
    <Banner/>
    <FundraisingCampaigns/>
    <Banner2/>
    <VolunteerCampaigns/>
    <CausesSection/>
    <Footer/>
    </>
  )
}

export default HomePage
