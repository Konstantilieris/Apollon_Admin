'use client'

import { use, useEffect, useState }  from "react"
import TimeSlider from "../shared/timepicker/time-slider"
import ToggleTransport from "../booking/ToggleTransport"
import { useRouter, useSearchParams } from "next/navigation";
import { cn, formUrlQuery } from "@/lib/utils";
import moment from "moment";
interface updateTNTProps{
    initialDate:Date;
    hasTransport:boolean;
   type:string;
    transportFee:number
}
 
const UpdateTNT = ({initialDate,hasTransport,transportFee,type}:updateTNTProps)=>{
    const searchParams=useSearchParams();
    const router=useRouter();
    const extractTime = moment(initialDate).format("HH:mm");
    const [time,setTime]=useState<string>();
 useEffect(()=>{
    if (!hasTransport) return ;
    const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: type,
        value: "true",
      });
    
      router.push(newUrl, { scroll: false });
    }, [hasTransport]);
const handleTimeChange=()=>{
    try {
        await updateTransportAndTime({type,time,initialDate,hasTransport,setTransport:searchParams.get(type),transportFee,path})
    } catch (error) {
        
    }
}
return (
    <div className="flex flex-col gap-1 items-start pt-5 px-4 dark:bg-dark-100 bg-light-800 w-full mt-6 rounded-lg">
        <div className="flex flex-row items-center justify-between w-full pr-6"> 
        <h1 
        className="dark:text-green-300 text-dark-100 text-lg"> Άλλαξε Χρόνο {type==='flag1'?searchParams.get(type)?'Παραλαβής':'Άφιξης':searchParams.get(type)?'Παράδοσης':'Αναχώρησης'}
        </h1>
         <div className="flex flex-row items-center gap-2">
            <ToggleTransport type={type}/>
            <span 
            className={cn('dark:text-light-700 text-dark-100 bg-light-700 dark:bg-dark-300  rounded-lg p-2 font-sans',{'dark:text-green-300 text-green-600 font-semibold':searchParams.get(type)})}>{transportFee?transportFee:0} €
            </span>
            </div>
            </div>
      
        <TimeSlider initialTime={extractTime} onTimeChange={setTime} />
        
    </div>
)


}
export default UpdateTNT