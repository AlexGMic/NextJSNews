import Sidebar from '../home_page/sidebar'
import LikedNewsProfile from './homepage'

export default function page({searchParams}) {
  return (
    <div className='flex w-[100%]'>
      <Sidebar />
      <LikedNewsProfile searchParams={searchParams} />
    </div>
  )
}
