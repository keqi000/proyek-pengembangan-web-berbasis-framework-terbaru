"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

type LinkItemType = {
  name: string;
  href: string;
}

const linkData: LinkItemType[] = [{
  name: 'beranda',
  href: '/admin/home'
}, {
  name: 'kelola dosen',
  href: '/admin/manage_lecturers'
}, {
  name: 'Kelola Ruangan',
  href: '/admin/manage_room'
}, {
  name: 'generate jadwal',
  href: '/admin/generate_schedule'
}, {
  name: 'logout',
  href: '/'   // TODO: use function instead using path
}]

export default function NavigationBar(){
  const currentPath = usePathname()

  return (
    <nav className="bg-[#4F959D] text-white shadow-md">
      <div className="container flex justify-between items-center px-4">
        <h1 className="text-xl font-bold">Sistem Penjadwalan</h1>
        <ul className="flex space-x-6 h-full">
          { linkData.map((item, index) => 
              <li 
                className={
                  item.href === currentPath 
                  // TODO: better syntax for `className` in `li`
                  ? "bg-[#42a7b2] h-full flex flex-col py-4 px-2" : "flex-col h-full py-4 px-2"
                } 
                key={index}>
                <Link href={item.href} className="hover:text-slate-100 capitalize">
                  {item.name}
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    </nav>
  )
}