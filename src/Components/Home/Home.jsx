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
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden">

      {/* HERO SECTION */}
      <div
        className='h-screen w-full relative 
        bg-[url("https://images.unsplash.com/photo-1461784121038-f088ca1e7714?q=80&w=1170&auto=format&fit=crop")] 
        bg-cover bg-center bg-purple-600/30 bg-blend-soft-light'
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <h1 className="text-white absolute top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2 
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
          font-bold text-center px-4">
          Connect. <br />
          <span className="text-yellow-400">Collaborate.</span> <br />
          Create Music.
        </h1>

        <p className="absolute bottom-28 sm:bottom-32 left-1/2 
          -translate-x-1/2 text-white 
          text-sm sm:text-base md:text-lg 
          font-semibold text-center px-4 max-w-xl">
          Join thousands of musicians worldwide. Find your perfect bandmate,
          share your talent, and create amazing music together.
        </p>

        <ChevronDownIcon
          className="w-7 h-7 sm:w-8 sm:h-8 text-white animate-bounce 
          left-1/2 bottom-12 absolute -translate-x-1/2"
        />
      </div>

      {/* FEATURES */}
      <div className="py-16 px-4 md:px-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Everything You Need to Make Music
        </h1>

        <p className="text-center mt-4 text-gray-600 text-lg sm:text-xl">
          Jam provides tools to connect, collaborate, and grow your musical journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {[
            { icon: <UserIcon className="w-6 h-6" />, title: "Personalized Profiles", desc: "Create your musician profile with instruments, interests, and more." },
            { icon: <VideoCameraIcon className="w-6 h-6" />, title: "Video Sharing", desc: "Upload performances and get discovered by musicians worldwide." },
            { icon: <MapPinIcon className="w-6 h-6" />, title: "City-Based Discovery", desc: "Find musicians in your area for jam sessions and bands." },
            { icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, title: "Real-Time Chat", desc: "Message musicians instantly and plan collaborations." },
            { icon: <BookOpenIcon className="w-6 h-6" />, title: "Resource Library", desc: "Access sheet music, tutorials, and music learning content." },
          ].map((item, i) => (
            <div key={i} className="bg-gray-200 shadow-xl rounded-2xl p-6">
              <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center text-gray-700">
                {item.icon}
              </div>
              <h1 className="font-semibold mt-4 text-xl">{item.title}</h1>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}

          <div className="bg-gray-200 shadow-xl rounded-2xl p-6">
            <div className="p-3 w-12 h-12 rounded-xl bg-purple-300 flex items-center justify-center">
              <i className="ri-team-line text-xl"></i>
            </div>
            <h1 className="font-semibold mt-4 text-xl">Instrument Communities</h1>
            <p className="mt-2 text-gray-600">
              Join groups for guitar, piano, drums, vocals, and more.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative h-[60vh] bg-cover bg-center 
        bg-[url('https://images.unsplash.com/photo-1565719178004-420e3480e2b5?q=80&w=1170')]">
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 gap-6">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
            Ready to Start Your Musical Journey?
          </h1>

          <p className="text-white font-semibold max-w-xl">
            Join thousands of musicians who are already creating, collaborating,
            and sharing their passion for music on Jam.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="bg-yellow-500 px-6 py-3 rounded-xl hover:bg-yellow-600">
              Get Start Free
            </Link>
            <Link to="/discover" className="border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-black">
              Explore Musician
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 md:px-40 py-12">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/4">
            <h1 className="font-Pacifico text-purple-600 text-2xl font-bold">Jam</h1>
            <p className="mt-2 text-gray-700">
              Connecting musicians worldwide to create, collaborate, and share their passion for music.
            </p>
            <div className="flex gap-3 mt-3 text-xl">
              <i className="ri-facebook-circle-fill"></i>
              <i className="ri-twitter-fill"></i>
              <i className="ri-instagram-fill"></i>
            </div>
          </div>

          {[
            { title: "Platform", links: ["Discover", "Communities", "Post", "Profile"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Feedback", "Community Guidelines"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
          ].map((col, i) => (
            <div key={i}>
              <h1 className="font-semibold">{col.title}</h1>
              <div className="mt-2 flex flex-col gap-1 text-sm text-gray-800">
                {col.links.map((l, j) => (
                  <Link key={j} to="*">{l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr className="my-6" />
        <footer className="text-center text-gray-500 text-sm">
          &copy; 2025 Jam. All rights reserved.
        </footer>
      </div>

    </div>
  );
};

export default Home;
