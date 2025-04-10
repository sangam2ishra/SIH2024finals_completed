import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
// import DashPosts from '../components/DashPosts';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row mt-10 bg-slate-200 dark:bg-slate-900'>
      <div className='md:w-56 '>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      
      {tab === 'profile' && <DashProfile className='bg-black' />}
      {/* posts... */}
      {/* {tab === 'posts' && <DashPosts />} */}
      {/* users */}
      {/* {tab === 'users' && <DashUsers />} */}
      {/* comments  */}
      {/* {tab === 'comments' && <DashComments />}
      {/* dashboard comp */}
      {/* {tab === 'dash' && <DashboardComp />} */} 
    </div>
  );
}