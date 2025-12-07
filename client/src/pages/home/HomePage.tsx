import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  Spinner,
  Link,
  useDisclosure
} from "@heroui/react";
import { useSettings } from '../../context/SettingsContext';
import { fetchVideoList } from '../../services/api';
import { VideoItem } from '../../types/video';
import SettingsModal from '../../components/SettingsModal';

export default function HomePage() {
  const { currentSource, categories } = useSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedTab = searchParams.get('category') || 'home';
  
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);

  // Main categories (type_pid === 0)
  const mainCategories = useMemo(() => {
    return categories.filter(cat => cat.type_pid === 0);
  }, [categories]);

  // Sub categories for selected tab
  const subCategories = useMemo(() => {
    if (selectedTab === 'home') return [];
    const mainCat = mainCategories.find(cat => cat.type_id.toString() === selectedTab);
    if (!mainCat) return [];
    return categories.filter(cat => cat.type_pid === mainCat.type_id);
  }, [selectedTab, categories, mainCategories]);

  // Reset sub-category when tab changes
  useEffect(() => {
    setSelectedSubCategory(null);
  }, [selectedTab]);

  // Get type IDs to fetch
  const getTypeIdsForFetch = (): number[] | undefined => {
    if (selectedTab === 'home') return undefined; // All types
    
    if (selectedSubCategory) {
      return [selectedSubCategory]; // Single sub-category
    }
    
    // Get all sub-category IDs for the selected main category
    const subs = subCategories.map(cat => cat.type_id);
    return subs.length > 0 ? subs : [parseInt(selectedTab)];
  };

  useEffect(() => {
    setLoading(true);
    const typeIds = getTypeIdsForFetch();
    fetchVideoList(currentSource.url, 1, typeIds)
      .then(res => {
        setVideos(res.list);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load videos. Please check your API source settings.');
      })
      .finally(() => setLoading(false));
  }, [currentSource, selectedTab, selectedSubCategory]);

  useEffect(() => {
    if (videos.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % Math.min(videos.length, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [videos]);

  const featuredVideos = videos.slice(0, 5);
  const currentFeatured = featuredVideos[activeSlide];
  const otherVideos = videos.length > 5 ? videos.slice(5) : [];

  const handlePlay = (id: number) => {
    navigate(`/play/${id}`);
  };

  return (
    <div className="container mx-auto max-w-7xl px-6 pt-6">
      <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
      
      {/* Sub-category Filters */}
      {subCategories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedSubCategory === null ? "solid" : "flat"}
            color={selectedSubCategory === null ? "primary" : "default"}
            onPress={() => setSelectedSubCategory(null)}
          >
            全部
          </Button>
          {subCategories.map(cat => (
            <Button
              key={cat.type_id}
              size="sm"
              variant={selectedSubCategory === cat.type_id ? "solid" : "flat"}
              color={selectedSubCategory === cat.type_id ? "primary" : "default"}
              onPress={() => setSelectedSubCategory(cat.type_id)}
            >
              {cat.type_name}
            </Button>
          ))}
        </div>
      )}
      
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
          {/* Hero Section - Carousel */}
          {currentFeatured && (
            <section className="mb-12 relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
              {/* Background Image with Transition */}
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img 
                  key={currentFeatured.vod_id}
                  src={currentFeatured.vod_pic} 
                  alt={currentFeatured.vod_name}
                  className="w-full h-full object-cover object-center animate-fade-in"
              />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="flex gap-2 mb-3">
                      <Chip color="primary" variant="shadow" size="sm">{currentFeatured.type_name}</Chip>
                      <Chip color="default" variant="flat" size="sm">{currentFeatured.vod_year}</Chip>
                      <Chip color="warning" variant="flat" size="sm">{currentFeatured.vod_area}</Chip>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg line-clamp-1">{currentFeatured.vod_name}</h1>
                  <h2 className="text-xl md:text-2xl text-gray-300 mb-4 font-light line-clamp-1">{currentFeatured.vod_sub}</h2>
                  <p className="text-gray-200 mb-6 line-clamp-3 max-w-xl text-sm md:text-base">
                      {currentFeatured.vod_blurb || currentFeatured.vod_content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                  </p>
                  <div className="flex gap-4">
                      {/* <Button 
                        color="primary" 
                        size="lg" 
                        className="font-semibold shadow-lg shadow-primary/40"
                        onPress={() => handlePlay(currentFeatured.vod_id)}
                      >
                          立即播放
                      </Button> */}
                      <Button 
                        variant="bordered" 
                        className="text-white border-white/40 hover:bg-white/10 font-semibold" 
                        size="lg"
                        onPress={() => handlePlay(currentFeatured.vod_id)}
                      >
                          立即播放
                      </Button>
                  </div>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-8 right-8 z-30 flex gap-2">
                {featuredVideos.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === activeSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'}`}
                    onClick={() => setActiveSlide(idx)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Content Grid */}
          <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">最新更新</h2>
                  {/* <Link href="#" color="primary" showAnchorIcon>查看全部</Link> */}
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
                          {/* Blurred background for small images */}
                          <div 
                            className="absolute inset-0 bg-cover bg-center blur-md"
                            style={{ backgroundImage: `url(${video.vod_pic})` }}
                          />
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
                          <b className="text-default-900 dark:text-default-700 line-clamp-1 text-lg">{video.vod_name}</b>
                          <p className="text-default-500 text-xs">{video.type_name} • {video.vod_year}</p>
                      </CardFooter>
                  </Card>
                  ))}
              </div>
          </section>
        </>
      )}
    </div>
  );
}
