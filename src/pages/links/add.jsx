import NavbarHeader from '@/components/Navbar'
import React, { useRef, useState } from 'react'
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import {Input} from "@nextui-org/react";
import { authMiddleware } from '@/util/authMiddleware';
import { useRouter } from 'next/router';

export default function add(props) {
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const [data, setData] = useState({})
    const router = useRouter()

    const handleKeyDown = (e, ref) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent form submission
          ref.current.focus(); // Focus on the next input
        }
      };

      const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const res = await fetch("https://nest-lnk-2432ca7b74f8.herokuapp.com/links", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.token}`
                },
                body: JSON.stringify({...data, shortURL: "https://nafhan.site/"+data.path})
              })
              if (res.ok) {
                router.push("/links")
              }
              
        } catch (error) {
            console.log(error)
        }
        
          
      }
  return (
    <>
    <NavbarHeader/>
    <div className="mx-auto max-w-6xl">
    <div className="my-3 flex justify-center">
    <Card className="flex py-2 px-4 rounded-xl absolute min-h-96 min-w-96" >
        <CardHeader>
            Add Link
        </CardHeader>
      <CardBody className="flex-col items-start flex mb-auto pb-auto gap-y-5">
        <form className='flex-col items-start flex mb-auto pb-auto gap-y-5 flex-1 w-full'>
            
       
        <Input ref={inputRef1} onChange={((e)=> setData({...data, path: e.target.value}))} type='text' label="path" labelPlacement="outside" placeholder='zoom' onKeyDown={(e) => handleKeyDown(e, inputRef2)} />
        <Input ref={inputRef2} onChange={((e)=> setData({...data, originalURL: e.target.value}))} type='text' label="url" labelPlacement="outside" placeholder="https://zoom.id/vf2sa-asc23-2xcd"  onKeyDown={(e) =>e.key == "Enter"?handleSubmit(): null}/>
        <div className="flex flex-row gap-3 justify-end w-full">
            <Button color="default">
            Cancel
            </Button>
            <Button onClick={handleSubmit} color="default" type='submit' className='hover:bg-gradient-to-r hover:from-blue-500 hover:via-violet-500 hover:to-red-400 hover:bg-300% hover:scale-105 hover:animate-gradient'>
            Submit
            </Button>
        </div>
        </form>
        </CardBody>
    </Card>
    </div>
    </div>
    </>
    
  )
}

export const getServerSideProps = async(context) =>{
    return authMiddleware(context)
  }