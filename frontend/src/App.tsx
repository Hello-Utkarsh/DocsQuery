import './App.css'

function App() {

  return (
    <div className='bg-[#212121] h-[100vh] w-[100vw] flex flex-col relative'>
      <div className='w-full flex justify-between items-center bg-[#303030] px-8 py-4'>
        <h1 className='text-2xl font-semibold text-white'>Docs<span className='text-[#26A69A]'>Query</span></h1>
        <span className='flex gap-4'>
          <button className='bg-[#26A69A] rounded-md px-3 py-2 font-medium text-center hover:scale-110 transition duration-150'>Demo Pdf</button>
          <button className='bg-[#424242] rounded-md px-3 py-2 font-medium text-center text-gray-200 hover:scale-110 transition duration-150'>Upload</button>
        </span>
      </div>
      <div className='w-full mx-auto py-6 flex flex-col items-center overflow-y-auto'>
        <div className='w-4/6 gap-6 flex flex-col'>
          <div className='text-gray-300 w-5/6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ipsam nam quae harum distinctio minus voluptatem, rerum molestias sunt aperiam quaerat non explicabo tenetur doloribus corporis voluptates enim, quidem libero excepturi sed aspernatur dolores error ut cumque. Obcaecati maxime rem, earum, voluptates eos rerum reprehenderit officia magni, eligendi corrupti accusantium.</div>
          <div className='w-full flex justify-end'>
            <span className='bg-[#373737] rounded-2xl text-gray-300 px-3 py-1 w-3/5'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda voluptas corporis laudantium maxime illum provident ratione consequatur, expedita dolore explicabo, voluptate suscipit ipsa neque ut qui eum sapiente placeat consequuntur distinctio ea. Quidem ea adipisci cumque repellendus id asperiores quibusdam exercitationem aperiam esse consequatur animi unde quae suscipit, ab voluptate?</span>
          </div>
        </div>
      </div>
      <span className='absolute bottom-8 w-2/4 left-1/4 flex justify-between'>
        <input type="text" className='w-11/12 py-2 bg-[#303030] rounded-md px-2 text-gray-300' placeholder='Send Message' />
        <button className='rounded-md bg-[#26A69A] my-1 px-2'>Send</button>
      </span>
    </div>
  )
}

export default App
