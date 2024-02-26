import React from 'react'
import { useRouter } from 'next/router'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function slug() {
    const router = useRouter()
    return <p>Post: {router.query.slug}</p>
}

export const getServerSideProps = async({params, req, res}) =>{
    const {slug} = params
    const docQuery = query(collection(db, "links"), where("path", "==", slug ))
    const data = await getDocs(docQuery)
    const docs = []
    data.forEach((doc)=>{
        docs.push(doc.data())
    })
    // console.log(docs)
    res.writeHead(302, { Location: docs[0]?.originalURL ?? "/" });
    res.end()
    return {props:{}}
}