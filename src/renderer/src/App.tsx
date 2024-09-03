import { Button } from '@/components/ui/button'

function App() {

  return (
    <>
      <div className='flex flex-col gap-5 justify-center items-center h-screen w-screen'>
        <p className="font-bold text-4xl text-center">Hello world.</p>
        <Button onClick={() => console.log('Hello world!')}>Print hello world</Button>
      </div>
    </>
  )
}

export default App
