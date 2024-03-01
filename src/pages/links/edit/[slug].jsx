import NavbarHeader from '@/components/Navbar'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardBody, CardHeader, Button, Skeleton } from '@nextui-org/react';
import {Input} from "@nextui-org/react";
import { authMiddleware } from '@/util/authMiddleware';
import { useRouter } from 'next/router';
import useDataFetching from '@/util/getLink';

export default function editLink(props) {
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null); 
    const router = useRouter()
    const {data, isLoading, error} = useDataFetching("https://nest-lnk-2432ca7b74f8.herokuapp.com/links/"+router.query.slug, props.token)
    if (error) {
      router.push("/login")
    }
    // useEffect(()=>{
    //   inputRef1.current.value = data?.path ?? "";
    //   inputRef2.current.value = data?.originalURL ?? "";
      
    // }, [isLoading, data])
    const handleKeyDown = (e, ref) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent form submission
          ref.current.focus(); // Focus on the next input
        }
      };

      const handleSubmit = async (e)=>{
        e.preventDefault();
        try {
            const res = await fetch("https://nest-lnk-2432ca7b74f8.herokuapp.com/links/" + router.query.slug, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${props.token}`
                },
                body: JSON.stringify({originalURL: inputRef2.current.value})
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
            Edit Link
        </CardHeader>
      <CardBody className="flex-col items-start flex mb-auto pb-auto gap-y-5">
        <form className='flex-col items-start flex mb-auto pb-auto gap-y-5 flex-1 w-full'>
            
       {isLoading?(<>
        <Skeleton className="h-10 w-full rounded-lg"/>
        <Skeleton className="h-10 w-full rounded-lg"/>
       </>):(<>
        <Input disabled defaultValue={data?.path ?? null} ref={inputRef1} type='text' label="path" labelPlacement="outside" placeholder='zoom' onKeyDown={(e) => handleKeyDown(e, inputRef2)} />
        <Input defaultValue={data?.originalURL ?? null} ref={inputRef2} type='text' label="url" labelPlacement="outside" placeholder="https://zoom.id/vf2sa-asc23-2xcd"  onKeyDown={(e) =>e.key == "Enter"?handleSubmit(): null}/>
       </>)}
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