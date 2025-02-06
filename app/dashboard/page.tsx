"use client"
import { Button } from "@/components/ui/button"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
export default function Page(){

    const [loading, setLoading] = useState<boolean>(true)
    const [userDetails, setUserDetails] = useState<any>({})

    const router = useRouter() ; 

    const handleLogout = ()=>{

        Cookies.remove('authToken') ; 
        Cookies.remove('refreshToken')
        // you can also add a route for removing the token from the database 
        router.push('/signin')


        
    }

    useEffect(()=>{

        const getUserDetails = async()=>{

            const token = Cookies.get('authToken')

            console.log("This is the token I am finding for ", token)

            if(token && token!==undefined)
            {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-details`, {method : "GET", headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${token}`}})
                const repData = await response.json() ; 
                if(response.ok)
                {
                    setUserDetails(repData.data) ; 
                    console.log("The user details are as follows (from the backend )", repData) ; 
                }

            }

            

        }

        const refreshToken = async(refreshCookies : any)=>{

            try{

                /// next action -> to write down the logic calling the refresh token route and re-setting the token

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh-token`, {method : "GET", headers : {'Content-Type' : 'application/json', 'Authorization' : `Bearer ${refreshCookies}`}})
                const repData = await response.json() ; 
                const token = repData.token ; 
                console.log("this the refreshed access token ", token)
                Cookies.set("authToken", token, {expires : 0.00139})
                getUserDetails() ; 
              



            }
            catch(error)
            {

                console.log("There is an error at refresh token", error) ; 

            }

            

        }
        const checkAuthentication = async()=>{
            const cookies = Cookies.get('authToken') ; 
            const refreshCookies = Cookies.get('refreshToken')

            console.log("I am here at checkauthentication")

            if(!cookies)
            {

                console.log("I am here at cookies")
                console.log("This is the value of refreshCookies", refreshCookies)

                try{

                    if(refreshCookies)
                    {
                        console.log("you need to actually refresh the token using refresh token")
                        await refreshToken(refreshCookies)
                       
                        setLoading(false)


                        
                       

                    }
                    else
                    {
                        console.log("It should be re-directed to sign in ")
                        router.push('/signin')
                        
                    }

                }
                catch(error)
                {

                    console.log("There is an error at checking authentication ", error)

                }
                
            }
            else
            {
                setLoading(false)
                getUserDetails() ; 
            }
        }

       

        checkAuthentication() ; 

        
    },[])

    if(loading)
    {
        return(

            <div className="m-2">
                {/* {loading.toString()} */}
                ...isloading
            </div>
        )
    }
    return(
        <>

            <div className="flex justify-between px-4 py-2">
                {/* {loading.toString()} */}
                Hi {userDetails.username} 
                <Button onClick={handleLogout}>Logout</Button>
            </div>
            <Card className="m-2" >

                <CardHeader> 
                    <CardTitle>Here are a few things about me</CardTitle>
                </CardHeader>

                <CardContent>

                    <p>{JSON.stringify(userDetails)}</p>
                </CardContent>



            </Card>
        
        
        
        </>
    )
}