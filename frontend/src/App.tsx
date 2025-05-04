import { useEffect, useRef, useState } from 'react'
import './App.css'
import { RedirectToSignIn, RedirectToSignUp, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'

function App() {
  const { user } = useUser()
  const inputRef = useRef<null | HTMLInputElement>(null)
  const questionRef = useRef<null | HTMLInputElement>(null)
  const [chats, setChat] = useState<{ user: string, ai: string }[] | null>(null)
  const [selectedFiles, setFile] = useState('')
  const [userFiles, setUserFiles] = useState<string[]>([])
  const [processing, setProcess] = useState(false)

  useEffect(() => {
    if (user) {
      getUserFiles(user.id)
    }
  }, [user, chats])

  const handleClick = async () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleFileChange = async () => {
    if (user) {
      if (inputRef.current?.files) {
        const formData = new FormData();
        formData.append('file', inputRef.current?.files[0]);
        const req = await fetch(`http://127.0.0.1:8000/files/upload/${user?.id}`, {
          method: 'POST',
          body: formData
        })
        const res = await req.json()
        setFile(res.filename)
        getUserFiles(user.id)
      }
    } else {
      RedirectToSignUp({ signUpFallbackRedirectUrl: '/', })
    }
  }

  const handleQuestion = async () => {
    if (user) {
      if (questionRef.current && selectedFiles) {
        const question = questionRef.current.value
        setProcess(true)
        const req = await fetch(`http://127.0.0.1:8000/files/ask/${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ file: selectedFiles, question: questionRef.current.value })
        })
        const res = await req.json()

        setChat((prev) => {
          if (prev) {
            return [...prev, { user: question, ai: res.answer }]
          } else {
            // @ts-ignore
            return [{ user: question, ai: res.answer }]
          }
        })
        questionRef.current.value = ""
        setProcess(false)
      }
    } else {
      RedirectToSignUp({ signUpFallbackRedirectUrl: '/', })
    }
  }

  const getUserFiles = async (id: string) => {
    if (id) {
      const req = await fetch(`http://127.0.0.1:8000/user/${id}`, { method: 'GET' })
      if (req.status == 200) {
        const res: string[] = await req.json()
        setUserFiles(res)
      }
    }
  }

  return (
    <div className='bg-[#212121] h-[100vh] w-[100vw] flex flex-col relative'>
      <div className='w-full flex justify-between items-center bg-[#303030] px-8 h-[12vh]'>
        <h1 className='text-2xl font-semibold text-white'>Docs<span className='text-[#26A69A]'>Query</span></h1>
        <span className='flex gap-4'>
          <input onChange={handleFileChange} ref={inputRef} type="file" className='hidden' />
          <button onClick={handleClick} className='bg-[#424242] rounded-md px-3 py-2 font-medium text-center text-gray-200 hover:scale-110 transition duration-150'>Upload</button>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </span>
      </div>
      <div className='flex h-[75vh] overflow-y-auto'>
        <div className='w-[20vw] absolute rounded-md text-white px-2 py-4 bg-[#303030] h-[78vh] mt-[5vh] flex flex-col overflow-y-auto gap-2 justify-start items-center'>
          {userFiles.length > 0 && userFiles.map((file) => {
            return <p onClick={() => {
              setChat([])
              setFile(file)
            }} id={file} aria-selected={selectedFiles == file} className='bg-[#212121] aria-selected:text-[#26A69A] w-full rounded-md px-3 py-1 cursor-pointer truncate'>{file}</p>
          })}
        </div>
        <div className='w-full mx-auto py-6 flex flex-col items-center ml-[10vw] gap-4'>
          {chats && chats.length > 0 && chats?.map((chat) => {
            return <div className='w-4/6 gap-4 flex flex-col'>
              <div className='w-full flex justify-end'>
                <span className='bg-[#373737] rounded-2xl text-gray-300 px-4 py-2 w-3/5'>{chat.user}</span>
              </div>
              <div className='text-gray-300 w-5/6'>{chat.ai || ""}</div>
            </div>
          })}
        </div>
      </div>
      <span className='absolute bottom-8 w-2/4 left-1/4 flex justify-between'>
        <input ref={questionRef} type="text" className='w-11/12 py-2 bg-[#303030] rounded-md px-2 text-gray-300' placeholder='Send Message' />
        <button onClick={handleQuestion} className='rounded-md bg-[#26A69A] my-1 px-2 flex justify-center items-center'>{processing && <svg className="size-5 animate-spin ..." viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>}<p aria-checked={processing} className='aria-checked:hidden'>Send</p></button>
      </span>
    </div>
  )
}

export default App
