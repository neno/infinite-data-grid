import { useEffect, useRef, useState } from 'react';
import { fetchPosts } from '../api/posts';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const limit = 20;

export const GridLoadOnScroll = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const myOuterRef = useRef<HTMLDivElement>(null);
  const myGridRef = useRef<any>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);

  const currentSize = useRef<number>(rowData.length + limit);

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: true,
    },
    { headerName: 'User Id', field: 'userId', sortable: true, filter: true },
    { headerName: 'Title', field: 'title', sortable: true, filter: true },
    { headerName: 'Body', field: 'body', sortable: true, filter: true },
  ];

  useEffect(() => {
    console.log('bottomRef.current 1', bottomRef.current);
  }, [bottomRef.current]);

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

  const getRowId = (row: any) => {
    console.log('getRowId', row.data.id);
    return row.data.id;
  };

  const findLastRow = () => {
    const lastRowIdx = rowData.length - 1;
    const lastRow = document.querySelector(`[row-index="${lastRowIdx}"]`);
    if (lastRow) {
      loadMore();
    }
  };

  const loadMore = () => {
    console.log('loadMore');

    setPage((prev) => prev + 1);
    currentSize.current = currentSize.current + limit;
  };

  const onBodyScrollEnd = (event: any) => {
    console.log('onBodyScrollEnd', event);
    findLastRow();
  };

  if (rowData.length === 0) {
    return <p>"Loading..."</p>;
  }

  return (
    <div>
      <button onClick={loadMore}>Load More...</button>
      <div
        style={{
          width: 800,
          height: 400,
          color: 'black',
          border: '1em solid yellow',
          overflow: 'hidden',
        }}
        ref={myOuterRef}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'orange',
            overflowX: 'hidden',
            overflowY: 'hidden',
          }}
        >
          <AgGridReact
            gridOptions={{
              rowModelType: 'clientSide',
              columnDefs: columnDefs,
            }}
            rowData={rowData}
            getRowId={getRowId}
            rowModelType='clientSide'
            onBodyScrollEnd={onBodyScrollEnd}
            ref={myGridRef}
          />
        </div>
      </div>
    </div>
  );
};
