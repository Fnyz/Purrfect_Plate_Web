'use client'

import React, { useEffect, useState } from 'react'
import { FaBalanceScale } from "react-icons/fa";
import { BiEditAlt, BiSave, BiPlay, BiPause} from "react-icons/bi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BiRfid, BiPlus, BiCalendar } from "react-icons/bi";
import { Avatar } from '@mui/material';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { petsData } from '../animeData';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image from 'next/image';
import { collection, addDoc, query, onSnapshot, serverTimestamp , doc, updateDoc, where} from "firebase/firestore";
import { db } from '../firebase';
import Swal from 'sweetalert2'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import AudioRecorder from './AudioRecorder';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { BiX } from "react-icons/bi"; 
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:2,
  zIndex:0,
  p: 2,
};


const style1 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius:2,
  zIndex:0,
  p: 4,
};







function AddPetsForm() {
  const [warn, setWarning] = React.useState(false);
  const [RfidGranded, setRfidGranded] = React.useState('');
  const [rfidtaken , setRfidtaken] = React.useState(false);
  const [goalMonthSet, setGoalMonths] = React.useState(false);
  const [value, setValue] = React.useState();
  const [value1, setValue1] = React.useState();
    const [showVisibility, setShowVisibility] = React.useState(false);
    const [specified, setSpecifiedPet] = useState(false);
    const [dog, setDog] = React.useState([]);
    const [cat, setCat] = React.useState([]);
    const [choose, setChoose] = React.useState('https://img.freepik.com/free-vector/cute-shiba-inu-dog-flying-with-bone-cartoon-vector-icon-illustration-animal-nature-icon-isolated_138676-5800.jpg?size=626&ext=jpg');
    const [petname, setPetName] = React.useState('');
    const [age, SetPetAge] = React.useState('');
    const gender = [
      {val: 'male', label: 'Male' },
      {val: 'female', label: 'Female' },
    ]

    const slot = [
      {val: "1", label: 'Slot 1' },
      {val: "2", label: 'Slot 2' },
    ]
    const kindPet = [
      {val: 'dog', label: 'Dog' },
      {val: 'cat', label: 'Cat' },
      {val: 'specified', label: 'Specified type' },
    ]
    const [placeSlot, setPetSlot] = React.useState('');
    const [petKind, setPetKind] = React.useState('');
    const [genders, setGenders] = React.useState('');
    const [rfid, SetRfid] = React.useState('');
    const [weight, SetWeight] = React.useState('');
    const [goalWeight, SetGoalWeight] = React.useState('');
    const [petDatas, setPetDatas] = React.useState([]);
    const [credential, setCredential] = React.useState({});
    const [click1, setClick1] = useState(false);
    const [click, setClick] = useState(false);
    const [click2, setClick2] = useState(false);
    const [Base64, setBase64] = React.useState('')
    const [audioRecord, setAudioRecord] = React.useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    const [petId, setPetID] = React.useState('');
    const [show, setShow] = React.useState(false);
  

    const getAllDatas = () => {
      const q = query(collection(db, "List_of_Pets"));
     onSnapshot(q, (querySnapshot) => {
    const dt = [];
    querySnapshot.forEach((doc) => {
        dt.push({data:doc.data()});
    });
  
    setPetDatas(dt);
 
   
  });
  
    }
  
    useEffect(()=>{
      getAllDatas();
      handleShowCredData();
    },[])


  





    
    useEffect(()=> {
      console.log(petname);
      const user = localStorage.getItem("credentials")
      if(user){
          const datas = JSON.parse(user);
          const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName));
          onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
           if (change.type === "modified" &&  change.doc.data().Weight && change.doc.data().Token === 0) {
            SetWeight(change.doc.data().Weight)
            setClick(false);
            return;
          }
        });
      
      });


      }
  },[click, weight])


  useEffect(()=> {
   
    const user = localStorage.getItem("credentials")
    if(user){
        const datas = JSON.parse(user);
        const q = query(collection(db, "List_of_Pets"), where("DeviceName", "==", datas.DeviceName));
        onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
        if (change.type === "modified" && change.doc.data().Rfid && parseInt(change.doc.data().Token) === 0 && change.doc.data().Petname === petname) {
          const a = petDatas.find(d => d.data?.Rfid == change.doc.data().Rfid && d.data.Petname.trim() !== change.doc.data().Petname.trim());
          setRfidGranded("");
          
          if(!a){
            setRfidtaken(false);
            setRfidGranded("");
            SetRfid(change.doc.data().Rfid)
            setClick1(false);
            return;
          }
          
  
            setRfidtaken(true);
            SetRfid("");
            setRfidGranded(`RFID is already taken on pet ${RfidGranded}; please try to generate a new RFID.`);
            setTimeout(() => {
              setRfidtaken(false);
              setRfidGranded("");
            }, 3000);

          
  
            setClick1(false);
            return;
       
   
          
       

       
           
          
         
      
        }

      });
    
    });


    }
},[click1, rfid])
  


    const handleShowCredData = () => {
      const user = localStorage.getItem("credentials")
      if(user){
          const datas = JSON.parse(user);
          setCredential(datas);
      }
    }

    const handleSubmit = async () => {

      setClick2(true)
  
      if(!petname || !genders || !age){
        setClick2(false)
        Swal.fire({
          title: "Warning?",
          text: "Please input all fields.",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Yes, I will.",
          
         
        })
      
        return;
      }

      if(!Base64){
        setClick2(false)
        Swal.fire({
          title: "Warning?",
          text: "Please add a voice record for your pet; that is mandatory.",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Yes, I will.",
          
         
        })
      
        return;
      }
  
       const res = petDatas.find(d => d.data.Petname.toLowerCase().trim() === petname.toLowerCase().trim() && d.data.DeviceName.toLowerCase().trim() === credential.DeviceName.toLowerCase().trim());
      
       if(!res){
        
        const addListPet = await addDoc(collection(db, "List_of_Pets"), {
          DeviceName:credential.DeviceName.trim(),
          Petname: petname,
          Gender:genders,
          Rfid:rfid,
          Weight:weight,
          GoalWeight:goalWeight,
          Age:age,
          image:choose || null,
          synced:false,
          petType:petKind,
          RecordingFile:Base64 || null,
          requestWeight: false,
          requestRfid: false,
          Token:0,
          StartGoalMonth: dayjs(value?.$d || null).format('MM/DD/YYYY'),
          EndGoalMonth:  dayjs(value1?.$d || null).format('MM/DD/YYYY'),
          Slot:parseInt(placeSlot),
          Created_at: Date.now(),
          Updated_at: Date.now(),
        });
  
        if(addListPet.id){
          setClick2(false)
          setOpenModal(true);
          setPetID(addListPet.id);
           

        
        }

        setClick2(false)
  
        return;
       }
  
       if(res.Petname.toLowerCase().trim() === petname.toLowerCase().trim()){
        setClick2(false)
        setPetName('');
   
        Swal.fire({
          title: "Warning?",
          text: "Pet is already exists!",
          icon: "warning",
          confirmButtonColor: "#FAB1A0",

          confirmButtonText: "Try again",
        })
       }
        
    }

    const handleUpdateChange = async () => {


      if(!weight || !rfid){
        setRfidtaken(true);
        setRfidGranded('Weight and Rfid are required, please try again!')
        setTimeout(() => {
          setRfidtaken(false);
          setRfidGranded("");
        }, 3000);
       
            return;
      }


      const petWeightss = doc(db, "List_of_Pets", petId);
      await updateDoc(petWeightss, {
        Token: 1,
        requestWeight:false,
        requestRfid:false,
        GoalWeight:goalWeight,
      }).then( async()=>{
    
        setOpenModal(false)
    
        Swal.fire({
          title: "Success?",
          text: "Successfully added new pet!",
          icon: "success",
          confirmButtonColor: "#FAB1A0",
          confirmButtonText: "Okay",
        })

        await addDoc(collection(db, "Petbackup_data"), {
          DeviceName:credential.DeviceName.trim(),
          Petname: petname,
          Gender:genders,
          Rfid:rfid,
          Weight:weight,
          GoalWeight:goalWeight,
          Age:age,
          image:choose || null,
          synced:false,
          petType:petKind,
          RecordingFile:Base64,
          Slot:parseInt(placeSlot),
          requestWeight: false,
          requestRfid: false,
          Token:0,
          StartGoalMonth: dayjs(value?.$d || null).format('MM/DD/YYYY'),
          EndGoalMonth:  dayjs(value1?.$d || null).format('MM/DD/YYYY'),
          Created_at: Date.now(),
          Updated_at: Date.now(),
        }).then(()=>{
          setGenders('');
          SetGoalWeight('');
          SetPetAge('');
          SetRfid('');
          SetWeight('');
          setBase64('')
          setTimeout(() => {
            window.location.href="/dashboard"
          }, 3000);
        });

  
      })
  
    }
  


    const handleFakeRFID = async () => {
   
      const petRrfid = doc(db, "List_of_Pets", petId);
      await updateDoc(petRrfid, {
        requestRfid: true,
        Token:0,
        Rfid:"",
      }).then(()=>{
        setClick1(true);
        addDoc(collection(db, "Task"), {
          type:'request_rfid',
          deviceName:credential.DeviceName.trim(),
          document_id:petId,
          request:placeSlot,
        })
      })
  
    }
  
    const handleFakeWeight = async () => {
      
      const petWeightss = doc(db, "List_of_Pets", petId);
      await updateDoc(petWeightss, {
        requestWeight: true,
        Token:0,
        Weight:"",
      }).then(()=>{
        setClick(true);
        addDoc(collection(db, "Task"), {
          type:'request_weight',
          deviceName:credential.DeviceName.trim(),
          document_id:petId,
          request:placeSlot,
        })
      })
  
    }

    const handlePlayAudio = () => {
      audioRecord.play()
      setIsPlaying(true);
      audioRecord.addEventListener('ended', handleAudioEnded);
    }

    const handlePauseAudio = () => {
      audioRecord.pause()
      setIsPlaying(false);
    }

    const handleAudioEnded = () => {
      setIsPlaying(false);

  
    };


 


 

    
  React.useEffect(()=>{
    const dog = petsData.filter(item => item.category === 'Dog');
    const cat = petsData.filter(item => item.category === 'Cat');

    setDog(dog);
    setCat(cat);

  },[])

  return (
    <Card className="w-full">
    <CardHeader>
     <CardTitle>Add pet!</CardTitle>
     <CardDescription>Fill out this form below.</CardDescription>
    </CardHeader>
    <CardContent>
    <div className=' flex justify-center items-center'>
    <div className='border p-1 rounded-full border-[#FAB1A0] relative '>
        <Avatar
  alt="Remy Sharp"
  src={choose}
  sx={{ width: 100, height: 100, objectFit:'contain' }}
/>      
        </div>
    </div>
    
    <Sheet>
      <SheetTrigger asChild >
        <div className='my-4 flex justify-center items-center'>
        <div className='flex justify-center items-center gap-1 p-3  rounded-md  bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer max-md:w-[200px]'>
        <BiEditAlt  size={15} color='white' />
          <label className='text-[10px] text-white font-bold cursor-pointer'>CHOOSE PET IMAGE</label>
        </div>
        </div>
     
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>CHOOSE YOUR IMAGE</SheetTitle>
          <SheetDescription>
            Feel free to choose it your favorite image here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <label className='font-bold text-blue-500  opacity-50'>Dog's</label>
          <ImageList  cols={3} rowHeight={115}>
      {dog.map((item) => (
        <ImageListItem key={item.image}>
          <div className={`${item.image === choose && "border-2 border-[#FAB1A0]"} w-[100px] h-[100px] m-1 border  overflow-hidden rounded-md relative hover:border hover:border-[#FAB1A0]`} onClick={()=>{
            setChoose(item.image)
          }}>
          <Image 
          src={item.image}
          fill
          objectFit='contain'
          className='p-2'
          />
          </div>
         
        </ImageListItem>
      ))}
    </ImageList>


    <label className='font-bold text-pink-500 opacity-50'>
  
       Cat's</label>
          <ImageList  cols={3} rowHeight={115}>
      {cat.map((item) => (
        <ImageListItem key={item.image}>
          <div className={`${item.image === choose && "border-2 border-[#FAB1A0]"} border m-1 w-[100px] h-[100px]  overflow-hidden rounded-md relative hover:border hover:border-[#FAB1A0]`} onClick={()=> setChoose(item.image)}>
          <Image 
          src={item.image}
          fill
          objectFit='contain'
          className='p-2'
          />
          </div>
         
        </ImageListItem>
      ))}
    </ImageList>

    
    <Button component="label" variant="contained" className='opacity-60' startIcon={<CloudUploadIcon />} >
      Upload file
      <VisuallyHiddenInput type="file" onChange={(event)=> {
       const file = event.target.files[0]
       setChoose(URL.createObjectURL(file));
      }}/>
    </Button>
         
         
        </div>
        <SheetFooter>
          <SheetClose asChild>
          <div className='border p-2 flex justify-center items-center gap-2 shadow-sm rounded-md  border-[#FAB1A0] hover:shadow-md transition-all ease-in cursor-pointer w-full'>
<BiSave size={20} color='#FAB1A0'/>
<label className='text-[#FAB1A0] font-bold cursor-pointer'>SAVE CHANGES</label>

</div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    
     <form>
       <div className="grid w-full items-center gap-4">

         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="petname">Petname</Label>
           <Input id="petname" placeholder="Name of pet here" value={petname} onChange={(e)=>{
              setPetName(e.target.value);
            }} />
         </div>
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="age">Age</Label>
           <Input id="age" placeholder="Input Age here"  value={age} onChange={(e)=>{
              SetPetAge(e.target.value);
            }} />
         </div>
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="gender">PetFeeding Slot</Label>
           <Select  onValueChange={(e)=> setPetSlot(e)}  >
             <SelectTrigger id="gender">
               <SelectValue placeholder="Select slot here" />
             </SelectTrigger>
             <SelectContent position="popper ">
              {slot.map((d, i)=> {
                return (
                  <SelectItem value={d.val} key={i}>{d.label}</SelectItem>
                )
              })}
         
            
             </SelectContent>
           </Select>
         </div>
         <div className="flex flex-col space-y-1.5">
           <Label htmlFor="gender">Gender</Label>
           <Select  onValueChange={(e)=> setGenders(e)}  >
             <SelectTrigger id="gender">
               <SelectValue placeholder="Select Gender" />
             </SelectTrigger>
             <SelectContent position="popper ">
              {gender.map((d, i)=> {
                return (
                  <SelectItem value={d.val} key={i}>{d.label}</SelectItem>
                )
              })}
         
            
             </SelectContent>
           </Select>
         </div>
         <div className='flex justify-center items-center gap-5 w-full '>
         {specified ? (
               <div className='flex justify-between w-full  items-center  gap-2'>
    
               <div className="flex flex-col w-full space-y-1.5 ">
                 <Label htmlFor="rfid">Input type of pet</Label>
                 <Input id="rfid" placeholder="Set type pet here"  className='w-full'   value={petKind} onChange={(e)=>{
                   
                    if(e.target.value.toLowerCase().trim() === "dog" || e.target.value.toLowerCase().trim()=== "cat"){
                      Swal.fire({
                        title: "Warning?",
                        text: "Type of pet is already exist.",
                        icon: "warning",
                        confirmButtonColor: "#FAB1A0",
                        confirmButtonText: "Try another one type",
                        
                       
                      })

                      setPetKind("")
                    
                    }else{
                      setPetKind(e.target.value.toLowerCase().trim())
                    }
                  }}/>
               </div>
               <div className=' gap-2 h-[40px] mt-5  flex justify-center items-center w-[10%] max-md:w-[20%] rounded-sm cursor-pointer   bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in' onClick={()=>{
                setSpecifiedPet(false);
               }}>
                 <BiX size={25} color='white' className='block'/>
    
               </div>
          
              
             
               </div>
         ): (
          <div className="flex flex-col space-y-1.5 w-full">
          <Label htmlFor="gender">What type of pet?</Label>
          <Select  onValueChange={(e)=> {
           if(e === "specified"){
            setPetKind("")
             setSpecifiedPet(true);
             return;
           }
           setPetKind(e)
          }}  >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select here" />
            </SelectTrigger>
            <SelectContent position="popper ">
             {kindPet.map((d, i)=> {
               return (
                 <SelectItem value={d.val} key={i}>{d.label}</SelectItem>
               )
             })}
        
           
            </SelectContent>
          </Select>
        </div>
         )}

         

         </div>
        
    
 
    
         <div className="flex flex-row justify-center items-center gap-1">
       <span className='font-bold opacity-60' >Record your voice to call your pet.</span>
       <span className='italic font-bold text-red-500 opacity-60 hover:opacity-100 cursor-pointer transition-all ease-in' onClick={()=> setShowVisibility(true)}>Click here</span>
      
         </div>
         <Modal
        open={showVisibility}
  
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style}>
        <div className='w-full justify-center  flex flex-col px-5'>
         <h1 className='font-bold'>Add Record for Pet</h1>
         <span className='text-[12px] mb-3 opacity-40 font-bold'>Click recording to start record your voice.</span>
         <AudioRecorder isAddPet={true} setBase64={setBase64} setAudioRecord={setAudioRecord} setShow={setShow}/>
       
         {show && (
          <>
            <span className='mt-5 text-[12px] opacity-40 font-bold mb-2'>Click here to listen your recorded file</span>
            <div className='w-full flex justify-center items-center  border p-2 rounded-md shadow-sm cursor-pointer hover:shadow-md' onClick={!isPlaying ? handlePlayAudio : handlePauseAudio}>
     {isPlaying ? <>

<BiPause color='#FAB1A0' size={24}/>
<span className='text-[#FAB1A0] font-bold'>Pause</span>

</>: <>

  <BiPlay color='#FAB1A0' size={24}/>
       <span className='text-[#FAB1A0] font-bold'>Play</span>
     
     </>}
      </div>
          </>
    

         )}
    
          </div>
       
      <div className='flex gap-2 mt-4 '>
          
          <div className=" mx-5 w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={()=> setShowVisibility(false)}>
          <BiX size={24} color='white' />
           <span className='text-white font-bold'>Close</span>
          </div>
      </div>
        </Box>
      </Modal>

       </div>
     </form>



    


     <Modal
        open={openModal}
  
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style}>
        <div className='w-full justify-center  flex flex-col px-5'>
         <h1 className='font-bold'>Add pet Weight and RFID</h1>
         <span className='text-[12px] mb-3 opacity-40 font-bold'>Click the button to provide the weight and rfid.</span>
      
         <div className='flex justify-between  items-center  gap-2'>
    
         <div className="flex flex-col w-full space-y-1.5 ">
            <Label htmlFor="rfid" className="font-bold">RFID</Label>
           <Input id="rfid" placeholder="Generate RFID here" disabled   value={rfid} onChange={(e)=>{
              SetRfid(e.target.value);
            }}/>
         </div>
         <div  className=' gap-2 h-[40px] mt-5 flex justify-center items-center w-full rounded-sm cursor-pointer   bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in' onClick={handleFakeRFID}>
         {click1 ?
 <>

  <span className='text-sm font-bold text-white'>
   PLEASE WAIT...
  </span>
 </>
          : 
            <>
           
           <BiRfid size={20} color='white' className='max-md:hidden block'/>
             <label className='text-white font-bold cursor-pointer'>Set RFID</label>
            </>
           
         }
          
         </div>
    
        
       
         </div>
         {rfid && (

<div className='flex justify-between  items-center  gap-2 mt-2  '>
    
<div className="flex flex-col w-full space-y-1.5 ">
<Label htmlFor="rfid">Weight</Label>
<Input id="weight"  placeholder="Pet weight"  value={weight} onChange={(e)=>{
          SetWeight(e.target.value);
        }}  />
</div>
<div className={`gap-2 cursor-pointer h-[40px] mt-5 flex justify-center items-center w-full rounded-sm  hover:bg-[coral] transition-all ease-in   bg-[#FAB1A0] `} onClick={handleFakeWeight}>
 
{click ?
<>

<span className='text-sm font-bold text-white'>
PLEASE WAIT...
</span>
</>
      : 
        <>
       
       <FaBalanceScale size={20} color='white' className=' max-md:hidden block'/>
<label className='text-white font-bold cursor-pointer'>Weight PET</label>
        </>
       
     }

     
     

</div>


 </div>
)}

  
   
        
     <div className="flex flex-col mt-3 space-y-1.5">

