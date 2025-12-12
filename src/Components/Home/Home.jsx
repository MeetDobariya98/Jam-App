import React from "react";
import {
  ChevronDownIcon,
  UserIcon,
  VideoCameraIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import "remixicon/fonts/remixicon.css";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">

      <div
        className='h-screen w-full relative 
        bg-[url("https://images.unsplash.com/photo-1461784121038-f088ca1e7714?q=80&w=1170&auto=format&fit=crop")] 
        bg-cover bg-center bg-purple-600/30 bg-blend-soft-light'
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <h1
          className='text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4'
        >
          Connect. <br />
          <span className="text-yellow-400">Collaborate.</span> <br />
          Create Music.
        </h1>

        <p
          className='absolute bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 text-white 
          text-sm sm:text-base md:text-lg font-semibold text-center px-4 max-w-xl'
        >
          Join thousands of musicians worldwide. Find your perfect bandmate,
          share your talent, and create amazing music together.
        </p>

        <ChevronDownIcon
          className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-bounce 
          left-1/2 bottom-12 absolute -translate-x-1/2"
        />
      </div>

      <div className="py-16 px-4 md:px-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Everything You Need to Make Music
        </h1>

        <p className="text-center mt-4 text-gray-600 text-lg sm:text-xl">
          Jam provides tools to connect, collaborate, and grow your musical journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          <div className="bg-gray-200 shadow-xl rounded-2xl p-6">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="font-semibold mt-4 text-xl">Personalized Profiles</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Create your musician profile with instruments, interests, and more.
            </p>
          </div>

          <div className="bg-gray-200 shadow-xl rounded-2xl p-6">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center">
              <VideoCameraIcon className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="font-semibold mt-4 text-xl">Video Sharing</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Upload performances and get discovered by musicians worldwide.
            </p>
          </div>

          <div className="bg-gray-200 shadow-xl rounded-2xl p-6">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center">
              <MapPinIcon className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="font-semibold mt-4 text-xl">City-Based Discovery</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Find musicians in your area for jam sessions and bands.
            </p>
          </div>

          <div className="bg-gray-200 shadow-xl rounded-2xl p-6">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="font-semibold mt-4 text-xl">Real-Time Chat</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Message musicians instantly and plan collaborations.
            </p>
          </div>

          <div className="bg-gray-200 shadow-xl rounded-2xl p-6">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="font-semibold mt-4 text-xl">Resource Library</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Access sheet music, tutorials, and music learning content.
            </p>
          </div>

          <div className="bg-gray-200 shadow-xl rounded-2xl p-6">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center">
              <i className="ri-team-line text-xl"></i>
            </div>
            <h1 className="font-semibold mt-4 text-xl">Instrument Communities</h1>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Join groups for guitar, piano, drums, vocals, and more.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
