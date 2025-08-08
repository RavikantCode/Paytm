'use server'

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function p2ptransfer(tonumber:string,amount:Number){

    const session = await getServerSession(authOptions);
    const FromUserId = session?.user?.id;


    if(!FromUserId){
        return {
            message:"Error while Sending"
        }
    }

    try {
        const tosuer = await prisma.user.findUnique({
            where:{number:tonumber}
        })

        if(!tosuer){
            return {
                message:"User Doesnt Exist"
            }
        }

        await prisma.$transaction(async(tx:any)=>{

            // await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(FromUserId)} FOR UPDATE`;

            const frombalance = await tx.balance.findUnique({
                where:{userId:Number(FromUserId)}
            })

            if(!frombalance || frombalance.amount < Number(amount)){
                throw new Error('Insufficient Balances')
            }

            await tx.balance.update({
                where:{userId:Number(FromUserId)},
                data:{
                    amount:{decrement:Number(amount)}
                }
            })

            await tx.balance.update({
                where:{userId:Number(tosuer.id)},
                data:{
                    amount:{increment:Number(amount)}
                }
            })

            await tx.p2pTransfer.create({
                data:{
                    fromUserId:Number(FromUserId),
                    toUserId:tosuer.id,
                    amount,
                    timestamp:new Date()
                }
            })
        })
    } catch (error) {
        console.log(error);
        
    }

}