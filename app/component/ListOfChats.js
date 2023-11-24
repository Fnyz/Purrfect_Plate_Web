'use client'

import React, { useEffect, useState , useMemo, useRef} from 'react'
import {  BiX, BiCircle , BiMailSend} from "react-icons/bi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { collection, doc, updateDoc, addDoc, getDocs, serverTimestamp, query, orderBy, onSnapshot, where, connectFirestoreEmulator} from "firebase/firestore"; 
import { db } from '../firebase';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Input } from "@/components/ui/input"
import moment from 'moment';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius:2,
    p: 4,
  };



function ListOfChats() {

    const [message, setMessage] = React.useState('');
    const [deviceName, setDeviceName] = useState('');
    const [data, setData] = useState({})
    const [messageSend, setSendMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const [active, setActive] = useState(false);
    const [image, setImage] = useState("");
    const [email, setEmail] = useState("")
    const [imageAdmin, setImageAdmin] = useState("");
    
 
    const messagesContainerRef = useRef(null);
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
      // Scroll to the bottom when messages change
      scrollToBottom();
  
    }, [message]);

    
    const scrollToBottom = () => {
      // Check if the container reference exists
      if (messagesContainerRef.current) {
        // Scroll to the bottom of the container
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    };




    


    
    const handleOpen = (device) => {

        const res =  allMessages.find(d => d.data.deviceName === device);
        const a = res.data.message.find(m => m.type === 'User');
        setUserName(a.username)
        setDeviceName(device)
        setEmail(res.data.sender)
        setOpen(true)

       
 

       
    };
    const handleClose = () => {
       
      const dts = allMessages.find((d) => d.data.deviceName === deviceName && d.data.sender === email);
        
      const docRef = doc(db, 'Messages', dts.id);
      updateDoc(docRef, {
        hasSeen:true,
     }).then(()=>{
      setOpen(false);
       console.log('update send message success')
     });


    };
    
  


    useEffect(()=> {

        const q = query(collection(db, "users"));
        onSnapshot(q, (querySnapshot) => {
       const dt = [];
       querySnapshot.forEach((doc) => {
           dt.push({data:doc.data(), id:doc.id});
       });
       const res = dt.find(a=> a.data.username === userName);
       setActive(res?.data.isActive)
       setImage(res?.data.image)
      

       
     });
    },[open])


    useEffect(()=> {

      const q = query(collection(db, "users"));
      onSnapshot(q, (querySnapshot) => {
     const dt = [];
     querySnapshot.forEach((doc) => {
         dt.push({data:doc.data(), id:doc.id});
     });
     const res = dt.find(a=> a.data.username === 'Admin' && a.data.isAdmin === true);
     setImageAdmin(res.data.image)
     console.log(res.data.image);
    

     
   });
  },[])

    useEffect(()=>{
        const q = query(collection(db, "Messages"), where("hasDevice", "==", true));
        onSnapshot(q, (querySnapshot) => {
       const dt = [];
       querySnapshot.forEach((doc) => {
           dt.push({data:doc.data(), id:doc.id});
       });
       setAllMessages(dt);
       });

     
    },[])


 
    
    
  





  

    const handleSubmit = async () => {
        const initialMessage = [
            {
              message: message,
              username: 'Admin',
              image: image,
              type: 'Admin',
              messagedate: new Date(),
              image:imageAdmin,
              unseen:false,
            }
          ]


       
      
      
      

      
      
      
          
          const dts = allMessages.find((d) => d.data.deviceName === deviceName && d.data.sender === email);
        
              const currentMessage  = dts.data.message || [];
              const updatedMessages = [...currentMessage, ...initialMessage];
              const docRef = doc(db, 'Messages', dts.id);
              updateDoc(docRef, {
                adminSend:false,
                message:updatedMessages,
             }).then(()=>{
               setSendMessage('')
               setMessage('')
               console.log('update send message success')
             });
      
      
            
        }

 
      const dataMessage = (m, device) => {
      
        return m.find(d => d.data.deviceName === device);
    
      }
    
     
    
    
      const dMessage = useMemo(()=> dataMessage(allMessages, deviceName), [allMessages, deviceName]);
 


  return (
    <>
    <Card className="w-[640px] border h-[600px]">
    <CardHeader>
     <CardTitle>List of Chats</CardTitle>
     <CardDescription>See the list of chats below.</CardDescription>
    </CardHeader>
    <CardContent>

  
       <ScrollArea className=" h-[450px] items-center gap-4 " >
         {allMessages.map((res,i)=>{
            return (
                <div className={`flex ${!res.data.hasSeen && "border-[#FAB1A0]"} p-3 rounded-md justify-between border border-5 items-center mb-2 cursor-pointer hover:shadow-md`} key={i} onClick={()=>{
                    handleOpen(res.data.deviceName)
                          
          const dts = allMessages.find((d) => d.data.deviceName === res.data.deviceName && d.data.sender === res.data.sender);
             if(dts.data.hasSeen === false){
                     const docRef = doc(db, 'Messages', dts.id);
             updateDoc(docRef, {
              hasSeen:true,
           }).then(()=>{
             console.log('seen now!')
           });

           const q = query(collection(db, "Notifications"), where("User", "==", res.data.sender), where("hasSeen", "==", false));
             onSnapshot(q, (querySnapshot) => {
            const dt = [];
            querySnapshot.forEach((doc) => {
                dt.push({data:doc.data(), id:doc.id});
            });
           
            dt.map(a => {
             const docRef = doc(db, 'Notifications', a.id);
           updateDoc(docRef, {
             hasSeen:true,
          }).then(()=>{
            console.log('update notification success')
          });
            })
     
            });
        
           return;
             }

             

             return;

        
         
                }}>
                <div className='flex justify-center items-center gap-4'>
                   <div className={` ${!res.data.hasSeen && "border-[#FAB1A0]"} border p-1 rounded-full  relative `}>
               <Avatar
         alt="Remy Sharp"
         src={res.data.Image || "/Image/anyaCuttie.jpg"}
         sx={{ width: 50, height: 50 }}
       />      
               </div>
                   <div className='flex flex-col justify-center'>
                       <span className={`font-bold max-md:text-[15px] ${!res.data.hasSeen  && "text-[#FAB1A0]"}`}>{res.data.sender}</span>
                       <span className={`text-sm opacity-60 max-md:text-[13px] ${!res.data.hasSeen  && "text-[#FAB1A0]"}`}>{res.data.message[res.data.message.length - 1]?.message || "You read the message."}</span>
                   </div>
                   </div>
                
                   <div className={`text-[12px] opacity-70  ${!res.data.hasSeen && "text-[#FAB1A0]"}`}>
                        {moment(res.data.message[res.data.message.length - 1]?.messagedate.toDate()).calendar()}
                   </div>
                </div>
            )
         })}

       </ScrollArea>
  
    </CardContent>
   
    </Card>

    <div>
   
      <Modal
        open={open}
      
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div className='flex justify-between mb-4'>
         
          <div className='flex justify-center items-center gap-4'>
            <div className='border p-1 rounded-full border-[#FAB1A0] relative '>
        <Avatar
  alt="Remy Sharp"
  src={image ||"/Image/anyaCuttie.jpg"}
  sx={{ width: 50, height: 50 }}
/>      
        </div>
            <div className='flex flex-col justify-center'>
                <span className='font-bold max-md:text-[15px]'>{userName}</span>
                {active ? (
  <div className=' flex items-center gap-1 w-full'>
  <span className='text-sm opacity-60 max-md:text-[13px]'>Active now</span>
  <BiCircle size={10} color='green' className=' bg-green-700 overflow-hidden rounded-full'/>
  </div>

                ): (
                    <div className=' flex items-center gap-1 w-full'>
                    <span className='text-sm opacity-60 max-md:text-[13px]'>Offline now</span>
                    <BiCircle size={10} color='red' className=' bg-red-700 overflow-hidden rounded-full'/>
                    </div>
    
                )}
              
                
               
            </div>
            </div>
         
          <BiX size={30} onClick={handleClose} color='red' className='cursor-pointer'/>
        </div>
        <div   className="element-with-scroll h-[300px] mb-5 border rounded-md p-2  " ref={messagesContainerRef}>

           {dMessage?.data.message && dMessage?.data.message.map((d, i)=>{
            return (
                <div  className= {`space-y-2 flex items-center ${d.type === "Admin" && "ml-[157px]" }   ${d.type === "Admin"? "w-[50%]" : "w-[100%]" } gap-2 mb-2  `}>
                <div>
                <Avatar
  alt="Remy Sharp"
  src={d.image||"/Image/anyaCuttie.jpg"}
  sx={{ width: 40, height: 40 }}
/>      
                </div>
                <div className='flex flex-col'>
                    <label className='text-[10px] opacity-70'>{d.username} / {moment(d.messagedate.toDate()).calendar()}</label>
                    <label className='text-[13px] opacity-80 font-bold'>{d.message}</label>
                </div>
               </div>

            )
           })}
          

           
           
        </div>

        <div className='w-full flex gap-2' >
          <Input  placeholder='Input message here' className='w-3/4'  onChange={(e)=> setMessage(e.target.value)} value={message}/>
          <div className=' rounded-md w-1/4 p-2 gap-1 justify-center font-bold flex items-center text-white bg-[#FAB1A0] cursor-pointer hover:bg-[coral]' onClick={handleSubmit} >
         <BiMailSend size={20} color='white'/>
          <span>SEND</span>
         </div>
         </div>
       
        </Box>
      </Modal>
    </div>
 
    </>
  )
}

export default ListOfChats