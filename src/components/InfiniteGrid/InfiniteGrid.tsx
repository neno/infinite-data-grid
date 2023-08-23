import { useEffect, useRef, useState } from 'react';
import { fetchPosts } from '../../api/posts';
import { MyTable } from '../MyTable/MyTable';

const limit = 20;

export const InfiniteGrid = () => {
  const myOuterRef = useRef<HTMLDivElement>(null);
  const myGridRef = useRef<HTMLDivElement>(null);
  const myObserver = useRef<IntersectionObserver | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const intersectionOptions = {
      root: myOuterRef.current,
      rootMargin: '0px',
      threshold: 1,
    };

    console.log('myGridRef.current', myGridRef.current);
    if (myObserver.current) {
      myObserver.current.disconnect();
    }

    myObserver.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      console.log('entry', entry);

      if (entry.isIntersecting) {
        console.log('entry.isIntersecting', entry.isIntersecting);
      }
    }, intersectionOptions);

    myObserver.current.observe(myGridRef.current!);
  }, [myGridRef.current]);

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
      <div ref={myGridRef} style={{ width: '100%', backgroundColor: 'orange' }}>
        <MyTable data={rowData} />
      </div>
    </div>
  );
};
