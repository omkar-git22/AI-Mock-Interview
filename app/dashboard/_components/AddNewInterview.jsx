"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';
  

function AddNewInterview() {

    const [openDialog,setOpenDialog] = useState(false);
    const [jobPosition,setJobPosition] = useState();
    const [jobDesc,setJobDesc] = useState();
    const [jobExperience,setJobExperience] = useState();
    const [loading,setLoading] = useState(false)
    const [JsonResponse,setJsonResponse] = useState([])
    const router  =useRouter();
    const {user} = useUser();

    const onSubmit =async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log(jobPosition,jobDesc,jobExperience)

        const InputPrompt = "Job Position: "+jobPosition+", Job Description: "+jobDesc+", Years Of Experience:"+jobExperience+" Depend on this information please give me "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions with answers in JSON format.Give question and answer as field in JSON."

        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResp = (result.response.text()).replace('```json','').replace('```','')

        //console.log(JSON.parse(MockJsonResp))
        setJsonResponse(MockJsonResp);

        if(MockJsonResp){

        const resp = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp:MockJsonResp,
          jobPosition:jobPosition,
          jobDesc:jobDesc,
          jobExperience:jobExperience,
          createdBy:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD-MM-yyyy')
        }).returning({mockId:MockInterview.mockId})

        console.log("Inserted ID: ",resp)

        if(resp) {
          setOpenDialog(false)
          router.push('/dashboard/interview/'+resp[0]?.mockId)
        }

      }else{
        console.log("error")
      }
        setLoading(false)
    }

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary
      hover: scale-105 hover:shadow-md cursor-pointer transition-all'
      onClick={() => setOpenDialog(true)}>
        <h2 className='font-bold text-lg text-center'>+ Add New</h2>
      </div>

          <Dialog open={openDialog}>
              
              <DialogContent className='max-w-xl'>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">Tell us more about Job you are interviewing</DialogTitle>
                      <DialogDescription>
                        <form onSubmit={onSubmit}>
                        <div>
                            <h2>Add Details about your Job Position/Role, Job Description and Years of Experience</h2>

                            <div className='mt-7 my-3'>
                                <label htmlFor="">Job Role/Job Position</label>
                                <Input placeholder="Ex. Full Stack Developer" required
                                onChange={(event) => setJobPosition(event.target.value)}
                                />  
                            </div>

                            <div className='mt-7 my-3'>
                                <label htmlFor="">Job Description/  Tech Stack (In Short)</label>
                                <Textarea placeholder="Ex. React, Angular, Node.js, MySql etc" required
                                onChange={(event) => setJobDesc(event.target.value)}
                                />  
                            </div>

                            <div className='mt-7 my-3'>
                                <label htmlFor="">JYears Of Experience</label>
                                <Input placeholder="Ex. 5" type="number" max="100" required
                                onChange={(event) => setJobExperience(event.target.value)}
                                />  
                            </div>

                        </div>

                          <div className='flex gap-5 justify-end'>
                            <Button type="button" variant='ghost' onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                              {loading?
                              <><LoaderCircle className='animate-spin'/>'Generating From AI'</>:'Start Interview'
                              }
                              </Button>
                          </div>
                          </form>
                      </DialogDescription>
                  </DialogHeader>
              </DialogContent>
          </Dialog>

    </div>
  )
}

export default AddNewInterview
