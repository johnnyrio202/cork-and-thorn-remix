import { SignIn } from '@clerk/nextjs'

export const metadata = {
  title: 'Sign In | Cork & Thorn',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0B111B] flex items-center justify-center px-4 py-16">
      <SignIn
        appearance={{
          variables: { colorPrimary: '#E2B636' },
        }}
      />
    </div>
  )
}
