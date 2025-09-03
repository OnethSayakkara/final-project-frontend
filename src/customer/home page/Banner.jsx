

const Banner = () => {
  return (
    <div 
      className="relative h-40 flex justify-around items-center text-white px-6"
      style={{ backgroundImage: "url('/banner1.jpg')" }}
    >
      {/* Purple overlay */}
      <div className="absolute inset-0 bg-purple-900/80 "></div>

      {/* Content */}
      <div className="relative flex justify-around items-center font-family-inter w-full">
        <div className="text-center">
          <p className="text-3xl font-medium">LKR 39,842,620.46</p>
          <p className="text-lg mt-1">Donations Raised</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-medium">519</p>
          <p className="text-lg mt-1">Fundraising Campaigns</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-medium">211</p>
          <p className="text-lg mt-1">Organisations that trust us</p>
        </div>
      </div>
    </div>
  )
}

export default Banner
