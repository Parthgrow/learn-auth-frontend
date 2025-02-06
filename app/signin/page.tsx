"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
export default function Page(){

    const [formValues, setFormValues] = useState({username : "", password : ""}) ; 
    const [loading, setLoading] = useState<boolean>(true) ;  
    const router = useRouter() ; 
    // console.log("This is the value of the token from the cookie",Cookies.get('authToken'))
    const handleSubmit = async(e : any)=>{

        e.preventDefault() ;
        // console.log("I am working")
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {method : "POST", headers : {'Content-Type' : 'application/json' }, body : JSON.stringify({...formValues})})
        const repData = await response.json() ; 
        
        if(response.ok)
        {

            
            Cookies.set("authToken", repData.token, {expires : 0.00139})
            Cookies.set("refreshToken", repData.refreshToken, {expires : 0.003125})
            router.push('/dashboard')
            console.log("The value from the backend is ", repData) ; 



        }


    }

    useEffect(()=>{

        const checkAuthentication = ()=>{
            const cookie = Cookies.get("authToken") ; 
            if(!cookie)
            {
                setLoading(false)
                console.log("The user is not signed in")
            }
            else
            {
                console.log("The user is signed in ")
                router.push("/dashboard")
            }
        }

        checkAuthentication() ;
    },[router])


    if(loading)
    {
        return(
            <div>...is loading</div>
        )
    }
    return(
        <>
            <div>
                <Card className="w-[50%] m-2 p-2">

                    {JSON.stringify(formValues)}

                    <form action="" onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle> Sign in </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Input value={formValues.username} onChange={(e)=>{setFormValues({...formValues, username : e.target.value})}} placeholder="Enter your user name"/>
                        <Input value={formValues.password} onChange={(e)=>{setFormValues({...formValues, password : e.target.value })}} placeholder="Enter your password" />
                    </CardContent>

                    <Button type="submit" className="text-center">Submit</Button>

                    </form>


                </Card>
            </div>
        
        
        
        </>
    )
}