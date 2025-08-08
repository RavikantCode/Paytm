'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function OnRampTransaction(amount:number,provider:string){

    const session = await getServerSession(authOptions); //tryy to get the session here only dont pass it as context 
    const token = Math.random().toString()

    const userId = session.user.id;

    if(!userId){
        return{
            message:"User Not Logged in"
        }
    }
    await prisma.onRampTransaction.create({
        data:{
            userId:Number(userId),
            amount:amount,
            provider:provider,
            status:"Processing",
            startTime:new Date(),
            token:token
        }
    })

}