<Label htmlFor="goalWeight" className="mb-1 font-bold">Goal Weight</Label>
<Input id="goalWeight" placeholder="Input goal weight of pet"  value={goalWeight} onChange={(e)=>{
   SetGoalWeight(e.target.value);
 }} />
 
</div>

{goalMonthSet ? (
 <div className='my-3'>
  <div className='w-full flex justify-between items-center'>
  <label className='font-bold'>  Select Goal Month:</label>
  <BiX size={25} color='red' className='opacity-60 hover:opacity-100 cursor-pointer' onClick={()=> setGoalMonths(false)}/>
    </div>
 <LocalizationProvider dateAdapter={AdapterDayjs}>
 <DemoContainer components={['DatePicker', 'DatePicker']}>
   <DatePicker label="Start Date:"   value={value1}
     onChange={(newValue) => setValue1(newValue)}/>
   <DatePicker
     label="End Date"
     value={value}
     onChange={(newValue) => setValue(newValue)}
   />
 </DemoContainer>
</LocalizationProvider>
 </div> 

 ): (

<div className='mt-3 gap-1 flex'>
      <span className='font-bold opacity-60'>Do you want to set the goal month?</span>
      <span className='italic text-red-500 font-bold opacity-60 hover:opacity-100 cursor-pointer' onClick={()=> {
       setWarning(true);
      }}>Click here.</span>
    </div>

 )}
 

          </div>
          <div className='flex gap-2 mt-4 '>
          
          <div className=" mx-5 w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={handleUpdateChange}>
          
          <BiSave size={20} color='white'/>
           <span className='text-white font-bold'>Submit</span>
          </div>
      </div>
       
      <div className='flex gap-2 mt-3 '>
          
          <div className=" mx-5 w-full flex items-center gap-2 border p-2 justify-center rounded-md  border-[#FAB1A0] opacity-50 hover:opacity-100  transition-all ease-in cursor-pointer" onClick={()=>{
            setGenders('');
            SetGoalWeight('');
            SetPetAge('');
            SetRfid('');
            SetWeight('');
            setPetName('');
            setBase64('')
            setOpenModal(false)
          }} >
          <BiX size={24} color='#FAB1A0' />
           <span className='text-[#FAB1A0] font-bold'>Close</span>
          </div>
      </div>
        </Box>
      </Modal>

      <Modal
        open={rfidtaken}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      
      >
        <Box sx={style1} >
          <div className='flex flex-col justify-center items-center w-full gap-2'>
          <Image
        width={150}
        height={150}
        src="/Image/output-onlinegiftools (8).gif"
        contentFit="cover"
       
      />

 
   
      <p className='font-bold text-sm opacity-70 text-center'>{RfidGranded}</p>
 
          </div>
     
        </Box>
      </Modal>
      <Modal
        open={warn}
  
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style}>
          <div className='w-full flex justify-center items-center'>
          <Image
        width={170}
        height={170}
        src="/Image/KawaiDog.png"
        contentFit="cover"
       
      />
          </div>
      
        <div className='w-full justify-center  flex  px-5'>
         <span className='text-[20px] font-bold mr-1 text-[#FAB1A0]'>|</span>
         <span className='text-[20px] mb-3 opacity-40 font-bold'>Please make sure you have already consulted the professional before setting the goal for the month.</span>
      
          </div>
          <div className='flex gap-2 mt-4 '>
          
          <div className=" mx-5 w-full flex items-center gap-2 border p-2 justify-center rounded-md bg-[#FAB1A0] hover:bg-[coral] transition-all ease-in cursor-pointer" onClick={()=> {
            setWarning(false);
            setGoalMonths(true);  
          }}>
          <BiCalendar color='white' size={20} />
           <span className='text-white font-bold'>Set Goal month now</span>
          </div>
      </div>
       
      <div className='flex gap-2 mt-3 '>
          
          <div className=" mx-5 w-full flex items-center gap-2 border p-2 justify-center rounded-md  border-[#FAB1A0] opacity-50 hover:opacity-100  transition-all ease-in cursor-pointer" onClick={()=>{
             setWarning(false);
          }} >
          <BiX size={24} color='#FAB1A0' />
           <span className='text-[#FAB1A0] font-bold'>Close</span>
          </div>
      </div>
        </Box>
      </Modal>
    </CardContent>
    <CardFooter className="flex justify-between">
     <div className='border px-4 py-2 rounded-md  border-[#FAB1A0] text-[#FAB1A0] font-bold cursor-pointer hover:border-[coral] hover:text-[coral] ' onClick={()=>{
      setPetName("")
      SetPetAge("");
      SetRfid("");
      SetWeight("");
      SetGoalWeight("");
     }}>CLEAR</div>
     <div onClick={handleSubmit} className='flex transition-all ease-in  justify-center items-center gap-1 border py-2 px-4 rounded-md bg-[#FAB1A0] text-white shadow-sm cursor-pointer hover:bg-[coral]'>
     {click2 ?
 <>

  <span className='text-sm font-bold text-white'>
   PLEASE WAIT...
  </span>
 </>
          : 
            <>
           
           <BiSave size={20} />
      <label className=' cursor-pointer font-bold '>SUBMIT</label>
            </>
           
         }
      
      </div>
   
    </CardFooter>
    </Card>
  )
}

export default AddPetsForm