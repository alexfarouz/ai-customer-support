'use client'
import Image from "next/image";
import { useState } from "react";
import { Box, Stack } from "@mui/material";

export default function Home() {
  const [messages, setMessages] = useState({
    role: 'assistant',
    content: `Hi I'm the Headstarter Support Agernt, how can I assist you today?`
  })

  const [message, sestMessage] = useState('')

  return(
    <div className="fixed h-full w-full">
      <div className="relative h-full w-full bg-black"><div class="absolute bottom-0 left-0 right-0 top-0 
        bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
        
        
      
      </div>
    </div>
  )
}
