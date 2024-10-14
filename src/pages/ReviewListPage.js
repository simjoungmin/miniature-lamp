import React from 'react';
import ReviewListItem from './ReviewListItem';
import { List, AutoSizer } from 'react-virtualized';
import '../css/ReviewListPage.css';

function ReviewListPage({ reviews, onDelete, onEdit, onAddComment }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={{ ...style, marginBottom: '15px' }}>
      <ReviewListItem
        review={reviews[index]}
        index={reviews.length - index} // 최신순 번호
        onDelete={onDelete}
        onEdit={onEdit}
        onAddComment={onAddComment}
      />
    </div>
  );

  return (
    <div className="list-container">
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={800}
            rowCount={reviews.length}
            rowHeight={100}
            rowRenderer={rowRenderer}
            overscanRowCount={10}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export default ReviewListPage;
