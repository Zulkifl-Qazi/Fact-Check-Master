export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let configuredHandle = process.env.YOUTUBE_CHANNEL_ID || '@ISPROfficial';
    let channelId = 'UCw8U3G10a8d672rDkC6W4Yw'; // Default ISPR Channel ID

    // If configured variable is a handle, resolve it to Channel ID
    if (configuredHandle.startsWith('@')) {
      try {
        const handleRes = await fetch(`https://www.youtube.com/${configuredHandle}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (handleRes.ok) {
          const html = await handleRes.text();
          const match = html.match(/itemprop="channelId"\s+content="([^"]+)"/) || 
                        html.match(/"browse_id"\s*,\s*"value"\s*:\s*"([^"]+)"/) ||
                        html.match(/"channelId"\s*:\s*"([^"]+)"/);
          if (match) {
            channelId = match[1];
            console.log(`[YouTube] Resolved handle ${configuredHandle} to Channel ID: ${channelId}`);
          } else {
            console.warn(`[YouTube] Could not parse Channel ID for ${configuredHandle}. Using default.`);
          }
        }
      } catch (err) {
        console.error(`[YouTube] Failed to resolve handle ${configuredHandle}:`, err);
      }
    } else {
      channelId = configuredHandle;
    }

    // 1. Check if the channel is currently LIVE
    let isLive = false;
    let liveVideoId = null;
    let liveTitle = null;

    try {
      const liveUrl = `https://www.youtube.com/channel/${channelId}/live`;
      const liveRes = await fetch(liveUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (liveRes.ok) {
        const html = await liveRes.text();
        
        const isUpcomingOrOffline = html.includes('"upcomingEventData"') || 
                                     html.includes('LIVE_STREAM_OFFLINE') || 
                                     html.includes('"status":"UPCOMING"');

        const isLiveActive = !isUpcomingOrOffline && (
                             html.includes('"isLive":true') || 
                             html.includes('"liveStreamability"')
        );

        if (isLiveActive) {
          const canonMatch = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"/) ||
                             html.match(/"videoDetails"\s*:\s*{\s*"videoId"\s*:\s*"([^"]+)"/) ||
                             html.match(/"videoId"\s*:\s*"([^"]+)"/);
          
          if (canonMatch) {
            isLive = true;
            liveVideoId = canonMatch[1];
            
            const titleMatch = html.match(/<title>([^<]+)<\/title>/) || 
                               html.match(/"videoDetails"\s*:\s*{\s*"videoId"\s*:\s*"[^"]+"\s*,\s*"title"\s*:\s*"([^"]+)"/);
            if (titleMatch) {
              liveTitle = titleMatch[1].replace(' - YouTube', '').trim();
            } else {
              liveTitle = "Live Stream";
            }
          }
        }
      }
    } catch (err) {
      console.error('[YouTube] Error checking live status:', err);
    }

    // If live, return live status
    if (isLive && liveVideoId) {
      return res.status(200).json({
        isLive: true,
        videoId: liveVideoId,
        title: liveTitle || 'Press Conference - LIVE',
        publishedAt: new Date().toISOString(),
        channelId,
        videos: [{
          videoId: liveVideoId,
          title: liveTitle || 'Press Conference - LIVE',
          publishedAt: new Date().toISOString(),
          description: '🔴 LIVE BROADCAST: Streaming official ISPR press conference statements in real-time.'
        }],
        fallbackMode: false
      });
    }

    // 2. Fetch latest uploads using RSS feed — extract MULTIPLE entries
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const rssRes = await fetch(rssUrl);
      
      if (rssRes.ok) {
        const xml = await rssRes.text();
        
        // Extract ALL entries from the RSS feed (up to 6)
        const entryRegex = /<entry>([\s\S]+?)<\/entry>/g;
        const videos = [];
        let match;
        
        while ((match = entryRegex.exec(xml)) !== null && videos.length < 6) {
          const entryXml = match[1];
          
          const idMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
          const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
          const dateMatch = entryXml.match(/<published>([^<]+)<\/published>/);
          
          if (idMatch && titleMatch) {
            videos.push({
              videoId: idMatch[1],
              title: titleMatch[1].trim(),
              publishedAt: dateMatch ? dateMatch[1] : new Date().toISOString(),
              description: 'Official press conference statement and media briefing from ISPR.'
            });
          }
        }

        if (videos.length > 0) {
          return res.status(200).json({
            isLive: false,
            videoId: videos[0].videoId,
            title: videos[0].title,
            publishedAt: videos[0].publishedAt,
            channelId,
            videos,
            fallbackMode: false
          });
        }
      }
    } catch (err) {
      console.error('[YouTube] Error fetching RSS feed:', err);
    }

    // Fallback: RSS and Live both failed. Return empty videos with fallbackMode flag.
    // The frontend will show a "visit channel" message instead of broken thumbnails.
    return res.status(200).json({
      isLive: false,
      videoId: null,
      title: 'ISPR Official Channel',
      publishedAt: null,
      channelId,
      videos: [],
      fallbackMode: true
    });

  } catch (error) {
    console.error('[API] YouTube Feed handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
