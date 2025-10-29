"use client"

import * as React from "react"
import { transactionsApi } from "@/lib/api"
import type { Transaction } from "@/lib/types"

interface TransactionsContextType {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  addTransaction: (transaction: Omit<Transaction, "transaction_id" | "transaction_date">) => Promise<void>
  updateTransaction: (transactionId: number, updates: Partial<Omit<Transaction, "transaction_id" | "transaction_date">>) => Promise<void>
  deleteTransaction: (transactionId: number) => Promise<void>
  refreshTransactions: () => Promise<void>
  searchTerm: string
  setSearchTerm: (term: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  dateFilter: string
  setDateFilter: (date: string) => void
  filteredTransactions: Transaction[]
}

const TransactionsContext = React.createContext<TransactionsContextType | undefined>(undefined)

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("All Types")
  const [dateFilter, setDateFilter] = React.useState("All Time")

  // Fetch transactions from backend on mount
  const refreshTransactions = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionsApi.getAll()
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
      console.error('Error fetching transactions:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refreshTransactions()
  }, [])

  const addTransaction = async (transactionData: Omit<Transaction, "transaction_id" | "transaction_date">) => {
    try {
      const newTransaction = await transactionsApi.create(transactionData)
      setTransactions([newTransaction, ...transactions])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction')
      throw err
    }
  }

  const updateTransaction = async (transactionId: number, updates: Partial<Omit<Transaction, "transaction_id" | "transaction_date">>) => {
    try {
      const updatedTransaction = await transactionsApi.update(transactionId, updates)
      setTransactions(
        transactions.map((transaction) =>
          transaction.transaction_id === transactionId ? updatedTransaction : transaction
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction')
      throw err
    }
  }

  const deleteTransaction = async (transactionId: number) => {
    try {
      await transactionsApi.delete(transactionId)
      setTransactions(transactions.filter((transaction) => transaction.transaction_id !== transactionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction')
      throw err
    }
  }

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.machine_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.work_order?.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const matchesType =
        typeFilter === "All Types" || transaction.action_type === typeFilter

      // Date filter
      let matchesDate = true
      if (dateFilter !== "All Time") {
        const transactionDate = new Date(transaction.transaction_date)
        const now = new Date()
        
        switch (dateFilter) {
          case "Today":
            matchesDate = transactionDate.toDateString() === now.toDateString()
            break
          case "This Week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = transactionDate >= weekAgo
            break
          case "This Month":
            matchesDate = transactionDate.getMonth() === now.getMonth() && 
                         transactionDate.getFullYear() === now.getFullYear()
            break
          case "This Year":
            matchesDate = transactionDate.getFullYear() === now.getFullYear()
            break
        }
      }

      return matchesSearch && matchesType && matchesDate
    }).sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
  }, [transactions, searchTerm, typeFilter, dateFilter])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshTransactions,
        searchTerm,
        setSearchTerm,
        typeFilter,
        setTypeFilter,
        dateFilter,
        setDateFilter,
        filteredTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = React.useContext(TransactionsContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider")
  }
  return context
}
