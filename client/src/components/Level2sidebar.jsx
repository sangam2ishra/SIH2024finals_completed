/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Sidebar } from 'flowbite-react';

import { useEffect, useState } from 'react';

import { HiOutlineArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
// import Level2Sidebar from './Level2sidebar';

export default function Level2sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
//   const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
//   console.log(currentUser.paymentDues);



  return (
    <Sidebar className='w-full md:w-56  mt-2'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1 '>
            <Link to='/dash'>
              <Sidebar.Item
                // active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>

          <Link to='/profile'>
            <Sidebar.Item
            //   active={tab === 'profile'}
              icon={HiUser}
            //   label={currentUser.role==='Admin' ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
    
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}