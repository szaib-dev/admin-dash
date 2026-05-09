import {
  Sidebar as SideBaz,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FiList, FiLogOut, FiSettings, FiUsers } from 'react-icons/fi';


function Sidebar() {

     const items = [
  {
    title: "Home",
    url: "/",
    icon: FiList,
  },
  {
    title: "Users",
    url: "/users",
    icon: FiUsers,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: FiSettings,
  },
];


  return (
   <SideBaz>
      <SidebarHeader>
        <div className="px-2 py-2 flex items-center gap-3">
          <img src='/logo.png' height={20} width={20}  className='size-12'/>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className='hover:bg-amber-500' asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <FiLogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SideBaz>
  )
}

export default Sidebar
