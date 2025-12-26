"use client"
import ProductForm from '../../../../components/ProductForm'
export default function NewProduct(){
  return (
    <div>
      <h2 className="text-xl font-bold">Add Product</h2>
      <div className="mt-4"><ProductForm /></div>
    </div>
  )
}

