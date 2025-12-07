import { useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  Input, 
  DropdownItem, 
  DropdownTrigger, 
  Dropdown, 
  DropdownMenu, 
  Avatar,
  useDisclosure
} from "@heroui/react";
import { useSettings } from '../context/SettingsContext';
import SettingsModal from './SettingsModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentSource, categories } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState('');

  const mainCategories = useMemo(() => {
    return categories.filter(cat => cat.type_pid === 0);
  }, [categories]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col">
      <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
      
      {/* Navigation Bar */}
      <Navbar isBordered maxWidth="xl" className="bg-background/70 backdrop-blur-md">
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4 cursor-pointer" onClick={() => navigate('/')}>
            <p className="hidden sm:block font-bold text-inherit text-2xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">ReelFlix</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-3">
            <NavbarItem isActive={location.pathname === '/' && !currentCategory}>
              <Link 
                color={location.pathname === '/' && !currentCategory ? "secondary" : "foreground"} 
                href="#" 
                onPress={() => navigate('/')}
              >
                首页
              </Link>
            </NavbarItem>
            {mainCategories.map(cat => (
              <NavbarItem key={cat.type_id} isActive={currentCategory === cat.type_id.toString()}>
                <Link 
                  color={currentCategory === cat.type_id.toString() ? "secondary" : "foreground"} 
                  href="#" 
                  onPress={() => navigate(`/?category=${cat.type_id}`)}
                >
                  {cat.type_name}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" justify="end">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[15rem] h-10",
              mainWrapper: "h-full",
              input: "text-small outline-none",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="搜索..."
            size="sm"
            startContent={
                <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" viewBox="0 0 24 24" width="1em" className="text-default-400 pointer-events-none flex-shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            }
            type="search"
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleSearch}
          />
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="User"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">当前源</p>
                <p className="font-semibold text-xs text-default-500">{currentSource.name}</p>
              </DropdownItem>
              <DropdownItem key="settings" onPress={onOpen}>设置</DropdownItem>
              <DropdownItem key="help_and_feedback">帮助与反馈</DropdownItem>
              <DropdownItem key="logout" color="danger">
                退出登录
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="w-full flex flex-col items-center justify-center py-8 border-t border-default-200/20 mt-12">
        <p className="text-default-500 text-sm">© 2025 ReelFlix. All rights reserved.</p>
      </footer>
    </div>
  );
}
