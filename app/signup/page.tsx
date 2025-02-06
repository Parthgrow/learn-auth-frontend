"use client"
import { Card,  CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
export default function Page(){

    const [formValues, setFormValues] = useState({name : "", password : ""})

    const handleSubmit = (e : any)=>{
        e.preventDefault() ; 
        console.log("It's working")
        console.log("The value of formValues is ", formValues)


    }
    return(
        <>

            <div className="flex items-center justify-center">
                <Card className="flex flex-col items-center p-4">

                    <CardContent className="font-semibold">
                        Signup Page 
                    </CardContent>

                    <form action="" onSubmit={handleSubmit}>

                        <label  htmlFor="">Username</label>
                        <Input name="name" placeholder="enter you name " value={formValues.name} onChange={(event)=>{setFormValues({...formValues, name : event?.target.value})}}/>

                        <label htmlFor="">Password</label>
                        <Input name="password" placeholder="enter your password" value={formValues.password} onChange={(event)=>{setFormValues({...formValues, password : event?.target.value})}}/>


                        <Button type="submit">Sign Up</Button>



                    </form>

                </Card>
               
            </div>
        
        
        
        </>
    )
}