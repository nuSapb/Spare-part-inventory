"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Edit, Eye, QrCode, AlertTriangle, Package, MapPin, Building2, Tag, ImageIcon, Trash2 } from "lucide-react"
import { useParts } from "@/contexts/parts-context"
import Image from "next/image"
import type { Part } from "@/lib/types"

export function PartsTable() {
  const { filteredParts, updatePart, deletePart } = useParts()
  const [selectedPart, setSelectedPart] = useState<Part | null>(null)
  const [editingStock, setEditingStock] = useState<number | null>(null)
  const [newStock, setNewStock] = useState("")

  const getStatusBadge = (currentStock: number, minStock: number) => {
    if (currentStock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (currentStock <= minStock) {
      return (
        <Badge variant="secondary" className="bg-warning/20 text-warning">
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="bg-success/20 text-success">
          In Stock
        </Badge>
      )
    }
  }

  const handleStockUpdate = (partId: number) => {
    updatePart(partId, { current_stock: parseInt(newStock) })
    setEditingStock(null)
    setNewStock("")
  }

  const handleDelete = (partId: number) => {
    if (confirm("Are you sure you want to delete this part?")) {
      deletePart(partId)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Parts Inventory ({filteredParts.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>No.</TableHead>
                <TableHead>Spare Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Congatec Part No.</TableHead>
                <TableHead>Where Used</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Change Rate</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                    No parts found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredParts.map((part) => (
                <TableRow key={part.part_id}>
                  <TableCell>
                    {part.image_url ? (
                      <Image
                        src={part.image_url}
                        alt={part.description}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{(part as any).row_number || ''}</TableCell>
                  <TableCell className="font-medium">{(part as any).spare_name || ''}</TableCell>
                  <TableCell className="text-sm">{part.description || ''}</TableCell>
                  <TableCell className="font-mono text-xs">{part.storage_detail || ''}</TableCell>
                  <TableCell className="text-sm max-w-xs truncate">{(part as any).machine_used || ''}</TableCell>
                  <TableCell className="text-sm">{part.location || ''}</TableCell>
                  <TableCell className="font-medium text-center">{part.current_stock}</TableCell>
                  <TableCell className="text-sm">{(part as any).change_rate || ''}</TableCell>
                  <TableCell className="text-sm">{(part as any).photo || ''}</TableCell>
                  <TableCell>
                    {editingStock === part.part_id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="w-20 h-8"
                          placeholder={part.current_stock.toString()}
                        />
                        <Button size="sm" onClick={() => handleStockUpdate(part.part_id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingStock(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{part.current_stock}</span>
                        <span className="text-muted-foreground text-sm">/ {part.minimum_stock} min</span>
                        {part.current_stock <= part.minimum_stock && <AlertTriangle className="h-4 w-4 text-warning" />}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(part.current_stock, part.minimum_stock)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPart(part)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Part Details</DialogTitle>
                          </DialogHeader>
                          {selectedPart && (
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Part Number</label>
                                  <p className="font-mono">{selectedPart.part_number}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                                  <p>{selectedPart.description}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                                  <p>{selectedPart.category}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                                  <p>{selectedPart.department}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                                  <p>{selectedPart.location}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Storage Detail</label>
                                  <p>{selectedPart.storage_detail || "N/A"}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Machine Used</label>
                                  <p>{selectedPart.machine_used || "N/A"}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Unit</label>
                                  <p>{selectedPart.unit}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Current Stock</label>
                                  <p className="text-2xl font-bold">{selectedPart.current_stock}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Minimum Stock</label>
                                  <p className="text-2xl font-bold">{selectedPart.minimum_stock}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Barcode</label>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="bg-muted px-2 py-1 rounded text-sm">{selectedPart.part_number}</code>
                                  <Button variant="outline" size="sm">
                                    <QrCode className="h-4 w-4 mr-2" />
                                    Generate QR
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingStock(part.part_id)
                          setNewStock(part.current_stock.toString())
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => handleDelete(part.part_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
