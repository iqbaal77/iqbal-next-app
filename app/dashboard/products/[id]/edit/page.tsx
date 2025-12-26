import ProductForm from '../../../../../components/ProductForm'
import productsServer from '../../../../../lib/products-server'
export default async function EditPage({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params
  const p = await productsServer.getById(Number(id))
  if (!p) return <div>Not found</div>
  return (
    <div>
      <h2 className="text-xl font-bold">Edit product</h2>
      <div className="mt-4"><ProductForm defaultValues={{...p, _id: p.id}} /></div>
    </div>
  )
}

