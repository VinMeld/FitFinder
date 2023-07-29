'use client'
import React, {useEffect} from 'react'
import { useState } from "react";
import { navLinks } from "../../../public";
import Image from 'next/image'
import { useAuth } from '../components/providers/supabase-auth-provider'; 
import { usePathname, useRouter } from 'next/navigation'
export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter()
  const pathName = usePathname();
  useEffect(() => {
    console.log(pathName)
    if (pathName.includes('profile')) {
      setActive('Profile')
    } else {
      setActive('Home')
    }
  }, [pathName]);
    
  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <a href="/" className="flex items-center gap-2">
        <Image src="/FitFinderLogoTextBig.png" width="224" height="50" alt="FitFinder"/>
      </a>
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        { 
        user ?
        <>
        {
        navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] mr-10 ${
              active === nav.title ? "text-slate-300	" : "text-slate-500"
            } `}
            onClick={() => {
              router.push(`${nav.id}`)
              setActive(nav.title)}}
          >
            {nav.title}
          </li>
        ))}
         <li
            key="signout"
            className={`font-poppins font-normal cursor-pointer text-[16px] mr-0 ${
              "text-slate-700"
            }`} 
            onClick={
              signOut}
          >
            <p>Sign Out</p>
          </li>
          </>
      :
          <a
            key='/'
            className={`font-poppins font-medium cursor-pointer text-[16px] ${
 "text-slate-400" 
            } ${ "mb-0"}`}
            onClick={() =>{ 
              console.log("here")
              router.push(`/`)
            setActive("Home")}}
          >
            <a href={`/`} className='text-slate-50'>Home</a>
          </a>}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image
          src={toggle ? "/close.svg" : "/menu.svg"}
          alt="menu"
          width="28" height="28"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {
              user ?
            navLinks.map((nav, index) => (

              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-slate-400	" : "text-slate-50"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => {
                  router.push('/profile')
                setActive(nav.title)}}
              >
                <a href={`#${nav.id}`} className='text-slate-50'>{nav.title}</a>
              </li>
            ))
          :
          <li
            key='/'
            className={`font-poppins font-medium cursor-pointer text-[16px] ${
 "text-slate-400" 
            } ${ "mb-0"}`}
            onClick={() => {
              router.push('/')
            setActive("Home")}}
          >
            <a href={`/`} className='text-slate-50'>Home</a>
          </li>
          }
          </ul>
        </div>
      </div>
    </nav>
  );
};