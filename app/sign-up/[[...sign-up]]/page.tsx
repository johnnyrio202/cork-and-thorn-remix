import { SignUp } from '@clerk/nextjs'

export const metadata = {
  title: 'Sign Up | Cork & Thorn',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0B111B] flex items-center justify-center px-4 py-16">
      <SignUp
        appearance={{
          variables: { colorPrimary: '#E2B636' },
        }}
      />
    </div>
  )
}
