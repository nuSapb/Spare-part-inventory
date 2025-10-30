"use client"

import { CongatecIssuance } from "@/components/congatec-issuance"

export default function CongatecPage() {
  const handleIssuePart = (issuanceData: any) => {
    console.log("Issuing part:", issuanceData)
    // In real implementation, this would:
    // 1. Create transaction record
    // 2. Update part stock
    // 3. Log issuance history
    
    alert(`Part ${issuanceData.part_number} issued successfully to ${issuanceData.issuedTo}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Congatec Part Issuance</h1>
          <p className="text-gray-600">
            Scan QR codes or enter part numbers to issue Congatec spare parts
          </p>
        </div>

        {/* Issuance Component */}
        <CongatecIssuance onIssuePart={handleIssuePart} />

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. Scan QR code or enter part number in the search field</p>
            <p>2. Select the specific area and location where the part will be used</p>
            <p>3. Enter the recipient's name</p>
            <p>4. Specify the quantity to issue (cannot exceed available stock)</p>
            <p>5. Click "Issue Part" to complete the transaction</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-sm text-gray-600">
            <p>No recent issuances to display.</p>
            <p className="mt-2">All issued parts will be tracked in the transaction history.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
