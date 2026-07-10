export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let configuredHandle = process.env.YOUTUBE_CHANNEL_ID || '@ISPR';
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
        
        // Check if the HTML contains live player flags, excluding scheduled/upcoming/offline events
        const isUpcomingOrOffline = html.includes('"upcomingEventData"') || 
                                     html.includes('LIVE_STREAM_OFFLINE') || 
                                     html.includes('"status":"UPCOMING"') ||
                                     html.includes('"upcomingEventData"');

        const isLiveActive = !isUpcomingOrOffline && (
                             html.includes('"isLive":true') || 
                             html.includes('"liveStreamability"') ||
                             html.includes('yt-playability-error-supported-renderers')
        );

        if (isLiveActive) {
          // Extract video ID from canonical link or watch URL
          const canonMatch = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([^"]+)"/) ||
                             html.match(/"videoDetails"\s*:\s*{\s*"videoId"\s*:\s*"([^"]+)"/) ||
                             html.match(/"videoId"\s*:\s*"([^"]+)"/);
          
          if (canonMatch) {
            isLive = true;
            liveVideoId = canonMatch[1];
            
            // Attempt to grab live title
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

    // 2. If not live, fetch the latest uploaded video using the RSS feed
    if (isLive && liveVideoId) {
      return res.status(200).json({
        isLive: true,
        videoId: liveVideoId,
        title: liveTitle || 'Press Conference - LIVE',
        channelId
      });
    }

    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const rssRes = await fetch(rssUrl);
      
      if (rssRes.ok) {
        const xml = await rssRes.text();
        
        // Extract the first entry from feed
        const entryMatch = xml.match(/<entry>([\s\S]+?)<\/entry>/);
        if (entryMatch) {
          const entryXml = entryMatch[1];
          
          const idMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
          const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
          const dateMatch = entryXml.match(/<published>([^<]+)<\/published>/);
          
          if (idMatch && titleMatch) {
            return res.status(200).json({
              isLive: false,
              videoId: idMatch[1],
              title: titleMatch[1].trim(),
              publishedAt: dateMatch ? dateMatch[1] : null,
              channelId
            });
          }
        }
      }
    } catch (err) {
      console.error('[YouTube] Error fetching RSS feed:', err);
    }

    // Fallback if both checks fail (hardcoded latest fallback or placeholder)
    return res.status(200).json({
      isLive: false,
      videoId: '5c-PzN0a1s8', // Example placeholder news/press video
      title: 'Latest Press Conference',
      publishedAt: new Date().toISOString(),
      channelId
    });

  } catch (error) {
    console.error('[API] YouTube Feed handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
