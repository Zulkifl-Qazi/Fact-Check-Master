import React from 'react';
import EditorialCard from './EditorialCard';

/**
 * MustReadSidebar - Compact sidebar with "MUST READ" and "MORE HEADLINES" sections
 * Al Jazeera style with uppercase headers and compact article list
 */

const MustReadSidebar = ({ posts = [] }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
          Must Read
        </h3>
        <p className="text-sm text-gray-500">No articles available</p>
      </div>
    );
  }

  // Split posts into Must Read (first 4) and More Headlines (rest)
  const mustReadPosts = posts.slice(0, 4);
  const moreHeadlines = posts.slice(4, 8);

  return (
    <div className="space-y-6">
      {/* MUST READ Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-gray-900">
          Must Read
        </h3>
        <div className="space-y-1">
          {mustReadPosts.map((post) => (
            <EditorialCard
              key={post.id}
              post={post}
              variant="sidebar"
              showImage={false}
              showExcerpt={false}
            />
          ))}
        </div>
      </div>

      {/* MORE HEADLINES Section */}
      {moreHeadlines.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-300">
            More Headlines
          </h3>
          <div className="space-y-1">
            {moreHeadlines.map((post) => (
              <EditorialCard
                key={post.id}
                post={post}
                variant="sidebar"
                showImage={false}
                showExcerpt={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MustReadSidebar;
