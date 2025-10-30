"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Package, MapPin, User, Search, CheckCircle } from "lucide-react"

interface CongatecIssuanceProps {
  onIssuePart?: (partData: any) => void
}

export function CongatecIssuance({ onIssuePart }: CongatecIssuanceProps) {
  const [scannedCode, setScannedCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [partData, setPartData] = useState<any>(null)
  const [area, setArea] = useState("")
  const [location, setLocation] = useState("")
  const [issuedTo, setIssuedTo] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [searching, setSearching] = useState(false)

  // Simulate QR code scan
  const handleScan = useCallback(() => {
    setIsScanning(true)
    setSearching(true)
    
    // Simulate finding part after scan
    setTimeout(() => {
      // Mock data - in real implementation, this would search database
      const mockPart = {
        part_id: 1,
        part_number: scannedCode || "10000119",
        description: "10.4'' LVDS Panel G104SN03 V5",
        category: "Congatec",
        department: "Test",
        location: location || "Test Area",
        current_stock: 5,
        minimum_stock: 1,
        unit: "piece"
      }
      
      setPartData(mockPart)
      setIsScanning(false)
      setSearching(false)
    }, 1500)
  }, [scannedCode, location])

  const handleIssue = useCallback(() => {
    if (!partData || !area || !location || !issuedTo) {
      alert("Please fill in all required fields")
      return
    }

    const issuanceData = {
      ...partData,
      area,
      location: location, // Use user's location input
      issuedTo,
      quantity,
      issuedDate: new Date().toISOString()
    }

    onIssuePart?.(issuanceData)
    
    // Reset form
    setScannedCode("")
    setPartData(null)
    setArea("")
    setLocation("")
    setIssuedTo("")
    setQuantity(1)
  }, [partData, area, location, issuedTo, quantity, onIssuePart])

  const handleManualSearch = useCallback(async () => {
    if (!scannedCode) return
    
    setSearching(true)
    
    try {
      // In real implementation, this would call API
      const response = await fetch(`/api/parts/search?q=${scannedCode}`)
      const data = await response.json()
      
      if (data.length > 0) {
        setPartData(data[0])
      } else {
        alert("Part not found")
      }
    } catch (error) {
      console.error("Search error:", error)
      alert("Error searching for part")
    } finally {
      setSearching(false)
    }
  }, [scannedCode])

  return (
    <div className="space-y-6">
      {/* QR Scanner Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Congatec Part Issuance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Scanner Input */}
          <div className="space-y-2">
            <Label htmlFor="qr-scan">Scan QR Code / Enter Part Number</Label>
            <div className="flex gap-2">
              <Input
                id="qr-scan"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="Scan QR code or enter part number"
                className="flex-1"
                disabled={isScanning}
              />
              <Button 
                onClick={handleScan} 
                disabled={!scannedCode || isScanning}
                className="min-w-[100px]"
              >
                <QrCode className="h-4 w-4 mr-2" />
                {isScanning ? "Scanning..." : "Scan"}
              </Button>
              <Button 
                variant="outline"
                onClick={handleManualSearch}
                disabled={!scannedCode || searching}
              >
                <Search className="h-4 w-4 mr-2" />
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Part Display */}
          {partData && (
            <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Part Found</h3>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Congatec
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Part Number</Label>
                  <p className="font-mono font-medium">{partData.part_number}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="font-medium">{partData.description}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p className="font-medium">{partData.category}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Current Stock</Label>
                  <p className="font-medium">{partData.current_stock} {partData.unit}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issuance Form */}
      {partData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Issue Part Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Area Input */}
              <div className="space-y-2">
                <Label htmlFor="area">Area *</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Test Area">Test Area</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Assembly">Assembly</SelectItem>
                    <SelectItem value="SMT">SMT</SelectItem>
                    <SelectItem value="QA">QA</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 mt-2 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter specific location"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Issued To */}
              <div className="space-y-2">
                <Label htmlFor="issued-to">Issued To *</Label>
                <div className="flex gap-2">
                  <User className="h-4 w-4 mt-2 text-muted-foreground" />
                  <Input
                    id="issued-to"
                    value={issuedTo}
                    onChange={(e) => setIssuedTo(e.target.value)}
                    placeholder="Enter recipient name"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={partData?.current_stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Issue Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleIssue}
                disabled={!partData || !area || !location || !issuedTo || quantity > (partData?.current_stock || 0)}
                className="min-w-[150px]"
              >
                <Package className="h-4 w-4 mr-2" />
                Issue Part
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
