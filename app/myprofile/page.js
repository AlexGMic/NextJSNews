import Sidebar from '../home_page/sidebar'
import UserProfileView from './homepage'

export default function page() {
  return (
    <div className='flex w-[100%]'>
      <Sidebar />
      <UserProfileView />
    </div>
  )
}
