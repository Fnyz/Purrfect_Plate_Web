'use client'

import React, { useState , useEffect} from 'react'
import Image from 'next/image'
import {collection, query, where, onSnapshot , orderBy} from "firebase/firestore";
import { db } from '../firebase';


function TotalUser({position}) {


    
  const [listOfUser, setListOfUser] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(()=>{
    const q = query(collection(db, "notifications"), where("type", "==", "Admin"),  where("hasSeen", "==", false));
    onSnapshot(q, (querySnapshot) => {
   const dt = [];
   querySnapshot.forEach((doc) => {
       dt.push({data:doc.data(), id:doc.id});
   });
   setNotifications(dt);
   });

 
},[])

  
  useEffect(()=>{


    const q = query(collection(db, "users"), where("isAdmin", "==", false), where("hasDevice", "==", true));
    const data = [];  
    onSnapshot(q, (querySnapshot) => {
   querySnapshot.forEach((docing) => {
      data.push({dt: docing.data(), id: docing.id});

   });

    if(position === "WITHDEVICE" ){
      setListOfUser(data);
      return;
    }
    
    if(position === "WITHOUTDEVICE"){
      const q = query(collection(db, "users"), where("isAdmin", "==", false),where("hasDevice", "==", false));
          const data = [];  
          onSnapshot(q, (querySnapshot) => {
         querySnapshot.forEach((docing) => {
            data.push({dt: docing.data(), id: docing.id});
    
         });
          setListOfUser(data);
      
       });
    }

    if(position === "ALLUSER"){
      const q = query(collection(db, "users"), where("isAdmin", "==", false));
          const data = [];  
          onSnapshot(q, (querySnapshot) => {
         querySnapshot.forEach((docing) => {
            data.push({dt: docing.data(), id: docing.id});
    
         });
          setListOfUser(data);
      
       });
    }
   
   
 
 
  
 });




    },[position])

  return (
    <div className='w-4/5  flex '>
    <div className='flex flex-row gap-2 '>
        <div className=' w-[170px] border h-20 rounded-md  shadow-sm'>
            <h1 className='pl-2 text-[10px] pt-1'> {notifications.length - 1 > 0 ? "Notifications": "Notification"}</h1>
            <div className='flex'>
                <span className='flex-1  pl-2 font-bold opacity-[0.8]'><span className='text-[#FAB1A0]'>|</span> {notifications.length}</span>
                
                <div className=' flex-1 relative h-[50px] opacity-[0.7]'>
                <Image
        src="/Image/output-onlinegiftools (2).gif"
        layout='fill'
        className='fill-black stroke-2'
        alt='icons'
        />
                </div>  
            
            </div>
        </div>
        <div className=' w-[170px] border h-20 rounded-md  shadow-sm '>
        <h1 className='pl-2 text-[10px] pt-1'>{listOfUser.length -1 > 0 ? "User's": "User"}</h1>
            <div className='flex'>
                <span className='flex-1  pl-2 font-bold opacity-[0.8]'><span className='text-[#FAB1A0]'>|</span> {listOfUser.length}</span>
                <div className=' flex-1 relative h-[50px] w-[210px] '>
                <Image
        src="/Image/output-onlinegiftools (3).gif"
        layout='fill'
      
        alt='icons'
        />
                </div>
            </div>
        </div>
        <div className=' w-[150px]  h-20 rounded-md relative max-md:hidden block'>
        <Image
        src="/Image/undraw_sign_in_re_o58h.svg"
        layout='fill'
        alt='icons'
        />
        </div>
        
    </div>
   
</div>
  )
}

export default TotalUser