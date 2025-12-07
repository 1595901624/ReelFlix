import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Card, CardBody, Spinner, Chip, ScrollShadow } from "@heroui/react";
import { useSettings } from '../../context/SettingsContext';
import { fetchVideoDetail } from '../../services/api';
import { VideoItem } from '../../types/video';
import Player from '../../components/Player';

interface Episode {
  name: string;
  url: string;
}

interface PlayGroup {
  name: string;
  episodes: Episode[];
}

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const { currentSource } = useSettings();
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchVideoDetail(currentSource.url, parseInt(id))
      .then(res => {
        if (res.list && res.list.length > 0) {
          setVideo(res.list[0]);
        } else {
          setError('Video not found');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load video');
      })
      .finally(() => setLoading(false));
  }, [id, currentSource]);

  const playGroups = useMemo<PlayGroup[]>(() => {
    if (!video) return [];
    
    const froms = video.vod_play_from.split('$$$');
    const urls = video.vod_play_url.split('$$$');
    
    return froms.map((from, index) => {
      const urlGroup = urls[index] || '';
      const episodes = urlGroup.split('#').map(ep => {
        const [name, url] = ep.split('$');
        return { name, url };
      }).filter(ep => ep.url); // Filter out invalid ones
      
      return {
        name: from,
        episodes
      };
    });
  }, [video]);

  const currentEpisode = playGroups[currentGroupIndex]?.episodes[currentEpisodeIndex];

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner size="lg" /></div>;
  if (error || !video) return <div className="flex justify-center items-center min-h-screen text-red-500">{error || 'Video not found'}</div>;

  return (
    <div className="min-h-screen bg-background text-foreground dark p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4">
            <Link to="/" className="text-primary hover:underline flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                返回首页
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentEpisode ? (
              <Player src={currentEpisode.url} poster={video.vod_pic} />
            ) : (
              <div className="aspect-video bg-black flex items-center justify-center text-white rounded-xl">
                No playable source found
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-bold mb-2">{video.vod_name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Chip color="primary" variant="flat">{video.type_name}</Chip>
                <Chip>{video.vod_year}</Chip>
                <Chip>{video.vod_area}</Chip>
                <Chip>{video.vod_lang}</Chip>
              </div>
              <div className="text-default-500" dangerouslySetInnerHTML={{ __html: video.vod_content }} />
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-content1">
              <CardBody>
                <h3 className="text-xl font-bold mb-4">播放源</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {playGroups.map((group, idx) => (
                    <Button 
                      key={idx} 
                      size="sm" 
                      color={currentGroupIndex === idx ? "primary" : "default"}
                      variant={currentGroupIndex === idx ? "solid" : "bordered"}
                      onPress={() => {
                        setCurrentGroupIndex(idx);
                        setCurrentEpisodeIndex(0);
                      }}
                    >
                      {group.name}
                    </Button>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-4">选集</h3>
                <ScrollShadow className="h-[400px]">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {playGroups[currentGroupIndex]?.episodes.map((ep, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        color={currentEpisodeIndex === idx ? "secondary" : "default"}
                        variant={currentEpisodeIndex === idx ? "solid" : "flat"}
                        onPress={() => setCurrentEpisodeIndex(idx)}
                        className="overflow-hidden text-ellipsis"
                      >
                        {ep.name}
                      </Button>
                    ))}
                  </div>
                </ScrollShadow>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
