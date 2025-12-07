import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  Spinner,
  useDisclosure
} from "@heroui/react";
import { useSettings } from '../../context/SettingsContext';
import { fetchVideoList } from '../../services/api';
import { VideoItem } from '../../types/video';
import SettingsModal from '../../components/SettingsModal';

export default function HomePage() {
  const { currentSource } = useSettings();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setLoading(true);
    fetchVideoList(currentSource.url)
      .then(res => {
        setVideos(res.list);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load videos. Please check your API source settings.');
      })
      .finally(() => setLoading(false));
  }, [currentSource]);

  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const otherVideos = videos.length > 0 ? videos.slice(1) : [];

  const handlePlay = (id: number) => {
    navigate(`/play/${id}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
      
      {/* Navigation Bar */}
      <Navbar isBordered maxWidth="xl" className="bg-background/70 backdrop-blur-md">
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4 cursor-pointer" onClick={() => navigate('/')}>
            <p className="hidden sm:block font-bold text-inherit text-2xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">ReelFlix</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-3">
            <NavbarItem isActive>
              <Link color="secondary" href="#">
                首页
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" color="foreground">
                电影
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" color="foreground">
                剧集
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="#" color="foreground">
                综艺
              </Link>
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>

        <NavbarContent as="div" className="items-center" justify="end">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[15rem] h-10",
              mainWrapper: "h-full",
              input: "text-small",
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

      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-6">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Spinner size="lg" label="加载中..." color="secondary" />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
            <p className="text-danger text-xl">{error}</p>
            <Button color="primary" onPress={onOpen}>检查设置</Button>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            {featuredVideo && (
              <section className="mb-12 relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img 
                    src={featuredVideo.vod_pic} 
                    alt={featuredVideo.vod_name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12 w-full md:w-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="flex gap-2 mb-3">
                        <Chip color="primary" variant="shadow" size="sm">{featuredVideo.type_name}</Chip>
                        <Chip color="default" variant="flat" size="sm">{featuredVideo.vod_year}</Chip>
                        <Chip color="warning" variant="flat" size="sm">{featuredVideo.vod_area}</Chip>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">{featuredVideo.vod_name}</h1>
                    <h2 className="text-xl md:text-2xl text-gray-300 mb-4 font-light">{featuredVideo.vod_sub}</h2>
                    <p className="text-gray-200 mb-6 line-clamp-3 max-w-xl text-sm md:text-base">
                        {featuredVideo.vod_blurb || featuredVideo.vod_content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                    </p>
                    <div className="flex gap-4">
                        <Button 
                          color="primary" 
                          size="lg" 
                          className="font-semibold shadow-lg shadow-primary/40"
                          onPress={() => handlePlay(featuredVideo.vod_id)}
                        >
                            立即播放
                        </Button>
                        <Button 
                          variant="bordered" 
                          className="text-white border-white/40 hover:bg-white/10 font-semibold" 
                          size="lg"
                          onPress={() => handlePlay(featuredVideo.vod_id)}
                        >
                            更多信息
                        </Button>
                    </div>
                </div>
              </section>
            )}

            {/* Content Grid */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">最新更新</h2>
                    <Link href="#" color="primary" showAnchorIcon>查看全部</Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {otherVideos.map((video) => (
                    <Card 
                      shadow="sm" 
                      key={video.vod_id} 
                      isPressable 
                      onPress={() => handlePlay(video.vod_id)} 
                      className="border-none bg-transparent hover:scale-105 transition-transform duration-200"
                    >
                        <CardBody className="overflow-visible p-0 relative aspect-[2/3] rounded-lg group">
                            <Image
                                shadow="sm"
                                radius="lg"
                                width="100%"
                                alt={video.vod_name}
                                className="w-full object-cover h-full"
                                src={video.vod_pic}
                            />
                            <div className="absolute top-2 right-2 z-10">
                                <Chip size="sm" color="secondary" variant="shadow" className="text-xs h-6">{video.vod_remarks || 'HD'}</Chip>
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        </CardBody>
                        <CardFooter className="text-small justify-between flex-col items-start px-1 pt-2 pb-0">
                            <b className="text-default-900 dark:text-default-100 line-clamp-1 text-lg">{video.vod_name}</b>
                            <p className="text-default-500 text-xs">{video.type_name} • {video.vod_year}</p>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
            </section>
          </>
        )}
      </main>
      
      <footer className="w-full flex flex-col items-center justify-center py-8 border-t border-default-200/20 mt-12">
        <p className="text-default-500 text-sm">© 2025 ReelFlix. All rights reserved.</p>
      </footer>
    </div>
  );
}
