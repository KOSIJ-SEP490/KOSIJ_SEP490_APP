import { Orders } from '@shared/types/Order.dto'
import axios from 'axios'

const API_URL = 'https://kosij.azurewebsites.net/api/orders/current-consultant'

export async function fetchOrders(): Promise<Orders[]> {
  try {
    const response = await axios.get<{ value: Orders[] }>(API_URL, {
      headers: {
        Accept: 'text/plain',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDT04tMDAyIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQ29uc3VsdGluZ1N0YWZmIiwiZXhwIjoxNzUwNTI0Mzk5fQ.XYohrHsXsnCnAwkIuBtzQW0pLUcVD9Xw4auXZ66fqaM`
      }
    })
    return response.data.value // Extracting the orders array
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}
