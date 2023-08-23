import { useEffect, useRef, useState } from 'react';
import { fetchPosts } from '../../api/posts';
import { MyTable } from '../MyTable/MyTable';

const limit = 20;

export const InfiniteGrid = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const myOuterRef = useRef<HTMLDivElement>(null);
  const myGridRef = useRef<HTMLDivElement>(null);
  const myObserver = useRef<IntersectionObserver | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (rowData.length === 0) return;

    const intersectionOptions = {
      root: myOuterRef.current,
      rootMargin: '0px 0px 0px 0px',
      threshold: 0,
    };

    console.log('bottomRef.current', bottomRef.current);
    if (myObserver.current) {
      myObserver.current.disconnect();
    }

    myObserver.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      console.log('entry', entry);

      if (entry.isIntersecting) {
        console.log('entry.isIntersecting', entry.isIntersecting);
        setPage((prev) => prev + 1);
      }
    }, intersectionOptions);

    myObserver.current.observe(bottomRef.current!);
  }, [bottomRef.current, rowData]);

  useEffect(() => {
    if (page) {
      const loadNewPosts = async () => {
        const newPosts = await fetchPosts(page, limit);
        setRowData((prev) => [...prev, ...newPosts]);
      };
      loadNewPosts();
    }
  }, [page]);

  useEffect(() => setPage(1), []);

  return (
    <div
      style={{
        width: 800,
        height: 400,
        color: 'black',
        backgroundColor: 'yellow',
        border: '1em solid yellow',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      ref={myOuterRef}
    >
      <div
        ref={myGridRef}
        style={{
          width: '100%',
          backgroundColor: 'orange',
          paddingBottom: '1px',
          overflow: 'hidden',
        }}
      >
        <MyTable data={rowData} />
        <div
          ref={bottomRef}
          style={{ height: 5, backgroundColor: 'red' }}
        ></div>
      </div>
    </div>
  );
};
