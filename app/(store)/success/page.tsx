// app/(store)/success/page.tsx
import { Suspense } from 'react'
import SuccessPageContent from './success-content'

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 px-4 w-full max-w-xl mx-auto">
          <div className="border rounded-md bg-lime-100 p-4">
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  )
}
