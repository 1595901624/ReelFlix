import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  CardFooter, 
  Image, 
  Chip, 
  Spinner,
  Listbox,
  ListboxItem,
  useDisclosure
} from "@heroui/react";
import { useSettings } from '../../context/SettingsContext';
import { fetchVideoList } from '../../services/api';
import { VideoItem } from '../../types/video';
import EmptySourcesState from '../../components/EmptySourcesState';
import SettingsModal from '../../components/SettingsModal';

interface SearchResultItem extends VideoItem {
  sourceName: string;
  sourceUrl: string;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { sources } = useSettings();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>("all");
  
  // Throttling ref
  const lastSearchTimeRef = useRef<number>(0);
  // 用于清理定时器
  const searchCleanupRef = useRef<(() => void) | null>(null);
  // 用于跟踪搜索状态
  const searchCompletionRef = useRef({
    total: 0,
    completed: 0,
    successCount: 0
  });

  useEffect(() => {
    if (!query || sources.length === 0) return;

    const performSearch = async () => {
      // 重置状态
      setLoading(true);
      setError(null);
      setResults([]);
      
      // 重置搜索完成跟踪
      searchCompletionRef.current = {
        total: sources.length,
        completed: 0,
        successCount: 0
      };
      
      // 清理之前的清理函数
      if (searchCleanupRef.current) {
        searchCleanupRef.current();
      }

      try {
        // 为每个源创建独立的搜索任务
        sources.forEach(async (source) => {
          try {
            const response = await fetchVideoList(source.url, 1, undefined, query);
            const sourceResults = (response.list || []).map(item => ({
              ...item,
              sourceName: source.name,
              sourceUrl: source.url
            }));
            
            // 更新结果状态 - 每个源返回结果后立即更新
            setResults(prevResults => {
              const newResults = [...prevResults, ...sourceResults];
              return newResults;
            });
            
            // 增加成功计数
            searchCompletionRef.current.successCount += 1;
          } catch (err) {
            console.error(`Failed to fetch from ${source.name}:`, err);
            // 即使单个源出错也不影响其他源
          } finally {
            // 更新完成计数
            searchCompletionRef.current.completed += 1;
            
            // 检查是否所有源都已完成
            if (searchCompletionRef.current.completed >= searchCompletionRef.current.total) {
              // 延迟检查最终结果
              setTimeout(() => {
                // 检查是否有任何结果
                setResults(currentResults => {
                  if (currentResults.length === 0 && searchCompletionRef.current.successCount === 0) {
                    setError('未找到相关结果');
                  }
                  setLoading(false);
                  return currentResults;
                });
              }, 100);
            }
          }
        });
        
      } catch (err) {
        console.error(err);
        setError('搜索过程中发生错误');
        setLoading(false);
      } finally {
        lastSearchTimeRef.current = Date.now();
      }
    };

    const now = Date.now();
    const timeSinceLast = now - lastSearchTimeRef.current;
    const minInterval = 5000; // 5 seconds

    let timer: number;

    if (timeSinceLast < minInterval) {
      const delay = minInterval - timeSinceLast;
      console.log(`Throttling search. Waiting ${delay}ms`);
      timer = setTimeout(performSearch, delay);
    } else {
      performSearch();
    }

    // 设置清理函数
    searchCleanupRef.current = () => {
      if (timer) clearTimeout(timer);
    };

    return () => {
      // 组件卸载时执行清理
      if (searchCleanupRef.current) {
        searchCleanupRef.current();
      }
    };
  }, [query, sources]);

  const handlePlay = (id: number, sourceUrl: string) => {
    // 在新标签页中打开播放页面
    const url = `/play/${id}?source=${encodeURIComponent(sourceUrl)}`;
    window.open(url, '_blank');
  };

  const filteredResults = useMemo(() => {
    if (selectedSourceFilter === "all") return results;
    return results.filter(r => r.sourceName === selectedSourceFilter);
  }, [results, selectedSourceFilter]);

  // Group sources for the sidebar
  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    results.forEach(r => {
      counts[r.sourceName] = (counts[r.sourceName] || 0) + 1;
    });
    return counts;
  }, [results]);

  const filterItems = useMemo(() => [
    { key: "all", label: "全部", count: results.length, icon: "🌐" },
    ...sources.map(source => ({
      key: source.name,
      label: source.name,
      count: sourceCounts[source.name] || 0,
      icon: "📺"
    }))
  ], [sources, results.length, sourceCounts]);

  return (
    <>
      <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} />
      {sources.length === 0 ? (
        <EmptySourcesState onOpenSettings={onOpen} />
      ) : (
        <div className="container mx-auto max-w-7xl px-6 pt-6 flex flex-col md:flex-row gap-6 min-h-[80vh]">
      {/* Sidebar - Source Filter */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h2 className="text-xl font-bold mb-4 px-2">搜索源</h2>
          <Card className="w-full p-2">
            <Listbox 
              aria-label="Source Filters"
              items={filterItems}
              selectedKeys={new Set([selectedSourceFilter])}
              selectionMode="single"
              variant="flat"
              color="primary"
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedSourceFilter(selected);
              }}
            >
              {(item) => (
                <ListboxItem key={item.key} startContent={<span className="text-lg">{item.icon}</span>} endContent={<Chip size="sm" variant="flat">{item.count}</Chip>}>
                  {item.label}
                </ListboxItem>
              )}
            </Listbox>
          </Card>
        </div>
      </div>

      {/* Main Content - Results */}
      <div className="flex-grow">
        <h1 className="text-2xl font-bold mb-6">
          搜索结果: <span className="text-primary">{query}</span>
        </h1>

        {loading && results.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <Spinner size="lg" label="正在全网搜索..." color="secondary" />
          </div>
        ) : error && results.length === 0 ? (
          <div className="flex justify-center items-center h-[30vh]">
            <p className="text-default-500 text-xl">{error}</p>
          </div>
        ) : (
          <>
            {filteredResults.length === 0 && results.length > 0 ? (
               <div className="flex justify-center items-center h-[30vh]">
                 <p className="text-default-500">该源下没有找到结果</p>
               </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredResults.map((video) => (
                  <Card 
                    shadow="sm" 
                    key={`${video.sourceName}-${video.vod_id}`} 
                    isPressable 
                    onPress={() => handlePlay(video.vod_id, video.sourceUrl)} 
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
                      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                        <Chip size="sm" color="secondary" variant="shadow" className="text-xs h-6">
                          {video.vod_remarks || 'HD'}
                        </Chip>
                        <Chip size="sm" color="primary" variant="solid" className="text-xs h-6">
                          {video.sourceName}
                        </Chip>
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
            )}
          </>
        )}
      </div>
        </div>
      )}
    </>
  );
}
